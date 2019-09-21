from django.contrib.auth.models import AbstractUser
from django.db import models

from core.models import Country


class User(AbstractUser):
    username = models.CharField(
        'username',
        max_length=50,
        unique=True,
        help_text='Required. 50 characters or fewer. Letters, digits and @/./+/-/_ only.',
        error_messages={
            'unique': "A user with this username already exists.",
        },
    )
    email = models.EmailField(unique=True, blank=False,
                              error_messages={
                                  'unique': "A user with this email already exists.",
                              })
    status = models.CharField(max_length=20, default='active')
    avatar = models.CharField(max_length=30, default="default.jpg")
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __unicode__(self):
        return self.email
