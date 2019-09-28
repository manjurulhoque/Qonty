from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.generic import ListView

from campaign.models import Campaign


class CampaignDashboardListView(ListView):
    template_name = "dashboard/campaign-dashboard.html"
    context_object_name = "campaigns"

    @method_decorator(login_required(login_url=reverse_lazy('accounts:login')))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(self.request, *args, **kwargs)

    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)
