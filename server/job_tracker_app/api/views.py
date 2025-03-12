from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .services import (create_user, get_users, new_spreadsheet, login_user, get_spreadsheets,
                        get_job_applications, new_job_application, new_status)
from .serializers import UserSerializer, SpreadsheetSerializer, JobApplicationSerializer, JobApplicationStatusSerializer

@api_view(['POST'])
def new_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = create_user( email, password)
            return Response(user, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_users_view(request):
    try:
        users = get_users()
        return Response(users, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = login_user(email,password)
            return Response(user, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def get_spreadsheets_views(request):
    #getting userid from request
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user_id = serializer.validated_data['user_id']
            userData = get_spreadsheets(user_id)
            return Response(userData, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def new_spreadsheet_views(request):
    serializer = SpreadsheetSerializer(data=request.data)
    if serializer.is_valid():
        user_id = request.data.get('user_id')
        spreadsheet_name = serializer.validated_data['spreadsheet_name']
        try:
            sheet = new_spreadsheet(user_id, spreadsheet_name)
            return Response(sheet, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#implementing job applications
@api_view(['POST'])
def get_job_applications_views(request):
    #we take in sheet_id and user_id and return the job apps in this sheet

    serializer = SpreadsheetSerializer(data=request.data)

    if serializer.is_valid():
        try:
            user_id = request.data.get('user_id')
            sheet_id = serializer.validated_data['sheet_id']

            #going to business logic now
            job_applications = get_job_applications(user_id,sheet_id)
            return Response(job_applications, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def new_job_application_views(request):
    #taking in user_id,sheet_id and also job application data
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        user_id = request.data.get('user_id')
        sheet_id = request.data.get('sheet_id')
        job_application_data = serializer.validated_data

        try:
            job_app = new_job_application(user_id,sheet_id,job_application_data)
            return Response(job_app, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def new_status_views(request):
    #taking in user_id,sheet_id,job_id and job app data
    serializer = JobApplicationStatusSerializer(data=request.data)

    if serializer.is_valid():
        user_id = request.data.get('user_id')
        sheet_id = request.data.get('sheet_id')
        job_id = request.data.get('job_id')
        job_app_status = serializer.validated_data

        try:
            job_app = new_status(user_id,sheet_id,job_id,job_app_status)
            return Response(job_app, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)