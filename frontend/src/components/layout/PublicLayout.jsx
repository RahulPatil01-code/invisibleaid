import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <Shield className="h-8 w-8 text-teal-600" />
                <span className="text-xl font-bold text-gray-900">InvisibleAid</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link to="/auth/register" className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Register Organization
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>InvisibleAid - Empowering communities through data-driven assistance.</p>
          <p className="mt-2 text-xs text-gray-400">
            Disclaimer: This system provides preliminary recommendations. Final decisions should be made by authorized personnel.
          </p>
        </div>
      </footer>
    </div>
  );
}
