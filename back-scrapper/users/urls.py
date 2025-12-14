from django.urls import path
from .views import CreateUsers,login,confirm_creation,ListUsers,DeleteUsers,UpdateUsers,CacheContent

# Create your views here.
urlpatterns = [
    path('', ListUsers.as_view(), name='user_list'),
    path('sign-up/', CreateUsers.as_view(), name='user_list'),
    path('confirm/<str:user_key>/', confirm_creation, name='confirm_creation'),
    path("log-in/",login,name="user_login"),
    path('<int:pk>/', DeleteUsers.as_view(), name='user_delete'),
    path('<int:pk>/', UpdateUsers.as_view(), name='user_update'),
    path('get_all_cache/',CacheContent.as_view() ),
]