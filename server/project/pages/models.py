from django.db import models
from datetime import datetime
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.dispatch import receiver 
from django.db.models.signals import post_save
# Create your models here.

def user_photo_path(instance, filename):
    return f'Profiles/{instance.user.id}/photos/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='page_profile')
    user_type = models.CharField(max_length=20, default='employer')
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    img=models.ImageField(upload_to=user_photo_path, blank=True, null=True ,default="Profiles/68/photos/default.png")
    vision = models.TextField(blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    business_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reset_password_token = models.CharField(max_length=50,default="",blank=True)
    reset_password_expire = models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
    

@receiver(post_save, sender=User)
def save_profile(sender, instance, created, **kwargs):
    
    if created and hasattr(instance, '_is_employer') and instance._is_employer:
        Profile.objects.create(user=instance, user_type='employer')


class Job(models.Model):
     EMPLOYMENT_TYPES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('paid_internship', 'Paid Internship'),
        ('unpaid_internship', 'Unpaid Internship'),
       
         ]
     company=models.CharField(max_length=255)
     position=models.CharField(max_length=255)
     location = models.CharField(max_length=255)
     description = models.TextField()
     job_skills = models.TextField(help_text="Comma-separated list of skills")
     salaryoffer = models.CharField(max_length=100, blank=True, null=True,default="")
     posted_at = models.DateTimeField(auto_now_add=True)
     edu_qualifications=models.TextField()
     Work_experince=models.TextField()
     Deadline_of_application=models.DateTimeField()
     Emp_type=models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPES,
        default='full_time'
    )
     period = models.CharField(max_length=100, help_text="e.g. 6 months, 1 year", blank=True, null=True,default="")
     def __str__(self):
        return f"{self.position} at {self.company}"