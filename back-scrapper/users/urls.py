from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token 
from .views import CreateUsers,login,confirm_creation,ListUsers,DeleteUsers,UpdateUsers,DeleteMultipleUsers,CacheContent

# Create your views here.
urlpatterns = [
    path("login",login,name="login user"),
    path('sign-up', CreateUsers.as_view(), name='user_list'),
    path('confirm/<str:user_key>', confirm_creation, name='confirm_creation'),
    path('', ListUsers.as_view(), name='user_list'),
    path('<int:pk>', DeleteUsers.as_view(), name='user_delete'),
    path('<int:pk>', UpdateUsers.as_view(), name='user_update'),
    path('get_all_cache',CacheContent.as_view() ),
]