from django.db import models


class Country(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name
