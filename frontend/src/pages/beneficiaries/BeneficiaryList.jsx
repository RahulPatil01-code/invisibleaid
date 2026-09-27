import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import Badge, { getVulnerabilityBadge } from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import { UserPlus, Download, Eye, ClipboardCheck, Award, Edit, Filter } from 'lucide-react';
import { beneficiaryAPI } from '../../services/api';
import { downloadCSV } from '../../utils/helpers';

export default function BeneficiaryList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vulnFilter, setVulnFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    beneficiaryAPI.list()
      .then(setRecords)
      .catch(apiError => setError(apiError.message || 'Unable to load beneficiaries.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => records.filter(record => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || [record.name, record.beneficiary_id, record.city_village]
      .some(value => String(value || '').toLowerCase().includes(term));
    const matchesVulnerability = vulnFilter === 'ALL' || (vulnFilter === 'UNASSESSED' ? !record.vulnerability_level : record.vulnerability_level === vulnFilter);
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    return matchesSearch && matchesVulnerability && matchesStatus;
  }), [records, searchTerm, vulnFilter, statusFilter]);

  const handleExport = () => downloadCSV(filteredData.map(record => ({
    ID: record.beneficiary_id, Name: record.name, Age: record.age, Gender: record.gender,
    Vulnerability: record.vulnerability_level || 'NOT_ASSESSED', Status: record.status,
  })), `beneficiaries_${new Date().toISOString().slice(0, 10)}.csv`);

  const columns = [
    { header: 'Beneficiary', accessor: 'beneficiary_id', cell: (_, row) => <div><div className="font-semibold text-gray-900">{row.name}</div><div className="text-xs text-gray-500 font-mono">{row.beneficiary_id}</div></div> },
    { header: 'Age / Gender', accessor: 'age', cell: (_, row) => `${row.age} yrs • ${row.gender}` },
    { header: 'Vulnerability Level', accessor: 'vulnerability_level', cell: value => value ? getVulnerabilityBadge(value) : <Badge>Not assessed</Badge> },
    { header: 'Status', accessor: 'status', cell: value => <Badge text={value} variant={value === 'ASSESSED' ? 'success' : 'warning'} /> },
  ];
  const actions = [
    { label: 'View Profile', icon: Eye, onClick: row => navigate(`/beneficiaries/${row.id}`) },
    { label: 'Run Assessment', icon: ClipboardCheck, onClick: row => navigate(`/assessments/${row.id}`) },
    { label: 'Matched Schemes', icon: Award, onClick: row => navigate(`/schemes/recommendations/${row.id}`) },
    { label: 'Edit Details', icon: Edit, onClick: row => navigate(`/beneficiaries/edit/${row.id}`) },
  ];

  return <div className="space-y-6">
    <PageHeader title="Beneficiary Records" subtitle="Registered children and socio-economic profiles under evaluation" actions={[{ label: 'Export CSV', icon: Download, onClick: handleExport, variant: 'outline' }, { label: 'Add Beneficiary', icon: UserPlus, onClick: () => navigate('/beneficiaries/add'), variant: 'primary' }]} />
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <input type="text" placeholder="Search by child name or ID..." value={searchTerm} onChange={event => setSearchTerm(event.target.value)} className="w-full md:max-w-md text-sm border border-gray-300 rounded-lg px-3.5 py-2" />
      <div className="flex flex-wrap items-center gap-3 text-sm"><Filter className="w-4 h-4 text-gray-400" /><select value={vulnFilter} onChange={event => setVulnFilter(event.target.value)} className="border border-gray-300 rounded-lg px-2.5 py-1.5"><option value="ALL">All Levels</option><option value="HIGH">High</option><option value="MODERATE">Moderate</option><option value="LOW">Low</option><option value="UNASSESSED">Not Assessed</option></select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="border border-gray-300 rounded-lg px-2.5 py-1.5"><option value="ALL">All Statuses</option><option value="SUBMITTED">Submitted</option><option value="VERIFIED">Verified</option><option value="ASSESSED">Assessed</option></select></div>
    </div>
    <DataTable columns={columns} data={filteredData} actions={actions} pagination pageSize={10} loading={loading} emptyMessage="No beneficiaries found." onRowClick={row => navigate(`/beneficiaries/${row.id}`)} />
  </div>;
}
