from django.urls import path
from .views import (ProfileView, RegisterView, LoginView, ProfileView, DashboardView, 
                    UserListView, EmployeeListView, EmployeeDetailview, AdminUserDetailsView,
                    AdminPasswordChangeView,ChangeOwnpasswordView, LogoutView, ForgetPasswordView,
                    ResetPasswordView, CreateEmployeeView, DepartmentView, DesignationView,
                    AttendanceView, AttendanceDetailView)

urlpatterns = [
    path('register/',RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('users/', UserListView.as_view()),
    path('employees/', EmployeeListView.as_view()),
    path('employees/<int:pk>/', EmployeeDetailview.as_view()),
    path('admin/users/<int:pk>/', AdminUserDetailsView.as_view()),
    path('admin/users/<int:pk>/password/', AdminPasswordChangeView.as_view()),
    path('change-password/', ChangeOwnpasswordView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('forgot-password/',ForgetPasswordView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
    path('employees/create/', CreateEmployeeView.as_view()),
    path('departments/', DepartmentView.as_view()),
    path('designations/', DesignationView.as_view()),
    path('attendance/', AttendanceView.as_view()),
    path('attendance/<int:pk>/', AttendanceDetailView.as_view()),
]
