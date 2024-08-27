from django.urls import path

from store.views import OrderAPIView
from userauths import views as userauths_views
from store import views as store_views
from rest_framework_simplejwt.views import TokenRefreshView

from userauths.views import UserRegistrationView

urlpatterns = [
    # Userauths API Endpoints
    path(
        "user/token/",
        userauths_views.MyTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "user/register/", userauths_views.RegisterView.as_view(), name="auth_register"
    ),
    path('user/signup/', UserRegistrationView.as_view(), name='user_signup'),
    # path('user/login/', UserLoginView.as_view(), name='user_login'),

    #Orders API Endpoints
    path('orders/', OrderAPIView.as_view(), name='order-create'),

]
