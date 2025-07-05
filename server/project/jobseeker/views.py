from django.shortcuts import render
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .serializers import SignUpSerializer,UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from .models import UserProfile, Education
from .serializers import SignUpSerializer, UserSerializer, UserProfileSerializer, EducationSerializer

from pages.serializers import *
from pages.models import *
from .models import *
from .serializers import *
@api_view(['POST'])
@permission_classes([])
def register(request):
    data = request.data
    user_serializer = SignUpSerializer(data=data)

    if user_serializer.is_valid():
        if not User.objects.filter(username=data['email'].split("@")[0]).exists():
            user = User.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'], 
                email=data['email'], 
                username=data['email'].split("@")[0], 
                password=make_password(data['password']),
            )
            
            token, _ = Token.objects.get_or_create(user=user)
            UserProfile.objects.create(
                user=user,
                user_type='jobseeker'
            )
           
            from pages.email_utils import send_welcome_email
            email_sent, error_msg = send_welcome_email(user, 'jobseeker')
            
            return Response({
                'message': 'Your account registered successfully! and successfully sending email ',
                'token': token.key,
                'user_id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': 'jobseeker'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': 'This email already exists!'},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(user_serializer.errors)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = UserSerializer(request.user,many=False)
    return Response(user.data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_update_profile(request):
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    if request.method == 'GET':
        prof=UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(prof)
        
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            
            if 'photo' in request.FILES:
                profile.photo = request.FILES['photo']
            if 'resume' in request.FILES:
                profile.resume = request.FILES['resume']
                
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_education(request):
    user_profile = UserProfile.objects.get(user=request.user)
    
    serializer = EducationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user_profile=user_profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_delete_education(request, pk):
    user_profile = UserProfile.objects.get(user=request.user)
    try:
        education = Education.objects.get(pk=pk, user_profile=user_profile)
    except Education.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        serializer = EducationSerializer(education, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        education.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['GET'])
@permission_classes([])
def jobs(request):
    jobs = Job.objects.all().order_by('-posted_at')
    serializer = JobsListSerializer(jobs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if JobApplication.objects.filter(job=job, applicant=request.user).exists():
        return Response({"error": "You have already applied for this job"}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        if not user_profile.resume:
            return Response({"error": "Please update your profile with a resume before applying"}, 
                           status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(job=job, applicant=request.user)

        from pages.email_utils import send_job_application_confirmation
        email_sent, error_msg = send_job_application_confirmation(request.user, job)

        
        if not email_sent:
            print(f"Failed to send application confirmation email: {error_msg}")
        
        return Response({
            "message": "Application submitted successfully using resume from your profile",
            "email_sent": email_sent
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    """
    Get all applications submitted by the current user (jobseeker)
    """
    applications = JobApplication.objects.filter(applicant=request.user).order_by('-applied_at')
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications_by_status(request, state):
    """
    Get applications submitted by the current user filtered by status
    """
    valid_statuses = [choice[0] for choice in JobApplication.STATUS_CHOICES]
    if state not in valid_statuses:
        return Response(
            {"error": f"Invalid status. Choose from {valid_statuses}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    applications = JobApplication.objects.filter(
        applicant=request.user,
        status=state
    ).order_by('-applied_at')
    
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_detail(request, pk):
    """
    Get details of a specific application
    Jobseekers can only view their own applications
    """
    application = get_object_or_404(JobApplication, id=pk)
    
    if application.applicant != request.user:
        return Response(
            {"error": "You don't have permission to view this application."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = JobApplicationSerializer(application)
    return Response(serializer.data)