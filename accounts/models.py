from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    ROLE_CHOICES = (
        ('admin','Admin'),
        ('hr','HR'),
        ('employee','Employee'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    department = models.ForeignKey('Department',
                                   on_delete=models.SET_NULL,
                                   blank = True, null = True)
    
    designation = models.ForeignKey('Designation',
                                    on_delete=models.SET_NULL,
                                    blank=True, null= True)
    
    def __str__(self):
        return self.user.username
    
class Department(models.Model):
    name = models.CharField(max_length=100,unique=True)
    
    def __str__(self):
        return self.name

class Designation(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey("Department", on_delete=models.CASCADE,related_name = 'designations') 
    
    def __str__(self):
        return self.name   
    
class Attendance(models.Model):
    STATUS_CHOICE = (
        ('present', 'PRESENT'),
        ('adsent', 'ABSENT'),
        ('leave', 'LEAVE')
    )
    
    employee = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='attendance')
    date = models.DateField()
    status = models.CharField(max_length=20, choices = STATUS_CHOICE)
    
    def __str__(self):
        return f"{self.employee.username} - {self.date}"
  
class Leave(models.Model):
    STATUS_CHOICE = (
        ('pending', 'PENDING'),
        ('approved', 'APPROVED'),
        ('rejected', 'REJECTED'),
    )    
    
    employee = models.ForeignKey(
        User,
        on_delete= models.CASCADE,
        related_name='leaves'
    )
    
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices = STATUS_CHOICE, default= 'pending')
    
    def __str__(self):
        return f"{self.employee.username} - {self.start_date}"