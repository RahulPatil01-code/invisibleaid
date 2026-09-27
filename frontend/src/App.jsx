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
import DocumentVerification from './pages/documents/DocumentVerification';
import ReportsPage from './pages/reports/ReportsPage';
import ProfilePage from './pages/profile/ProfilePage';

// Admin Pages
import OrganizationManagement from './pages/admin/OrganizationManagement';
import SchemeManagement from './pages/admin/SchemeManagement';
import RuleManagement from './pages/admin/RuleManagement';
import AuditLogPage from './pages/admin/AuditLogPage';
import SystemSettings from './pages/admin/SystemSettings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles) {
    const userRole = user.role?.toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
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

        {/* Beneficiaries */}
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
        <Route path="/documents" element={<DocumentVerification />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Governance */}
        <Route path="/admin/organizations" element={<ProtectedRoute allowedRoles={['ADMIN']}><OrganizationManagement /></ProtectedRoute>} />
        <Route path="/admin/beneficiaries" element={<ProtectedRoute allowedRoles={['ADMIN']}><BeneficiaryList /></ProtectedRoute>} />
        <Route path="/admin/assessments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AssessmentList /></ProtectedRoute>} />
        <Route path="/admin/schemes" element={<ProtectedRoute allowedRoles={['ADMIN']}><SchemeManagement /></ProtectedRoute>} />
        <Route path="/admin/rules" element={<ProtectedRoute allowedRoles={['ADMIN']}><RuleManagement /></ProtectedRoute>} />
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