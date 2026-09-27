import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, User, Building2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-xl font-bold text-gray-800">Sign in to your organization</h2>
        <p className="text-xs text-gray-500 mt-1">
          Access vulnerability identification & scheme recommendation tools
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Organization Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="name@school.edu or name@ngo.org"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-teal-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-md hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Need an organization account?{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:underline">
              Register School or NGO
            </Link>
          </div>
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