from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from jobseeker.models import *
from rest_framework.authtoken.models import Token


class EmployerLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, required=True)


class EmployerSerializer(serializers.ModelSerializer):
  
    password = serializers.CharField(max_length=15, validators=[MinLengthValidator(8)], write_only=True)
    token = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'username', 'token']
        
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'username': {'required': True},
            'email': {'required': True},
        }
    
    def get_token(self, obj):
        token, created = Token.objects.get_or_create(user=obj)
        return token.key

class EditSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=User
        fields=['email', 'first_name','last_name', 'username']
        read_only_fields = ('email', 'username')

       

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name','last_name','email', 'username')
      
class UseremProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'user_type', 'city', 'country', 'img',
                  'company_name', 'business_phone', 'created_at', 'updated_at', 'vision']

    def __init__(self, *args, **kwargs):
        super(UseremProfileSerializer, self).__init__(*args, **kwargs)
        # Make all fields not required
        for field in self.fields.values():
            field.required = False
class JobSerializer(serializers.ModelSerializer):
     class Meta:
        model = Job
        fields = ['position','location','description','job_skills','salaryoffer','edu_qualifications',
                  'Work_experince','Deadline_of_application','Emp_type','period']
        extra_kwargs ={
             
              'position':{'required':True},
              'location':{'required':True},
             'description':{'required':True},
             'job_skills':{'required':True},
             
             'edu_qualifications':{'required':True},
             'Work_experince':{'required':True},
             
             'Emp_type':{'required':True},
             'period':{'required':True},
             'salaryoffer':{'required':True},
             'Deadline_of_application':{'required':True}
          
        }

class JobsListSerializer(serializers.ModelSerializer):
     class Meta:
        model = Job
        fields ='__all__'
        read_only_fields = ['company', 'posted_at']

class ApplicationSerializer(serializers.ModelSerializer):
    job=JobsListSerializer()
    applicant=UserSerializer()
    resume_url = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = JobApplication
        fields = '__all__'
    def get_resume_url(self, obj):
        try:
            user_profile = UserProfile.objects.get(user=obj.applicant)
            if user_profile.resume:
                return user_profile.resume.url
            return None
        except UserProfile.DoesNotExist:
            return None

class ResetSerializer(serializers.ModelSerializer):
     email=serializers.EmailField()
     confirm=serializers.CharField(max_length=15,validators=[MinLengthValidator(8)])
     password=serializers.CharField(max_length=15,validators=[MinLengthValidator(8)])
     class Meta:
        model = User
        fields = ['email','confirm','password']
        
        extra_kwargs ={
          
             'email':{'required':True},
            
        }