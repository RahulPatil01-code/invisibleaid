import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { documentAPI } from '../../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

// Admin-only: review and approve/reject documents that organizations have
// uploaded for their beneficiaries. Uploading happens on the beneficiary's
// own profile page (Organization portal), not here — admin does not
// collect or upload beneficiary documents.
export default function DocumentVerification() {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => documentAPI.list()
    .then(setDocuments)
    .catch(apiError => setError(apiError.message || 'Unable to load documents.'))
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const verify = async id => {
    try {
      await documentAPI.verify(id);
      await load();
    } catch (apiError) {
      setError(apiError.message || 'Unable to verify document.');
    }
  };

  const reject = async () => {
    try {
      await documentAPI.reject(selected.id, reason);
      setSelected(null);
      setReason('');
      await load();
    } catch (apiError) {
      setError(apiError.message || 'Unable to reject document.');
    }
  };

  const columns = [
    { header: 'Beneficiary', accessor: 'beneficiary_name', cell: (value, row) => value || `#${row.beneficiary}` },
    { header: 'Organization', accessor: 'organization_name', cell: value => value || 'N/A' },
    { header: 'Document', accessor: 'file_name' },
    { header: 'Type', accessor: 'document_type' },
    { header: 'Uploaded By', accessor: 'uploaded_by_name', cell: value => value || 'N/A' },
    { header: 'Uploaded', accessor: 'uploaded_at', cell: value => new Date(value).toLocaleDateString() },
    {
      header: 'Status',
      accessor: 'verification_status',
      cell: value => (
        <Badge variant={value === 'VERIFIED' ? 'success' : value === 'REJECTED' ? 'error' : 'warning'}>
          {value}
        </Badge>
      ),
    },
    { header: 'Rejection Reason', accessor: 'rejection_reason', cell: value => value || 'N/A' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (_, row) =>
        row.verification_status === 'PENDING' ? (
          <div className="flex gap-2">
            <button onClick={() => verify(row.id)} className="text-green-600" title="Approve">
              <CheckCircle className="h-5 w-5" />
            </button>
            <button onClick={() => setSelected(row)} className="text-red-600" title="Reject">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-500">Processed</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Document Verification" subtitle="Review documents uploaded by organizations and approve or reject them" />
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <DataTable columns={columns} data={documents} keyField="id" loading={loading} emptyMessage="No documents uploaded yet." />
      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Reject Document">
        <div className="space-y-4">
          <textarea
            value={reason}
            onChange={event => setReason(event.target.value)}
            placeholder="Reason for rejection"
            className="w-full rounded-md border border-gray-300 p-2"
            rows="4"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
            <button disabled={!reason.trim()} onClick={reject} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">Reject</button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 