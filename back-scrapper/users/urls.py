from django.urls import path
from .views import user_profile,create_user,send_mail_page
# Create your views here.
urlpatterns = [
    path('list/', user_profile, name='user_list'),
    path('create/', create_user, name='create_user'),
    path("send_mail/",send_mail_page,name="test for sending mails")
]