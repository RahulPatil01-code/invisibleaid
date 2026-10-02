import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, ClipboardCheck, GraduationCap, FileText, BarChart3, Settings, Building2, Scale, Shield, ScrollText, BookOpen, HandHelping, User, ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react';

const schoolNgoLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/beneficiaries/add', icon: UserPlus, label: 'Add Beneficiary' },
  { to: '/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { to: '/schemes', icon: GraduationCap, label: 'Schemes' },
  { to: '/applications', icon: HandHelping, label: 'Applications' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/organizations', icon: Building2, label: 'Organizations' },
  { to: '/admin/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/admin/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { to: '/admin/schemes', icon: GraduationCap, label: 'Schemes' },
  { to: '/admin/rules', icon: Scale, label: 'Vulnerability Rules' },
  { to: '/admin/documents', icon: FileText, label: 'Documents' },
  { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { to: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : schoolNgoLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${collapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-lg">InvisibleAid</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-100">
            <p className="font-medium text-gray-800 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-teal-600 font-medium">{user?.role}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {links.map(link => (
            <NavLink key={link.to} to={link.to} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                ${collapsed ? 'justify-center' : ''}`}>
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <button onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-50 w-full mt-1 justify-center">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
