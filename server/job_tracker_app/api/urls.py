from django.urls import path
from . import views

urlpatterns = [
    path('new_user/', views.new_user, name='new_user'),
    path('users/',views.get_users_view,name='get_users')
]