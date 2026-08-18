from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import add_product

urlpatterns = [
    path("add-product/", add_product, name="add_product"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)