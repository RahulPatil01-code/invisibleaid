from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsSchool(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SCHOOL'

class IsNGO(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'NGO'

class IsSchoolOrNGO(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['SCHOOL', 'NGO']

class IsApprovedOrganization(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.organization and request.user.organization.status == 'APPROVED'


class IsAdminOrApprovedOrganization(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role == 'ADMIN' or (
            request.user.role in ['SCHOOL', 'NGO']
            and request.user.organization
            and request.user.organization.status == 'APPROVED'
        )
