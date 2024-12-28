from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.generic import CreateView, DetailView, ListView
from django.utils.translation import gettext as _
from django.db.models import Q

from core.models import Country
from .forms import *


class CampaignListView(ListView):
    model = Campaign
    template_name = "campaigns/list.html"
    context_object_name = "campaigns"
    paginate_by = 12  # Show 12 campaigns per page

    def get_queryset(self):
        queryset = Campaign.objects.prefetch_related("user").order_by('-date')
        
        # Handle search
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(location__icontains=query) |
                Q(category__name__icontains=query)
            )
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_term'] = self.request.GET.get('q', '')
        return context


class CampaignCreateView(CreateView):
    model = Campaign
    form_class = CampaignForm
    template_name = "campaigns/create.html"
    success_url = "/"

    @method_decorator(login_required(login_url=reverse_lazy("accounts:login")))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(self.request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["categories"] = Category.objects.all()
        return context

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.status = "pending"
        self.object.save()
        data = {"success": True, "target": self.get_success_url()}
        return JsonResponse(data)
        # return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form):
        data = {
            "success": False,
            "errors": form.errors,
        }
        return JsonResponse(data, status=200)
        # return super(CampaignCreateView, self).form_invalid(form)

    # def get_form_kwargs(self):
    #     kwargs = super(CampaignCreateView, self).get_form_kwargs()
    #     kwargs.update({'user': self.request.user})
    #     kwargs.update({'status': 'pending'})
    #     return kwargs


class CampaignDetailView(DetailView):
    model = Campaign
    template_name = "campaigns/details.html"
    context_object_name = "campaign"
    queryset = Campaign.objects.prefetch_related("donation_set").prefetch_related(
        "user"
    )


class DonationView(CreateView):
    model = Donation
    template_name = "campaigns/make-donation.html"
    form_class = DonationForm
    pk = None
    campaign = None

    def dispatch(self, request, *args, **kwargs):
        print(self.get_form())
        self.pk = kwargs["pk"]
        return super().dispatch(self.request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(DonationView, self).get_context_data(**kwargs)
        self.campaign = Campaign.objects.prefetch_related("user").get(id=self.pk)
        context["campaign"] = self.campaign
        context["countries"] = Country.objects.all()
        return context

    def get_success_url(self):
        return reverse_lazy("campaign:campaign-detail", kwargs={"pk": self.pk})

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.date = now()
        self.object.approved = False
        self.object.campaign_id = self.pk
        self.object.save()
        data = {"success": True, "url": self.get_success_url()}
        return JsonResponse(data)

    def form_invalid(self, form):
        data = {
            "success": False,
            "errors": form.errors,
        }
        return JsonResponse(data, status=200)
