from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.models import User

def send_password_reset_email(user, request=None):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    reset_url = f"http://localhost:5173/reset-password?uidb64={uid}&token={token}"

    subject = "Password Reset Request"
    message = f"""
    Hello {user.first_name} {user.last_name},

    You recently requested to reset your password for your Job Board account.

    Please use the following link to reset your password:

    {reset_url}

    This link will expire in 24 hours.

    If you did not request a password reset, please ignore this email or contact support if you have questions.

    Best regards,
    The Job Board Team
    """

    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        return True, None
    except Exception as e:
        return False, str(e)

def verify_reset_token(uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        return user
    return None
