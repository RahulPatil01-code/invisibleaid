const fs = require('fs');
const path = require('path');

const files = {
  "src/components/common/Badge.jsx": `import React from 'react';
import clsx from 'clsx';
export default function Badge({ children, variant = 'default' }) {
  const base = 'px-2 py-1 text-xs font-semibold rounded-full';
  const variants = { 
    default: 'bg-gray-100 text-gray-800', 
    HIGH: 'bg-red-100 text-red-800', 
    MODERATE: 'bg-yellow-100 text-yellow-800', 
    LOW: 'bg-green-100 text-green-800',
    VERIFIED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800'
  };
  return <span className={clsx(base, variants[variant] || variants.default)}>{children}</span>;
}`,
  "src/components/common/Navbar.jsx": `import React from 'react';
import { useAuth } from '../../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-teal-600">InvisibleAid</div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user.name}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}`,
  "src/pages/public/LandingPage.jsx": `import React from 'react';
import { Link } from 'react-router-dom';
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-6 bg-white border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-600">InvisibleAid</h1>
        <Link to="/login" className="bg-teal-600 text-white px-4 py-2 rounded font-medium hover:bg-teal-700">Login</Link>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-4xl font-bold mb-4">Identify Vulnerability. Discover Support. Enable Education.</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">A comprehensive platform to identify vulnerable children and match them with government schemes to ensure their education continues without financial barriers.</p>
        <Link to="/login" className="bg-teal-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-teal-700 shadow-md">Get Started</Link>
      </main>
    </div>
  );
}`,
  "src/pages/auth/LoginPage.jsx": `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@invisibleaid.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-600">Login to InvisibleAid</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded p-2 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded p-2 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded font-medium hover:bg-teal-700">Sign In</button>
        </form>
      </div>
    </div>
  );
}`,
  "src/pages/dashboard/AdminDashboard.jsx": `import React from 'react';
import Navbar from '../../components/common/Navbar';
import { mockDashboardStats } from '../../data/mockData';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Beneficiaries</h3>
            <p className="text-3xl font-bold mt-2">{mockDashboardStats.totalBeneficiaries}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">High Vulnerability</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{mockDashboardStats.highVulnerability}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Eligible Schemes</h3>
            <p className="text-3xl font-bold mt-2 text-teal-600">{mockDashboardStats.eligibleSchemes}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Pending Verifications</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{mockDashboardStats.pendingVerification}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  "src/pages/dashboard/SchoolNGODashboard.jsx": `import React from 'react';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import { mockDashboardStats } from '../../data/mockData';

export default function SchoolNGODashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">My Beneficiaries</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Pending Actions</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  "src/App.jsx": `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SchoolNGODashboard from './pages/dashboard/SchoolNGODashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['school', 'ngo']}><SchoolNGODashboard /></ProtectedRoute>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log("Files generated");
