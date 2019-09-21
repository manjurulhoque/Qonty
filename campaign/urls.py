from django.urls import path

from .views import *

app_name = 'campaign'

urlpatterns = [
    path('create', CampaignCreateView.as_view(), name='campaign-create'),
]
