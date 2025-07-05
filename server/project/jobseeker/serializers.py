from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Education
from pages.serializers import *
from pages.models import *
from .models import *
from rest_framework.authtoken.models import Token

class SignUpSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'token')
        
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False},
            'password': {'required': True, 'allow_blank': False, 'min_length': 8, 'write_only': True}
        }
    
    def get_token(self, obj):
        token, created = Token.objects.get_or_create(user=obj)
        return token.key


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name','last_name','email', 'username')         

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'degree', 'university', 'field_of_study', 'graduation_year']        
class UserProfileSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'job_title', 'city', 'country', 'phone_number', 
                 'photo', 'resume', 'education', 'created_at', 'updated_at']
        

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    resume_url = serializers.SerializerMethodField(read_only=True)
    job = JobsListSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'applicant', 'Portfolio_link', 
                 'cover_letter', 'status', 'resume_url', 'applied_at']
    
    def get_resume_url(self, obj):
      
        try:
            user_profile = UserProfile.objects.get(user=obj.applicant)
            if user_profile.resume:
                return user_profile.resume.url
            return None
        except UserProfile.DoesNotExist:
               return None




class JobSeekerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, required=True)

