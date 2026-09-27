import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { beneficiaryAPI } from '../../services/api';

export default function EditBeneficiary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    beneficiaryAPI.getById(id).then(record => {
      const parent = record.family?.parents?.[0] || {};
      const ration = record.family?.rationcard || {};
      const edu = record.education || {};
      const socio = record.socioeconomic || {};
      
      setForm({
        name: record.name || '',
        date_of_birth: record.date_of_birth || '',
        age: record.age || '',
        gender: record.gender || 'FEMALE',
        contact_number: record.contact_number || '',
        address: record.address || '',
        state: record.state || '',
        district: record.district || '',
        city_village: record.city_village || '',
        status: record.status || 'SUBMITTED',
        
        family_size: record.family?.family_size || 1,
        monthly_income: record.family?.monthly_income || 0,
        income_frequency: record.family?.income_frequency || 'MONTHLY',
        housing_condition: record.family?.housing_condition || 'PUCCA',
        num_earning_members: record.family?.num_earning_members || 1,
        
        parent_name: parent.name || '',
        parent_relationship: parent.relationship || 'FATHER',
        parent_occupation: parent.occupation || '',
        parent_employment_status: parent.employment_status || 'EMPLOYED',
        parent_monthly_income: parent.monthly_income || 0,
        parent_is_primary: parent.is_primary_guardian ?? true,
        
        has_ration_card: ration.has_ration_card ?? false,
        ration_card_category: ration.category || 'NONE',
        ration_card_number: ration.card_number || '',
        
        education_level: edu.education_level || 'PRIMARY',
        enrollment_status: edu.enrollment_status || 'ENROLLED',
        grade: edu.grade || '',
        attendance_percentage: edu.attendance_percentage || '',
        school_name: edu.school_name || '',
        academic_year: edu.academic_year || '',
        academic_performance: edu.academic_performance || 'AVERAGE',
        educational_difficulties: edu.educational_difficulties || '',
        higher_education_interest: edu.higher_education_interest ?? false,
        
        meals_per_day: socio.meals_per_day || 3,
        has_electricity: socio.has_electricity ?? true,
        has_clean_water: socio.has_clean_water ?? true,
        has_toilet: socio.has_toilet ?? true,
        has_health_insurance: socio.has_health_insurance ?? false,
        distance_to_school_km: socio.distance_to_school_km || 0
      });
    }).catch(apiError => setError(apiError.message || 'Unable to load beneficiary.'));
  }, [id]);

  const update = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm(previous => ({ ...previous, [event.target.name]: value }));
  };

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    
    const payload = {
      name: form.name, date_of_birth: form.date_of_birth, age: Number(form.age), gender: form.gender, contact_number: form.contact_number, address: form.address, state: form.state, district: form.district, city_village: form.city_village, status: form.status,
      family: {
        family_size: Number(form.family_size), monthly_income: Number(form.monthly_income), income_frequency: form.income_frequency, housing_condition: form.housing_condition, num_earning_members: Number(form.num_earning_members),
        parents: [{
          name: form.parent_name, relationship: form.parent_relationship, occupation: form.parent_occupation, employment_status: form.parent_employment_status, monthly_income: Number(form.parent_monthly_income), is_primary_guardian: form.parent_is_primary
        }],
        rationcard: {
          has_ration_card: form.has_ration_card, category: form.ration_card_category, card_number: form.ration_card_number
        }
      },
      education: {
        education_level: form.education_level, enrollment_status: form.enrollment_status, grade: form.grade, attendance_percentage: form.attendance_percentage ? Number(form.attendance_percentage) : null,
        school_name: form.school_name, academic_year: form.academic_year, academic_performance: form.academic_performance, educational_difficulties: form.educational_difficulties, higher_education_interest: form.higher_education_interest
      },
      socioeconomic: {
        meals_per_day: Number(form.meals_per_day), has_electricity: form.has_electricity, has_clean_water: form.has_clean_water, has_toilet: form.has_toilet, has_health_insurance: form.has_health_insurance, distance_to_school_km: Number(form.distance_to_school_km)
      }
    };

    try {
      await beneficiaryAPI.update(id, payload);
      navigate(`/beneficiaries/${id}`);
    } catch (apiError) {
      setError(apiError.message || 'Unable to update beneficiary.');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="p-6 text-sm text-gray-500">{error || 'Loading beneficiary...'}</div>;

  return (
    <div>
      <PageHeader title="Edit Beneficiary" subtitle={id} />
      <Card>
        <form onSubmit={submit} className="space-y-6 max-w-4xl">
          {error && <div className="text-sm text-red-700 bg-red-50 p-3 rounded-md">{error}</div>}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 1: Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" name="name" value={form.name || ''} onChange={update} required />
              <FormInput label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth || ''} onChange={update} />
              <FormInput label="Age" name="age" type="number" value={form.age || ''} onChange={update} />
              <FormSelect label="Gender" name="gender" value={form.gender || ''} onChange={update} options={['MALE', 'FEMALE', 'OTHER']} />
              <FormInput label="Contact Number" name="contact_number" value={form.contact_number || ''} onChange={update} />
              <FormInput label="State" name="state" value={form.state || ''} onChange={update} required />
              <FormInput label="District" name="district" value={form.district || ''} onChange={update} required />
              <FormInput label="City / Village" name="city_village" value={form.city_village || ''} onChange={update} required />
              <FormSelect label="Status" name="status" value={form.status || 'SUBMITTED'} onChange={update} options={['DRAFT', 'SUBMITTED', 'VERIFIED', 'ASSESSED']} />
              <div className="md:col-span-2">
                <FormTextarea label="Address" name="address" value={form.address || ''} onChange={update} required />
              </div>
            </div>
          </div>
          
          <hr className="border-gray-200 my-6" />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 2: Family & Household</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Family Size" name="family_size" type="number" value={form.family_size} onChange={update} required />
              <FormInput label="Monthly Income" name="monthly_income" type="number" value={form.monthly_income} onChange={update} required />
              <FormSelect label="Income Frequency" name="income_frequency" value={form.income_frequency} onChange={update} options={['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY']} required />
              <FormInput label="Earning Members" name="num_earning_members" type="number" value={form.num_earning_members} onChange={update} required />
              <FormSelect label="Housing Condition" name="housing_condition" value={form.housing_condition} onChange={update} options={['PUCCA', 'SEMI_PUCCA', 'KUTCHA', 'HOMELESS']} required />
              
              <FormInput label="Parent/Guardian Name" name="parent_name" value={form.parent_name} onChange={update} />
              <FormSelect label="Relationship" name="parent_relationship" value={form.parent_relationship} onChange={update} options={['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']} />
              <FormInput label="Parent Occupation" name="parent_occupation" value={form.parent_occupation} onChange={update} />
              <FormSelect label="Employment Status" name="parent_employment_status" value={form.parent_employment_status} onChange={update} options={['EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED', 'DAILY_WAGE']} />
              <FormInput label="Parent Monthly Income" name="parent_monthly_income" type="number" value={form.parent_monthly_income} onChange={update} />
              <div className="flex items-center">
                <input type="checkbox" name="parent_is_primary" checked={form.parent_is_primary} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Is Primary Guardian</label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" name="has_ration_card" checked={form.has_ration_card} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Has Ration Card</label>
              </div>
              <FormSelect label="Ration Card Category" name="ration_card_category" value={form.ration_card_category} onChange={update} options={['AAY', 'PHH', 'NPHH', 'APL', 'BPL', 'ANTYODAYA', 'NONE']} />
              <FormInput label="Ration Card Number" name="ration_card_number" value={form.ration_card_number} onChange={update} />
            </div>
          </div>
          
          <hr className="border-gray-200 my-6" />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 3: Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect label="Education Level" name="education_level" value={form.education_level} onChange={update} options={['NEVER_ENROLLED', 'DROPOUT', 'PRIMARY', 'UPPER_PRIMARY', 'SECONDARY', 'HIGHER_SECONDARY', 'GRADUATE']} />
              <FormSelect label="Enrollment Status" name="enrollment_status" value={form.enrollment_status} onChange={update} options={['ENROLLED', 'DROPPED_OUT', 'NEVER_ENROLLED', 'GRADUATED']} />
              <FormInput label="Grade / Class" name="grade" value={form.grade} onChange={update} />
              <FormInput label="Attendance %" name="attendance_percentage" type="number" value={form.attendance_percentage} onChange={update} />
              <FormInput label="School Name" name="school_name" value={form.school_name} onChange={update} />
              <FormInput label="Academic Year" name="academic_year" value={form.academic_year} onChange={update} />
              <FormSelect label="Academic Performance" name="academic_performance" value={form.academic_performance} onChange={update} options={['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'POOR']} />
              <div className="flex items-center">
                <input type="checkbox" name="higher_education_interest" checked={form.higher_education_interest} onChange={update} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-900">Interested in Higher Education</label>
              </div>
              <div className="md:col-span-2">
                <FormTextarea label="Educational Difficulties" name="educational_difficulties" value={form.educational_difficulties} onChange={update} />
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-6" />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section 4: Living Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Meals Per Day" name="meals_per_day" type="number" value={form.meals_per_day} onChange={update} required />
              <FormInput label="Distance to School (km)" name="distance_to_school_km" type="number" value={form.distance_to_school_km} onChange={update} required />
              
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
            <button disabled={saving} className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(`/beneficiaries/${id}`)} className="border px-4 py-2 rounded-md text-sm">
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
