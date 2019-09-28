from core.models import Category


def categories(request):
    cats = Category.objects.prefetch_related("campaign_set").all()[:5]
    return {'categories': cats}
