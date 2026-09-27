import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import VulnerabilityChart from '../../components/charts/VulnerabilityChart';
import EducationChart from '../../components/charts/EducationChart';
import SchemeChart from '../../components/charts/SchemeChart';
import { Download } from 'lucide-react';
import { reportAPI } from '../../services/api';

export default function ReportsPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reportAPI.getDashboardStats()
      .then(setStats)
      .catch(apiError => setError(apiError.message || 'Unable to load reports.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {loading && <div className="text-sm text-gray-500">Loading reports...</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <PageHeader 
        title="Reports & Analytics" 
        actions={[
          { label: 'Export CSV', icon: Download, variant: 'primary', onClick: () => {} }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card><div className="text-sm text-gray-500">Total Beneficiaries</div><div className="text-2xl font-bold">{stats.total_beneficiaries ?? 0}</div></Card>
         <Card><div className="text-sm text-gray-500">Assessments Completed</div><div className="text-2xl font-bold">{stats.assessments_completed ?? 0}</div></Card>
         <Card><div className="text-sm text-gray-500">High Vulnerability</div><div className="text-2xl font-bold text-red-600">{stats.high_vulnerability ?? 0}</div></Card>
         <Card><div className="text-sm text-gray-500">Successful Interventions</div><div className="text-2xl font-bold text-green-600">{stats.successful_interventions ?? 0}</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vulnerability Distribution">
          <VulnerabilityChart data={stats.vulnerability_distribution || []} />
        </Card>
        
        <Card title="Education Levels">
          <EducationChart data={stats.education_distribution || []} />
        </Card>
      </div>

      <Card title="Top Recommended Schemes">
        <SchemeChart data={stats.scheme_recommendations || []} />
      </Card>
    </div>
  );
}
