from django.conf.urls.static import static
from django.urls import path, include

from qonty import settings
from .views import *

app_name = "core"

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('categories', CategoryListView.as_view(), name="categories"),
    path('campaigns-by-category/<int:pk>', CampaignsByCategoryView.as_view(), name="campaigns-by-category"),
    path('how-it-works/', HowItWorksView.as_view(), name='how-it-works'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
