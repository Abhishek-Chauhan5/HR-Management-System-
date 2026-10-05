from rest_framework.permissions import BasePermission   

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and request.user.profile.role == 'admin')
    
class IsHR(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and request.user.profile.role == 'hr')
  
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and request.user.profile.role == 'employee')    
 
class IsAdminOrHR(BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and request.user.profile.role in ['hr', 'admin'])   