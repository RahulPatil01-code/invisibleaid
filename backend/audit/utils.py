from .models import AuditLog
def log_action(user, action, entity_type, entity_id, details=None, ip_address=None):
    AuditLog.objects.create(user=user, action=action, entity_type=entity_type, entity_id=entity_id, details=details, ip_address=ip_address)
