from django.core.management.base import BaseCommand
from authentication.models import User
from organizations.models import Organization
from schemes.models import GovernmentScheme, SchemeRecommendation, SupportApplication
from assessments.models import RuleCategory, Rule, Assessment, AssessmentFactor
from beneficiaries.models import Family, ParentGuardian, RationCard, Beneficiary, EducationDetails, SocioEconomicDetails
from assessments.engine import RuleEngine
from schemes.matcher import SchemeMatcher
import datetime
from decimal import Decimal

class Command(BaseCommand):
    help = 'Comprehensive seeder for InvisibleAid research platform demo'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting comprehensive database seeding...")

        # 1. ORGANIZATIONS
        orgs_data = [
            {'name': 'Green Valley School', 'org_type': 'SCHOOL', 'status': 'APPROVED', 'email': 'greenvalley@school.edu', 'phone': '9876543210', 'city': 'Jaipur', 'state': 'Rajasthan', 'address': '42 Education Lane', 'registration_number': 'SCH-RJ-2020-1234', 'contact_person': 'Rajesh Sharma'},
            {'name': 'Sunrise Public School', 'org_type': 'SCHOOL', 'status': 'APPROVED', 'email': 'sunrisepublic@school.edu', 'phone': '9876543211', 'city': 'Lucknow', 'state': 'Uttar Pradesh', 'address': '78 Knowledge Park', 'registration_number': 'SCH-UP-2021-5678', 'contact_person': 'Sunita Verma'},
            {'name': 'Hope Foundation', 'org_type': 'NGO', 'status': 'APPROVED', 'email': 'hopefoundation@ngo.org', 'phone': '9876543212', 'city': 'Mumbai', 'state': 'Maharashtra', 'address': '15 Social Welfare Road', 'registration_number': 'NGO-MH-2019-9012', 'contact_person': 'Priya Desai'},
            {'name': 'ChildCare Trust', 'org_type': 'NGO', 'status': 'APPROVED', 'email': 'childcaretrust@ngo.org', 'phone': '9876543213', 'city': 'Delhi', 'state': 'Delhi', 'address': '33 Welfare Street', 'registration_number': 'NGO-DL-2020-3456', 'contact_person': 'Amit Singh'},
            {'name': 'Bright Future Academy', 'org_type': 'SCHOOL', 'status': 'PENDING', 'email': 'brightfuture@school.edu', 'phone': '9876543214', 'city': 'Pune', 'state': 'Maharashtra', 'address': '55 Academy Road', 'registration_number': 'SCH-MH-2024-7890', 'contact_person': 'Meena Kulkarni'},
            {'name': 'Rural Uplift NGO', 'org_type': 'NGO', 'status': 'PENDING', 'email': 'ruraluplift@ngo.org', 'phone': '9876543215', 'city': 'Bhopal', 'state': 'Madhya Pradesh', 'address': '12 Village Development Center', 'registration_number': 'NGO-MP-2024-1111', 'contact_person': 'Ramesh Tiwari'},
        ]
        org_map = {}
        for od in orgs_data:
            org, _ = Organization.objects.update_or_create(
                name=od['name'],
                defaults={
                    'org_type': od['org_type'],
                    'status': od['status'],
                    'address': od['address'],
                    'city': od['city'],
                    'state': od['state'],
                    'phone': od['phone'],
                    'email': od['email'],
                    'registration_number': od['registration_number'],
                    'contact_person': od['contact_person']
                }
            )
            org_map[od['name']] = org
        self.stdout.write("Created 6 organizations.")

        # 2. USERS (with exact viva demo credentials)
        users_data = [
            {'email': 'admin@invisibleaid.org', 'name': 'Admin User', 'password': 'Admin@123', 'role': 'ADMIN', 'org': None, 'is_superuser': True, 'is_staff': True},
            {'email': 'greenvalley@school.edu', 'name': 'Green Valley School Admin', 'password': 'School@123', 'role': 'SCHOOL', 'org': org_map['Green Valley School']},
            {'email': 'sunrisepublic@school.edu', 'name': 'Sunrise Public School Admin', 'password': 'School@123', 'role': 'SCHOOL', 'org': org_map['Sunrise Public School']},
            {'email': 'hopefoundation@ngo.org', 'name': 'Hope Foundation Coordinator', 'password': 'Ngo@123', 'role': 'NGO', 'org': org_map['Hope Foundation']},
            {'email': 'childcaretrust@ngo.org', 'name': 'ChildCare Trust Field Worker', 'password': 'Ngo@123', 'role': 'NGO', 'org': org_map['ChildCare Trust']},
        ]
        user_map = {}
        for ud in users_data:
            user = User.objects.filter(email=ud['email']).first()
            if not user:
                user = User(
                    email=ud['email'],
                    username=ud['email'],
                    first_name=ud['name'],
                    role=ud['role'],
                    organization=ud['org'],
                    is_superuser=ud.get('is_superuser', False),
                    is_staff=ud.get('is_staff', False)
                )
                user.set_password(ud['password'])
                user.save()
            else:
                user.first_name = ud['name']
                user.role = ud['role']
                user.organization = ud['org']
                user.set_password(ud['password'])
                user.save()
            user_map[ud['role']] = user
        self.stdout.write("Created / updated 5 demo user accounts.")

        admin_user = User.objects.get(email='admin@invisibleaid.org')

        # 3. RULE CATEGORIES & 15 RULES
        cats_data = [
            ('Income', 1, 'Household income and wage earner stability'),
            ('Employment', 2, 'Guardian occupation and employment security'),
            ('Family', 3, 'Family size and dependency ratio'),
            ('Ration Card', 4, 'Targeted Public Distribution System categorization'),
            ('Education', 5, 'Enrollment continuity and attendance factors'),
            ('Housing', 6, 'Shelter durability and living vulnerability'),
            ('Nutrition', 7, 'Food security and daily meal adequacy'),
            ('Infrastructure', 8, 'Basic utility access (electricity, water, sanitation)'),
        ]
        cat_map = {}
        for cname, corder, cdesc in cats_data:
            cat, _ = RuleCategory.objects.update_or_create(
                name=cname,
                defaults={'order': corder, 'description': cdesc}
            )
            cat_map[cname] = cat

        rules_data = [
            {'cat': 'Income', 'name': 'Very Low Income', 'desc': 'Monthly household income below ₹5,000', 'factor': 'MONTHLY_INCOME', 'op': 'LT', 'thresh': 5000, 'score': 25, 'prio': 1},
            {'cat': 'Income', 'name': 'Low Income', 'desc': 'Monthly household income below ₹10,000', 'factor': 'MONTHLY_INCOME', 'op': 'LT', 'thresh': 10000, 'score': 15, 'prio': 2},
            {'cat': 'Employment', 'name': 'No Earning Member', 'desc': 'Zero earning members in the family', 'factor': 'EARNING_MEMBERS', 'op': 'EQ', 'thresh': 0, 'score': 20, 'prio': 3},
            {'cat': 'Employment', 'name': 'Single Earning Member', 'desc': 'Only one earning member in family', 'factor': 'EARNING_MEMBERS', 'op': 'LTE', 'thresh': 1, 'score': 10, 'prio': 4},
            {'cat': 'Employment', 'name': 'Unemployed Parent', 'desc': 'Primary guardian is unemployed or disabled', 'factor': 'EMPLOYMENT_STATUS', 'op': 'IN', 'thresh': 'UNEMPLOYED,DISABLED', 'score': 15, 'prio': 5},
            {'cat': 'Employment', 'name': 'Daily Wage Worker', 'desc': 'Primary guardian is a daily wage laborer', 'factor': 'EMPLOYMENT_STATUS', 'op': 'EQ', 'thresh': 'DAILY_WAGE', 'score': 10, 'prio': 6},
            {'cat': 'Family', 'name': 'Large Family Size', 'desc': 'Household has 6 or more members', 'factor': 'FAMILY_SIZE', 'op': 'GTE', 'thresh': 6, 'score': 10, 'prio': 7},
            {'cat': 'Ration Card', 'name': 'BPL/AAY Ration Card', 'desc': 'Family holds BPL, AAY, or Antyodaya ration card', 'factor': 'RATION_CARD_CATEGORY', 'op': 'IN', 'thresh': 'AAY,BPL,ANTYODAYA', 'score': 15, 'prio': 8},
            {'cat': 'Ration Card', 'name': 'No Ration Card', 'desc': 'Family has no ration card issued', 'factor': 'RATION_CARD_CATEGORY', 'op': 'EQ', 'thresh': 'NONE', 'score': 5, 'prio': 9},
            {'cat': 'Education', 'name': 'School Dropout', 'desc': 'Child has dropped out of school', 'factor': 'ENROLLMENT_STATUS', 'op': 'EQ', 'thresh': 'DROPPED_OUT', 'score': 20, 'prio': 10},
            {'cat': 'Education', 'name': 'Poor Attendance', 'desc': 'School attendance is below 60%', 'factor': 'ATTENDANCE', 'op': 'LT', 'thresh': 60, 'score': 10, 'prio': 11},
            {'cat': 'Housing', 'name': 'Kutcha/Homeless Housing', 'desc': 'Family lives in kutcha dwelling or is homeless', 'factor': 'HOUSING_CONDITION', 'op': 'IN', 'thresh': 'KUTCHA,HOMELESS', 'score': 15, 'prio': 12},
            {'cat': 'Nutrition', 'name': 'Insufficient Meals', 'desc': 'Child receives less than 3 meals per day', 'factor': 'MEALS_PER_DAY', 'op': 'LT', 'thresh': 3, 'score': 10, 'prio': 13},
            {'cat': 'Infrastructure', 'name': 'No Electricity', 'desc': 'Household lacks electricity supply', 'factor': 'HAS_ELECTRICITY', 'op': 'EQ', 'thresh': False, 'score': 5, 'prio': 14},
            {'cat': 'Infrastructure', 'name': 'No Clean Water', 'desc': 'No direct access to clean drinking water', 'factor': 'HAS_CLEAN_WATER', 'op': 'EQ', 'thresh': False, 'score': 5, 'prio': 15},
        ]
        for rd in rules_data:
            Rule.objects.update_or_create(
                name=rd['name'],
                defaults={
                    'category': cat_map[rd['cat']],
                    'description': rd['desc'],
                    'factor': rd['factor'],
                    'operator': rd['op'],
                    'threshold_value': rd['thresh'],
                    'score': rd['score'],
                    'priority': rd['prio'],
                    'is_active': True,
                    'created_by': admin_user
                }
            )
        self.stdout.write("Created 15 vulnerability evaluation rules.")

        # 4. GOVERNMENT SCHEMES
        schemes_data = [
            {
                'name': 'National Scholarship for Economically Weaker Sections',
                'department': 'Ministry of Education',
                'description': 'Centrally funded scholarship program providing financial support to vulnerable school students from primary through higher secondary stages.',
                'scheme_type': 'SCHOLARSHIP',
                'education_level_min': 'PRIMARY',
                'education_level_max': 'HIGHER_SECONDARY',
                'min_age': 6,
                'max_age': 18,
                'income_limit': Decimal('15000.00'),
                'ration_card_required': False,
                'accepted_ration_categories': [],
                'gender_requirement': 'ANY',
                'benefits': '₹1,000 per month direct benefit transfer (DBT) towards tuition, books, and study materials.',
                'required_documents': ['Income Certificate', 'Aadhaar Card', 'Bonafide Certificate', 'Bank Passbook'],
                'application_method': 'Online application through the National Scholarship Portal (NSP) with school nodal verification.',
                'official_source': 'National Scholarship Portal Notification',
                'is_active': True,
                'is_demo_data': True
            },
            {
                'name': 'Mid-Day Meal Educational Support & Nutrition Scheme',
                'department': 'Ministry of Education & State Welfare',
                'description': 'Nutritional and supplementary educational materials support ensuring daily meals and attendance retention for underprivileged school students.',
                'scheme_type': 'NUTRITION',
                'education_level_min': 'PRIMARY',
                'education_level_max': 'UPPER_PRIMARY',
                'min_age': 6,
                'max_age': 14,
                'income_limit': Decimal('20000.00'),
                'ration_card_required': False,
                'accepted_ration_categories': [],
                'gender_requirement': 'ANY',
                'benefits': 'Free wholesome daily mid-day meal plus quarterly dry ration kits for qualifying families.',
                'required_documents': ['School ID Card', 'Ration Card (if available)', 'Parent Undertaking'],
                'application_method': 'Enrolled automatically at all government and government-aided recognized schools.',
                'official_source': 'PM POSHAN Scheme Guidelines',
                'is_active': True,
                'is_demo_data': True
            },
            {
                'name': 'Free Textbook & Uniform Distribution Scheme',
                'department': 'Department of School Education',
                'description': 'State educational assistance ensuring no child is excluded from classroom learning due to lack of standard uniforms or textbooks.',
                'scheme_type': 'MATERIAL_SUPPORT',
                'education_level_min': 'PRIMARY',
                'education_level_max': 'SECONDARY',
                'min_age': 6,
                'max_age': 16,
                'income_limit': Decimal('12000.00'),
                'ration_card_required': True,
                'accepted_ration_categories': ['AAY', 'BPL', 'PHH'],
                'gender_requirement': 'ANY',
                'benefits': 'Complete curriculum textbooks and two sets of standardized school uniforms per academic year.',
                'required_documents': ['Ration Card Copy (BPL/AAY/PHH)', 'School Enrollment Certificate'],
                'application_method': 'Administered through the school headmaster at beginning of academic session.',
                'official_source': 'State Education Directorate Circular',
                'is_active': True,
                'is_demo_data': True
            },
            {
                'name': 'Kasturba & Beti Padhao Girl Child Education Grant',
                'department': 'Ministry of Women & Child Development',
                'description': 'Special financial incentive and scholarship grant designed to encourage female literacy and prevent dropouts among adolescent girls.',
                'scheme_type': 'SCHOLARSHIP',
                'education_level_min': 'PRIMARY',
                'education_level_max': 'HIGHER_SECONDARY',
                'min_age': 6,
                'max_age': 18,
                'income_limit': Decimal('25000.00'),
                'ration_card_required': False,
                'accepted_ration_categories': [],
                'gender_requirement': 'FEMALE',
                'benefits': '₹1,200 per month stipend and a free bicycle for girls entering secondary schooling (Grade 9+).',
                'required_documents': ['Birth Certificate', 'Income Proof', 'School Bonafide', 'Bank Account in Girl Child Name'],
                'application_method': 'Online state portal application verified by local Block Education Officer (BEO).',
                'official_source': 'National Policy for Women Empowerment',
                'is_active': True,
                'is_demo_data': True
            },
            {
                'name': 'Skill & Vocational Training for Adolescent Youth',
                'department': 'Ministry of Skill Development & Entrepreneurship',
                'description': 'After-school vocational education and skill training stipend for secondary school students and youth from low-income families.',
                'scheme_type': 'SKILL_DEVELOPMENT',
                'education_level_min': 'UPPER_PRIMARY',
                'education_level_max': 'HIGHER_SECONDARY',
                'min_age': 14,
                'max_age': 18,
                'income_limit': Decimal('20000.00'),
                'ration_card_required': False,
                'accepted_ration_categories': [],
                'gender_requirement': 'ANY',
                'benefits': 'Free 3-month certified IT/craft vocational course with ₹1,500 monthly travel and tool stipend.',
                'required_documents': ['Age Proof', 'Marksheet', 'Income Affidavit'],
                'application_method': 'Direct registration at designated Government Industrial Training Institutes (ITI).',
                'official_source': 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
                'is_active': True,
                'is_demo_data': True
            },
        ]
        scheme_map = {}
        for sd in schemes_data:
            scheme, _ = GovernmentScheme.objects.update_or_create(
                name=sd['name'],
                defaults=sd
            )
            scheme_map[sd['name']] = scheme
        self.stdout.write("Created 5 active government welfare schemes.")

        # 5. BENEFICIARIES (18 realistic records matching mockData)
        beneficiaries_specs = [
            {'id': 'BEN-2024-001', 'name': 'Aarav Sharma', 'dob': '2016-05-12', 'age': 8, 'gender': 'MALE', 'income': 3500, 'housing': 'KUTCHA', 'ration': 'BPL', 'size': 7, 'earners': 1, 'p_name': 'Ram Sharma', 'p_rel': 'Father', 'p_occ': 'Daily Laborer', 'p_stat': 'DAILY_WAGE', 'p_inc': 3500, 'org': org_map['Green Valley School'], 'grade': '3rd', 'stage': 'PRIMARY', 'att': 65, 'enr': 'ENROLLED', 'meals': 2, 'elec': False, 'water': False, 'toilet': False, 'city': 'Jaipur', 'state': 'Rajasthan'},
            {'id': 'BEN-2024-002', 'name': 'Priya Patel', 'dob': '2010-02-15', 'age': 14, 'gender': 'FEMALE', 'income': 5000, 'housing': 'KUTCHA', 'ration': 'AAY', 'size': 6, 'earners': 0, 'p_name': 'Sita Patel', 'p_rel': 'Mother', 'p_occ': 'None', 'p_stat': 'UNEMPLOYED', 'p_inc': 0, 'org': org_map['Green Valley School'], 'grade': '9th', 'stage': 'SECONDARY', 'att': 40, 'enr': 'DROPPED_OUT', 'meals': 2, 'elec': True, 'water': False, 'toilet': True, 'city': 'Jaipur', 'state': 'Rajasthan'},
            {'id': 'BEN-2024-003', 'name': 'Rahul Kumar', 'dob': '2012-08-20', 'age': 12, 'gender': 'MALE', 'income': 8500, 'housing': 'SEMI_PUCCA', 'ration': 'PHH', 'size': 5, 'earners': 1, 'p_name': 'Ashok Kumar', 'p_rel': 'Father', 'p_occ': 'Painter', 'p_stat': 'DAILY_WAGE', 'p_inc': 8500, 'org': org_map['Green Valley School'], 'grade': '7th', 'stage': 'UPPER_PRIMARY', 'att': 75, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Jaipur', 'state': 'Rajasthan'},
            {'id': 'BEN-2024-004', 'name': 'Meera Devi', 'dob': '2014-11-05', 'age': 10, 'gender': 'FEMALE', 'income': 7000, 'housing': 'HOMELESS', 'ration': 'NONE', 'size': 4, 'earners': 0, 'p_name': 'Kamla Devi', 'p_rel': 'Mother', 'p_occ': 'Domestic Helper', 'p_stat': 'UNEMPLOYED', 'p_inc': 0, 'org': org_map['Green Valley School'], 'grade': '5th', 'stage': 'PRIMARY', 'att': 50, 'enr': 'ENROLLED', 'meals': 2, 'elec': False, 'water': False, 'toilet': False, 'city': 'Jaipur', 'state': 'Rajasthan'},
            {'id': 'BEN-2024-005', 'name': 'Ananya Singh', 'dob': '2009-04-18', 'age': 15, 'gender': 'FEMALE', 'income': 12000, 'housing': 'SEMI_PUCCA', 'ration': 'BPL', 'size': 5, 'earners': 1, 'p_name': 'Vikram Singh', 'p_rel': 'Father', 'p_occ': 'Vendor', 'p_stat': 'SELF_EMPLOYED', 'p_inc': 12000, 'org': org_map['Green Valley School'], 'grade': '10th', 'stage': 'SECONDARY', 'att': 95, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Jaipur', 'state': 'Rajasthan'},
            {'id': 'BEN-2024-006', 'name': 'Arjun Yadav', 'dob': '2013-09-25', 'age': 11, 'gender': 'MALE', 'income': 15000, 'housing': 'SEMI_PUCCA', 'ration': 'PHH', 'size': 4, 'earners': 1, 'p_name': 'Suresh Yadav', 'p_rel': 'Father', 'p_occ': 'Driver', 'p_stat': 'EMPLOYED_PRIVATE', 'p_inc': 15000, 'org': org_map['Green Valley School'], 'grade': '6th', 'stage': 'UPPER_PRIMARY', 'att': 85, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Jaipur', 'state': 'Rajasthan'},
            {'id': 'BEN-2024-007', 'name': 'Kavya Reddy', 'dob': '2015-06-10', 'age': 9, 'gender': 'FEMALE', 'income': 10000, 'housing': 'KUTCHA', 'ration': 'BPL', 'size': 6, 'earners': 1, 'p_name': 'Narasimha Reddy', 'p_rel': 'Father', 'p_occ': 'Laborer', 'p_stat': 'DAILY_WAGE', 'p_inc': 10000, 'org': org_map['Sunrise Public School'], 'grade': '4th', 'stage': 'PRIMARY', 'att': 70, 'enr': 'ENROLLED', 'meals': 2, 'elec': False, 'water': False, 'toilet': False, 'city': 'Lucknow', 'state': 'Uttar Pradesh'},
            {'id': 'BEN-2024-008', 'name': 'Rohan Gupta', 'dob': '2008-01-30', 'age': 16, 'gender': 'MALE', 'income': 18000, 'housing': 'PUCCA', 'ration': 'APL', 'size': 3, 'earners': 1, 'p_name': 'Rakesh Gupta', 'p_rel': 'Father', 'p_occ': 'Shopkeeper', 'p_stat': 'EMPLOYED_PRIVATE', 'p_inc': 18000, 'org': org_map['Sunrise Public School'], 'grade': '11th', 'stage': 'HIGHER_SECONDARY', 'att': 90, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Lucknow', 'state': 'Uttar Pradesh'},
            {'id': 'BEN-2024-009', 'name': 'Sneha Joshi', 'dob': '2011-07-14', 'age': 13, 'gender': 'FEMALE', 'income': 22000, 'housing': 'PUCCA', 'ration': 'NPHH', 'size': 4, 'earners': 1, 'p_name': 'Gopal Joshi', 'p_rel': 'Father', 'p_occ': 'Clerk', 'p_stat': 'EMPLOYED_GOVT', 'p_inc': 22000, 'org': org_map['Sunrise Public School'], 'grade': '8th', 'stage': 'UPPER_PRIMARY', 'att': 92, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Lucknow', 'state': 'Uttar Pradesh'},
            {'id': 'BEN-2024-010', 'name': 'Vikram Thakur', 'dob': '2017-03-08', 'age': 7, 'gender': 'MALE', 'income': 4000, 'housing': 'KUTCHA', 'ration': 'AAY', 'size': 8, 'earners': 1, 'p_name': 'Brijesh Thakur', 'p_rel': 'Father', 'p_occ': 'Agricultural Labor', 'p_stat': 'DAILY_WAGE', 'p_inc': 4000, 'org': org_map['Sunrise Public School'], 'grade': '2nd', 'stage': 'PRIMARY', 'att': 60, 'enr': 'ENROLLED', 'meals': 2, 'elec': False, 'water': False, 'toilet': False, 'city': 'Lucknow', 'state': 'Uttar Pradesh'},
            {'id': 'BEN-2024-011', 'name': 'Pooja Mishra', 'dob': '2010-10-22', 'age': 14, 'gender': 'FEMALE', 'income': 9000, 'housing': 'SEMI_PUCCA', 'ration': 'BPL', 'size': 5, 'earners': 1, 'p_name': 'Dinesh Mishra', 'p_rel': 'Father', 'p_occ': 'Tailor', 'p_stat': 'SELF_EMPLOYED', 'p_inc': 9000, 'org': org_map['Hope Foundation'], 'grade': '9th', 'stage': 'SECONDARY', 'att': 80, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Mumbai', 'state': 'Maharashtra'},
            {'id': 'BEN-2024-012', 'name': 'Amit Verma', 'dob': '2007-12-05', 'age': 17, 'gender': 'MALE', 'income': 25000, 'housing': 'PUCCA', 'ration': 'APL', 'size': 3, 'earners': 1, 'p_name': 'Sunil Verma', 'p_rel': 'Father', 'p_occ': 'Govt Teacher', 'p_stat': 'EMPLOYED_GOVT', 'p_inc': 25000, 'org': org_map['Hope Foundation'], 'grade': '12th', 'stage': 'HIGHER_SECONDARY', 'att': 96, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Mumbai', 'state': 'Maharashtra'},
            {'id': 'BEN-2024-013', 'name': 'Divya Nair', 'dob': '2013-05-19', 'age': 11, 'gender': 'FEMALE', 'income': 6000, 'housing': 'KUTCHA', 'ration': 'PHH', 'size': 7, 'earners': 1, 'p_name': 'Manoj Nair', 'p_rel': 'Father', 'p_occ': 'Helper', 'p_stat': 'DAILY_WAGE', 'p_inc': 6000, 'org': org_map['Hope Foundation'], 'grade': '6th', 'stage': 'UPPER_PRIMARY', 'att': 72, 'enr': 'ENROLLED', 'meals': 2, 'elec': True, 'water': False, 'toilet': False, 'city': 'Mumbai', 'state': 'Maharashtra'},
            {'id': 'BEN-2024-014', 'name': 'Karan Chauhan', 'dob': '2009-08-11', 'age': 15, 'gender': 'MALE', 'income': 14000, 'housing': 'SEMI_PUCCA', 'ration': 'BPL', 'size': 4, 'earners': 1, 'p_name': 'Ajay Chauhan', 'p_rel': 'Father', 'p_occ': 'Electrician', 'p_stat': 'SELF_EMPLOYED', 'p_inc': 14000, 'org': org_map['Hope Foundation'], 'grade': '10th', 'stage': 'SECONDARY', 'att': 88, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Mumbai', 'state': 'Maharashtra'},
            {'id': 'BEN-2024-015', 'name': 'Neha Agarwal', 'dob': '2016-04-03', 'age': 8, 'gender': 'FEMALE', 'income': 35000, 'housing': 'PUCCA', 'ration': 'APL', 'size': 3, 'earners': 1, 'p_name': 'Pradeep Agarwal', 'p_rel': 'Father', 'p_occ': 'Accountant', 'p_stat': 'EMPLOYED_PRIVATE', 'p_inc': 35000, 'org': org_map['ChildCare Trust'], 'grade': '3rd', 'stage': 'PRIMARY', 'att': 98, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Delhi', 'state': 'Delhi'},
            {'id': 'BEN-2024-016', 'name': 'Suresh Patil', 'dob': '2011-09-17', 'age': 13, 'gender': 'MALE', 'income': 11000, 'housing': 'SEMI_PUCCA', 'ration': 'PHH', 'size': 6, 'earners': 1, 'p_name': 'Pandurang Patil', 'p_rel': 'Father', 'p_occ': 'Mason', 'p_stat': 'DAILY_WAGE', 'p_inc': 11000, 'org': org_map['ChildCare Trust'], 'grade': '8th', 'stage': 'UPPER_PRIMARY', 'att': 76, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Delhi', 'state': 'Delhi'},
            {'id': 'BEN-2024-017', 'name': 'Lakshmi Iyer', 'dob': '2014-02-28', 'age': 10, 'gender': 'FEMALE', 'income': 2000, 'housing': 'HOMELESS', 'ration': 'NONE', 'size': 5, 'earners': 0, 'p_name': 'Meenakshi Iyer', 'p_rel': 'Mother', 'p_occ': 'Ragpicker', 'p_stat': 'UNEMPLOYED', 'p_inc': 0, 'org': org_map['ChildCare Trust'], 'grade': '4th', 'stage': 'PRIMARY', 'att': 45, 'enr': 'ENROLLED', 'meals': 1, 'elec': False, 'water': False, 'toilet': False, 'city': 'Delhi', 'state': 'Delhi'},
            {'id': 'BEN-2024-018', 'name': 'Ravi Deshmukh', 'dob': '2008-11-15', 'age': 16, 'gender': 'MALE', 'income': 45000, 'housing': 'PUCCA', 'ration': 'APL', 'size': 4, 'earners': 2, 'p_name': 'Vasant Deshmukh', 'p_rel': 'Father', 'p_occ': 'Govt Officer', 'p_stat': 'EMPLOYED_GOVT', 'p_inc': 45000, 'org': org_map['ChildCare Trust'], 'grade': '11th', 'stage': 'HIGHER_SECONDARY', 'att': 95, 'enr': 'ENROLLED', 'meals': 3, 'elec': True, 'water': True, 'toilet': True, 'city': 'Delhi', 'state': 'Delhi'},
        ]

        engine = RuleEngine()
        matcher = SchemeMatcher()

        created_bens = []
        for idx, bs in enumerate(beneficiaries_specs):
            # Create Family
            family = Family.objects.create(
                family_size=bs['size'],
                monthly_income=Decimal(str(bs['income'])),
                income_frequency='MONTHLY',
                housing_condition=bs['housing'],
                num_earning_members=bs['earners']
            )

            # Create Parent
            ParentGuardian.objects.create(
                family=family,
                name=bs['p_name'],
                relationship=bs['p_rel'],
                occupation=bs['p_occ'],
                employment_status=bs['p_stat'],
                monthly_income=Decimal(str(bs['p_inc'])),
                is_primary_guardian=True
            )

            # Create Ration Card
            RationCard.objects.create(
                family=family,
                has_ration_card=(bs['ration'] != 'NONE'),
                category=bs['ration'],
                card_number=f"RC-{bs['state'][:2]}-{1000 + idx}" if bs['ration'] != 'NONE' else '',
                verification_status='VERIFIED' if bs['ration'] != 'NONE' else 'PENDING'
            )

            # Create Beneficiary
            ben = Beneficiary.objects.create(
                beneficiary_id=bs['id'],
                organization=bs['org'],
                family=family,
                name=bs['name'],
                date_of_birth=bs['dob'],
                age=bs['age'],
                gender=bs['gender'],
                contact_number=f"98765{idx:05d}",
                address=f"Ward {idx + 1}, Community Center",
                state=bs['state'],
                district=bs['city'],
                city_village=bs['city'],
                status='SUBMITTED',
                created_by=admin_user
            )

            # Create Education Details
            EducationDetails.objects.create(
                beneficiary=ben,
                school_name=bs['org'].name if bs['org'].org_type == 'SCHOOL' else f"{bs['city']} Public School",
                grade=bs['grade'],
                academic_year='2024-25',
                education_level=bs['stage'],
                enrollment_status=bs['enr'],
                academic_performance='GOOD' if bs['att'] >= 75 else 'AVERAGE' if bs['att'] >= 60 else 'POOR',
                attendance_percentage=float(bs['att']),
                educational_difficulties='Financial strain on textbooks and stationery' if bs['income'] < 10000 else '',
                higher_education_interest=True
            )

            # Create SocioEconomic Details
            SocioEconomicDetails.objects.create(
                beneficiary=ben,
                has_electricity=bs['elec'],
                has_clean_water=bs['water'],
                has_toilet=bs['toilet'],
                meals_per_day=bs['meals'],
                has_health_insurance=(bs['income'] > 20000),
                distance_to_school_km=2.0,
                additional_notes='Priority candidate for welfare intervention' if bs['income'] < 10000 else ''
            )

            # Run Assessment for first 12 beneficiaries
            if idx < 12:
                assessment = engine.evaluate(ben, admin_user)
                # Run Scheme Matching
                matcher.match(ben, assessment)

            created_bens.append(ben)

        self.stdout.write(f"Successfully seeded {len(created_bens)} beneficiaries with families, assessments, and recommendations.")
        self.stdout.write(self.style.SUCCESS('InvisibleAid database seeding completed successfully!'))

