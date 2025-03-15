from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('new_user/', views.new_user, name='new_user'),
    path('users/', views.get_users_view, name='get_users'),
    path('new_spreadsheet/', views.new_spreadsheet_views, name='new_spreadsheet'),
    path('login/', views.login,name='login'),
    path('spreadsheets/',views.get_spreadsheets_views,name='get_spreadsheets'),
    path('job_applications/',views.get_job_applications_views,name='job_applications'),
    path('new_job_application/',views.new_job_application_views,name='new_job_application'),
    path('new_job_application_status/',views.new_status_views,name='new_job_application_status'),
    path('delete_status/',views.delete_status_update_views,name='delete_status'),
    path('delete_job_application/',views.delete_job_application_views,name='delete_job_application'),
    path('delete_spreadsheet/',views.delete_sheets_views,name='delete_spreadsheet'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]