from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import generics,status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view,permission_classes

from .serializer import RegisterDataSerializer,UserSerializer
from .permissions import IsStaffPermission
from .services import UserService
from .models import User

user_service=UserService()

@api_view(["GET"])
@permission_classes([AllowAny])
def confirm_creation(request: Request,email:str):
    user = get_object_or_404(User, email=email)
    if user.is_active:
        return Response("Account is already confirmed",status=status.HTTP_200_OK)
    
    user.is_active = True
    user.save()
    return Response("Account confirmed successfully",status=status.HTTP_200_OK)

# def confirm_creation(request: Request,user_key:str):
#     if cache.has_key(user_key):
#         email = cache.get(user_key)
#         user = get_object_or_404(User, email=email)
#         user.is_active = True
#         user.save()
#         cache.delete(user_key)
#         return Response("Account confirmed successfully",status=status.HTTP_200_OK)
#     return Response("Invalid confirmation key",status=status.HTTP_400_BAD_REQUEST)





@api_view(["POST"])
@permission_classes([AllowAny])
def login(request:Request):
    body=request.data
    email = body.get("email",None)
    password = body.get("password",None)
    
    if email is not None and password is not None:
        user = get_object_or_404(User, email=email)
        
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"key":token.key},status=status.HTTP_200_OK)
    
        return Response("check your email and password",status=status.HTTP_401_UNAUTHORIZED)
    
    return Response("email and password are obligatory",status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request:Request):
    auth_token=request.auth
    token=Token.objects.filter(key=auth_token.key).first()
    if token:
        token.delete()
        return Response("Logged out successfully",status=status.HTTP_200_OK)
    return Response("User is not logged in",status=status.HTTP_400_BAD_REQUEST)


class CreateUsers(generics.CreateAPIView):
    serializer_class=RegisterDataSerializer
    queryset = User.objects.all()
    permission_classes=[AllowAny]


class UpdateUsers(generics.UpdateAPIView):
    serializer_class=RegisterDataSerializer
    queryset = User.objects.all()
    permission_classes=[IsAuthenticated]


class DeleteUsers(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes=[IsAuthenticated,IsStaffPermission]


class DeleteMultipleUsers(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes=[AllowAny]


    def delete(self,request,*args, **kwargs):
        nb_user=User.objects.all().delete()
        return Response(
            f"all users was deleted (number of users ={nb_user})",status=status.HTTP_204_NO_CONTENT            
        )    


class CacheContent(APIView):
    def get(self,request,  *args, **kwargs):
        return Response(cache.get(),status=status.HTTP_200_OK)


class ListUsers(generics.ListAPIView):
    serializer_class=UserSerializer
    queryset = User.objects.all()
    
    authentication_classes = [TokenAuthentication]
    permission_classes=[AllowAny]



class ShowAllTokens(generics.GenericAPIView):
    permission_classes=[AllowAny]
    
    def get(self,request:Request,*args,**kwargs):
        tokens = Token.objects.all()
        return Response([token.key for token in tokens],status=status.HTTP_200_OK)