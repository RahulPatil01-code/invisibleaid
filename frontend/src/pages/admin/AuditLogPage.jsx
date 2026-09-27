import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { auditAPI } from '../../services/api';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { auditAPI.list().then(setLogs).catch(apiError => setError(apiError.message || 'Unable to load audit logs.')).finally(() => setLoading(false)); }, []);
  const columns = [{ header: 'Time', accessor: 'timestamp', cell: value => new Date(value).toLocaleString() }, { header: 'Action', accessor: 'action' }, { header: 'Entity', accessor: 'entity_type' }, { header: 'Entity ID', accessor: 'entity_id' }, { header: 'User', accessor: 'user' }, { header: 'Details', accessor: 'details', cell: value => JSON.stringify(value || {}) }];
  return <div><PageHeader title="Audit Logs" subtitle="System activity visible to administrators" />{error && <div className="mb-4 text-sm text-red-700">{error}</div>}<DataTable columns={columns} data={logs} keyField="id" loading={loading} emptyMessage="No audit records found." /></div>;
}
