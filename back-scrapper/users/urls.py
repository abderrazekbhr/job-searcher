from django.urls import path
from .views import user_profile,create_user
# Create your views here.
urlpatterns = [
    path('users/', user_profile, name='user_list'),
    path('create/', create_user, name='create_user'),
]