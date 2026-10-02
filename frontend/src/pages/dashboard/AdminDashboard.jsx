import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { organizationAPI, auditAPI, reportAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import VulnerabilityChart from '../../components/charts/VulnerabilityChart';
import EducationChart from '../../components/charts/EducationChart';
import SchemeChart from '../../components/charts/SchemeChart';
import { Building2, Users, AlertTriangle, ShieldCheck, Award, FileCheck, Check, X, ShieldAlert, ArrowRight, Settings, Scale } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [orgs, setOrgs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    Promise.all([reportAPI.getDashboardStats(), organizationAPI.list(), auditAPI.list()])
      .then(([dashboard, organizations, logs]) => {
        setStats(dashboard);
        setOrgs(organizations);
        setAuditLogs(logs);
      })
      .catch(apiError => setError(apiError.message || 'Unable to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const pendingOrgs = orgs.filter(o => o.status === 'PENDING');

  const handleOrgAction = async (id, newStatus) => {
    try {
      const action = newStatus === 'APPROVED' ? organizationAPI.approve : organizationAPI.reject;
      await action(id);
      setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      setToastMessage(`Organization status updated to ${newStatus}`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (apiError) {
      setError(apiError.message || 'Unable to update organization.');
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading dashboard...</div>}
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
              SYSTEM ADMINISTRATOR
            </span>
            <span className="text-xs text-slate-400">System-wide Governance & Rule Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Operations Center</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Manage participating schools, NGOs, rule engine thresholds, and government scheme eligibility definitions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/rules"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
          >
            <Scale className="w-4 h-4" />
            Manage Rules
          </Link>
          <Link
            to="/admin/schemes"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
          >
            <Award className="w-4 h-4" />
            Manage Schemes
          </Link>
        </div>
      </div>

      {/* 8 Core Admin Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Schools Registered"
          value={stats.schools_registered ?? 0}
          icon={Building2}
          color="teal"
          change="Verified partners"
        />
        <Card
          title="NGOs Registered"
          value={stats.ngos_registered ?? 0}
          icon={Building2}
          color="blue"
          change="Field welfare teams"
        />
        <Card
          title="Total Beneficiaries"
          value={stats.total_beneficiaries ?? 0}
          icon={Users}
          color="purple"
          change="System wide records"
        />
        <Card
          title="High Vulnerability"
          value={stats.high_vulnerability ?? 0}
          icon={AlertTriangle}
          color="red"
          change="Score >= 60%"
        />
        <Card
          title="Pending Verifications"
          value={stats.pending_document_verifications ?? 0}
          icon={FileCheck}
          color="amber"
          change="Document review backlog"
        />
        <Card
          title="Active Schemes"
          value={stats.active_schemes ?? 0}
          icon={Award}
          color="teal"
          change="Government education"
        />
        <Card
          title="Recommendations"
          value={stats.total_recommendations ?? 0}
          icon={ShieldCheck}
          color="green"
          change="Rule matched cases"
        />
        <Card
          title="Support In Progress"
          value={stats.support_in_progress ?? 0}
          icon={ShieldAlert}
          color="blue"
          change="Application tracker"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Vulnerability Breakdown</h2>
          <p className="text-xs text-gray-500 mb-4">High vs Moderate vs Low vulnerability</p>
          <VulnerabilityChart data={stats.vulnerability_distribution || []} />
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Education Distribution</h2>
          <p className="text-xs text-gray-500 mb-4">Beneficiary count by school level</p>
          <EducationChart data={stats.education_distribution || []} />
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Scheme Demand Match</h2>
          <p className="text-xs text-gray-500 mb-4">Total recommendations generated</p>
          <SchemeChart data={stats.scheme_recommendations || []} />
        </div>
      </div>

      {/* Pending Organization Approvals & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Organizations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pending Organization Approvals</h2>
              <p className="text-xs text-gray-500 mt-0.5">School and NGO registration requests requiring admin verification</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
              {pendingOrgs.length} Pending
            </span>
          </div>

          <div className="p-4 flex-1">
            {pendingOrgs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No pending registrations at this time. All organizations are approved.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrgs.map((org) => (
                  <div key={org.id} className="p-4 border border-gray-100 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{org.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${org.type === 'SCHOOL' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                          {org.org_type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {org.city}, {org.state} • Contact: {org.contact_person} ({org.phone})
                      </div>
                      <div className="text-xs text-gray-400">Reg: {org.registration_number}</div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleOrgAction(org.id, 'APPROVED')}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 rounded font-medium shadow-sm transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleOrgAction(org.id, 'REJECTED')}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium shadow-sm transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-right">
            <Link to="/admin/organizations" className="text-xs font-semibold text-teal-700 hover:underline">
              View All Organizations &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Audit Trail */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">System Audit Trail</h2>
              <p className="text-xs text-gray-500 mt-0.5">Recent user logins, assessments, and status modifications</p>
            </div>
            <Link to="/admin/audit-logs" className="text-xs font-semibold text-teal-600 hover:underline">
              Full Logs
            </Link>
          </div>
          <div className="p-4 flex-1">
            <div className="divide-y divide-gray-100 text-sm">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800 text-xs">
                      <span className="font-bold text-teal-700">{log.action}</span> - {JSON.stringify(log.details || '')}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      User: {log.user || 'System'} • IP: {log.ip_address || 'N/A'}
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-right">
            <Link to="/admin/audit-logs" className="text-xs font-semibold text-teal-700 hover:underline">
              View Complete Audit History &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}