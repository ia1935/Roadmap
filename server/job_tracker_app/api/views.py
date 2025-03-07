from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import create_user, get_users
from .serializers import UserSerializer, SpreadsheetSerializer, JobApplicationSerializer

# import services

# Create your views here.


@api_view(['POST'])
def new_user(request):
    #we recieve name, email, and password from request
    #calling service 
    #we will call our service layer to make a new user with a uuid also:
    #call serializer
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        name = serializer.validated_data['name']
        email  = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = create_user(name,email,password)
            return Response(user,status=200)

        except Exception as e:
            return Response({'error':str(e)},status=400)

    else:
        return Response(serializer.errors,status=400)



@api_view(['GET'])
def get_users_view(request):
    try:
        users = get_users()
        return Response(users,status=200)
    except Exception as e:
        return Response({'error':str(e)},status=400)
    
