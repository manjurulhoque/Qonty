from django.urls import path

from .views import *

app_name = 'dashboard'

urlpatterns = [
    path('campaigns', CampaignDashboardListView.as_view(), name='user-campaign-dashboard'),
]
