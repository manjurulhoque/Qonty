from django.urls import path

from .views import *

app_name = 'accounts'

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('setting', AccountSettingsView.as_view(), name='account'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
