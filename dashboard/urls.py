from django.urls import path

from .views import DashboardView, CampaignListView

app_name = 'dashboard'

urlpatterns = [
    path('', DashboardView.as_view(), name='home'),
    path('campaigns', CampaignListView.as_view(), name='campaigns'),
]
