import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import { organizationAPI } from '../../services/api';
import { Play, Square, CheckCircle, XCircle } from 'lucide-react';

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = () => organizationAPI.list().then(setOrganizations).catch(apiError => setError(apiError.message || 'Unable to load organizations.')).finally(() => setLoading(false)); useEffect(() => { load(); }, []);
  const action = async (org, operation) => { try { await organizationAPI[operation](org.id); load(); } catch (apiError) { setError(apiError.message || 'Unable to update organization.'); } };
  const columns = [{ header: 'ID', accessor: 'id' }, { header: 'Name', accessor: 'name' }, { header: 'Type', accessor: 'org_type' }, { header: 'Status', accessor: 'status', cell: value => <Badge variant={value === 'APPROVED' ? 'success' : value === 'REJECTED' || value === 'SUSPENDED' ? 'error' : 'warning'}>{value}</Badge> }, { header: 'Actions', accessor: 'id', cell: (_, row) => <div className="flex gap-2">{row.status === 'PENDING' && <><button onClick={() => action(row, 'approve')} className="text-green-600"><CheckCircle className="h-4 w-4" /></button><button onClick={() => action(row, 'reject')} className="text-red-600"><XCircle className="h-4 w-4" /></button></>}{row.status === 'APPROVED' && <button onClick={() => action(row, 'suspend')} className="text-orange-600"><Square className="h-4 w-4" /></button>}{row.status === 'SUSPENDED' && <button onClick={() => action(row, 'approve')} className="text-green-600"><Play className="h-4 w-4" /></button>}</div> }];
  return <div><PageHeader title="Organization Management" />{error && <div className="mb-4 text-sm text-red-700">{error}</div>}<DataTable columns={columns} data={organizations} keyField="id" loading={loading} emptyMessage="No organizations found." /></div>;
}
