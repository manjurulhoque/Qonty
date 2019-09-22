from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.generic import CreateView

from .forms import *


class CampaignCreateView(CreateView):
    model = Campaign
    form_class = CampaignForm
    template_name = "campaigns/create.html"
    success_url = '/'

    @method_decorator(login_required(login_url=reverse_lazy('accounts:login')))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(self.request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.status = "pending"
        self.object.save()
        data = {
            'success': True,
            'target': self.get_success_url()
        }
        return JsonResponse(data)
        # return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form):
        data = {
            'success': False,
            'errors': form.errors,
        }
        return JsonResponse(data, status=200)
        # return super(CampaignCreateView, self).form_invalid(form)

    # def get_form_kwargs(self):
    #     kwargs = super(CampaignCreateView, self).get_form_kwargs()
    #     kwargs.update({'user': self.request.user})
    #     kwargs.update({'status': 'pending'})
    #     return kwargs
