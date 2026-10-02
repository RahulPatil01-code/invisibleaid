// ============================================
// InvisibleAid — Comprehensive Mock Data
// ============================================

export const mockUsers = [
  { id: 1, email: 'admin@invisibleaid.org', password: 'Admin@123', name: 'Admin User', role: 'ADMIN', token: 'mock-jwt-admin', organization: null },
  { id: 2, email: 'greenvalley@school.edu', password: 'School@123', name: 'Green Valley School', role: 'SCHOOL', token: 'mock-jwt-school1', organization: { id: 1, name: 'Green Valley School', type: 'SCHOOL', status: 'APPROVED', email: 'greenvalley@school.edu', phone: '9876543210', city: 'Jaipur', state: 'Rajasthan' } },
  { id: 3, email: 'sunrisepublic@school.edu', password: 'School@123', name: 'Sunrise Public School', role: 'SCHOOL', token: 'mock-jwt-school2', organization: { id: 2, name: 'Sunrise Public School', type: 'SCHOOL', status: 'APPROVED', email: 'sunrisepublic@school.edu', phone: '9876543211', city: 'Lucknow', state: 'Uttar Pradesh' } },
  { id: 4, email: 'hopefoundation@ngo.org', password: 'Ngo@123', name: 'Hope Foundation', role: 'NGO', token: 'mock-jwt-ngo1', organization: { id: 3, name: 'Hope Foundation', type: 'NGO', status: 'APPROVED', email: 'hopefoundation@ngo.org', phone: '9876543212', city: 'Mumbai', state: 'Maharashtra' } },
  { id: 5, email: 'childcaretrust@ngo.org', password: 'Ngo@123', name: 'ChildCare Trust', role: 'NGO', token: 'mock-jwt-ngo2', organization: { id: 4, name: 'ChildCare Trust', type: 'NGO', status: 'APPROVED', email: 'childcaretrust@ngo.org', phone: '9876543213', city: 'Delhi', state: 'Delhi' } },
];

export const mockOrganizations = [
  { id: 1, name: 'Green Valley School', type: 'SCHOOL', email: 'greenvalley@school.edu', phone: '9876543210', address: '42 Education Lane', city: 'Jaipur', state: 'Rajasthan', registration_number: 'SCH-RJ-2020-1234', contact_person: 'Rajesh Sharma', status: 'APPROVED', created_at: '2024-01-15' },
  { id: 2, name: 'Sunrise Public School', type: 'SCHOOL', email: 'sunrisepublic@school.edu', phone: '9876543211', address: '78 Knowledge Park', city: 'Lucknow', state: 'Uttar Pradesh', registration_number: 'SCH-UP-2021-5678', contact_person: 'Sunita Verma', status: 'APPROVED', created_at: '2024-02-20' },
  { id: 3, name: 'Hope Foundation', type: 'NGO', email: 'hopefoundation@ngo.org', phone: '9876543212', address: '15 Social Welfare Road', city: 'Mumbai', state: 'Maharashtra', registration_number: 'NGO-MH-2019-9012', contact_person: 'Priya Desai', status: 'APPROVED', created_at: '2023-06-10' },
  { id: 4, name: 'ChildCare Trust', type: 'NGO', email: 'childcaretrust@ngo.org', phone: '9876543213', address: '33 Welfare Street', city: 'Delhi', state: 'Delhi', registration_number: 'NGO-DL-2020-3456', contact_person: 'Amit Singh', status: 'APPROVED', created_at: '2023-09-05' },
  { id: 5, name: 'Bright Future Academy', type: 'SCHOOL', email: 'brightfuture@school.edu', phone: '9876543214', address: '55 Academy Road', city: 'Pune', state: 'Maharashtra', registration_number: 'SCH-MH-2024-7890', contact_person: 'Meena Kulkarni', status: 'PENDING', created_at: '2024-08-01' },
  { id: 6, name: 'Rural Uplift NGO', type: 'NGO', email: 'ruraluplift@ngo.org', phone: '9876543215', address: '12 Village Development Center', city: 'Bhopal', state: 'Madhya Pradesh', registration_number: 'NGO-MP-2024-1111', contact_person: 'Ramesh Tiwari', status: 'PENDING', created_at: '2024-08-15' },
];

export const mockBeneficiaries = [
  {
    id: 1, beneficiary_id: 'BEN-2024-001', name: 'Aarav Sharma', date_of_birth: '2016-05-12', age: 8, gender: 'MALE', contact_number: '9876500001', address: 'Slum Area 1', state: 'Rajasthan', district: 'Jaipur', city_village: 'Jaipur', status: 'ASSESSED', organization_id: 1, organization_name: 'Green Valley School', created_at: '2024-03-01T10:00:00Z', vulnerability_level: 'HIGH', assessment_id: 'ASS-001',
    family: { family_size: 7, monthly_income: 3500, income_frequency: 'MONTHLY', housing_condition: 'KUTCHA', num_earning_members: 1 },
    parents: [{ name: 'Ram Sharma', relationship: 'Father', occupation: 'Laborer', employment_status: 'DAILY_WAGE', monthly_income: 3500, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'BPL', card_number: 'BPL-RJ-1234', verification_status: 'VERIFIED' },
    education: { school_name: 'Green Valley School', grade: '3rd', academic_year: '2024-25', education_level: 'PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'AVERAGE', attendance_percentage: 65, educational_difficulties: 'Frequent absence due to work', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: false, has_clean_water: false, has_toilet: false, meals_per_day: 2, has_health_insurance: false, distance_to_school_km: 2, additional_notes: 'Needs immediate intervention' }
  },
  {
    id: 2, beneficiary_id: 'BEN-2024-002', name: 'Priya Patel', date_of_birth: '2010-02-15', age: 14, gender: 'FEMALE', contact_number: '9876500002', address: 'Ward 5', state: 'Rajasthan', district: 'Jaipur', city_village: 'Jaipur', status: 'ASSESSED', organization_id: 1, organization_name: 'Green Valley School', created_at: '2024-03-05T10:00:00Z', vulnerability_level: 'HIGH', assessment_id: 'ASS-002',
    family: { family_size: 6, monthly_income: 5000, income_frequency: 'MONTHLY', housing_condition: 'KUTCHA', num_earning_members: 0 },
    parents: [{ name: 'Sita Patel', relationship: 'Mother', occupation: 'None', employment_status: 'UNEMPLOYED', monthly_income: 0, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'AAY', card_number: 'AAY-RJ-5678', verification_status: 'VERIFIED' },
    education: { school_name: 'Green Valley School', grade: '9th', academic_year: '2024-25', education_level: 'SECONDARY', enrollment_status: 'DROPPED_OUT', academic_performance: 'POOR', attendance_percentage: 40, educational_difficulties: 'Financial stress', higher_education_interest: 'No' },
    socioeconomic: { has_electricity: true, has_clean_water: false, has_toilet: true, meals_per_day: 2, has_health_insurance: false, distance_to_school_km: 3, additional_notes: 'Dropped out to help mother' }
  },
  {
    id: 3, beneficiary_id: 'BEN-2024-003', name: 'Rahul Kumar', date_of_birth: '2012-08-20', age: 12, gender: 'MALE', contact_number: '9876500003', address: 'Colony B', state: 'Rajasthan', district: 'Jaipur', city_village: 'Jaipur', status: 'ASSESSED', organization_id: 1, organization_name: 'Green Valley School', created_at: '2024-03-10T10:00:00Z', vulnerability_level: 'HIGH', assessment_id: 'ASS-003',
    family: { family_size: 5, monthly_income: 8500, income_frequency: 'MONTHLY', housing_condition: 'SEMI_PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Ashok Kumar', relationship: 'Father', occupation: 'Painter', employment_status: 'DAILY_WAGE', monthly_income: 8500, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'PHH', card_number: 'PHH-RJ-9012', verification_status: 'VERIFIED' },
    education: { school_name: 'Green Valley School', grade: '7th', academic_year: '2024-25', education_level: 'UPPER_PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'GOOD', attendance_percentage: 75, educational_difficulties: 'Needs textbooks', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: false, distance_to_school_km: 1, additional_notes: '' }
  },
  {
    id: 4, beneficiary_id: 'BEN-2024-004', name: 'Meera Devi', date_of_birth: '2014-11-05', age: 10, gender: 'FEMALE', contact_number: '9876500004', address: 'Street 9', state: 'Rajasthan', district: 'Jaipur', city_village: 'Jaipur', status: 'ASSESSED', organization_id: 1, organization_name: 'Green Valley School', created_at: '2024-03-12T10:00:00Z', vulnerability_level: 'HIGH', assessment_id: 'ASS-004',
    family: { family_size: 4, monthly_income: 7000, income_frequency: 'MONTHLY', housing_condition: 'HOMELESS', num_earning_members: 0 },
    parents: [{ name: 'Kamla Devi', relationship: 'Mother', occupation: 'None', employment_status: 'UNEMPLOYED', monthly_income: 0, is_primary_guardian: true }],
    ration_card: { has_ration_card: false, category: 'NONE', card_number: null, verification_status: 'PENDING' },
    education: { school_name: 'Green Valley School', grade: '5th', academic_year: '2024-25', education_level: 'PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'BELOW_AVERAGE', attendance_percentage: 50, educational_difficulties: 'No fixed home', higher_education_interest: 'Maybe' },
    socioeconomic: { has_electricity: false, has_clean_water: false, has_toilet: false, meals_per_day: 2, has_health_insurance: false, distance_to_school_km: 4, additional_notes: 'Living in temporary shelter' }
  },
  {
    id: 5, beneficiary_id: 'BEN-2024-005', name: 'Ananya Singh', date_of_birth: '2009-04-18', age: 15, gender: 'FEMALE', contact_number: '9876500005', address: 'Sector 4', state: 'Rajasthan', district: 'Jaipur', city_village: 'Jaipur', status: 'ASSESSED', organization_id: 1, organization_name: 'Green Valley School', created_at: '2024-03-15T10:00:00Z', vulnerability_level: 'MODERATE', assessment_id: 'ASS-005',
    family: { family_size: 5, monthly_income: 12000, income_frequency: 'MONTHLY', housing_condition: 'SEMI_PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Vikram Singh', relationship: 'Father', occupation: 'Vendor', employment_status: 'SELF_EMPLOYED', monthly_income: 12000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'BPL', card_number: 'BPL-RJ-3456', verification_status: 'VERIFIED' },
    education: { school_name: 'Green Valley School', grade: '10th', academic_year: '2024-25', education_level: 'SECONDARY', enrollment_status: 'ENROLLED', academic_performance: 'EXCELLENT', attendance_percentage: 95, educational_difficulties: 'Needs coaching', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: true, distance_to_school_km: 2, additional_notes: '' }
  },
  {
    id: 6, beneficiary_id: 'BEN-2024-006', name: 'Arjun Yadav', date_of_birth: '2013-09-22', age: 11, gender: 'MALE', contact_number: '9876500006', address: 'Block D', state: 'Rajasthan', district: 'Jaipur', city_village: 'Jaipur', status: 'ASSESSED', organization_id: 1, organization_name: 'Green Valley School', created_at: '2024-03-20T10:00:00Z', vulnerability_level: 'MODERATE', assessment_id: 'ASS-006',
    family: { family_size: 4, monthly_income: 15000, income_frequency: 'MONTHLY', housing_condition: 'SEMI_PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Manoj Yadav', relationship: 'Father', occupation: 'Clerk', employment_status: 'EMPLOYED_PRIVATE', monthly_income: 15000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'PHH', card_number: 'PHH-RJ-7890', verification_status: 'VERIFIED' },
    education: { school_name: 'Green Valley School', grade: '6th', academic_year: '2024-25', education_level: 'UPPER_PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'GOOD', attendance_percentage: 85, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: false, distance_to_school_km: 1.5, additional_notes: '' }
  },
  {
    id: 7, beneficiary_id: 'BEN-2024-007', name: 'Kavya Reddy', date_of_birth: '2015-01-30', age: 9, gender: 'FEMALE', contact_number: '9876500007', address: 'Slum 3', state: 'Uttar Pradesh', district: 'Lucknow', city_village: 'Lucknow', status: 'ASSESSED', organization_id: 2, organization_name: 'Sunrise Public School', created_at: '2024-04-01T10:00:00Z', vulnerability_level: 'HIGH', assessment_id: 'ASS-007',
    family: { family_size: 6, monthly_income: 10000, income_frequency: 'MONTHLY', housing_condition: 'KUTCHA', num_earning_members: 2 },
    parents: [{ name: 'Ramesh Reddy', relationship: 'Father', occupation: 'Laborer', employment_status: 'DAILY_WAGE', monthly_income: 6000, is_primary_guardian: true }, { name: 'Gita Reddy', relationship: 'Mother', occupation: 'Maid', employment_status: 'DAILY_WAGE', monthly_income: 4000, is_primary_guardian: false }],
    ration_card: { has_ration_card: true, category: 'BPL', card_number: 'BPL-UP-1111', verification_status: 'VERIFIED' },
    education: { school_name: 'Sunrise Public School', grade: '4th', academic_year: '2024-25', education_level: 'PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'AVERAGE', attendance_percentage: 70, educational_difficulties: 'Lack of stationary', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: false, has_clean_water: true, has_toilet: false, meals_per_day: 3, has_health_insurance: false, distance_to_school_km: 2.5, additional_notes: '' }
  },
  {
    id: 8, beneficiary_id: 'BEN-2024-008', name: 'Rohan Gupta', date_of_birth: '2008-07-14', age: 16, gender: 'MALE', contact_number: '9876500008', address: 'Apt 4B', state: 'Uttar Pradesh', district: 'Lucknow', city_village: 'Lucknow', status: 'ASSESSED', organization_id: 2, organization_name: 'Sunrise Public School', created_at: '2024-04-05T10:00:00Z', vulnerability_level: 'LOW', assessment_id: 'ASS-008',
    family: { family_size: 3, monthly_income: 18000, income_frequency: 'MONTHLY', housing_condition: 'PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Sanjay Gupta', relationship: 'Father', occupation: 'Manager', employment_status: 'EMPLOYED_PRIVATE', monthly_income: 18000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'APL', card_number: 'APL-UP-2222', verification_status: 'VERIFIED' },
    education: { school_name: 'Sunrise Public School', grade: '11th', academic_year: '2024-25', education_level: 'HIGHER_SECONDARY', enrollment_status: 'ENROLLED', academic_performance: 'GOOD', attendance_percentage: 90, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: true, distance_to_school_km: 1, additional_notes: '' }
  },
  {
    id: 9, beneficiary_id: 'BEN-2024-009', name: 'Sneha Joshi', date_of_birth: '2011-12-05', age: 13, gender: 'FEMALE', contact_number: '9876500009', address: 'House 12', state: 'Uttar Pradesh', district: 'Lucknow', city_village: 'Lucknow', status: 'ASSESSED', organization_id: 2, organization_name: 'Sunrise Public School', created_at: '2024-04-10T10:00:00Z', vulnerability_level: 'LOW', assessment_id: 'ASS-009',
    family: { family_size: 4, monthly_income: 22000, income_frequency: 'MONTHLY', housing_condition: 'PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Rajiv Joshi', relationship: 'Father', occupation: 'Teacher', employment_status: 'EMPLOYED_GOVT', monthly_income: 22000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'NPHH', card_number: 'NPHH-UP-3333', verification_status: 'VERIFIED' },
    education: { school_name: 'Sunrise Public School', grade: '8th', academic_year: '2024-25', education_level: 'UPPER_PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'EXCELLENT', attendance_percentage: 95, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: true, distance_to_school_km: 1.2, additional_notes: '' }
  },
  {
    id: 10, beneficiary_id: 'BEN-2024-010', name: 'Vikram Thakur', date_of_birth: '2017-03-25', age: 7, gender: 'MALE', contact_number: '9876500010', address: 'Village Outskirts', state: 'Uttar Pradesh', district: 'Lucknow', city_village: 'Lucknow', status: 'ASSESSED', organization_id: 2, organization_name: 'Sunrise Public School', created_at: '2024-04-15T10:00:00Z', vulnerability_level: 'HIGH', assessment_id: 'ASS-010',
    family: { family_size: 8, monthly_income: 4000, income_frequency: 'MONTHLY', housing_condition: 'KUTCHA', num_earning_members: 1 },
    parents: [{ name: 'Bheem Thakur', relationship: 'Father', occupation: 'Farm Laborer', employment_status: 'DAILY_WAGE', monthly_income: 4000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'AAY', card_number: 'AAY-UP-4444', verification_status: 'VERIFIED' },
    education: { school_name: 'Sunrise Public School', grade: '2nd', academic_year: '2024-25', education_level: 'PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'POOR', attendance_percentage: 45, educational_difficulties: 'Often sick', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: false, has_clean_water: false, has_toilet: false, meals_per_day: 2, has_health_insurance: false, distance_to_school_km: 3, additional_notes: '' }
  },
  {
    id: 11, beneficiary_id: 'BEN-2024-011', name: 'Pooja Mishra', date_of_birth: '2010-06-11', age: 14, gender: 'FEMALE', contact_number: '9876500011', address: 'Chawl 9', state: 'Maharashtra', district: 'Mumbai', city_village: 'Mumbai', status: 'ASSESSED', organization_id: 3, organization_name: 'Hope Foundation', created_at: '2024-05-01T10:00:00Z', vulnerability_level: 'MODERATE', assessment_id: 'ASS-011',
    family: { family_size: 5, monthly_income: 9000, income_frequency: 'MONTHLY', housing_condition: 'SEMI_PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Hari Mishra', relationship: 'Father', occupation: 'Tailor', employment_status: 'SELF_EMPLOYED', monthly_income: 9000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'BPL', card_number: 'BPL-MH-5555', verification_status: 'VERIFIED' },
    education: { school_name: 'Govt High School', grade: '9th', academic_year: '2024-25', education_level: 'SECONDARY', enrollment_status: 'ENROLLED', academic_performance: 'AVERAGE', attendance_percentage: 80, educational_difficulties: 'Needs uniform', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: false, meals_per_day: 3, has_health_insurance: false, distance_to_school_km: 1.5, additional_notes: '' }
  },
  {
    id: 12, beneficiary_id: 'BEN-2024-012', name: 'Amit Verma', date_of_birth: '2007-09-09', age: 17, gender: 'MALE', contact_number: '9876500012', address: 'Quarters', state: 'Maharashtra', district: 'Mumbai', city_village: 'Mumbai', status: 'ASSESSED', organization_id: 3, organization_name: 'Hope Foundation', created_at: '2024-05-10T10:00:00Z', vulnerability_level: 'LOW', assessment_id: 'ASS-012',
    family: { family_size: 3, monthly_income: 25000, income_frequency: 'MONTHLY', housing_condition: 'PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Sunil Verma', relationship: 'Father', occupation: 'Clerk', employment_status: 'EMPLOYED_GOVT', monthly_income: 25000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'APL', card_number: 'APL-MH-6666', verification_status: 'VERIFIED' },
    education: { school_name: 'Govt High School', grade: '12th', academic_year: '2024-25', education_level: 'HIGHER_SECONDARY', enrollment_status: 'ENROLLED', academic_performance: 'GOOD', attendance_percentage: 92, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: true, distance_to_school_km: 2, additional_notes: '' }
  },
  {
    id: 13, beneficiary_id: 'BEN-2024-013', name: 'Divya Nair', date_of_birth: '2013-02-14', age: 11, gender: 'FEMALE', contact_number: '9876500013', address: 'Slum 12', state: 'Maharashtra', district: 'Mumbai', city_village: 'Mumbai', status: 'SUBMITTED', organization_id: 3, organization_name: 'Hope Foundation', created_at: '2024-05-15T10:00:00Z', vulnerability_level: null, assessment_id: null,
    family: { family_size: 7, monthly_income: 6000, income_frequency: 'MONTHLY', housing_condition: 'KUTCHA', num_earning_members: 1 },
    parents: [{ name: 'Gopal Nair', relationship: 'Father', occupation: 'Cleaner', employment_status: 'DAILY_WAGE', monthly_income: 6000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'PHH', card_number: 'PHH-MH-7777', verification_status: 'PENDING' },
    education: { school_name: 'Govt Primary School', grade: '6th', academic_year: '2024-25', education_level: 'UPPER_PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'POOR', attendance_percentage: 55, educational_difficulties: 'Frequent illness', higher_education_interest: 'Maybe' },
    socioeconomic: { has_electricity: false, has_clean_water: false, has_toilet: false, meals_per_day: 2, has_health_insurance: false, distance_to_school_km: 1, additional_notes: '' }
  },
  {
    id: 14, beneficiary_id: 'BEN-2024-014', name: 'Karan Chauhan', date_of_birth: '2009-11-20', age: 15, gender: 'MALE', contact_number: '9876500014', address: 'Gali 4', state: 'Maharashtra', district: 'Mumbai', city_village: 'Mumbai', status: 'VERIFIED', organization_id: 3, organization_name: 'Hope Foundation', created_at: '2024-05-20T10:00:00Z', vulnerability_level: null, assessment_id: null,
    family: { family_size: 4, monthly_income: 14000, income_frequency: 'MONTHLY', housing_condition: 'SEMI_PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Ravi Chauhan', relationship: 'Father', occupation: 'Mechanic', employment_status: 'SELF_EMPLOYED', monthly_income: 14000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'BPL', card_number: 'BPL-MH-8888', verification_status: 'VERIFIED' },
    education: { school_name: 'Govt High School', grade: '10th', academic_year: '2024-25', education_level: 'SECONDARY', enrollment_status: 'ENROLLED', academic_performance: 'AVERAGE', attendance_percentage: 85, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: false, distance_to_school_km: 2, additional_notes: '' }
  },
  {
    id: 15, beneficiary_id: 'BEN-2024-015', name: 'Neha Agarwal', date_of_birth: '2016-08-08', age: 8, gender: 'FEMALE', contact_number: '9876500015', address: 'Apt 101', state: 'Delhi', district: 'New Delhi', city_village: 'Delhi', status: 'DRAFT', organization_id: 4, organization_name: 'ChildCare Trust', created_at: '2024-06-01T10:00:00Z', vulnerability_level: null, assessment_id: null,
    family: { family_size: 3, monthly_income: 35000, income_frequency: 'MONTHLY', housing_condition: 'PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Vikas Agarwal', relationship: 'Father', occupation: 'Software Eng', employment_status: 'EMPLOYED_PRIVATE', monthly_income: 35000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'APL', card_number: 'APL-DL-9999', verification_status: 'VERIFIED' },
    education: { school_name: 'City Public School', grade: '3rd', academic_year: '2024-25', education_level: 'PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'EXCELLENT', attendance_percentage: 98, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: true, distance_to_school_km: 3, additional_notes: '' }
  },
  {
    id: 16, beneficiary_id: 'BEN-2024-016', name: 'Suresh Patil', date_of_birth: '2011-04-12', age: 13, gender: 'MALE', contact_number: '9876500016', address: 'Colony D', state: 'Delhi', district: 'New Delhi', city_village: 'Delhi', status: 'SUBMITTED', organization_id: 4, organization_name: 'ChildCare Trust', created_at: '2024-06-05T10:00:00Z', vulnerability_level: null, assessment_id: null,
    family: { family_size: 6, monthly_income: 11000, income_frequency: 'MONTHLY', housing_condition: 'SEMI_PUCCA', num_earning_members: 1 },
    parents: [{ name: 'Anil Patil', relationship: 'Father', occupation: 'Security Guard', employment_status: 'DAILY_WAGE', monthly_income: 11000, is_primary_guardian: true }],
    ration_card: { has_ration_card: true, category: 'PHH', card_number: 'PHH-DL-1010', verification_status: 'PENDING' },
    education: { school_name: 'City Public School', grade: '8th', academic_year: '2024-25', education_level: 'UPPER_PRIMARY', enrollment_status: 'ENROLLED', academic_performance: 'AVERAGE', attendance_percentage: 75, educational_difficulties: 'Needs guidance', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: false, meals_per_day: 3, has_health_insurance: false, distance_to_school_km: 1, additional_notes: '' }
  },
  {
    id: 17, beneficiary_id: 'BEN-2024-017', name: 'Lakshmi Iyer', date_of_birth: '2014-01-22', age: 10, gender: 'FEMALE', contact_number: '9876500017', address: 'Under Bridge', state: 'Delhi', district: 'New Delhi', city_village: 'Delhi', status: 'VERIFIED', organization_id: 4, organization_name: 'ChildCare Trust', created_at: '2024-06-10T10:00:00Z', vulnerability_level: null, assessment_id: null,
    family: { family_size: 5, monthly_income: 2000, income_frequency: 'MONTHLY', housing_condition: 'HOMELESS', num_earning_members: 0 },
    parents: [{ name: 'Maya Iyer', relationship: 'Mother', occupation: 'Beggar', employment_status: 'UNEMPLOYED', monthly_income: 2000, is_primary_guardian: true }],
    ration_card: { has_ration_card: false, category: 'NONE', card_number: null, verification_status: 'PENDING' },
    education: { school_name: 'None', grade: 'N/A', academic_year: '2024-25', education_level: 'NEVER_ENROLLED', enrollment_status: 'NEVER_ENROLLED', academic_performance: 'POOR', attendance_percentage: 0, educational_difficulties: 'No school access', higher_education_interest: 'No' },
    socioeconomic: { has_electricity: false, has_clean_water: false, has_toilet: false, meals_per_day: 1, has_health_insurance: false, distance_to_school_km: 5, additional_notes: 'Urgent rescue needed' }
  },
  {
    id: 18, beneficiary_id: 'BEN-2024-018', name: 'Ravi Deshmukh', date_of_birth: '2008-10-10', age: 16, gender: 'MALE', contact_number: '9876500018', address: 'Vasant Kunj', state: 'Delhi', district: 'New Delhi', city_village: 'Delhi', status: 'DRAFT', organization_id: 4, organization_name: 'ChildCare Trust', created_at: '2024-06-15T10:00:00Z', vulnerability_level: null, assessment_id: null,
    family: { family_size: 4, monthly_income: 45000, income_frequency: 'MONTHLY', housing_condition: 'PUCCA', num_earning_members: 2 },
    parents: [{ name: 'Vinod Deshmukh', relationship: 'Father', occupation: 'Banker', employment_status: 'EMPLOYED_GOVT', monthly_income: 30000, is_primary_guardian: true }, { name: 'Anjali Deshmukh', relationship: 'Mother', occupation: 'Teacher', employment_status: 'EMPLOYED_PRIVATE', monthly_income: 15000, is_primary_guardian: false }],
    ration_card: { has_ration_card: true, category: 'APL', card_number: 'APL-DL-1212', verification_status: 'VERIFIED' },
    education: { school_name: 'Delhi Public School', grade: '11th', academic_year: '2024-25', education_level: 'HIGHER_SECONDARY', enrollment_status: 'ENROLLED', academic_performance: 'EXCELLENT', attendance_percentage: 99, educational_difficulties: '', higher_education_interest: 'Yes' },
    socioeconomic: { has_electricity: true, has_clean_water: true, has_toilet: true, meals_per_day: 3, has_health_insurance: true, distance_to_school_km: 4, additional_notes: '' }
  }
];

export const mockRules = [
  { id: 1, name: 'Very Low Income', description: 'Monthly income below ₹5,000', category: 'Income', factor: 'MONTHLY_INCOME', operator: 'LT', threshold_value: 5000, score: 25, priority: 1, is_active: true },
  { id: 2, name: 'Low Income', description: 'Monthly income below ₹10,000', category: 'Income', factor: 'MONTHLY_INCOME', operator: 'LT', threshold_value: 10000, score: 15, priority: 2, is_active: true },
  { id: 3, name: 'No Earning Member', description: 'No earning member in family', category: 'Employment', factor: 'EARNING_MEMBERS', operator: 'EQ', threshold_value: 0, score: 20, priority: 3, is_active: true },
  { id: 4, name: 'Single Earning Member', description: 'Only one earning member', category: 'Employment', factor: 'EARNING_MEMBERS', operator: 'LTE', threshold_value: 1, score: 10, priority: 4, is_active: true },
  { id: 5, name: 'Unemployed Parent', description: 'Primary guardian unemployed', category: 'Employment', factor: 'EMPLOYMENT_STATUS', operator: 'IN', threshold_value: 'UNEMPLOYED,DISABLED', score: 15, priority: 5, is_active: true },
  { id: 6, name: 'Daily Wage Worker', description: 'Primary guardian is daily wage laborer', category: 'Employment', factor: 'EMPLOYMENT_STATUS', operator: 'EQ', threshold_value: 'DAILY_WAGE', score: 10, priority: 6, is_active: true },
  { id: 7, name: 'Large Family', description: 'Family size of 6 or more', category: 'Family', factor: 'FAMILY_SIZE', operator: 'GTE', threshold_value: 6, score: 10, priority: 7, is_active: true },
  { id: 8, name: 'BPL/AAY Ration Card', description: 'Has BPL or AAY ration card', category: 'Ration Card', factor: 'RATION_CARD_CATEGORY', operator: 'IN', threshold_value: 'AAY,BPL,ANTYODAYA', score: 15, priority: 8, is_active: true },
  { id: 9, name: 'No Ration Card', description: 'Does not have a ration card', category: 'Ration Card', factor: 'RATION_CARD_CATEGORY', operator: 'EQ', threshold_value: 'NONE', score: 5, priority: 9, is_active: true },
  { id: 10, name: 'School Dropout', description: 'Child has dropped out of school', category: 'Education', factor: 'ENROLLMENT_STATUS', operator: 'EQ', threshold_value: 'DROPPED_OUT', score: 20, priority: 10, is_active: true },
  { id: 11, name: 'Poor Attendance', description: 'School attendance below 60%', category: 'Education', factor: 'ATTENDANCE', operator: 'LT', threshold_value: 60, score: 10, priority: 11, is_active: true },
  { id: 12, name: 'Kutcha/Homeless Housing', description: 'Lives in kutcha house or is homeless', category: 'Housing', factor: 'HOUSING_CONDITION', operator: 'IN', threshold_value: 'KUTCHA,HOMELESS', score: 15, priority: 12, is_active: true },
  { id: 13, name: 'Insufficient Meals', description: 'Less than 3 meals per day', category: 'Nutrition', factor: 'MEALS_PER_DAY', operator: 'LT', threshold_value: 3, score: 10, priority: 13, is_active: true },
  { id: 14, name: 'No Electricity', description: 'Household without electricity', category: 'Infrastructure', factor: 'HAS_ELECTRICITY', operator: 'EQ', threshold_value: false, score: 5, priority: 14, is_active: true },
  { id: 15, name: 'No Clean Water', description: 'No access to clean drinking water', category: 'Infrastructure', factor: 'HAS_CLEAN_WATER', operator: 'EQ', threshold_value: false, score: 5, priority: 15, is_active: true },
];

export const mockSchemes = [
  { id: 1, name: 'National Scholarship for EWS', department: 'Education', description: 'Financial support for economically weaker sections.', scheme_type: 'SCHOLARSHIP', education_level_min: 'PRIMARY', education_level_max: 'HIGHER_SECONDARY', min_age: 6, max_age: 18, income_limit: 15000, ration_card_required: false, accepted_ration_categories: [], gender_requirement: 'ANY', benefits: '₹500 per month for primary, ₹1000 for secondary.', required_documents: ['Income Certificate', 'Aadhar Card', 'School ID'], application_method: 'Apply online via National Scholarship Portal.', official_url: null, official_source: 'Demo Data', is_active: true, is_demo_data: true, last_updated: '2024-01-15' },
  { id: 2, name: 'Mid-Day Meal Educational Support', department: 'Education', description: 'Nutritional support for school-going children.', scheme_type: 'NUTRITION', education_level_min: 'PRIMARY', education_level_max: 'UPPER_PRIMARY', min_age: 6, max_age: 14, income_limit: 20000, ration_card_required: false, accepted_ration_categories: [], gender_requirement: 'ANY', benefits: 'Free cooked meal every school day.', required_documents: ['School Enrollment Proof'], application_method: 'Provided directly at government schools.', official_url: null, official_source: 'Demo Data', is_active: true, is_demo_data: true, last_updated: '2024-01-15' },
  { id: 3, name: 'Free Textbook & Uniform Scheme', department: 'Education', description: 'Provides essential study materials.', scheme_type: 'MATERIAL_SUPPORT', education_level_min: 'PRIMARY', education_level_max: 'SECONDARY', min_age: 6, max_age: 16, income_limit: 12000, ration_card_required: true, accepted_ration_categories: ['AAY', 'BPL', 'PHH'], gender_requirement: 'ANY', benefits: 'Free textbooks and 2 sets of uniforms per year.', required_documents: ['Ration Card', 'School ID'], application_method: 'Apply through school administration.', official_url: null, official_source: 'Demo Data', is_active: true, is_demo_data: true, last_updated: '2024-01-15' },
  { id: 4, name: 'Girl Child Education Support', department: 'Women & Child Development', description: 'Special scholarship to encourage female literacy.', scheme_type: 'SCHOLARSHIP', education_level_min: 'PRIMARY', education_level_max: 'HIGHER_SECONDARY', min_age: 6, max_age: 18, income_limit: 25000, ration_card_required: false, accepted_ration_categories: [], gender_requirement: 'FEMALE', benefits: '₹1200 per month and free bicycle for secondary students.', required_documents: ['Birth Certificate', 'Income Certificate', 'Bank Account Details'], application_method: 'Online application through state portal.', official_url: null, official_source: 'Demo Data', is_active: true, is_demo_data: true, last_updated: '2024-01-15' },
  { id: 5, name: 'Skill Development for Rural Youth', department: 'Skill Development', description: 'Vocational training for youth.', scheme_type: 'SKILL_DEVELOPMENT', education_level_min: 'UPPER_PRIMARY', education_level_max: 'HIGHER_SECONDARY', min_age: 14, max_age: 18, income_limit: 20000, ration_card_required: false, accepted_ration_categories: [], gender_requirement: 'ANY', benefits: 'Free 3-month vocational course with stipend.', required_documents: ['Age Proof', 'Income Certificate'], application_method: 'Register at local skill center.', official_url: null, official_source: 'Demo Data', is_active: true, is_demo_data: true, last_updated: '2024-01-15' },
];

export const mockAssessments = [
  { id: 'ASS-001', beneficiary_id: 1, beneficiary_name: 'Aarav Sharma', total_score: 78, max_score: 100, vulnerability_level: 'HIGH', verified_info_percentage: 95, assessed_by: 'Green Valley School', assessed_at: '2024-03-02T10:00:00Z', notes: 'High vulnerability detected.', factors: [{ rule_id: 1, rule_name: 'Very Low Income', category: 'Income', triggered: true, score_awarded: 25, actual_value: '3500', threshold_value: '5000', explanation: 'Income is 3500' }] },
  { id: 'ASS-002', beneficiary_id: 2, beneficiary_name: 'Priya Patel', total_score: 82, max_score: 100, vulnerability_level: 'HIGH', verified_info_percentage: 90, assessed_by: 'Green Valley School', assessed_at: '2024-03-06T10:00:00Z', notes: 'Needs urgent support.', factors: [] },
  { id: 'ASS-003', beneficiary_id: 3, beneficiary_name: 'Rahul Kumar', total_score: 65, max_score: 100, vulnerability_level: 'HIGH', verified_info_percentage: 95, assessed_by: 'Green Valley School', assessed_at: '2024-03-11T10:00:00Z', notes: 'Borderline high.', factors: [] },
  { id: 'ASS-004', beneficiary_id: 4, beneficiary_name: 'Meera Devi', total_score: 85, max_score: 100, vulnerability_level: 'HIGH', verified_info_percentage: 85, assessed_by: 'Green Valley School', assessed_at: '2024-03-13T10:00:00Z', notes: 'Homeless condition elevates risk.', factors: [] },
  { id: 'ASS-005', beneficiary_id: 5, beneficiary_name: 'Ananya Singh', total_score: 45, max_score: 100, vulnerability_level: 'MODERATE', verified_info_percentage: 95, assessed_by: 'Green Valley School', assessed_at: '2024-03-16T10:00:00Z', notes: 'Stable but needs educational support.', factors: [] },
  { id: 'ASS-006', beneficiary_id: 6, beneficiary_name: 'Arjun Yadav', total_score: 40, max_score: 100, vulnerability_level: 'MODERATE', verified_info_percentage: 95, assessed_by: 'Green Valley School', assessed_at: '2024-03-21T10:00:00Z', notes: 'Moderate risk.', factors: [] },
  { id: 'ASS-007', beneficiary_id: 7, beneficiary_name: 'Kavya Reddy', total_score: 75, max_score: 100, vulnerability_level: 'HIGH', verified_info_percentage: 95, assessed_by: 'Sunrise Public School', assessed_at: '2024-04-02T10:00:00Z', notes: 'Needs uniform and books.', factors: [] },
  { id: 'ASS-008', beneficiary_id: 8, beneficiary_name: 'Rohan Gupta', total_score: 15, max_score: 100, vulnerability_level: 'LOW', verified_info_percentage: 100, assessed_by: 'Sunrise Public School', assessed_at: '2024-04-06T10:00:00Z', notes: 'Low risk.', factors: [] },
  { id: 'ASS-009', beneficiary_id: 9, beneficiary_name: 'Sneha Joshi', total_score: 12, max_score: 100, vulnerability_level: 'LOW', verified_info_percentage: 100, assessed_by: 'Sunrise Public School', assessed_at: '2024-04-11T10:00:00Z', notes: 'Not vulnerable.', factors: [] },
  { id: 'ASS-010', beneficiary_id: 10, beneficiary_name: 'Vikram Thakur', total_score: 80, max_score: 100, vulnerability_level: 'HIGH', verified_info_percentage: 90, assessed_by: 'Sunrise Public School', assessed_at: '2024-04-16T10:00:00Z', notes: 'Very low income.', factors: [] },
  { id: 'ASS-011', beneficiary_id: 11, beneficiary_name: 'Pooja Mishra', total_score: 50, max_score: 100, vulnerability_level: 'MODERATE', verified_info_percentage: 95, assessed_by: 'Hope Foundation', assessed_at: '2024-05-02T10:00:00Z', notes: 'Moderate.', factors: [] },
  { id: 'ASS-012', beneficiary_id: 12, beneficiary_name: 'Amit Verma', total_score: 10, max_score: 100, vulnerability_level: 'LOW', verified_info_percentage: 100, assessed_by: 'Hope Foundation', assessed_at: '2024-05-11T10:00:00Z', notes: 'Low.', factors: [] }
];

export const mockRecommendations = [
  { id: 'REC-1', beneficiary_id: 1, beneficiary_name: 'Aarav Sharma', scheme_id: 1, scheme_name: 'National Scholarship for EWS', assessment_id: 'ASS-001', status: 'ELIGIBLE', match_percentage: 100, matched_criteria: ['Age', 'Income', 'Education'], unmatched_criteria: [], missing_info: [], created_at: '2024-03-02T10:30:00Z' },
  { id: 'REC-2', beneficiary_id: 2, beneficiary_name: 'Priya Patel', scheme_id: 4, scheme_name: 'Girl Child Education Support', assessment_id: 'ASS-002', status: 'ELIGIBLE', match_percentage: 100, matched_criteria: ['Gender', 'Income'], unmatched_criteria: [], missing_info: [], created_at: '2024-03-06T10:30:00Z' }
];

export const mockDocuments = [
  { id: 1, beneficiary_id: 1, document_type: 'INCOME_CERTIFICATE', file_name: 'income_proof.pdf', upload_date: '2024-03-01T11:00:00Z', verification_status: 'VERIFIED', uploaded_by: 'Admin User' },
  { id: 2, beneficiary_id: 1, document_type: 'RATION_CARD', file_name: 'ration.jpg', upload_date: '2024-03-01T11:05:00Z', verification_status: 'VERIFIED', uploaded_by: 'Admin User' }
];

export const mockApplications = [
  { id: 'APP-1', beneficiary_id: 1, scheme_id: 1, status: 'APPROVED', applied_on: '2024-03-05T10:00:00Z', last_updated: '2024-03-10T10:00:00Z', status_history: [{ status: 'SUBMITTED', date: '2024-03-05T10:00:00Z' }, { status: 'APPROVED', date: '2024-03-10T10:00:00Z' }] }
];

export const mockAuditLogs = [
  { id: 1, action: 'LOGIN', user_id: 1, user_name: 'Admin User', details: 'Successful login', timestamp: '2024-03-01T09:00:00Z', ip_address: '192.168.1.1' },
  { id: 2, action: 'BENEFICIARY_CREATED', user_id: 2, user_name: 'Green Valley School', details: 'Created beneficiary Aarav Sharma', timestamp: '2024-03-01T10:00:00Z', ip_address: '192.168.1.2' }
];

export const mockDashboardStats = {
  school: {
    totalBeneficiaries: 6, pendingVerification: 1, assessed: 6, highVulnerability: 4, moderateVulnerability: 2, lowVulnerability: 0, eligibleSchemes: 12, supportInProgress: 3,
    vulnerabilityDistribution: [{ name: 'High', value: 4, color: '#DC2626' }, { name: 'Moderate', value: 2, color: '#F59E0B' }, { name: 'Low', value: 0, color: '#16A34A' }],
    educationDistribution: [{ level: 'Primary', count: 3 }, { level: 'Upper Primary', count: 2 }, { level: 'Secondary', count: 1 }],
    schemeRecommendations: [{ name: 'National Scholarship', count: 4 }, { name: 'Mid-Day Meal', count: 3 }, { name: 'Free Textbook', count: 2 }, { name: 'Girl Child Support', count: 1 }, { name: 'Skill Development', count: 1 }],
    verificationStatus: [{ status: 'Verified', count: 8 }, { status: 'Pending', count: 3 }, { status: 'Rejected', count: 1 }],
  },
  admin: {
    totalSchools: 2, totalNGOs: 2, totalBeneficiaries: 18, highVulnerability: 7, moderateVulnerability: 4, lowVulnerability: 4, pendingVerification: 3, activeSchemes: 5, totalRecommendations: 35, supportCases: 8, pendingOrganizations: 2,
    vulnerabilityDistribution: [{ name: 'High', value: 7, color: '#DC2626' }, { name: 'Moderate', value: 4, color: '#F59E0B' }, { name: 'Low', value: 4, color: '#16A34A' }, { name: 'Not Assessed', value: 3, color: '#9CA3AF' }],
    educationDistribution: [{ level: 'Primary', count: 6 }, { level: 'Upper Primary', count: 5 }, { level: 'Secondary', count: 4 }, { level: 'Higher Secondary', count: 2 }, { level: 'Dropout', count: 1 }],
    schemeRecommendations: [{ name: 'National Scholarship', count: 10 }, { name: 'Mid-Day Meal', count: 8 }, { name: 'Free Textbook', count: 6 }, { name: 'Girl Child Support', count: 5 }, { name: 'Skill Development', count: 6 }],
    orgWiseStats: [{ name: 'Green Valley School', beneficiaries: 6, assessed: 6 }, { name: 'Sunrise Public School', beneficiaries: 4, assessed: 4 }, { name: 'Hope Foundation', beneficiaries: 4, assessed: 2 }, { name: 'ChildCare Trust', beneficiaries: 4, assessed: 0 }],
  }
};

// Compatibility aliases for all pages
export const BENEFICIARIES = mockBeneficiaries;
export const ASSESSMENTS = mockAssessments;
export const SCHEMES = mockSchemes;
export const SCHEME_RECOMMENDATIONS = mockRecommendations;
export const RULES = mockRules;
export const DOCUMENTS = mockDocuments;
export const APPLICATIONS = mockApplications;
export const AUDIT_LOGS = mockAuditLogs;
export const DASHBOARD_STATS = mockDashboardStats;
export const ORGANIZATIONS = mockOrganizations;
export const USERS = mockUsers;
export const CURRENT_USER = mockUsers[0];
export { INDIAN_STATES } from '../utils/constants';

