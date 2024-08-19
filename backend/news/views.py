from django.http import JsonResponse


def test_view(request):
    return JsonResponse({"heading": "This is a test heading"})
