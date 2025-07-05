from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_welcome_email(user, user_type):
    """
    Send a welcome email to a newly registered user.
    
    Args:
        user: The User object
        user_type: String indicating 'employer' or 'jobseeker'
    
    Returns:
        tuple: (success, error_message)
    """
    subject = f"Welcome to Job Board - Your {user_type.title()} Account"
    
    if user_type == 'employer':
        message = f"""
        Hello {user.first_name} {user.last_name},
        
        Thank you for registering as an employer on our Job Board platform.
        
        With your account, you can:
        - Post new job opportunities
        - Review applications from candidates
        - Manage your company profile
        
        If you have any questions, please don't hesitate to contact us.
        
        Best regards,
        The Job Board Team
        """
    else:  # jobseeker
        message = f"""
        Hello {user.first_name} {user.last_name},
        
        Thank you for registering as a job seeker on our Job Board platform.
        
        With your account, you can:
        - Browse available jobs
        - Apply for positions
        - Track your application status
        - Manage your professional profile
        
        Good luck with your job search!
        
        Best regards,
        The Job Board Team
        """
    
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    
    logger.info(f"Attempting to send welcome email to {user.email} as {user_type}")
    
    try:
        send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,
        )
        return True, None  
    except Exception as e:
        error_message = str(e)
        logger.error(f"Failed to send welcome email to {user.email}: {error_message}")

        return False, error_message  

def send_job_application_confirmation(user, job):
    """Send confirmation email after a jobseeker applies for a job"""
    try:
        subject = f"Application Confirmation: {job.position}"
        message = f"""
Hi {user.first_name},

Thank you for applying to the position of {job.position} at {job.company}.

Your application has been received and is currently under review. You can check the status of your application in your dashboard.

Best regards,
JobPortal Team
        """
        
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        
        send_mail(subject, message, email_from, recipient_list)
        return True, None
    except Exception as e:
        return False,str(e)