const fs = require('fs');
const path = require('path');

const mockDataContent = `export const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@invisibleaid.org', role: 'admin', token: 'token-admin-123' },
  { id: '2', name: 'Sunrise School', email: 'school1@example.com', role: 'school', token: 'token-school-123' },
  { id: '3', name: 'Hope NGO', email: 'ngo1@example.com', role: 'ngo', token: 'token-ngo-123' }
];

export const mockBeneficiaries = Array.from({ length: 18 }).map((_, i) => ({
  id: \`BEN-00\${i + 1}\`,
  firstName: ['Aarav', 'Priya', 'Rahul', 'Meera', 'Ananya', 'Arjun', 'Kavya', 'Rohan', 'Sneha', 'Vikram', 'Pooja', 'Amit', 'Divya', 'Karan', 'Neha', 'Suresh', 'Lakshmi', 'Ravi'][i],
  lastName: ['Sharma', 'Patel', 'Kumar', 'Devi', 'Singh', 'Yadav', 'Reddy', 'Gupta', 'Joshi', 'Thakur', 'Mishra', 'Verma', 'Nair', 'Chauhan', 'Agarwal', 'Patil', 'Iyer', 'Deshmukh'][i],
  age: Math.floor(Math.random() * 13) + 6,
  gender: i % 2 === 0 ? 'Male' : 'Female',
  vulnerabilityLevel: i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MODERATE' : 'LOW',
  verificationStatus: i % 4 === 0 ? 'PENDING' : 'VERIFIED',
  income: Math.floor(Math.random() * 43000) + 2000,
  educationLevel: i % 2 === 0 ? 'Primary' : 'Secondary',
  schoolName: 'Sunrise School',
  grade: Math.floor(Math.random() * 12) + 1,
  familySize: Math.floor(Math.random() * 7) + 2,
  earningMembers: Math.floor(Math.random() * 3) + 1
}));

export const mockAssessments = mockBeneficiaries.slice(0, 12).map((b, i) => ({
  id: \`ASS-00\${i + 1}\`,
  beneficiaryId: b.id,
  score: Math.floor(Math.random() * 100),
  vulnerabilityLevel: b.vulnerabilityLevel,
  date: '2023-10-01T10:00:00Z',
  assessedBy: 'Sunrise School',
  factors: [
    { rule: 'Low Income', score: 30, explanation: \`Income is \${b.income}\` }
  ]
}));

export const mockRules = Array.from({ length: 15 }).map((_, i) => ({
  id: \`R\${i + 1}\`,
  name: \`Rule \${i + 1}\`,
  category: i % 2 === 0 ? 'Income' : 'Family',
  factor: i % 2 === 0 ? 'income' : 'familySize',
  operator: '<',
  threshold: 15000 + i * 1000,
  score: 10 + i,
  active: true
}));

export const mockSchemes = [
  { id: 'SCH-001', name: 'National Scholarship for EWS', department: 'Education', type: 'Scholarship', educationLevel: 'All', incomeLimit: 15000, status: 'Active' },
  { id: 'SCH-002', name: 'Mid-Day Meal Educational Support', department: 'Education', type: 'Support', educationLevel: 'Primary', incomeLimit: 20000, status: 'Active' },
  { id: 'SCH-003', name: 'Free Textbook & Uniform Scheme', department: 'Education', type: 'Material', educationLevel: 'Primary', incomeLimit: 12000, status: 'Active' },
  { id: 'SCH-004', name: 'Girl Child Education Support', department: 'Education', type: 'Scholarship', educationLevel: 'All', incomeLimit: 25000, status: 'Active' },
  { id: 'SCH-005', name: 'Skill Development for Rural Youth', department: 'Education', type: 'Skill', educationLevel: 'Secondary', incomeLimit: 20000, status: 'Active' }
];

export const mockDashboardStats = {
  totalBeneficiaries: 18,
  pendingVerification: 5,
  assessed: 12,
  highVulnerability: 6,
  moderateVulnerability: 6,
  eligibleSchemes: 15,
  supportInProgress: 8
};
`;
fs.writeFileSync(path.join(__dirname, 'src/data/mockData.js'), mockDataContent);

const files2 = {
  "src/pages/beneficiaries/BeneficiaryList.jsx": `import React from 'react';
import Navbar from '../../components/common/Navbar';
import { mockBeneficiaries } from '../../data/mockData';
import Badge from '../../components/common/Badge';

export default function BeneficiaryList() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow p-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Beneficiaries</h1>
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Add Beneficiary</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-medium text-gray-600">ID</th>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Age</th>
                <th className="p-4 font-medium text-gray-600">Income</th>
                <th className="p-4 font-medium text-gray-600">Vulnerability</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBeneficiaries.map(b => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">{b.id}</td>
                  <td className="p-4 font-medium">{b.firstName} {b.lastName}</td>
                  <td className="p-4">{b.age}</td>
                  <td className="p-4">₹{b.income}</td>
                  <td className="p-4"><Badge variant={b.vulnerabilityLevel}>{b.vulnerabilityLevel}</Badge></td>
                  <td className="p-4">
                    <button className="text-teal-600 hover:underline mr-3">View</button>
                    <button className="text-blue-600 hover:underline">Assess</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
import BeneficiaryList from './pages/beneficiaries/BeneficiaryList';

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
      <Route path="/beneficiaries" element={<ProtectedRoute allowedRoles={['school', 'ngo', 'admin']}><BeneficiaryList /></ProtectedRoute>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;`
};

Object.entries(files2).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log("Files 2 generated");
