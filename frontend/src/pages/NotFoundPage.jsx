import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Shield className="mx-auto h-16 w-16 text-teal-600" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">404 - Page Not Found</h2>
        <p className="mt-2 text-sm text-gray-600">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="text-teal-600 hover:text-teal-500 font-medium">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
