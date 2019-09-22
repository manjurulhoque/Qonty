from core.models import Category


def categories(request):
    cats = Category.objects.all()[:5]
    return {'categories': cats}
