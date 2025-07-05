from django.shortcuts import render
from rest_framework import serializers
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from rest_framework import status
from .serializers import *
from .models import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated 
from jobseeker.models import *
from jobseeker.serializers import *
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from datetime import datetime, timedelta
from pages.email_utils import send_welcome_email
from rest_framework.decorators import api_view

# Create your views here
from project import settings
@api_view(['POST'])
@permission_classes([])
def register(request):
    data = request.data
    user = EmployerSerializer(data=data)

    if user.is_valid():
        email_exists = User.objects.filter(email=data['email']).exists()
        username_exists = User.objects.filter(username=data['username']).exists()

        if not email_exists and not username_exists:
            new_user = User.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                username=data['username'],
                email=data['email'],
                password=make_password(data['password']),
            )

            token, _ = Token.objects.get_or_create(user=new_user)

            Profile.objects.create(
                user=new_user,
                user_type='employer'
            )

            from pages.email_utils import send_welcome_email
            email_sent, error_msg = send_welcome_email(new_user, 'employer')

            return Response({
                'message': 'Account registered successfully. Welcome email sent.',
                'token': token.key,
                'user_id': new_user.id,
                'email': new_user.email,
                'username': new_user.username,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name,
                'user_type': 'employer'
            }, status=status.HTTP_201_CREATED)

        else:
            if email_exists:
                return Response(
                    {'error': 'An account with this email already exists.'},
                    status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(
                    {'error': 'An account with this username already exists.'},
                    status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response(
            {'error': 'Invalid input. Please check the provided data.', 'details': user.errors},
            status=status.HTTP_400_BAD_REQUEST
        )   

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
        request.user.auth_token.delete()
     
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        prof = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UseremProfileSerializer(prof)
    return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    prof = Profile.objects.get(user=request.user)
    serializer = UseremProfileSerializer(prof, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        
        if 'img' in request.FILES:
            prof.img = request.FILES['img']
            prof.save()
        
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ======================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_Job(request):
    data=request.data
    job=JobSerializer(data=data)
    comp=Profile.objects.get(user=request.user)
    try:
        
        if not comp.company_name:
            return Response({"error": "Please update your profile with Company Name before applying"}, 
                           status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
    if job.is_valid():
      
      if not Job.objects.filter(
    company=comp.company_name,
    position=data['position'],
    location=data['location'],
    description=data['description'],
    job_skills=data['job_skills'],
    salaryoffer=data['salaryoffer'],
    edu_qualifications=data['edu_qualifications'],
    Work_experince=data['Work_experince'],
    Deadline_of_application=data['Deadline_of_application'],
    Emp_type=data['Emp_type'],
    period=data['period']
      ).exists():
         job=Job.objects.create(
              company=comp.company_name,
              position=data['position'],
        location = data['location'],
         description = data['description'],
       job_skills = data['job_skills'],
        salaryoffer = data['salaryoffer'],

       edu_qualifications=data['edu_qualifications'],
        Work_experince=data['Work_experince'],
        Deadline_of_application=data['Deadline_of_application'],
        Emp_type=data['Emp_type'],
        period = data['period'] 
       )   
         return Response(
                {'details':'Your Job Created susccessfully!'},
                    status=status.HTTP_201_CREATED
                    ) 
      else:
           return Response(
                {'error':'This Job already exists!' },
                    status=status.HTTP_400_BAD_REQUEST)
    else :
         return Response(job.errors)     
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def jobs(request):
     comp=Profile.objects.get(user=request.user)
     jobs = Job.objects.filter(company=comp.company_name).order_by('-posted_at')
     serializer = JobsListSerializer(jobs, many=True)
     return Response(serializer.data,status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([])
def job_details(request,pk):
     job =get_object_or_404(Job, id=pk)
     serializer = JobsListSerializer(job,many=False)
     return Response({'Job deatails':serializer.data})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_job(request,pk):
     job=get_object_or_404(Job, id=pk)
     serializer = JobsListSerializer(job,data=request.data, many=False)
     if serializer.is_valid():
            
            serializer.save()
            return Response(serializer.data)
     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request,pk):
     job=get_object_or_404(Job, id=pk)
     
     job.delete() 
     return Response({"details":"Delete action is done"},status=status.HTTP_200_OK)
#  ========================================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def app(request,pk):
     job=get_object_or_404(Job, id=pk)
     apps = JobApplication.objects.filter(job=job)
     serializer = ApplicationSerializer(apps, many=True)
     return Response(serializer.data,status=status.HTTP_200_OK)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_app(request,pk):
     job=get_object_or_404(JobApplication, id=pk)
     
     job.delete() 
     return Response({"details":"Delete action is done"},status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([])
def reset_password(request):
     data=request.data
     user=get_object_or_404(User, email=data['email'])
     s=ResetSerializer(data=request.data)
     if s.is_valid():
       if data['password']==data['confirm'] :
          user.password=make_password(data['password'])
          user.save()
          return Response({"details":"password reset successfully"},status=status.HTTP_200_OK)
       else:
          return Response({"details":"password reset Fail"},status=status.HTTP_200_OK)
     else :
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
     


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def app_for_jobs(request):
     comp=Profile.objects.get(user=request.user)
     job=Job.objects.filter(company=comp.company_name)
     apps = JobApplication.objects.filter(job__in=job)
     serializer = ApplicationSerializer(apps, many=True)
     return Response(serializer.data,status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_app(request):
   
     apps = JobApplication.objects.all()
     serializer = ApplicationSerializer(apps, many=True)
     return Response(serializer.data,status=status.HTTP_200_OK)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    """
    Update the status of a job application.
    Only the employer who posted the job can update the status.
    """
    application = get_object_or_404(JobApplication, id=pk)
    
    
    comp=Profile.objects.get(user=request.user)
    if application.job.company != comp.company_name:
        return Response(
            {"error": "You don't have permission to update this application status."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    
    new_status = request.data.get('status')
    if new_status not in [choice[0] for choice in JobApplication.STATUS_CHOICES]:
        return Response(
            {"error": f"Invalid status. Choose from {[choice[0] for choice in JobApplication.STATUS_CHOICES]}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
   
    application.status = new_status
    application.save()
    
   
    send_application_status_email(application)
    
    serializer = JobApplicationSerializer(application)
    return Response(serializer.data)

def send_application_status_email(application):
    """
    Send an email to the applicant notifying them of their application status change.
    """
    subject = f"Job Application Status Update - {application.job.position}"
    status_messages = {
        'pending': 'Your application is pending review.',
        'in_progress': 'Your application is currently being reviewed.',
        'accepted': 'Congratulations! Your application has been accepted.',
        'rejected': 'We regret to inform you that your application was not selected.'
    }
    
    message = f"""
    Hello {application.applicant.first_name} {application.applicant.last_name},
    
    Your application for the position of {application.job.position} at {application.job.company} has been updated.
    
    Current Status: {application.get_status_display()}
    
    {status_messages.get(application.status, '')}
    
    {
        "Thank you for your application. We'll be in touch soon." 
        if application.status in ['pending', 'in_progress'] 
        else "Please log in to your account for more details."
    }
    
    Best regards,
    The Job Board Team
    """
    
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [application.applicant.email]
    
    try:
        send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send status update email: {str(e)}")
        return False

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_application_by_status(request, job_id,state=None):
    """
    List applications for a specific job filtered by status.
    Only the employer who posted the job can view these applications.
    """
    job = get_object_or_404(Job, id=job_id)
    
    
    comp=Profile.objects.get(user=request.user)
    if job.company != comp.company_name:
        return Response(
            {"error": "You don't have permission to view applications for this job."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    
    if state:
        applications = JobApplication.objects.filter(job=job, status=state)
    else:
        applications = JobApplication.objects.filter(job=job)
    
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)