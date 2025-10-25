from django.shortcuts import render
from django.http import HttpResponse
from .service import UserService
user_service = UserService()

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view["POST"]
def create_user(request):
    # Assuming request.POST is a dictionary-like object with user data
    user_data = {
        'username': request.POST.get('username'),
        'email': request.POST.get('email'),
        'first_name': request.POST.get('first_name'),
        'last_name': request.POST.get('last_name')
    }
    user = user_service.create_user(user_data)
    return Response(
        
    )


def user_list(request):
    users = user_service.find_all_users()
    return HttpResponse("List of users will be displayed here.")

def user_profile(request, user_id):
    user = user_service.find_user_by_id(user_id)
    if user:
        return HttpResponse(f"Profile of user {user_id} will be displayed here.")
    return HttpResponse("User not found.")