from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from project.password__reset_utils import send_password_reset_email, verify_reset_token

class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, min_length=8, write_only=True)
    confirm_password = serializers.CharField(required=True, min_length=8, write_only=True)
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        
        user = verify_reset_token(data['uidb64'], data['token'])
        if not user:
            raise serializers.ValidationError("Invalid reset token")
        
        return data

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    serializer = RequestPasswordResetSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
        email_sent, error_msg = send_password_reset_email(user, request)
        
        if email_sent:
            return Response({
                'success': True,
                'message': 'Password reset email has been sent.'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': f'Failed to send password reset email: {error_msg}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except User.DoesNotExist:
        return Response({
            'success': True,
            'message': 'If this email is registered, a password reset link has been sent.'
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    
    user = verify_reset_token(validated_data['uidb64'], validated_data['token'])
    
    if not user:
        return Response({
            'success': False,
            'message': 'Invalid or expired password reset token.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.password = make_password(validated_data['password'])
    user.save()
    
    return Response({
        'success': True,
        'message': 'Password has been reset successfully.'
    }, status=status.HTTP_200_OK)
