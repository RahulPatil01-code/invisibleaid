import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import FileUpload from '../../components/forms/FileUpload';
import FormSelect from '../../components/forms/FormSelect';
import { beneficiaryAPI, assessmentAPI, documentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Edit, FileText, CheckCircle, AlertTriangle, UploadCloud } from 'lucide-react';

const documentTypes = [
  { value: 'INCOME_PROOF', label: 'Income Proof' },
  { value: 'RATION_CARD', label: 'Ration Card' },
  { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate' },
  { value: 'SCHOOL_CERTIFICATE', label: 'School Certificate' },
  { value: 'BONAFIDE', label: 'Bonafide' },
  { value: 'MARKSHEET', label: 'Marksheet' },
  { value: 'OTHER', label: 'Other' },
];

const statusVariant = status =>
  status === 'VERIFIED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';

const statusLabel = status => (status === 'VERIFIED' ? 'Approved' : status === 'REJECTED' ? 'Rejected' : 'Pending');

// Only the most recent upload per document type is shown as that type's
// current status — older re-uploads (e.g. a corrected file after a
// rejection) stay in the database for the audit trail but don't clutter
// the summary list.
const latestPerType = documents => {
  const byType = new Map();
  for (const doc of documents) {
    const existing = byType.get(doc.document_type);
    if (!existing || new Date(doc.uploaded_at) > new Date(existing.uploaded_at)) {
      byType.set(doc.document_type, doc);
    }
  }
  return Array.from(byType.values());
};

export default function BeneficiaryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [beneficiary, setBeneficiary] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  // Upload form state — organization only; admin does not upload.
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('INCOME_PROOF');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const [detail, docs] = await Promise.all([beneficiaryAPI.getById(id), documentAPI.list(id)]);
      setBeneficiary(detail);
      setDocuments(docs);
    } catch (apiError) {
      setError(apiError.message || 'Unable to load beneficiary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const runAssessment = async () => {
    setRunning(true);
    setError('');
    try {
      await assessmentAPI.run(id);
      await load();
      navigate(`/assessments/${id}`);
    } catch (apiError) {
      setError(apiError.message || 'Unable to run assessment.');
    } finally {
      setRunning(false);
    }
  };

  const selectFile = nextFile => {
    setUploadError('');
    if (!nextFile) { setFile(null); return; }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(nextFile.type)) { setUploadError('Choose a PDF, JPG, or PNG file.'); return; }
    if (nextFile.size > 10 * 1024 * 1024) { setUploadError('File must be smaller than 10 MB.'); return; }
    setFile(nextFile);
  };

  const uploadDocument = async event => {
    event.preventDefault();
    if (!file) { setUploadError('Choose a file before uploading.'); return; }
    setUploading(true);
    setUploadError('');
    const body = new FormData();
    body.append('beneficiary', id);
    body.append('document_type', documentType);
    body.append('file', file);
    body.append('file_name', file.name);
    try {
      await documentAPI.upload(body);
      setFile(null);
      await load();
    } catch (apiError) {
      setUploadError(apiError.message || 'Unable to upload document.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading beneficiary...</div>;
  if (!beneficiary) return <div className="p-6 text-sm text-red-700">{error || 'Beneficiary not found.'}</div>;

  const assessment = beneficiary.latest_assessment;
  const parent = beneficiary.family?.parents?.[0] || null;
  const ration = beneficiary.family?.rationcard || null;
  const edu = beneficiary.education || {};
  const socio = beneficiary.socioeconomic || {};
  const summaryDocs = latestPerType(documents);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700">
        <AlertTriangle className="inline w-4 h-4 mr-2" />
        Preliminary assessment only; verify final eligibility through official channels.
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <PageHeader
        title={beneficiary.name}
        subtitle={`ID: ${beneficiary.beneficiary_id} • Added ${new Date(beneficiary.created_at).toLocaleDateString()}`}
        actions={[
          { label: 'Edit', icon: Edit, variant: 'secondary', onClick: () => navigate(`/beneficiaries/edit/${id}`) },
          { label: running ? 'Assessing...' : 'Run Assessment', icon: FileText, variant: 'primary', onClick: runAssessment }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basic Information">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Age / Gender</p><p className="font-medium">{beneficiary.age} years / {beneficiary.gender}</p></div>
              <div><p className="text-gray-500">Contact</p><p className="font-medium">{beneficiary.contact_number || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-medium">{beneficiary.address}, {beneficiary.city_village}, {beneficiary.district}, {beneficiary.state}</p></div>
            </div>
          </Card>

          <Card title="Family & Guardian Info">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Family Size</p><p className="font-medium">{beneficiary.family?.family_size || 'N/A'}</p></div>
              <div><p className="text-gray-500">Family Income</p><p className="font-medium">₹{Number(beneficiary.family?.monthly_income || 0).toLocaleString()}</p></div>
              {parent && (
                <>
                  <div><p className="text-gray-500">Primary Guardian</p><p className="font-medium">{parent.name} ({parent.relationship})</p></div>
                  <div><p className="text-gray-500">Guardian Occupation</p><p className="font-medium">{parent.occupation || 'N/A'} - {parent.employment_status}</p></div>
                </>
              )}
              {ration && ration.has_ration_card && (
                <>
                  <div><p className="text-gray-500">Ration Card Category</p><p className="font-medium">{ration.category}</p></div>
                  <div><p className="text-gray-500">Ration Card Number</p><p className="font-medium">{ration.card_number || 'N/A'}</p></div>
                </>
              )}
            </div>
          </Card>

          <Card title="Education Details">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Education Level</p><p className="font-medium">{edu.education_level || 'N/A'}</p></div>
              <div><p className="text-gray-500">Grade/Class</p><p className="font-medium">{edu.grade || 'N/A'}</p></div>
              <div><p className="text-gray-500">School Name</p><p className="font-medium">{edu.school_name || 'N/A'}</p></div>
              <div><p className="text-gray-500">Academic Performance</p><p className="font-medium">{edu.academic_performance || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-gray-500">Educational Difficulties</p><p className="font-medium">{edu.educational_difficulties || 'None reported'}</p></div>
            </div>
          </Card>

          <Card title="Living Conditions">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Meals Per Day</p><p className="font-medium">{socio.meals_per_day || 'N/A'}</p></div>
              <div><p className="text-gray-500">Distance to School</p><p className="font-medium">{socio.distance_to_school_km || 0} km</p></div>
              <div className="col-span-2 flex gap-4 mt-2">
                <Badge variant={socio.has_electricity ? 'success' : 'error'}>{socio.has_electricity ? 'Has Electricity' : 'No Electricity'}</Badge>
                <Badge variant={socio.has_clean_water ? 'success' : 'error'}>{socio.has_clean_water ? 'Has Clean Water' : 'No Clean Water'}</Badge>
                <Badge variant={socio.has_toilet ? 'success' : 'error'}>{socio.has_toilet ? 'Has Toilet' : 'No Toilet'}</Badge>
                <Badge variant={socio.has_health_insurance ? 'success' : 'warning'}>{socio.has_health_insurance ? 'Has Health Insurance' : 'No Health Insurance'}</Badge>
              </div>
            </div>
          </Card>

          {assessment && (
            <Card title="Assessment Summary">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-teal-600">{assessment.score_percentage ?? assessment.total_score} / 100</div>
                <Badge variant={assessment.vulnerability_level === 'HIGH' ? 'error' : assessment.vulnerability_level === 'MODERATE' ? 'warning' : 'success'}>
                  {assessment.vulnerability_level}
                </Badge>
              </div>
              <Link to={`/schemes/recommendations/${id}`} className="text-teal-600 font-medium text-sm flex items-center gap-1">
                View Recommendations <CheckCircle className="h-4 w-4" />
              </Link>
            </Card>
          )}
        </div>

        <Card title="Documents">
          <div className="space-y-4">
            <ul className="divide-y divide-gray-100">
              {summaryDocs.length ? summaryDocs.map(document => (
                <li key={document.id} className="py-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-800">
                      {documentTypes.find(t => t.value === document.document_type)?.label || document.document_type}
                    </span>
                    <Badge variant={statusVariant(document.verification_status)}>
                      {statusLabel(document.verification_status)}
                    </Badge>
                  </div>
                  {document.verification_status === 'REJECTED' && document.rejection_reason && (
                    <p className="text-xs text-red-600 mt-1">
                      Reason: {document.rejection_reason} — upload a corrected document below.
                    </p>
                  )}
                </li>
              )) : <li className="text-sm text-gray-500 py-2">No documents uploaded.</li>}
            </ul>

            {/* Organizations collect and upload documents; admins review them
                from Document Verification instead, so the upload form is
                hidden here for admin viewers. */}
            {!isAdmin && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <UploadCloud className="w-4 h-4 text-teal-600" />
                  <h4 className="text-sm font-semibold text-gray-800">Upload a document</h4>
                </div>
                <form onSubmit={uploadDocument} className="space-y-3">
                  <FormSelect
                    label="Document Type"
                    name="document_type"
                    value={documentType}
                    onChange={event => setDocumentType(event.target.value)}
                    options={documentTypes}
                    required
                  />
                  <FileUpload label="File" accept=".pdf,.jpg,.jpeg,.png" onFileSelect={selectFile} currentFile={file} error={uploadError} />
                  <button
                    disabled={uploading}
                    className="w-full bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}