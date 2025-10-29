from django.shortcuts import render
from django.http import HttpResponse
from .service import UserService
from users.models import User
user_service = UserService()

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status


@api_view(["POST"])
def create_user(request:Request):
    
    User.objects.create(
        
    )
    return Response(
        data=request.data.get("name","None"),
        status=status.HTTP_200_OK    
    )


def user_list(request):
    users = user_service.find_all_users()
    return HttpResponse("List of users will be displayed here.")

def user_profile(request, user_id):
    user = user_service.find_user_by_id(user_id)
    if user:
        return HttpResponse(f"Profile of user {user_id} will be displayed here.")
    return HttpResponse("User not found.")