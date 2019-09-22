from django.shortcuts import render
from django.views.generic import ListView, DetailView

from campaign.models import Campaign
from core.models import Category


class HomeView(ListView):
    model = Campaign
    template_name = "home.html"
    context_object_name = "campaigns"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()[:4]
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
