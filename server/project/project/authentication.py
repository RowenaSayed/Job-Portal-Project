# authentication.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)  
    password = serializers.CharField(required=True)
    


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    identifier = data.get('identifier')
    password = data.get('password')
    
  
    user = None
    
 
    if '@' in identifier:
        try:
            user = User.objects.get(email=identifier)
        except User.DoesNotExist:
            pass
    
   
    if user is None:
        user = authenticate(username=identifier, password=password)
    else:
       
        user = authenticate(username=user.username, password=password)
    
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
 
    token, _ = Token.objects.get_or_create(user=user)
    
   
    user_type = None
    
   
    if hasattr(user, 'page_profile'):
        user_type = user.page_profile.user_type
    elif hasattr(user, 'jobseeker_profile'):
        user_type = user.jobseeker_profile.user_type

   
    if user_type is None:
        if hasattr(user, 'page_profile') and hasattr(user.page_profile, 'user_type'):
            user_type = user.page_profile.user_type
        elif hasattr(user, 'jobseeker_profile') and hasattr(user.jobseeker_profile, 'user_type'):
            user_type = user.jobseeker_profile.user_type
    
    return Response({
        'token': token.key,
        'user_id': user.id,
        'email': user.email,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'user_type': user_type
    }, status=status.HTTP_200_OK)