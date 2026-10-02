import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Shield,
  Building2,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Hash,
  User,
  Lock,
  ArrowRight,
} from 'lucide-react';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Validation rules. These mirror authentication/serializers.py exactly
// (RegisterSerializer) so a value accepted here is also accepted by the
// backend. The backend remains the source of truth / real security gate —
// this is only for fast, friendly feedback.
// ---------------------------------------------------------------------------
const NAME_RE = /^[A-Za-z0-9&.,'\-\s]+$/;
const CITY_STATE_RE = /^[A-Za-z\s'\-]+$/;
const CONTACT_RE = /^[A-Za-z\s'\-]+$/;
const PHONE_RE = /^\d{10}$/;
const REGNUM_RE = /^[A-Za-z0-9\-/]+$/;
const ADDRESS_RE = /^[A-Za-z0-9\s,.\-/#]+$/;
const HAS_LETTER = /[A-Za-z]/;
const HAS_ALNUM = /[A-Za-z0-9]/;

// Small helper to keep each field's rule short and readable below.
function textField({ requiredMsg, maxLen, maxMsg, mustHaveLetter, mustHaveAlnum, pattern, patternMsg }) {
  return z.string().superRefine((raw, ctx) => {
    const value = (raw || '').trim();
    if (!value) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: requiredMsg });
      return;
    }
    if (maxLen && value.length > maxLen) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: maxMsg });
      return;
    }
    if (mustHaveLetter && !HAS_LETTER.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: patternMsg });
      return;
    }
    if (mustHaveAlnum && !HAS_ALNUM.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: patternMsg });
      return;
    }
    if (pattern && !pattern.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: patternMsg });
    }
  });
}

const registerSchema = z.object({
  orgType: z.string().min(1, 'Organization type is required.'),

  orgName: textField({
    requiredMsg: 'Organization name is required.',
    maxLen: 255,
    maxMsg: 'Organization name is too long.',
    mustHaveAlnum: true,
    pattern: NAME_RE,
    patternMsg: "Organization name can contain letters, numbers, spaces, and & . , - ' only.",
  }),

  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),

  phone: z.string().superRefine((raw, ctx) => {
    const value = (raw || '').trim();
    if (!value) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Phone number is required.' });
      return;
    }
    if (!PHONE_RE.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Phone number must contain exactly 10 digits.' });
    }
  }),

  address: textField({
    requiredMsg: 'Address is required.',
    maxLen: 1000,
    maxMsg: 'Address is too long.',
    pattern: ADDRESS_RE,
    patternMsg: 'Address contains invalid characters.',
  }),

  city: textField({
    requiredMsg: 'City is required.',
    maxLen: 100,
    maxMsg: 'City name is too long.',
    mustHaveLetter: true,
    pattern: CITY_STATE_RE,
    patternMsg: 'City can contain letters, spaces, hyphens, and apostrophes only.',
  }),

  state: textField({
    requiredMsg: 'State is required.',
    maxLen: 100,
    maxMsg: 'State name is too long.',
    mustHaveLetter: true,
    pattern: CITY_STATE_RE,
    patternMsg: 'State can contain letters, spaces, hyphens, and apostrophes only.',
  }),

  regNumber: textField({
    requiredMsg: 'Registration number is required.',
    maxLen: 100,
    maxMsg: 'Registration number is too long.',
    mustHaveAlnum: true,
    pattern: REGNUM_RE,
    patternMsg: 'Registration number can contain letters, numbers, hyphens, and slashes only.',
  }),

  contactPerson: textField({
    requiredMsg: 'Contact person name is required.',
    maxLen: 100,
    maxMsg: 'Contact person name is too long.',
    mustHaveLetter: true,
    pattern: CONTACT_RE,
    patternMsg: 'Contact person name can contain letters, spaces, hyphens, and apostrophes only.',
  }),

  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .refine((v) => /[A-Z]/.test(v), 'Password must contain at least one uppercase letter.')
    .refine((v) => /[a-z]/.test(v), 'Password must contain at least one lowercase letter.')
    .refine((v) => /\d/.test(v), 'Password must contain at least one digit.'),

  confirmPassword: z.string().min(1, 'Confirm your password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

// Strip characters that are never valid for a field, live, as the user
// types. This is a UX convenience (nothing "bad" can even be entered) —
// it is not a substitute for the validation above or on the server.
const filterValue = (value, allowedPattern, maxLen) => {
  let next = value.split('').filter((ch) => allowedPattern.test(ch)).join('');
  if (maxLen) next = next.slice(0, maxLen);
  return next;
};

function Field({ label, htmlFor, icon: Icon, error, helpText, required, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />}
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message || error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}

const inputClass = (hasIcon, error) =>
  `w-full text-sm border rounded-lg ${hasIcon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 outline-none transition-colors ${
    error
      ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
  }`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register: submitRegistration } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Only show a field's error once the user has actually typed into that
  // field (or after a submit attempt) — never on page load, and never
  // "leaked" onto a field the user hasn't touched yet.
  const shown = (name) => (dirtyFields[name] || isSubmitted) && errors[name];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitRegistration({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        org_name: data.orgName.trim(),
        org_type: data.orgType,
        phone: data.phone.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        contact_person: data.contactPerson.trim(),
        registration_number: data.regNumber.trim(),
      });
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error.message || 'Unable to register organization.');
    }
  };

  // react-hook-form field bindings, wrapped so we can filter disallowed
  // characters live for the fields that need it.
  const phoneReg = register('phone');
  const cityReg = register('city');
  const stateReg = register('state');
  const contactReg = register('contactPerson');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-900">InvisibleAid</span>
        </Link>
        <h2 className="text-xl font-bold text-gray-800">Register your organization</h2>
        <p className="text-xs text-gray-500 mt-1">
          Join InvisibleAid to help beneficiaries access government schemes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl sm:rounded-2xl border border-gray-100">
          {submitError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs flex items-start gap-2 whitespace-pre-line">
              <span className="font-bold">Error:</span> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field label="Organization Type" htmlFor="orgType" icon={Building2} error={shown('orgType')} required>
              <select
                id="orgType"
                {...register('orgType')}
                className={inputClass(true, shown('orgType'))}
                defaultValue=""
              >
                <option value="" disabled>Select organization type</option>
                <option value="NGO">NGO</option>
                <option value="SCHOOL">School / Educational Institution</option>
              </select>
            </Field>

            <Field label="Organization Name" htmlFor="orgName" icon={Building2} error={shown('orgName')} required>
              <input
                id="orgName"
                type="text"
                maxLength={255}
                {...register('orgName')}
                className={inputClass(true, shown('orgName'))}
                placeholder="e.g. Sunrise Public School"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email Address" htmlFor="email" icon={Mail} error={shown('email')} required>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={inputClass(true, shown('email'))}
                  placeholder="name@school.edu or name@ngo.org"
                />
              </Field>

              <Field label="Phone Number" htmlFor="phone" icon={Phone} error={shown('phone')} required>
                <input
                  id="phone"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={10}
                  {...phoneReg}
                  onChange={(e) => {
                    e.target.value = filterValue(e.target.value, /\d/, 10);
                    phoneReg.onChange(e);
                  }}
                  className={inputClass(true, shown('phone'))}
                  placeholder="10-digit phone number"
                />
              </Field>
            </div>

            <Field label="Address" htmlFor="address" icon={MapPin} error={shown('address')} required>
              <input
                id="address"
                type="text"
                maxLength={1000}
                {...register('address')}
                className={inputClass(true, shown('address'))}
                placeholder="Street address"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="City" htmlFor="city" icon={Landmark} error={shown('city')} required>
                <input
                  id="city"
                  type="text"
                  maxLength={100}
                  {...cityReg}
                  onChange={(e) => {
                    e.target.value = filterValue(e.target.value, /[A-Za-z\s'\-]/, 100);
                    cityReg.onChange(e);
                  }}
                  className={inputClass(true, shown('city'))}
                />
              </Field>

              <Field label="State" htmlFor="state" icon={Landmark} error={shown('state')} required>
                <input
                  id="state"
                  type="text"
                  maxLength={100}
                  {...stateReg}
                  onChange={(e) => {
                    e.target.value = filterValue(e.target.value, /[A-Za-z\s'\-]/, 100);
                    stateReg.onChange(e);
                  }}
                  className={inputClass(true, shown('state'))}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Registration Number"
                htmlFor="regNumber"
                icon={Hash}
                error={shown('regNumber')}
                required
                helpText="Govt. registration or UDISE code"
              >
                <input
                  id="regNumber"
                  type="text"
                  maxLength={100}
                  {...register('regNumber')}
                  className={inputClass(true, shown('regNumber'))}
                />
              </Field>

              <Field label="Contact Person" htmlFor="contactPerson" icon={User} error={shown('contactPerson')} required>
                <input
                  id="contactPerson"
                  type="text"
                  maxLength={100}
                  {...contactReg}
                  onChange={(e) => {
                    e.target.value = filterValue(e.target.value, /[A-Za-z\s'\-]/, 100);
                    contactReg.onChange(e);
                  }}
                  className={inputClass(true, shown('contactPerson'))}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Password"
                htmlFor="password"
                icon={Lock}
                error={shown('password')}
                required
                helpText="At least 8 characters, with an uppercase letter, a lowercase letter, and a digit."
              >
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={inputClass(true, shown('password'))}
                />
              </Field>

              <Field label="Confirm Password" htmlFor="confirmPassword" icon={Lock} error={shown('confirmPassword')} required>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={inputClass(true, shown('confirmPassword'))}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-md hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Registering...' : 'Register Organization'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-teal-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-600 underline">
            &larr; Return to Public Landing Page
          </Link>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Your organization registration is pending approval. An administrator will review and approve your account."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}