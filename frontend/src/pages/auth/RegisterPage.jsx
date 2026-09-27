import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
  orgType: z.string().min(1, 'Organization type is required'),
  orgName: z.string().min(3, 'Organization name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  regNumber: z.string().min(1, 'Registration number is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register: submitRegistration } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitRegistration({
        email: data.email,
        password: data.password,
        org_name: data.orgName,
        org_type: data.orgType,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        contact_person: data.contactPerson,
        registration_number: data.regNumber,
      });
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error.message || 'Unable to register organization.');
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Register Organization</h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Join InvisibleAid to help beneficiaries access government schemes.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>}
        <FormSelect
          label="Organization Type"
          name="orgType"
          options={[
            { value: 'NGO', label: 'NGO' },
            { value: 'SCHOOL', label: 'School / Educational Institution' },
          ]}
          register={register}
          error={errors.orgType}
          required
        />

        <FormInput
          label="Organization Name"
          name="orgName"
          register={register}
          error={errors.orgName}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            required
          />
          <FormInput
            label="Phone Number"
            name="phone"
            register={register}
            error={errors.phone}
            required
          />
        </div>

        <FormInput
          label="Address"
          name="address"
          register={register}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="City"
            name="city"
            register={register}
            error={errors.city}
            required
          />
          <FormInput
            label="State"
            name="state"
            register={register}
            error={errors.state}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Registration Number"
            name="regNumber"
            register={register}
            error={errors.regNumber}
            required
            helpText="Govt. registration or UDISE code"
          />
          <FormInput
            label="Contact Person"
            name="contactPerson"
            register={register}
            error={errors.contactPerson}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            required
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            error={errors.confirmPassword}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-teal-600 hover:text-teal-500">
            Sign in
          </Link>
        </p>
      </div>

      {showToast && (
        <Toast
          message="Your organization registration is pending approval. An administrator will review and approve your account."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
