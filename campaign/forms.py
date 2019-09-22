from django import forms
from .models import *


class CampaignForm(forms.ModelForm):
    class Meta:
        model = Campaign
        exclude = ('user', 'status')

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        self.status = kwargs.pop('status', None)
        super(CampaignForm, self).__init__(*args, **kwargs)
        self.fields['deadline'].input_formats = ['%d-%m-%Y']

    def clean_user(self):
        return self.user

    def clean_status(self):
        return self.status
