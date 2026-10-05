from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Department, Designation, Attendance, Leave
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)
    confirm_password = serializers.CharField(write_only = True)
    role = serializers.ChoiceField(choices=['admin', 'hr', 'employee'])
    
    def validate_name(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError("Name must contain at least 3 characters.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value
    
    def validate(self, value):
        if value['password'] != value['confirm_password']:
            raise serializers.ValidationError(
                "Please enter the same password in both sections.")
         
        try:
            validate_password(value['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})       
        return value
    
    def create(self, validate_user):
        validate_user.pop('confirm_password')
        
        user = User.objects.create_user(
            username = validate_user['username'],
            email = validate_user['email'],
            password = validate_user['password']
        )
        
        Profile.objects.create(
            user = user,
            name = validate_user['name'],
            role = validate_user['role']
        )    
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only = True)
    
    def validate(self, value):
        user = authenticate(
            username = value['username'],
            password = value['password']
        )
        
        if user is None:
            raise serializers.ValidationError(
                "Invalide username or password"
            )
        
        refresh = RefreshToken.for_user(user)
        value['user'] = user
        value['refresh'] = str(refresh)
        value['access'] = str(refresh.access_token)
        return value
    
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'    
      
class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'        
        
class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source = 'employee.profile.name',
        read_only = True
    )
    
    username = serializers.CharField(
        source = 'employee.username',
        read_only = True
    )
    
    department = serializers.CharField(
        source = 'employee.profile.department.name',
        read_only = True
    )
    
    designation = serializers.CharField(
        source = 'employee.profile.designation.name',
        read_only = True
    )
    class Meta:
        model = Attendance  
        fields = ['id', 'employee', 'employee_name', 'username', 'department', 'designation', 'date', 'status']     

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ['status']  # Make the status field read-only for employees        