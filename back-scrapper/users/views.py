from django.shortcuts import render
from django.http import HttpResponse
from .service import UserService
from users.models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from django.core.mail import send_mail
from django.template.loader import render_to_string

from django.core.mail import EmailMultiAlternatives



user_service = UserService()
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


@api_view(["POST"])
def send_mail_page(request):
    
    subject="confiramation mail"
    try:
        message_html=render_to_string(
            template_name="index.html",
            context={
                "firstname":request.data.get("firstname"),
                "lastname":request.data.get("lastname"),
                "url":request.data.get("url"),
            })
        
        # Then, create a multipart email instance.
        msg = EmailMultiAlternatives(
            "Subject here",
            "",
            "abderrazek455@gmail.com",
            ["abderrazek455@gmail.com"],
        )

        # Lastly, attach the HTML content to the email instance and send.
        msg.attach_alternative(message_html, "text/html")
        msg.send()
        
        return HttpResponse(
            "well done",
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

