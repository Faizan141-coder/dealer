from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model
from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from userauths.models import Profile
from userauths.serializer import MyTokenObtainPairSerializer, RegisterSerializer, UserRegistrationSerializer
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
import logging

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    # the serializer class to be used with this view.
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()

    permission_classes = (AllowAny,)

    serializer_class = RegisterSerializer


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'message': 'User registered successfully',
                    'user_id': user.id,
                    'email': user.email
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(View):
#
#     def get(self, request):
#         if request.user.is_authenticated:
#             return redirect("index")
#         return render(request, 'userauth/login.html')
#
#     def post(self, request):
#         username_or_email = request.POST.get("email-username")
#         password = request.POST.get("password")
#
#         print("username_or_email", username_or_email)
#         print("password", password)
#
#         if not (username_or_email and password):
#             messages.error(request, "Please enter your username and password.")
#             return redirect("login")
#
#         # Check if input is an email or username
#         user = None
#         if "@" in username_or_email:
#             user = User.objects.filter(email=username_or_email).first()
#             if user is None:
#                 messages.error(request, "Invalid email.")
#                 return redirect("login")
#         else:
#             user = User.objects.filter(username=username_or_email).first()
#             if user is None:
#                 messages.error(request, "Invalid username.")
#                 return redirect("login")
#
#         authenticated_user = authenticate(request, username=user.username, password=password)
#         if authenticated_user is not None:
#             login(request, authenticated_user)
#             next_page = request.POST.get("next", "index")
#             return redirect(next_page)
#         else:
#             messages.error(request, "Invalid username or password.")
#             return redirect("login")

# class LoginView():
#     def get(self, request):
#         if request.user.is_authenticated:
#             # If the user is already logged in, redirect them to the home page or another appropriate page.
#             return redirect("index")  # Replace 'index' with the actual URL name for the home page
#
#         # Render the login page for users who are not logged in.
#         return super().get(request)
#
#     def post(self, request):
#         if request.method == "POST":
#             username = request.POST.get("email-username")
#             password = request.POST.get("password")
#
#             if not (username and password):
#                 messages.error(request, "Please enter your username and password.")
#                 return redirect("login")
#
#             if "@" in username:
#                 user_email = User.objects.filter(email=username).first()
#                 if user_email is None:
#                     messages.error(request, "Please enter a valid email.")
#                     return redirect("login")
#                 username = user_email.username
#
#             user_email = User.objects.filter(username=username).first()
#             if user_email is None:
#                 messages.error(request, "Please enter a valid username.")
#                 return redirect("login")
#
#             authenticated_user = authenticate(request, username=username, password=password)
#             if authenticated_user is not None:
#                 # Login the user if authentication is successful
#                 login(request, authenticated_user)
#
#                 # Redirect to the page the user was trying to access before logging in
#                 if "next" in request.POST:
#                     return redirect(request.POST["next"])
#                 else: # Redirect to the home page or another appropriate page
#                     return redirect("index")
#             else:
#                 messages.error(request, "Please enter a valid username.")
#                 return redirect("login")


logger = logging.getLogger(__name__)


class LoginView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect("invoice:order-list")
            # return redirect("invoice:invoice-list")
        return render(request, 'userauth/login.html')

    def post(self, request):
        username_or_email = request.POST.get("email-username")
        password = request.POST.get("password")

        print(f"Received username_or_email: {username_or_email}")
        print(f"Received password: {password}")

        if not (username_or_email and password):
            messages.error(request, "Please enter your username and password.")
            return redirect("login")

        # Check if input is an email or username
        if "@" in username_or_email:
            user = User.objects.filter(email=username_or_email).first()
            if user is None:
                messages.error(request, "Invalid email.")
                return redirect("login")
            user = authenticate(request, username=user.email, password=password)
        else:
            user = User.objects.filter(username=username_or_email).first()
            if user is None:
                messages.error(request, "Invalid username.")
                return redirect("login")
            user = authenticate(request, username=user.username, password=password)

        if user is not None:
            login(request, user)
            next_page = request.POST.get("next", "invoice:order-list")
            # next_page = request.POST.get("next", "invoice:invoice-list")
            # next_page = request.POST.get("next", "index")
            return redirect(next_page)
        else:
            messages.error(request, "Invalid username or password.")
            return redirect("login")


