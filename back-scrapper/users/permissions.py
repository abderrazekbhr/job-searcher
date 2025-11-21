#define permissions of is_staff

from rest_framework.permissions import BasePermission

class IsStaffPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff