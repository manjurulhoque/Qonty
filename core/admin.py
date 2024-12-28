from django.contrib import admin

from .models import Category, Country


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "image")


admin.site.register(Category, CategoryAdmin)
admin.site.register(Country)
