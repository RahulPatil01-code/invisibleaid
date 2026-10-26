import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import Toast from '../../components/common/Toast';
import { beneficiaryAPI, organizationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const initial = {
  name: '', date_of_birth: '', age: '', gender: 'FEMALE', contact_number: '', address: '', state: '', district: '', city_village: '',
  family_size: 1, monthly_income: 0, income_frequency: 'MONTHLY', housing_condition: 'PUCCA', num_earning_members: 1,
  parent_name: '', parent_relationship: 'FATHER', parent_occupation: '', parent_employment_status: 'EMPLOYED_GOVT', parent_monthly_income: 0, parent_is_primary: true,
  has_ration_card: false, ration_card_category: 'NONE', ration_card_number: '',
  education_level: 'PRIMARY', enrollment_status: 'ENROLLED', grade: '', attendance_percentage: '',
  school_name: '', academic_year: '', academic_performance: 'AVERAGE', educational_difficulties: '', higher_education_interest: false,
  meals_per_day: 3, has_electricity: true, has_clean_water: true, has_toilet: true, has_health_insurance: false, distance_to_school_km: 0
};

const choices = {
  gender: ['MALE', 'FEMALE', 'OTHER'],
  income_frequency: ['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY'],
  housing_condition: ['PUCCA', 'SEMI_PUCCA', 'KUTCHA', 'HOMELESS'],
  parent_relationship: ['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER'],
  parent_employment_status: ['EMPLOYED_GOVT', 'EMPLOYED_PRIVATE', 'SELF_EMPLOYED', 'DAILY_WAGE', 'UNEMPLOYED', 'RETIRED', 'DISABLED'],
  ration_card_category: ['AAY', 'PHH', 'NPHH', 'APL', 'BPL', 'ANTYODAYA', 'NONE'],
  education_level: ['NEVER_ENROLLED', 'DROPOUT', 'PRIMARY', 'UPPER_PRIMARY', 'SECONDARY', 'HIGHER_SECONDARY', 'GRADUATE'],
  enrollment_status: ['ENROLLED', 'DROPPED_OUT', 'NEVER_ENROLLED', 'GRADUATED'],
  academic_performance: ['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'POOR']
};

const calculateAge = dob => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return '';
  const [year, month, day] = dob.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > new Date(today.getFullYear(), today.getMonth(), today.getDate())
  ) return '';

  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age--;
  return age;
};

const isBlank = value => String(value ?? '').trim() === '';
const isValidName = value => /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(String(value).trim());
const decimalPattern = (integerDigits, decimalPlaces) =>
  new RegExp(`^\\d{1,${integerDigits}}(?:\\.\\d{1,${decimalPlaces}})?$`);

function validateField(name, value, form, isAdmin) {
  const text = String(value ?? '').trim();
  const requiredText = (label, maxLength) => {
    if (!text) return `${label} is required.`;
    if (text.length > maxLength) return `${label} must be ${maxLength} characters or fewer.`;
    return '';
  };

  if (name === 'name') {
    const error = requiredText('Full name', 255);
    if (error) return error;
    return isValidName(text) ? '' : 'Enter a valid name using letters, spaces, hyphens, or apostrophes.';
  }
  if (name === 'date_of_birth') {
    if (!text) return 'Date of birth is required.';
    if (calculateAge(text) === '') return 'Enter a valid date of birth that is not in the future.';
    return '';
  }
  if (name === 'gender') return choices.gender.includes(value) ? '' : 'Select a valid gender.';
  if (name === 'contact_number') {
    return text && !/^\d{10}$/.test(text) ? 'Enter a valid 10-digit mobile number.' : '';
  }
  if (['state', 'district', 'city_village'].includes(name)) {
    const label = { state: 'State', district: 'District', city_village: 'City / Village' }[name];
    return requiredText(label, 100);
  }
  if (name === 'address') return requiredText('Address', Number.MAX_SAFE_INTEGER);
  if (name === 'organization_id' && isAdmin) return text ? '' : 'Select an organization.';
  if (name === 'family_size') {
    if (!/^\d+$/.test(text) || Number(text) < 1) return 'Family size must be a whole number of at least 1.';
    return '';
  }
  if (name === 'monthly_income' || name === 'parent_monthly_income') {
    if (name === 'parent_monthly_income' && !text) return '';
    if (!decimalPattern(8, 2).test(text)) return 'Enter a non-negative amount with up to 2 decimal places.';
    return '';
  }
  if (name === 'income_frequency' || name === 'housing_condition' || name === 'parent_relationship' ||
      name === 'parent_employment_status' || name === 'ration_card_category' || name === 'education_level' ||
      name === 'enrollment_status' || name === 'academic_performance') {
    return choices[name].includes(value) ? '' : 'Select a valid option.';
  }
  if (name === 'num_earning_members') {
    if (!/^\d+$/.test(text) || Number(text) > Number(form.family_size)) {
      return 'Enter a whole number between 0 and the family size.';
    }
    return '';
  }
  const parentDetailsProvided = !isBlank(form.parent_name) || !isBlank(form.parent_occupation) ||
    Number(form.parent_monthly_income) > 0;
  if (name === 'parent_name' && parentDetailsProvided) {
    if (!text) return 'Parent / guardian name is required when entering guardian details.';
    if (text.length > 255) return 'Parent / guardian name must be 255 characters or fewer.';
    return isValidName(text) ? '' : 'Enter a valid parent / guardian name.';
  }
  if (name === 'parent_occupation' && parentDetailsProvided) {
    if (!text) return 'Occupation is required when entering guardian details.';
    if (text.length > 100) return 'Occupation must be 100 characters or fewer.';
  }
  if (name === 'ration_card_number' && text.length > 100) return 'Ration card number must be 100 characters or fewer.';
  if (name === 'grade' && text.length > 50) return 'Grade / class must be 50 characters or fewer.';
  if (name === 'school_name' && text.length > 255) return 'School name must be 255 characters or fewer.';
  if (name === 'academic_year' && text.length > 20) return 'Academic year must be 20 characters or fewer.';
  if (name === 'attendance_percentage' && text &&
      (!Number.isFinite(Number(text)) || Number(text) < 0 || Number(text) > 100)) {
    return 'Attendance must be a number between 0 and 100.';
  }
  if (name === 'meals_per_day' && (!/^\d+$/.test(text) || Number(text) < 0)) {
    return 'Meals per day must be a non-negative whole number.';
  }
  if (name === 'distance_to_school_km' &&
      (!/^\d+(?:\.\d+)?$/.test(text) || !Number.isFinite(Number(text)))) {
    return 'Distance must be a non-negative number.';
  }
  return '';
}

const serverFieldNames = {
  organization: 'organization_id',
  'family.family_size': 'family_size',
  'family.monthly_income': 'monthly_income',
  'family.income_frequency': 'income_frequency',
  'family.housing_condition': 'housing_condition',
  'family.num_earning_members': 'num_earning_members',
  'family.parents.name': 'parent_name',
  'family.parents.relationship': 'parent_relationship',
  'family.parents.occupation': 'parent_occupation',
  'family.parents.employment_status': 'parent_employment_status',
  'family.parents.monthly_income': 'parent_monthly_income',
  'family.rationcard.category': 'ration_card_category',
  'family.rationcard.card_number': 'ration_card_number',
  'family.ration_card.category': 'ration_card_category',
  'family.ration_card.card_number': 'ration_card_number',
  'education.education_level': 'education_level',
  'education.enrollment_status': 'enrollment_status',
  'education.grade': 'grade',
  'education.attendance_percentage': 'attendance_percentage',
  'education.school_name': 'school_name',
  'education.academic_year': 'academic_year',
  'education.academic_performance': 'academic_performance',
  'education.educational_difficulties': 'educational_difficulties',
  'socioeconomic.meals_per_day': 'meals_per_day',
  'socioeconomic.distance_to_school_km': 'distance_to_school_km'
};

function normalizeServerField(path) {
  const normalized = path
    .replace(/\[(\d+)\]/g, '.$1')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .split('.')
    .filter(part => !/^\d+$/.test(part))
    .join('.');
  const mapped = serverFieldNames[normalized] || normalized;
  return Object.prototype.hasOwnProperty.call(initial, mapped) || mapped === 'organization_id' ? mapped : '';
}

function readServerErrors(data) {
  const fields = {};
  const general = [];
  const visit = (value, path = '') => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (typeof item === 'string' || typeof item === 'number') {
          const field = normalizeServerField(path);
          const message = String(item);
          if (field) fields[field] = [...(fields[field] || []), message].join(' ');
          else general.push(message);
        } else visit(item, path);
      });
      return;
    }
    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => {
        const nextPath = path ? `${path}.${key}` : key;
        if (['detail', 'error', 'non_field_errors'].includes(key)) visit(item, '');
        else visit(item, nextPath);
      });
      return;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const field = normalizeServerField(path);
      if (field) fields[field] = [...(fields[field] || []), String(value)].join(' ');
      else general.push(String(value));
    }
  };
  visit(data);
  return { fields, general: [...new Set(general)] };
}

export default function AddBeneficiary() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [form, setForm] = useState(initial);
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const savingRef = useRef(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (isAdmin) {
      organizationAPI.list()
        .then(setOrganizations)
        .catch(() => setToast({ message: 'Unable to load organizations. Please try again.', type: 'error' }));
    }
  }, [isAdmin]);

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      const input = formRef.current?.querySelector('[aria-invalid="true"]');
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.focus({ preventScroll: true });
      }
    });
  };

  const fieldProps = name => ({
    error: errors[name],
    onBlur: () => {
      const value = name === 'organization_id' ? organizationId : form[name];
      const message = validateField(name, value, form, isAdmin);
      setErrors(previous => {
        return message ? { ...previous, [name]: message } : previous;
      });
    }
  });

  const update = event => {
    const { name, type, checked, value } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    const nextForm = name === 'date_of_birth'
      ? { ...form, date_of_birth: nextValue, age: calculateAge(nextValue) }
      : { ...form, [name]: nextValue };
    setForm(nextForm);
    setErrors(previous => {
      const next = { ...previous };
      delete next[name];
      if (name === 'date_of_birth') delete next.age;
      const message = validateField(name, nextValue, nextForm, isAdmin);
      if (message) next[name] = message;
      if (name === 'family_size') {
        const earningError = validateField('num_earning_members', nextForm.num_earning_members, nextForm, isAdmin);
        if (earningError) next.num_earning_members = earningError;
        else delete next.num_earning_members;
      }
      if (['parent_name', 'parent_occupation', 'parent_monthly_income'].includes(name)) {
        ['parent_name', 'parent_occupation'].forEach(parentField => {
          const parentError = validateField(parentField, nextForm[parentField], nextForm, isAdmin);
          if (parentError) next[parentField] = parentError;
          else delete next[parentField];
        });
      }
      return next;
    });
  };

  const validateForm = () => {
    const fields = Object.keys(initial);
    if (isAdmin) fields.unshift('organization_id');
    const nextErrors = {};
    fields.forEach(name => {
      const value = name === 'organization_id' ? organizationId : form[name];
      const message = validateField(name, value, form, isAdmin);
      if (message) nextErrors[name] = message;
    });
    setErrors(nextErrors);
    return nextErrors;
  };

  const submit = async event => {
    event.preventDefault();
    if (savingRef.current) return;
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setToast({ message: 'Please correct the highlighted fields.', type: 'error' });
      focusFirstInvalid();
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setToast(null);
    const parentDetailsProvided = !isBlank(form.parent_name) || !isBlank(form.parent_occupation) ||
      Number(form.parent_monthly_income) > 0;
    const clean = value => String(value ?? '').trim();
    const payload = {
      beneficiary_id: `BEN-${Date.now()}`,
      name: clean(form.name),
      date_of_birth: form.date_of_birth,
      age: Number(form.age),
      gender: form.gender,
      contact_number: clean(form.contact_number),
      address: clean(form.address),
      state: clean(form.state),
      district: clean(form.district),
      city_village: clean(form.city_village),
      ...(isAdmin ? { organization_id: Number(organizationId) } : {}),
      family: {
        family_size: Number(form.family_size),
        monthly_income: Number(form.monthly_income),
        income_frequency: form.income_frequency,
        housing_condition: form.housing_condition,
        num_earning_members: Number(form.num_earning_members),
        ...(parentDetailsProvided ? {
          parents: [{
            name: clean(form.parent_name),
            relationship: form.parent_relationship,
            occupation: clean(form.parent_occupation),
            employment_status: form.parent_employment_status,
            monthly_income: Number(form.parent_monthly_income),
            is_primary_guardian: form.parent_is_primary
          }]
        } : {}),
        rationcard: {
          has_ration_card: form.has_ration_card,
          category: form.ration_card_category,
          card_number: clean(form.ration_card_number)
        }
      },
      education: {
        education_level: form.education_level,
        enrollment_status: form.enrollment_status,
        grade: clean(form.grade),
        attendance_percentage: form.attendance_percentage ? Number(form.attendance_percentage) : null,
        school_name: clean(form.school_name),
        academic_year: clean(form.academic_year),
        academic_performance: form.academic_performance,
        educational_difficulties: clean(form.educational_difficulties),
        higher_education_interest: form.higher_education_interest
      },
      socioeconomic: {
        meals_per_day: Number(form.meals_per_day),
        has_electricity: form.has_electricity,
        has_clean_water: form.has_clean_water,
        has_toilet: form.has_toilet,
        has_health_insurance: form.has_health_insurance,
        distance_to_school_km: Number(form.distance_to_school_km)
      }
    };

    try {
      const created = await beneficiaryAPI.create(payload);
      setToast({ message: 'Beneficiary created successfully.', type: 'success' });
      setTimeout(() => navigate(`/beneficiaries/${created.id}`), 700);
    } catch (apiError) {
      const responseErrors = readServerErrors(apiError.data);
      setErrors(responseErrors.fields);
      if (Object.keys(responseErrors.fields).length) focusFirstInvalid();
      console.error('Beneficiary creation failed.', {
        status: apiError.status,
        responseFields: Object.keys(apiError.data || {})
      });
      const message = !apiError.status
        ? 'Unable to connect to the server. Check your connection and try again.'
        : apiError.status >= 500
          ? 'The server could not save the beneficiary. Please try again later.'
          : responseErrors.general.length
          ? `Could not save beneficiary: ${responseErrors.general.join(' ')}`
          : 'Could not save beneficiary. Please review the highlighted fields and try again.';
      setToast({ message, type: 'error' });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Beneficiary" subtitle="Create a persisted beneficiary profile" />
      <Card>
        <form ref={formRef} noValidate onSubmit={submit} className="space-y-6">
          <p className="text-xs text-gray-500">Organization ownership is assigned by the backend for School and NGO users.</p>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 1: Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" name="name" value={form.name} onChange={update} required {...fieldProps('name')} />
              <FormInput label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={update} required {...fieldProps('date_of_birth')} />
              <FormInput label="Age" name="age" type="number" value={form.age} readOnly required {...fieldProps('age')} />
              <FormSelect label="Gender" name="gender" value={form.gender} onChange={update} options={choices.gender} required {...fieldProps('gender')} />
              <FormInput label="Contact Number" name="contact_number" value={form.contact_number} onChange={update} {...fieldProps('contact_number')} />
              <FormInput label="State" name="state" value={form.state} onChange={update} required {...fieldProps('state')} />
              <FormInput label="District" name="district" value={form.district} onChange={update} required {...fieldProps('district')} />
              <FormInput label="City / Village" name="city_village" value={form.city_village} onChange={update} required {...fieldProps('city_village')} />
              <FormTextarea label="Address" name="address" value={form.address} onChange={update} required {...fieldProps('address')} />
              {isAdmin && (
                <FormSelect label="Organization" name="organization_id" value={organizationId} onChange={event => {
                  setOrganizationId(event.target.value);
                  setErrors(previous => {
                    const next = { ...previous };
                    delete next.organization_id;
                    return next;
                  });
                }} options={organizations.map(org => ({ value: org.id, label: `${org.name} (${org.org_type})` }))} required {...fieldProps('organization_id')} />
              )}
            </div>
          </div>

          <hr className="border-gray-200 my-6" />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 2: Family &amp; Household</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Family Size" name="family_size" type="number" value={form.family_size} onChange={update} required {...fieldProps('family_size')} />
              <FormInput label="Monthly Income" name="monthly_income" type="number" value={form.monthly_income} onChange={update} required {...fieldProps('monthly_income')} />
              <FormSelect label="Income Frequency" name="income_frequency" value={form.income_frequency} onChange={update} options={choices.income_frequency} required {...fieldProps('income_frequency')} />
              <FormInput label="Earning Members" name="num_earning_members" type="number" value={form.num_earning_members} onChange={update} required {...fieldProps('num_earning_members')} />
              <FormSelect label="Housing Condition" name="housing_condition" value={form.housing_condition} onChange={update} options={choices.housing_condition} required {...fieldProps('housing_condition')} />
              <FormInput label="Parent/Guardian Name" name="parent_name" value={form.parent_name} onChange={update} {...fieldProps('parent_name')} />
              <FormSelect label="Relationship" name="parent_relationship" value={form.parent_relationship} onChange={update} options={choices.parent_relationship} {...fieldProps('parent_relationship')} />
              <FormInput label="Parent Occupation" name="parent_occupation" value={form.parent_occupation} onChange={update} {...fieldProps('parent_occupation')} />
              <FormSelect label="Employment Status" name="parent_employment_status" value={form.parent_employment_status} onChange={update} options={choices.parent_employment_status} {...fieldProps('parent_employment_status')} />
              <FormInput label="Parent Monthly Income" name="parent_monthly_income" type="number" value={form.parent_monthly_income} onChange={update} {...fieldProps('parent_monthly_income')} />
              <div className="flex items-center">
                <input type="checkbox" name="parent_is_primary" checked={form.parent_is_primary} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Is Primary Guardian</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="has_ration_card" checked={form.has_ration_card} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Has Ration Card</label>
              </div>
              <FormSelect label="Ration Card Category" name="ration_card_category" value={form.ration_card_category} onChange={update} options={choices.ration_card_category} {...fieldProps('ration_card_category')} />
              <FormInput label="Ration Card Number" name="ration_card_number" value={form.ration_card_number} onChange={update} {...fieldProps('ration_card_number')} />
            </div>
          </div>

          <hr className="border-gray-200 my-6" />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 3: Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect label="Education Level" name="education_level" value={form.education_level} onChange={update} options={choices.education_level} {...fieldProps('education_level')} />
              <FormSelect label="Enrollment Status" name="enrollment_status" value={form.enrollment_status} onChange={update} options={choices.enrollment_status} {...fieldProps('enrollment_status')} />
              <FormInput label="Grade / Class" name="grade" value={form.grade} onChange={update} {...fieldProps('grade')} />
              <FormInput label="Attendance %" name="attendance_percentage" type="number" value={form.attendance_percentage} onChange={update} {...fieldProps('attendance_percentage')} />
              <FormInput label="School Name" name="school_name" value={form.school_name} onChange={update} {...fieldProps('school_name')} />
              <FormInput label="Academic Year" name="academic_year" value={form.academic_year} onChange={update} {...fieldProps('academic_year')} />
              <FormSelect label="Academic Performance" name="academic_performance" value={form.academic_performance} onChange={update} options={choices.academic_performance} {...fieldProps('academic_performance')} />
              <div className="flex items-center">
                <input type="checkbox" name="higher_education_interest" checked={form.higher_education_interest} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Interested in Higher Education</label>
              </div>
              <div className="md:col-span-2">
                <FormTextarea label="Educational Difficulties" name="educational_difficulties" value={form.educational_difficulties} onChange={update} {...fieldProps('educational_difficulties')} />
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-6" />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 4: Living Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Meals Per Day" name="meals_per_day" type="number" value={form.meals_per_day} onChange={update} required {...fieldProps('meals_per_day')} />
              <FormInput label="Distance to School (km)" name="distance_to_school_km" type="number" value={form.distance_to_school_km} onChange={update} required {...fieldProps('distance_to_school_km')} />
              <div className="flex items-center">
                <input type="checkbox" name="has_electricity" checked={form.has_electricity} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Has Electricity</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="has_clean_water" checked={form.has_clean_water} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Has Clean Water</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="has_toilet" checked={form.has_toilet} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Has Toilet</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="has_health_insurance" checked={form.has_health_insurance} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Has Health Insurance</label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="submit" disabled={saving} className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving...' : 'Submit Beneficiary'}
            </button>
            <button type="button" onClick={() => navigate('/beneficiaries')} className="border border-gray-300 px-4 py-2 rounded-md text-sm">
              Cancel
            </button>
          </div>
        </form>
      </Card>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
