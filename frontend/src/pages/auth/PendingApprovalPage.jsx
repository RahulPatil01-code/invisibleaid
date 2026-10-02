import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Clock, XCircle, PauseCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_CONTENT = {
  PENDING: {
    icon: Clock,
    color: 'amber',
    title: 'Your organization approval is pending',
    body: 'An administrator needs to review your organization before you can access the portal. This usually does not take long — check back soon.',
  },
  REJECTED: {
    icon: XCircle,
    color: 'red',
    title: 'Your organization registration was not approved',
    body: 'Please contact the InvisibleAid administrator for more details, or reach out to support if you believe this is a mistake.',
  },
  SUSPENDED: {
    icon: PauseCircle,
    color: 'red',
    title: 'Your organization account is suspended',
    body: 'Access to the portal has been temporarily suspended. Please contact the InvisibleAid administrator for more information.',
  },
};

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const status = user?.organization?.status || 'PENDING';
  const content = STATUS_CONTENT[status] || STATUS_CONTENT.PENDING;
  const Icon = content.icon;

  useEffect(() => {
    // If the organization is already approved (e.g. approved in another
    // tab), don't leave the user stranded here.
    if (status === 'APPROVED') {
      navigate('/dashboard', { replace: true });
    }
  }, [status, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-900">InvisibleAid</span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100 text-center">
          <div
            className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              content.color === 'amber' ? 'bg-amber-50' : 'bg-red-50'
            }`}
          >
            <Icon className={`w-7 h-7 ${content.color === 'amber' ? 'text-amber-600' : 'text-red-600'}`} />
          </div>

          <h2 className="text-lg font-bold text-gray-800">{content.title}</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{content.body}</p>

          {user?.organization?.name && (
            <div className="mt-4 text-xs text-gray-400">
              Organization: <span className="font-semibold text-gray-600">{user.organization.name}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-600 underline">
            &larr; Return to Public Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}