from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        
    
    def validate_name(self,value):
        if len(value) < 3:
            raise serializers.ValidationError("Name contains atleast 3 character")
        return value
    
    def validate_age(self,value):
        if value < 18 or value > 60:
            raise serializers.ValidationError("Age must be greater than 18 and less than 60")
        return value