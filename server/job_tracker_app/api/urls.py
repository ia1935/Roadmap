from django.urls import path
from . import views

urlpatterns = [
    path('new_user/', views.new_user, name='new_user'),
    path('users/', views.get_users_view, name='get_users'),
    path('new_spreadsheet/', views.new_spreadsheet_views, name='new_spreadsheet'),
    path('login/', views.login,name='login'),
    path('spreadsheets/',views.get_spreadsheets_views,name='get_spreadsheets'),
    path('job_applications/',views.get_job_applications_views,name='job_applications'),
    path('new_job_application/',views.new_job_application_views,name='new_job_application'),
]