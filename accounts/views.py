from django.contrib import messages, auth
from django.http import HttpResponseRedirect

from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, FormView, RedirectView, UpdateView
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.mixins import LoginRequiredMixin

from core.models import Country
from .forms import *


class RegisterView(CreateView):
    model = User
    form_class = UserRegistrationForm
    template_name = 'accounts/register.html'
    success_url = '/'

    extra_context = {
        'title': 'Register'
    }

    def dispatch(self, request, *args, **kwargs):
        # print(self.get_form())
        if self.request.user.is_authenticated:
            return HttpResponseRedirect(self.get_success_url())
        return super().dispatch(self.request, *args, **kwargs)

    def get_success_url(self):
        return self.success_url

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['countries'] = Country.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        user_form = UserRegistrationForm(data=request.POST)

        if user_form.is_valid():
            user = user_form.save(commit=False)
            password = user_form.cleaned_data.get("password1")
            user.set_password(password)
            user.save()
            return redirect('accounts:login')
        else:
            return render(request, 'accounts/register.html', {'form': user_form})


class LoginView(FormView):
    success_url = '/'
    form_class = UserLoginForm
    template_name = 'accounts/login.html'

    extra_context = {
        'title': 'Login'
    }

    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            return HttpResponseRedirect(self.get_success_url())
        return super().dispatch(self.request, *args, **kwargs)

    def form_valid(self, form):
        auth.login(self.request, form.get_user())
        return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form):
        print(form.errors)
        return self.render_to_response(self.get_context_data(form=form))


class LogoutView(RedirectView):
    """
    Provides users the ability to logout
    """
    url = reverse_lazy('core:home')

    def get(self, request, *args, **kwargs):
        auth.logout(request)
        messages.success(request, 'You are now logged out')
        return super(LogoutView, self).get(request, *args, **kwargs)


class AccountSettingsView(UpdateView):
    model = User
    template_name = "accounts/account.html"
    context_object_name = "user"
    form_class = UserUpdateForm
    success_url = reverse_lazy("accounts:account")

    def dispatch(self, request, *args, **kwargs):
        print(self.request.resolver_match)
        if not self.request.user.is_authenticated:
            return HttpResponseRedirect("accounts/login")
        return super().dispatch(self.request, *args, **kwargs)

    def get_object(self, queryset=None):
        return self.request.user

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['countries'] = Country.objects.all()
        return context


class ChangePasswordView(LoginRequiredMixin, PasswordChangeView):
    template_name = 'accounts/change-password.html'
    success_url = reverse_lazy('accounts:change-password')
    
    def form_valid(self, form):
        messages.success(self.request, 'Your password was successfully updated!')
        return super().form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request, 'Please correct the errors below.')
        return super().form_invalid(form)
