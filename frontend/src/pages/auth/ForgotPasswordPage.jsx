import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/forms/FormInput';

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Password Reset</h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          To reset your password, please contact your system administrator at admin@invisibleaid.org
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link to="/auth/login" className="text-sm font-medium text-teal-600 hover:text-teal-500">
          Back to login
        </Link>
      </div>
    </>
  );
}
