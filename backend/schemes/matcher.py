from .models import GovernmentScheme, SchemeRecommendation

EDUCATION_LEVEL_ORDER = [
    'NEVER_ENROLLED', 'DROPOUT', 'PRIMARY', 'UPPER_PRIMARY',
    'SECONDARY', 'HIGHER_SECONDARY', 'GRADUATE'
]

class SchemeMatcher:
    """Evaluates beneficiary against active government schemes.
    Checks age, income, education level, ration card, and gender criteria."""

    def match(self, beneficiary, assessment=None):
        schemes = GovernmentScheme.objects.filter(is_active=True)
        recommendations = []

        # Delete existing recommendations for this beneficiary/assessment combo to prevent duplicates
        if assessment:
            SchemeRecommendation.objects.filter(beneficiary=beneficiary, assessment=assessment).delete()

        for scheme in schemes:
            rec_data = self._evaluate_scheme(beneficiary, scheme)
            rec = SchemeRecommendation.objects.create(
                beneficiary=beneficiary,
                scheme=scheme,
                assessment=assessment,
                status=rec_data['status'],
                match_percentage=rec_data['match_percentage'],
                matched_criteria=rec_data['matched_criteria'],
                unmatched_criteria=rec_data['unmatched_criteria'],
                missing_info=rec_data['missing_info']
            )
            recommendations.append(rec)

        return recommendations

    def _evaluate_scheme(self, b, s):
        matched = []
        unmatched = []
        missing = []
        hard_fail = False

        # 1. Age criteria
        if s.min_age is not None or s.max_age is not None:
            min_a = s.min_age or 0
            max_a = s.max_age or 99
            if b.age is not None:
                if min_a <= b.age <= max_a:
                    matched.append(f"Age {b.age} is within required {min_a}-{max_a} years.")
                else:
                    unmatched.append(f"Age {b.age} outside required range {min_a}-{max_a}.")
            else:
                missing.append("Date of birth / age not verified.")

        # 2. Income limit
        if s.income_limit is not None:
            income = float(b.family.monthly_income) if b.family else None
            limit = float(s.income_limit)
            if income is not None:
                if income <= limit:
                    matched.append(f"Monthly household income ₹{income:,.0f} is within limit of ₹{limit:,.0f}.")
                else:
                    unmatched.append(f"Monthly household income ₹{income:,.0f} exceeds limit of ₹{limit:,.0f}.")
                    hard_fail = True
            else:
                missing.append("Monthly family income information missing.")

        # 3. Gender requirement
        if s.gender_requirement and s.gender_requirement != 'ANY':
            if b.gender:
                if b.gender.upper() == s.gender_requirement.upper():
                    matched.append(f"Gender requirement met ({b.gender}).")
                else:
                    unmatched.append(f"Scheme requires {s.gender_requirement}, but candidate is {b.gender}.")
                    hard_fail = True
            else:
                missing.append("Gender information not provided.")

        # 4. Education level
        if s.education_level_min:
            try:
                current_level = b.education.education_level
                min_idx = EDUCATION_LEVEL_ORDER.index(s.education_level_min) if s.education_level_min in EDUCATION_LEVEL_ORDER else 0
                max_idx = EDUCATION_LEVEL_ORDER.index(s.education_level_max) if s.education_level_max in EDUCATION_LEVEL_ORDER else len(EDUCATION_LEVEL_ORDER) - 1
                curr_idx = EDUCATION_LEVEL_ORDER.index(current_level) if current_level in EDUCATION_LEVEL_ORDER else -1

                if curr_idx >= 0:
                    if min_idx <= curr_idx <= max_idx:
                        matched.append(f"Education stage {current_level} is eligible.")
                    else:
                        unmatched.append(f"Education stage {current_level} is outside target range.")
                else:
                    matched.append(f"Enrolled in {b.education.grade or 'School'}.")
            except Exception:
                missing.append("Education details not verified.")

        # 5. Ration card
        if s.ration_card_required:
            try:
                rc = b.family.rationcard
                if rc and rc.has_ration_card:
                    accepted = s.accepted_ration_categories or []
                    if not accepted or rc.category in accepted:
                        matched.append(f"Has accepted {rc.category} ration card.")
                    else:
                        unmatched.append(f"Ration card category {rc.category} not accepted for this scheme.")
                else:
                    unmatched.append("Requires valid BPL/AAY/PHH ration card.")
            except Exception:
                unmatched.append("Ration card required but no record found.")

        total = len(matched) + len(unmatched) + len(missing)
        match_pct = round((len(matched) / total * 100) if total > 0 else 100.0, 1)

        if hard_fail:
            status = 'NOT_ELIGIBLE'
        elif not unmatched and not missing:
            status = 'ELIGIBLE'
        elif not unmatched and missing:
            status = 'POTENTIALLY_ELIGIBLE'
        elif match_pct >= 60.0:
            status = 'POTENTIALLY_ELIGIBLE'
        else:
            status = 'NOT_ELIGIBLE'

        return {
            'status': status,
            'match_percentage': match_pct,
            'matched_criteria': matched,
            'unmatched_criteria': unmatched,
            'missing_info': missing
        }

