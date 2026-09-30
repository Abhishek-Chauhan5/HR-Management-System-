from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (RegisterSerializer, LoginSerializer, DepartmentSerializer,
                          DesignationSerializer, AttendanceSerializer, LeaveSerializer)
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from .permissions import IsAdminOrHR, IsAdmin
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Profile, Department, Designation, Attendance, Leave
from django.contrib.auth.password_validation import validate_password


# Create your views here.

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Registeration Successful"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({"message": "Login successful",
                             "username": user.username,
                             "role": user.profile.role,
                             "access":serializer.validated_data['access'],
                             "refresh":serializer.validated_data['refresh']})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        return Response({
            "username":request.user.username,
            "name":request.user.profile.name,
            "email":request.user.email,
            "role":request.user.profile.role,
        })
    
    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "name": user.profile.name,
            "email": user.email,
            "role": user.profile.role,
        })    
    
    def patch(self, request):
        user = request.user
        
        if 'name' in request.data:
            user.profile.name = request.data['name']
        
        if 'email' in request.data:
            user.email = request.data['email']
        
        user.save()
        user.profile.save()
        
        return Response({"message":"Profile Updated successfully",
                        "username":user.username,
                        "email":user.email,
                        "name":user.profile.name,
                        "role":user.profile.role})        
           
            

class DashboardView(APIView):  
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        
        role = request.user.profile.role
        
        if role == 'admin':
            return Response({
                "message":"Welcome Admin",
                "role":"admin",
                "access":"You can access all the data",
            }) 
        
        elif role == 'hr':
            return Response({
                "message":"Welcome HR",
                "role":"hr",
                "access":"You can access employee and HR data",
            })     
          
        elif role == 'employee':
            return Response({
                "message":"Welcome Employee",
                "role":"employee",
                "access":"You can access your own data",
            })    
        
        return Response({
            "message":"Invalid Role"}, status = status.HTTP_403_FORBIDDEN)    
  
class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        user = request.user
        role = user.profile.role
        
        # Employee can see only thier own data  
        if role == 'employee':
            users = User.objects.filter(id= user.id)        
        
        # HR can see only thier own data and employee data
        elif role == 'hr':
            users = User.objects.filter(profile__role__in = ['hr', 'employee'])
         
        # Admin can see all the data 
        elif role == 'admin':
            users = User.objects.filter(profile__isnull=False)  
        
        else:
            return Response({
                "error":"Invalid Role"},status=status.HTTP_403_FORBIDDEN)      
        
        data = []
        for user in users:
            data.append({
                "id":user.id,
                "username":user.username,
                "name":user.profile.name,
                "email":user.email,
                "role":user.profile.role,
            })   
        return Response(data,status=status.HTTP_200_OK)    
    
class EmployeeListView(APIView):
    permission_classes = [IsAdminOrHR]
    
    def get(self, request):
        employee = User.objects.filter(profile__role='employee')
        data = []   
        for user in employee:
            data.append({
                "id":user.id,
                "username":user.username,
                "name":user.profile.name,
                "email":user.email,
                "role":user.profile.role,
                "department":user.profile.department.name
                    if user.profile.department else None,
                "designation":user.profile.designation.name
                    if user.profile.designation else None,
            })
        return Response(data,status=status.HTTP_200_OK)         
 
class CreateEmployeeView(APIView):
    permission_classes = [IsAdminOrHR]
    
    def post(self, request):
        name = request.data.get('name')
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        department_id = request.data.get('department')
        designation_id = request.data.get('designation')
        
        # check required fields
        if not all([name, username, email, password, department_id, designation_id]):
            return Response({"error":"All fields are required"},status=status.HTTP_400_BAD_REQUEST)
        
        # check email format
        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Enter a valid email address"},status=status.HTTP_400_BAD_REQUEST)

        # check password length
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"error": e.messages},status=status.HTTP_400_BAD_REQUEST)
        
        #check username already exist
        if User.objects.filter(username=username).exists():
            return Response({"error":"Username already exists"},status=status.HTTP_400_BAD_REQUEST)
        
        # check email already exist
        if User.objects.filter(email=email).exists():
            return Response({"error":"Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        # check department
        try:
            department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({"error":"Department not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # check designation
        try:
            designation = Designation.objects.get(id=designation_id)
        except Designation.DoesNotExist:
            return Response({"error":"Designation not found"}, status=status.HTTP_404_NOT_FOUND)
                
        # create User
        user = User.objects.create_user(
            username = username, email = email, password = password
        )
        
        # create profile
        Profile.objects.create(
            user = user, name = name, role = 'employee', department = department, designation = designation
        )    
        
        return Response({
            "message":"Employee created successfully.",
            "id":user.id,
            "name":user.profile.name,
            "username":user.username,
            "email":user.email,
            "role":user.profile.role,
            "designation":user.profile.designation.name,
            "department":user.profile.department.name
        }, status= status.HTTP_201_CREATED)

class EmployeeDetailview(APIView):
    permission_classes = [IsAdminOrHR]
    
    def get(self,request,pk):
        
        try:
            user = User.objects.get(id=pk, profile__role= 'employee')
        except User.DoesNotExist:
            return Response({"error":"Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "id":user.id,
            "username":user.username,
            "name":user.profile.name,
            "email":user.email,
            "role":user.profile.role,
            "department":user.profile.department.name
                if user.profile.department else None,
            "designation":user.profile.designation.name
                if user.profile.designation else None,    
        }) 
    
    def put(self, request, pk):
        
        try:
            user = User.objects.get(id=pk, profile__role= 'employee')
        except User.DoesNotExist:
            return Response({"error":"Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user.email = request.data.get('email', user.email)
        user.profile.name = request.data.get('name', user.profile.name)  
        department_id = request.data.get('department')
        designation_id = request.data.get('designation')
        if department_id:
            try:
                department = Department.objects.get(id=department_id)
                user.profile.department = department
            except Department.DoesNotExist:
                return Response({"error":"Depratment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if designation_id:
            try:
                designation = Designation.objects.get(id=designation_id)
                user.profile.designation = designation
            except Designation.DoesNotExist:
                return Response({"error":"Designation not found"}, status=status.HTTP_404_NOT_FOUND)        
                
        user.save()
        user.profile.save()
        return Response({
            "message":"Employee updated Successfully",
            "id":user.id,
            "username":user.username,
            "name":user.profile.name,
            "email":user.email,
            "role":user.profile.role,
            "designation":user.profile.designation.name
                if user.profile.designation else None,
            "department": user.profile.designation.name
                if user.profile.designation else None,    
        }) 
        
    def delete(self, request, pk):
        
        try:
            user = User.objects.get(id=pk, profile__role= 'employee')
        except User.DoesNotExist:
            return Response({"error":"Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminUserDetailsView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request , pk):
        
        try:
            user = User.objects.get(id=pk, profile__isnull= False )
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status= status.HTTP_404_NOT_FOUND)
        return Response({
            "id":user.id,
            "username":user.username,
            "name":user.profile.name,
            "email":user.email,
            "role":user.profile.role,})
    
    def patch(self, request, pk):
        
        try:
            user = User.objects.get(id=pk, profile__isnull = False)
        except User.DoesNotExist:
            return Response({"error":"User not found"},status=status.HTTP_404_NOT_FOUND)
        
        if 'name' in request.data:
            user.profile.name = request.data['name']
        
        if 'email' in request.data:
            user.email = request.data['email']
         
        if 'role' in request.data:
            role = request.data['role']
            
            if user.id == request.user.id:
                return Response({"error": "You cannot change your own role"},status=status.HTTP_400_BAD_REQUEST)

            if role not in ['admin', 'hr', 'employee']:
                return Response({"error": "Invalid role"},status=status.HTTP_400_BAD_REQUEST)

            user.profile.role = role
         
        user.save()
        user.profile.save() 
        
        return Response({
            "message":"User updated successfully",
            "id":user.id,
            "username":user.username,
            "name":user.profile.name,
            "email":user.email,
            "role":user.profile.role,})
        
    def delete(self, request, pk):
        
        try:
            user = User.objects.get(id=pk, profile__isnull= False)
        except User.DoesNotExist:
            return Response({"error":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if user.id == request.user.id:
            return Response({"error": "You cannot delete your own account"},status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    
    
class AdminPasswordChangeView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):

        try:
            user = User.objects.get(id=pk,profile__isnull=False)
        except User.DoesNotExist:
            return Response({"error": "User not found"},status=status.HTTP_404_NOT_FOUND)

        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        # Check password fields
        if not password or not confirm_password:
            return Response({"error": "Password and confirm password are required"},status=status.HTTP_400_BAD_REQUEST)

        # Check matching passwords
        if password != confirm_password:return Response({"error": "Passwords do not match"},status=status.HTTP_400_BAD_REQUEST)

        # Validate password strength
        try:
            validate_password(password, user)
        except ValidationError as e:
            return Response({"error": e.messages},status=status.HTTP_400_BAD_REQUEST)

        # Hash and save password
        user.set_password(password)
        user.save()

        return Response({"message": "Password changed successfully."},status=status.HTTP_200_OK)
        
class ChangeOwnpasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        
        user = request.user
        
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        #check all field
        if not old_password or not new_password or not confirm_password:
            return Response({"error":"Old_password, new Password and confirm password is required"},status=status.HTTP_400_BAD_REQUEST)
        
        #check old field
        if not user.check_password(old_password):
            return Response({"error":" Old password is incorrect"},status.HTTP_400_BAD_REQUEST)
        
        # check new and confirm password
        if new_password != confirm_password:
            return Response({"error":"Password does not match"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({"error": e.messages},status=status.HTTP_400_BAD_REQUEST)
        
        #set new password securly
        user.set_password(new_password)
        user.save()
        
        return Response({"message":"Password changed successfully"},status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )

class ForgetPasswordView(APIView):
    
    def post(self, request):
        email = request.data.get('email')  
        
        if not email:
            return Response({"error":"Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message":"If this email is registered, a password reset link has been sent."},status=status.HTTP_200_OK)
        
        token = default_token_generator.make_token(user)
        
        reset_link = (
            f"http://127.0.0.1:8000/api/accounts/reset-password/"
            f"?uid={user.id}&token={token}"
        )

        send_mail(
            "Password Reset",
            f"Click this link to reset your password:\n\n{reset_link}",
            None,
            [user.email],
        )           
        
        return Response({"message":"If this email is registered, a password reset link has been sent."},status=status.HTTP_200_OK)
  
class ResetPasswordView(APIView):
    
    def post(self, request):
        user_id = request.data.get('user_id')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not all([user_id, token, new_password, confirm_password]):
            return Response({"error":"All fields are required"},status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({"error":"Both password do not match"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id = user_id)
        except User.DoesNotExist:
            return Response({"error":"Invalid User"},status=status.HTTP_404_NOT_FOUND)
        
        if not default_token_generator.check_token(user, token):
            return Response({"error":"Invalid or expire token"},status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({"message":"Password reset Successfully"})    

class DepartmentView(APIView):
    permission_classes = [IsAdminOrHR]
    
    def get(self, request):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = DepartmentSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                            "message":"Department Created successfully",
                            "data": serializer.data}, status=status.HTTP_201_CREATED)        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DesignationView(APIView):
    permission_classes = [IsAdminOrHR]
    
    def get(self, request):
        designations = Designation.objects.all()
        serializer = DepartmentSerializer(designations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = DesignationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Designation created successfully",
                             "data":serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class AttendanceView(APIView):
    permission_classes = [IsAdminOrHR]
    
    def get(self, request):
        attendance = Attendance.objects.all()
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = AttendanceSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Attendace marked successfully",
                             "data":serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class AttendanceDetailView(APIView):
    permission_classes = [IsAdminOrHR]
    
    def get(self, request, pk):
        try:
            attendance = Attendance.objects.get(id=pk)
        except Attendance.DoesNotExist:
            return Response({"error":"Attendance record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data,status= status.HTTP_200_OK)   
    
    def put(self, request, pk):
        try:
            attendance = Attendance.objects.get(id=pk)
        except Attendance.DoesNotExist:
            return Response({"error":"Attendance record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttendanceSerializer(attendance,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Attendance updated successfully",
                             "data":serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
       
    def delete(self, request, pk):
        try:
            attendance = Attendance.objects.get(id=pk)
        except Attendance.DoesNotExist:
            return Response({"error":"Attendance not found"}, status=status.HTTP_404_NOT_FOUND)
        attendance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

class LeaveView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = LeaveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee=request.user)
            return Response({"message":"Leave Applied Successfully",
                             "data":serializer.data}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)                              
                                     
                
                   
                         
                