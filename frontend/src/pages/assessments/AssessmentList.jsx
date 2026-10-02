import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import { assessmentAPI } from '../../services/api';
import { Eye } from 'lucide-react';

export default function AssessmentList() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { assessmentAPI.list().then(setAssessments).catch(apiError => setError(apiError.message || 'Unable to load assessments.')).finally(() => setLoading(false)); }, []);
  const columns = [
    { header: 'Beneficiary', accessor: 'beneficiary_name', cell: (value, row) => value || row.beneficiary },
    { header: 'Date', accessor: 'assessed_at', cell: value => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { header: 'Score', accessor: 'score_percentage', cell: (value, row) => `${value ?? row.total_score ?? 0} / 100` },
    { header: 'Vulnerability', accessor: 'vulnerability_level', cell: value => <Badge variant={value === 'HIGH' ? 'error' : value === 'MODERATE' ? 'warning' : 'success'}>{value}</Badge> },
    { header: 'Actions', accessor: 'id', cell: (_, row) => <button onClick={() => navigate(`/assessments/${row.beneficiary}`)} className="text-teal-600"><Eye className="h-5 w-5" /></button> },
  ];
  return <div>{<PageHeader title="Assessments" />}{error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<DataTable columns={columns} data={assessments} keyField="id" loading={loading} emptyMessage="No persisted assessments found." /></div>;
}
