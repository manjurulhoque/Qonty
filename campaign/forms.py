from django import forms
from .models import *


class CampaignForm(forms.ModelForm):
    class Meta:
        model = Campaign
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        self.status = kwargs.pop('status', None)
        print(self.user)
        super(CampaignForm, self).__init__(*args, **kwargs)

    def clean_user(self):
        return self.user

    def clean_status(self):
        return self.status
