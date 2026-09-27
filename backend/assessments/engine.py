from .models import Rule, Assessment, AssessmentFactor
import json

class RuleEngine:
    """Transparent rule-based vulnerability assessment engine.
    Evaluates beneficiary data against configurable rules to determine vulnerability level."""
    
    FACTOR_EXTRACTORS = {
        'MONTHLY_INCOME': '_get_monthly_income',
        'FAMILY_SIZE': '_get_family_size',
        'EARNING_MEMBERS': '_get_earning_members',
        'EMPLOYMENT_STATUS': '_get_employment_status',
        'RATION_CARD_CATEGORY': '_get_ration_card_category',
        'EDUCATION_LEVEL': '_get_education_level',
        'ENROLLMENT_STATUS': '_get_enrollment_status',
        'ATTENDANCE': '_get_attendance',
        'HOUSING_CONDITION': '_get_housing_condition',
        'MEALS_PER_DAY': '_get_meals_per_day',
        'HAS_ELECTRICITY': '_get_has_electricity',
        'HAS_CLEAN_WATER': '_get_has_clean_water',
        'HAS_TOILET': '_get_has_toilet',
        'DISTANCE_TO_SCHOOL': '_get_distance_to_school',
    }

    def evaluate(self, beneficiary, user):
        rules = Rule.objects.filter(is_active=True).order_by('priority')
        total_score = 0
        max_score = sum(r.score for r in rules)
        factors = []
        verified_count = 0
        total_factors = 0
        
        for rule in rules:
            total_factors += 1
            actual_value = self._extract_value(rule.factor, beneficiary)
            
            if actual_value is not None:
                verified_count += 1
                triggered = self._apply_operator(actual_value, rule.operator, rule.threshold_value)
            else:
                triggered = False
            
            score_awarded = rule.score if triggered else 0
            total_score += score_awarded
            explanation = self._generate_explanation(rule, actual_value, triggered)
            
            factors.append({
                'rule': rule,
                'triggered': triggered,
                'score_awarded': score_awarded,
                'actual_value': actual_value,
                'threshold_value': rule.threshold_value,
                'explanation': explanation,
            })
        
        verified_pct = round((verified_count / total_factors * 100) if total_factors > 0 else 0, 1)
        ratio = total_score / max_score if max_score > 0 else 0
        
        if ratio >= 0.60:
            vulnerability_level = 'HIGH'
        elif ratio >= 0.35:
            vulnerability_level = 'MODERATE'
        else:
            vulnerability_level = 'LOW'
        
        assessment = Assessment.objects.create(
            beneficiary=beneficiary,
            assessed_by=user,
            total_score=total_score,
            max_score=max_score,
            vulnerability_level=vulnerability_level,
            verified_info_percentage=verified_pct,
            notes=f"Assessment based on {verified_count}/{total_factors} verified data points."
        )
        
        for f in factors:
            AssessmentFactor.objects.create(
                assessment=assessment,
                rule=f['rule'],
                triggered=f['triggered'],
                score_awarded=f['score_awarded'],
                actual_value=f['actual_value'],
                threshold_value=f['threshold_value'],
                explanation=f['explanation'],
            )
        
        beneficiary.status = 'ASSESSED'
        beneficiary.save()
        
        return assessment
    
    def _extract_value(self, factor, beneficiary):
        extractor_name = self.FACTOR_EXTRACTORS.get(factor)
        if not extractor_name:
            return None
        extractor = getattr(self, extractor_name, None)
        if not extractor:
            return None
        try:
            return extractor(beneficiary)
        except Exception:
            return None
    
    def _get_monthly_income(self, b):
        return float(b.family.monthly_income) if b.family else None
    
    def _get_family_size(self, b):
        return b.family.family_size if b.family else None
    
    def _get_earning_members(self, b):
        return b.family.num_earning_members if b.family else None
    
    def _get_employment_status(self, b):
        if not b.family:
            return None
        parents = b.family.parents.all()
        if not parents.exists():
            return None
        statuses = [p.employment_status for p in parents]
        priority = ['UNEMPLOYED', 'DISABLED', 'DAILY_WAGE', 'RETIRED', 'SELF_EMPLOYED', 'EMPLOYED_PRIVATE', 'EMPLOYED_GOVT']
        for p in priority:
            if p in statuses:
                return p
        return statuses[0] if statuses else None
    
    def _get_ration_card_category(self, b):
        try:
            ration = b.family.rationcard
            if ration and ration.has_ration_card:
                return ration.category
        except Exception:
            pass
        return 'NONE'
    
    def _get_education_level(self, b):
        try:
            return b.education.education_level
        except Exception:
            return None
    
    def _get_enrollment_status(self, b):
        try:
            return b.education.enrollment_status
        except Exception:
            return None
    
    def _get_attendance(self, b):
        try:
            return b.education.attendance_percentage
        except Exception:
            return None
    
    def _get_housing_condition(self, b):
        return b.family.housing_condition if b.family else None
    
    def _get_meals_per_day(self, b):
        try:
            return b.socioeconomic.meals_per_day
        except Exception:
            return None
    
    def _get_has_electricity(self, b):
        try:
            return b.socioeconomic.has_electricity
        except Exception:
            return None
    
    def _get_has_clean_water(self, b):
        try:
            return b.socioeconomic.has_clean_water
        except Exception:
            return None
    
    def _get_has_toilet(self, b):
        try:
            return b.socioeconomic.has_toilet
        except Exception:
            return None
    
    def _get_distance_to_school(self, b):
        try:
            return b.socioeconomic.distance_to_school_km
        except Exception:
            return None
    
    def _apply_operator(self, actual, operator, threshold):
        try:
            threshold_val = threshold
            if isinstance(threshold, str):
                try:
                    threshold_val = json.loads(threshold)
                except (json.JSONDecodeError, TypeError):
                    threshold_val = threshold
            
            if operator == 'LT':
                return float(actual) < float(threshold_val)
            elif operator == 'LTE':
                return float(actual) <= float(threshold_val)
            elif operator == 'GT':
                return float(actual) > float(threshold_val)
            elif operator == 'GTE':
                return float(actual) >= float(threshold_val)
            elif operator == 'EQ':
                try:
                    return float(actual) == float(threshold_val)
                except ValueError:
                    return str(actual).strip() == str(threshold_val).strip()
            elif operator == 'NEQ':
                try:
                    return float(actual) != float(threshold_val)
                except ValueError:
                    return str(actual).strip() != str(threshold_val).strip()
            elif operator == 'IN':
                if isinstance(threshold_val, list):
                    return str(actual) in [str(v) for v in threshold_val]
                return str(actual) in [x.strip() for x in str(threshold_val).split(',')]
            elif operator == 'NOT_IN':
                if isinstance(threshold_val, list):
                    return str(actual) not in [str(v) for v in threshold_val]
                return str(actual) not in [x.strip() for x in str(threshold_val).split(',')]
            elif operator == 'BETWEEN':
                if isinstance(threshold_val, list) and len(threshold_val) == 2:
                    return float(threshold_val[0]) <= float(actual) <= float(threshold_val[1])
            elif operator == 'BOOL_FALSE':
                return not bool(actual)
            elif operator == 'BOOL_TRUE':
                return bool(actual)
        except (ValueError, TypeError):
            pass
        return False
    
    def _generate_explanation(self, rule, actual_value, triggered):
        if actual_value is None:
            return f"{rule.name}: Data not available for assessment."
        if triggered:
            return f"{rule.name}: Condition met ({rule.description}). Current value: {actual_value}, Threshold: {rule.threshold_value}"
        else:
            return f"{rule.name}: Threshold not crossed. Current value: {actual_value}, Required: {rule.operator} {rule.threshold_value}"

