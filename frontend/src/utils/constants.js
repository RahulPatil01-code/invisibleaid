export const VULNERABILITY_LEVELS = {
  HIGH: { label: 'High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  MODERATE: { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' },
  LOW: { label: 'Low', color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200' },
};

export const VERIFICATION_STATUSES = {
  PENDING: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  VERIFIED: { label: 'Verified', color: 'text-green-600', bg: 'bg-green-100' },
  REJECTED: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100' },
  NEEDS_CORRECTION: { label: 'Needs Correction', color: 'text-orange-600', bg: 'bg-orange-100' },
};

export const ELIGIBILITY_STATUSES = {
  ELIGIBLE: { label: 'Eligible', color: 'text-green-600' },
  POTENTIALLY_ELIGIBLE: { label: 'Potentially Eligible', color: 'text-blue-600' },
  NOT_ELIGIBLE: { label: 'Not Eligible', color: 'text-red-600' },
  INSUFFICIENT_INFO: { label: 'Insufficient Info', color: 'text-gray-500' },
};

export const APPLICATION_STATUSES = {
  IDENTIFIED: { label: 'Identified', color: 'text-gray-600', bg: 'bg-gray-100' },
  DOCUMENT_GATHERING: { label: 'Document Gathering', color: 'text-blue-600', bg: 'bg-blue-100' },
  SUBMITTED: { label: 'Submitted', color: 'text-purple-600', bg: 'bg-purple-100' },
  IN_REVIEW: { label: 'In Review', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  APPROVED: { label: 'Approved', color: 'text-green-600', bg: 'bg-green-100' },
  REJECTED: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100' },
  SUPPORT_RECEIVED: { label: 'Support Received', color: 'text-emerald-700', bg: 'bg-emerald-100' },
};

export const EDUCATION_LEVELS = {
  NEVER_ENROLLED: 'Never Enrolled',
  PRE_PRIMARY: 'Pre-Primary',
  PRIMARY: 'Primary (1-5)',
  UPPER_PRIMARY: 'Upper Primary (6-8)',
  SECONDARY: 'Secondary (9-10)',
  HIGHER_SECONDARY: 'Higher Secondary (11-12)',
  GRADUATE: 'Graduate',
  DROPOUT: 'Dropout',
};

export const ENROLLMENT_STATUSES = {
  ENROLLED_REGULAR: 'Enrolled & Regular',
  ENROLLED_IRREGULAR: 'Enrolled but Irregular',
  DROPPED_OUT: 'Dropped Out',
  NEVER_ENROLLED: 'Never Enrolled',
};

export const EMPLOYMENT_STATUSES = {
  EMPLOYED_GOVT: 'Employed (Government)',
  EMPLOYED_PRIVATE: 'Employed (Private)',
  SELF_EMPLOYED: 'Self Employed / Business',
  DAILY_WAGE: 'Daily Wage Laborer',
  UNEMPLOYED: 'Unemployed',
  RETIRED: 'Retired',
  DISABLED: 'Unable to work (Disabled)',
};

export const RATION_CARD_CATEGORIES = {
  AAY: 'AAY (Antyodaya Anna Yojana - Yellow)',
  BPL: 'BPL (Below Poverty Line - Saffron/Pink)',
  PHH: 'PHH (Priority Household)',
  APL: 'APL (Above Poverty Line - White)',
  NPHH: 'NPHH (Non-Priority Household)',
  NONE: 'None',
};

export const HOUSING_CONDITIONS = {
  PUCCA: 'Pucca (Solid/Permanent)',
  SEMI_PUCCA: 'Semi-Pucca (Mixed)',
  KUTCHA: 'Kutcha (Temporary/Fragile)',
  HOMELESS: 'Homeless / Street Dweller',
};

export const GENDER_OPTIONS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

export const DOCUMENT_TYPES = {
  AADHAAR_CARD: 'Aadhaar Card',
  RATION_CARD: 'Ration Card',
  INCOME_CERTIFICATE: 'Income Certificate',
  CASTE_CERTIFICATE: 'Caste Certificate',
  SCHOOL_ID: 'School ID / Bonafide',
  BANK_PASSBOOK: 'Bank Passbook',
  DISABILITY_CERTIFICATE: 'Disability Certificate',
  BIRTH_CERTIFICATE: 'Birth Certificate',
  OTHER: 'Other',
};

export const INCOME_FREQUENCIES = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  ANNUALLY: 'Annually',
  IRREGULAR: 'Irregular/Seasonal',
};

export const SCHEME_TYPES = {
  SCHOLARSHIP: 'Scholarship',
  MATERIAL_SUPPORT: 'Material Support',
  NUTRITION: 'Nutrition',
  SKILL_DEVELOPMENT: 'Skill Development',
  FINANCIAL_AID: 'Financial Aid',
  HEALTHCARE: 'Healthcare Support',
};

export const ACADEMIC_PERFORMANCES = {
  EXCELLENT: 'Excellent (>80%)',
  GOOD: 'Good (60-80%)',
  AVERAGE: 'Average (40-60%)',
  POOR: 'Poor (<40%)',
};

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];
