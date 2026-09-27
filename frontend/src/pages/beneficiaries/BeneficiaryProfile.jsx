import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { beneficiaryAPI, assessmentAPI, documentAPI } from '../../services/api';
import { Edit, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function BeneficiaryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

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

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading beneficiary...</div>;
  if (!beneficiary) return <div className="p-6 text-sm text-red-700">{error || 'Beneficiary not found.'}</div>;
  
  const assessment = beneficiary.latest_assessment;
  const parent = beneficiary.family?.parents?.[0] || null;
  const ration = beneficiary.family?.rationcard || null;
  const edu = beneficiary.education || {};
  const socio = beneficiary.socioeconomic || {};

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
          <ul className="space-y-3">
            {documents.length ? documents.map(document => (
              <li key={document.id} className="flex justify-between items-center text-sm">
                <span>{document.file_name || document.document_type}</span>
                <Badge variant={document.verification_status === 'VERIFIED' ? 'success' : document.verification_status === 'REJECTED' ? 'error' : 'warning'}>
                  {document.verification_status}
                </Badge>
              </li>
            )) : <li className="text-sm text-gray-500">No documents uploaded.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
