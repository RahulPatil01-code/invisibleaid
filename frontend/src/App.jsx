import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SchoolNGODashboard from './pages/dashboard/SchoolNGODashboard';

// Beneficiary Pages
import BeneficiaryList from './pages/beneficiaries/BeneficiaryList';
import AddBeneficiary from './pages/beneficiaries/AddBeneficiary';
import BeneficiaryProfile from './pages/beneficiaries/BeneficiaryProfile';
import EditBeneficiary from './pages/beneficiaries/EditBeneficiary';

// Assessments & Schemes
import AssessmentList from './pages/assessments/AssessmentList';
import AssessmentResult from './pages/assessments/AssessmentResult';
import SchemeList from './pages/schemes/SchemeList';
import SchemeDetails from './pages/schemes/SchemeDetails';
import SchemeRecommendations from './pages/schemes/SchemeRecommendations';

// Workflow & Management Pages
import ApplicationTracking from './pages/applications/ApplicationTracking';
import ReportsPage from './pages/reports/ReportsPage';
import ProfilePage from './pages/profile/ProfilePage';

// Admin Pages
import OrganizationManagement from './pages/admin/OrganizationManagement';
import SchemeManagement from './pages/admin/SchemeManagement';
import RuleManagement from './pages/admin/RuleManagement';
import AuditLogPage from './pages/admin/AuditLogPage';
import SystemSettings from './pages/admin/SystemSettings';
// Document review is admin-only (see /admin/documents below). Uploading
// happens on a beneficiary's own profile page in the Organization portal,
// not on a standalone /documents route.
import DocumentVerification from './pages/documents/DocumentVerification';

// `requireApproved` (default true) blocks a SCHOOL/NGO user whose
// organization is not yet APPROVED, sending them to /pending-approval
// instead of into the portal. This is a UX gate only — the backend's
// IsAdminOrApprovedOrganization permission class remains the real
// authorization boundary and is unchanged. Pass requireApproved={false}
// for routes a pending organization is allowed to see (e.g. the
// pending-approval page itself, profile/logout).
const ProtectedRoute = ({ children, allowedRoles, requireApproved = true }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role?.toUpperCase();

  if (allowedRoles) {
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  const isOrgAccount = userRole === 'SCHOOL' || userRole === 'NGO';
  if (isOrgAccount && requireApproved && user.organization?.status !== 'APPROVED') {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
};

// Role-based Dashboard Switcher
const DashboardSwitcher = () => {
  const { user } = useAuth();
  if (user?.role?.toUpperCase() === 'ADMIN') {
    return <AdminDashboard />;
  }
  return <SchoolNGODashboard />;
};

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      {/* Organization accounts land here while their organization is PENDING/REJECTED/SUSPENDED.
          requireApproved={false} so this route itself never redirects a pending org back to itself. */}
      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute requireApproved={false}>
            <PendingApprovalPage />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Dashboard Pages with Unified Sidebar & Navbar */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Main Dashboard */}
        <Route path="/dashboard" element={<DashboardSwitcher />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

        {/* Beneficiaries — organizations upload/view documents from within
            a beneficiary's own profile page, not a separate documents route. */}
        <Route path="/beneficiaries" element={<BeneficiaryList />} />
        <Route path="/beneficiaries/add" element={<AddBeneficiary />} />
        <Route path="/beneficiaries/:id" element={<BeneficiaryProfile />} />
        <Route path="/beneficiaries/edit/:id" element={<EditBeneficiary />} />

        {/* Assessments */}
        <Route path="/assessments" element={<AssessmentList />} />
        <Route path="/assessments/:id" element={<AssessmentResult />} />

        {/* Schemes & Recommendations */}
        <Route path="/schemes" element={<SchemeList />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />
        <Route path="/schemes/recommendations/:beneficiaryId" element={<SchemeRecommendations />} />
        <Route path="/recommendations/:beneficiaryId" element={<SchemeRecommendations />} />

        {/* Operational Workflow */}
        <Route path="/applications" element={<ApplicationTracking />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Governance */}
        <Route path="/admin/organizations" element={<ProtectedRoute allowedRoles={['ADMIN']}><OrganizationManagement /></ProtectedRoute>} />
        <Route path="/admin/beneficiaries" element={<ProtectedRoute allowedRoles={['ADMIN']}><BeneficiaryList /></ProtectedRoute>} />
        <Route path="/admin/assessments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AssessmentList /></ProtectedRoute>} />
        <Route path="/admin/schemes" element={<ProtectedRoute allowedRoles={['ADMIN']}><SchemeManagement /></ProtectedRoute>} />
        <Route path="/admin/rules" element={<ProtectedRoute allowedRoles={['ADMIN']}><RuleManagement /></ProtectedRoute>} />
        {/* Admin's ONLY entry point to documents: review/approve/reject.
            No upload capability here — see documents/views.py: create() is
            restricted to IsApprovedOrganization, which excludes ADMIN. */}
        <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={['ADMIN']}><DocumentVerification /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemSettings /></ProtectedRoute>} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}