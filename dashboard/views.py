from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.generic import ListView, View
from django.db.models import Sum
from django.shortcuts import render

from campaign.models import Campaign, Donation


class DashboardView(View):
    template_name = "dashboard/home.html"

    @method_decorator(login_required(login_url=reverse_lazy("accounts:login")))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(self.request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        user_campaigns = Campaign.objects.filter(user=self.request.user)

        context = {
            "active_campaigns": user_campaigns.filter(status="active").count(),
            "total_raised": Donation.objects.filter(
                campaign__user=self.request.user, approved=True
            ).aggregate(Sum("donation"))["donation__sum"]
            or 0,
            "total_donations": Donation.objects.filter(
                campaign__user=self.request.user, approved=True
            ).count(),
        }
        return context

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, self.get_context_data())


class CampaignListView(ListView):
    template_name = "dashboard/campaigns.html"
    context_object_name = "campaigns"
    paginate_by = 10

    @method_decorator(login_required(login_url=reverse_lazy("accounts:login")))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(self.request, *args, **kwargs)

    def get_queryset(self):
        return (
            Campaign.objects.filter(user=self.request.user)
            .prefetch_related("donation_set")
            .order_by("-date")
        )
