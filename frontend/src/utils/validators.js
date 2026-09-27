import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z.object({
  orgType: z.enum(['SCHOOL', 'NGO'], { required_error: 'Organization type is required' }),
  orgName: z.string().min(3, { message: 'Organization name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  contactPerson: z.string().min(3, { message: 'Contact person is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const beneficiaryStep1Schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  dob: z.string().refine((val) => {
    if (!val) return false;
    return new Date(val) <= new Date();
  }, { message: 'Date of birth cannot be in the future' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  district: z.string().min(2, { message: 'District is required' }),
  city_village: z.string().min(2, { message: 'City/Village is required' }),
});

export const beneficiaryStep2Schema = z.object({
  school_name: z.string().min(2, { message: 'School name is required' }),
  grade: z.string().min(1, { message: 'Grade is required' }),
  education_level: z.string().min(1, { message: 'Education level is required' }),
  enrollment_status: z.string().min(1, { message: 'Enrollment status is required' }),
});

export const beneficiaryStep3Schema = z.object({
  family_size: z.number().min(1, { message: 'Family size must be at least 1' }),
  monthly_income: z.number().min(0, { message: 'Income cannot be negative' }),
  num_earning_members: z.number().min(0),
  housing_condition: z.string().min(1, { message: 'Housing condition is required' }),
  parents: z.array(
    z.object({
      name: z.string().min(2, { message: 'Parent name is required' }),
      relationship: z.string().min(2, { message: 'Relationship is required' })
    })
  ).min(1, { message: 'At least one parent/guardian is required' })
}).refine((data) => data.num_earning_members <= data.family_size, {
  message: "Earning members cannot exceed family size",
  path: ["num_earning_members"]
});

export const beneficiaryStep4Schema = z.object({
  has_ration_card: z.boolean(),
  category: z.string().optional()
}).refine((data) => {
  if (data.has_ration_card && !data.category) {
    return false;
  }
  return true;
}, {
  message: "Ration card category is required if they have a card",
  path: ["category"]
});

export const beneficiaryStep5Schema = z.object({
  meals_per_day: z.number().min(1).max(5, { message: 'Please enter a valid number of meals' }),
});

export const ruleSchema = z.object({
  name: z.string().min(3, { message: 'Rule name is required' }),
  factor: z.string().min(2, { message: 'Factor is required' }),
  operator: z.string().min(1, { message: 'Operator is required' }),
  threshold_value: z.string().min(1, { message: 'Threshold value is required' }),
  score: z.number().min(1, { message: 'Score must be at least 1' })
});

export const schemeSchema = z.object({
  name: z.string().min(5, { message: 'Scheme name is required' }),
  scheme_type: z.string().min(2, { message: 'Scheme type is required' }),
  department: z.string().min(3, { message: 'Department is required' })
});
