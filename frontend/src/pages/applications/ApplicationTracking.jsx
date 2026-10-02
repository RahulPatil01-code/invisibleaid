import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { applicationAPI } from '../../services/api';
import { Edit } from 'lucide-react';

const statuses = ['RECOMMENDED', 'DOCUMENTS_PENDING', 'APPLICATION_STARTED', 'APPROVED', 'REJECTED', 'SUPPORT_PROVIDED'];
export default function ApplicationTracking() {
  const [applications, setApplications] = useState([]); const [selected, setSelected] = useState(null); const [status, setStatus] = useState('APPLICATION_STARTED'); const [notes, setNotes] = useState(''); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const load = () => applicationAPI.list().then(setApplications).catch(apiError => setError(apiError.message || 'Unable to load applications.')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const save = async () => { setSaving(true); try { await applicationAPI.updateStatus(selected.id, status, notes); setSelected(null); await load(); } catch (apiError) { setError(apiError.message || 'Unable to update application.'); } finally { setSaving(false); } };
  const badge = value => <Badge variant={value === 'APPROVED' || value === 'SUPPORT_PROVIDED' ? 'success' : value === 'REJECTED' ? 'error' : 'warning'}>{value?.replaceAll('_', ' ')}</Badge>;
  const columns = [{ header: 'App ID', accessor: 'id' }, { header: 'Beneficiary', accessor: 'beneficiary_name' }, { header: 'Scheme', accessor: 'scheme', cell: value => value?.name || 'N/A' }, { header: 'Date', accessor: 'created_at', cell: value => new Date(value).toLocaleDateString() }, { header: 'Status', accessor: 'status', cell: badge }, { header: 'Actions', accessor: 'id', cell: (_, row) => <button onClick={() => { setSelected(row); setStatus(row.status); setNotes(row.notes || ''); }} className="text-teal-600"><Edit className="h-5 w-5" /></button> }];
  return <div><PageHeader title="Application Tracking" /><>{error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<DataTable columns={columns} data={applications} keyField="id" loading={loading} emptyMessage="No support applications found." /></><Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Update Application Status"><div className="space-y-4"><label className="block text-sm font-medium text-gray-700">New Status<select value={status} onChange={event => setStatus(event.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 p-2">{statuses.map(value => <option key={value}>{value}</option>)}</select></label><label className="block text-sm font-medium text-gray-700">Notes<textarea value={notes} onChange={event => setNotes(event.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 p-2" rows="4" /></label><div className="flex justify-end gap-2"><button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-md text-sm">Cancel</button><button disabled={saving} onClick={save} className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm">{saving ? 'Saving...' : 'Save'}</button></div>{selected?.history?.length > 0 && <div className="border-t pt-4 text-xs text-gray-600">{selected.history.map(item => <div key={item.id} className="py-1">{item.status}: {item.notes}</div>)}</div>}</div></Modal></div>;
}
