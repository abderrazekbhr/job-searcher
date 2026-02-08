from django.urls import path
from .views import CreateUsers,login,confirm_creation,ListUsers,DeleteUsers,UpdateUsers,CacheContent, logout,ShowAllTokens


test_urls = [
    path('tokens/', ShowAllTokens.as_view(),name="get_all_tokens"),
    path('get_all_cache/',CacheContent.as_view() ),
]

# Create your views here.
urlpatterns = [
    path('', ListUsers.as_view(), name='user_list'),
    path('sign-up/', CreateUsers.as_view(), name='user_list'),
    path('confirm/<str:email>/', confirm_creation, name='confirm_creation'),
    path("login/",login,name="user_login"),
    path("logout/",logout,name="user_logout"),
    path('<int:pk>/', DeleteUsers.as_view(), name='user_delete'),
    path('<int:pk>/', UpdateUsers.as_view(), name='user_update'),
]
urlpatterns += test_urls