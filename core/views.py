from django.db.models import Q, Sum
from django.shortcuts import render
from django.views.generic import ListView, DetailView

from accounts.models import User
from campaign.models import Campaign, Donation
from core.models import Category


class HomeView(ListView):
    model = Campaign
    template_name = "home.html"
    context_object_name = "campaigns"
    queryset = Campaign.objects.prefetch_related("user").all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_campaigns'] = Campaign.objects.filter(status="pending").count()
        context['fund_raised'] = Donation.objects.aggregate(Sum("donation"))
        context['members'] = User.objects.count()
        return context


class CategoryListView(ListView):
    model = Category
    template_name = "categories.html"
    context_object_name = "categories"
    queryset = Category.objects.prefetch_related('campaign_set').all()


class CampaignsByCategoryView(DetailView):
    model = Category
    template_name = "campaigns/campaigns-by-category.html"
    context_object_name = 'category'
    object = None
