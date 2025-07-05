from django.db import models
from django.contrib.auth.models import User
from pages.models import Job
from django.dispatch import receiver
from django.db.models.signals import post_save

def user_photo_path(instance, filename):
    return f'users/{instance.user.pk}/photos/{filename}'


def user_resume_path(instance, filename):
    return f'users/{instance.user.pk}/resumes/{filename}'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='jobseeker_profile')
 
    user_type = models.CharField(max_length=20, default='jobseeker')
    job_title = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to=user_photo_path, blank=True, null=True,default="Profiles/68/photos/default.png")
    resume = models.FileField(upload_to=user_resume_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"


class Education(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='education')
    degree = models.CharField(max_length=100)
    university = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.degree} from {self.university}"
    

    
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    name= models.TextField(blank=True)
    Portfolio_link=models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)
    
    def str(self):
        return f"{self.applicant.username} applied for {self.job.position}"