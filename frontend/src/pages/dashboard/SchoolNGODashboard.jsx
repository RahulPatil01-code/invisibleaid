import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { beneficiaryAPI, reportAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import VulnerabilityChart from '../../components/charts/VulnerabilityChart';
import EducationChart from '../../components/charts/EducationChart';
import SchemeChart from '../../components/charts/SchemeChart';
import { Users, AlertTriangle, ShieldCheck, Award, Clock, ArrowRight, UserPlus, ClipboardCheck, BookOpen } from 'lucide-react';

export default function SchoolNGODashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([reportAPI.getDashboardStats(), beneficiaryAPI.list()])
      .then(([dashboard, records]) => { setStats(dashboard); setBeneficiaries(records.slice(0, 6)); })
      .catch(apiError => setError(apiError.message || 'Unable to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading dashboard...</div>}
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-100 border border-teal-400/30">
              {user?.role || 'ORGANIZATION'} PORTAL
            </span>
            <span className="text-xs text-teal-200">
              {user?.organization?.city}, {user?.organization?.state}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{user?.organization?.name || user?.name}</h1>
          <p className="text-teal-100 text-sm mt-1 max-w-2xl">
            Poverty vulnerability identification & government education scheme recommendation system.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/beneficiaries/add"
            className="inline-flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Beneficiary
          </Link>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 bg-teal-600/60 hover:bg-teal-600 text-white border border-teal-400/40 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" />
            Assessments
          </Link>
        </div>
      </div>

      {/* Disclaimer Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <span className="font-semibold">Preliminary Decision-Support Assessment:</span> InvisibleAid uses transparent, predefined rules to identify economic vulnerability. It is not a legal declaration of poverty. Final eligibility for welfare/scholarship schemes must be verified against official government guidelines.
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Beneficiaries"
          value={stats.total_beneficiaries ?? 0}
          icon={Users}
          color="teal"
          change="+2 this month"
        />
        <Card
          title="High Vulnerability"
          value={stats.high_vulnerability ?? 0}
          icon={AlertTriangle}
          color="red"
          change="Urgent support needed"
        />
        <Card
          title="Moderate Vulnerability"
          value={stats.moderate_vulnerability ?? 0}
          icon={Clock}
          color="amber"
          change="Eligible for schemes"
        />
        <Card
          title="Eligible Scheme Matches"
          value={stats.total_recommendations ?? 0}
          icon={Award}
          color="blue"
          change="Across 5 active schemes"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Vulnerability Distribution</h2>
          <p className="text-xs text-gray-500 mb-4">Rule-based preliminary risk classification</p>
          <VulnerabilityChart data={stats.vulnerability_distribution || []} />
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Education Level Breakdown</h2>
          <p className="text-xs text-gray-500 mb-4">Enrolled children by schooling stage</p>
          <EducationChart data={stats.education_distribution || []} />
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Top Recommended Schemes</h2>
          <p className="text-xs text-gray-500 mb-4">Matched government education schemes</p>
          <SchemeChart data={stats.scheme_recommendations || []} />
        </div>
      </div>

      {/* Recent Beneficiaries Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Beneficiaries</h2>
            <p className="text-xs text-gray-500 mt-0.5">Quick access to child profiles, vulnerability scores, and scheme matches</p>
          </div>
          <Link
            to="/beneficiaries"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View All ({stats.total_beneficiaries ?? 0})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">Age / Class</th>
                <th className="py-3 px-4">Monthly Income</th>
                <th className="py-3 px-4">Vulnerability Level</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {beneficiaries.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{b.name}</div>
                    <div className="text-xs text-gray-500">{b.beneficiary_id}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {b.age} yrs • {b.education?.grade || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    ₹{b.family?.monthly_income?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      b.vulnerability_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                      b.vulnerability_level === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                      b.vulnerability_level === 'LOW' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {b.vulnerability_level || 'Not Assessed'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      text={b.status === 'ASSESSED' ? 'Assessed' : b.status}
                      variant={b.status === 'ASSESSED' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      to={`/beneficiaries/${b.id}`}
                      className="text-teal-600 hover:text-teal-800 font-medium text-xs underline"
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/assessments/${b.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs underline"
                    >
                      Assessment
                    </Link>
                    <Link
                      to={`/schemes/recommendations/${b.id}`}
                      className="text-purple-600 hover:text-purple-800 font-medium text-xs underline"
                    >
                      Schemes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}