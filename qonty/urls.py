from django.contrib import admin
from django.urls import path, include

from qonty import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('campaign/', include('campaign.urls')),
    path('', include('core.urls')),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += path('__debug__/', include(debug_toolbar.urls)),