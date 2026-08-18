from django.urls import path
from . import views

urlpatterns = [
    path('home/',views.home,name='home'),
    path('category/',views.category,name='category'),
    path('profile/',views.profile,name='profile'),
    path('update-profile/', views.update_profile, name='update_profile'),
    path('remove-profile-picture/', views.remove_profile_picture, name='remove_profile_picture'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('product/<int:product_id>/review/', views.submit_review, name='submit_review'),
    path('review/delete/<int:review_id>/', views.delete_review, name='delete_review'),
    path('product/<int:product_id>/review/delete/', views.delete_review_by_product, name='delete_review_by_product'),
    path('contact/', views.contact, name='contact'),
    path('terms/', views.terms, name='terms'),
    path('about/', views.about, name='about'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path("delete_product/<int:product_id>/", views.delete_product, name="delete_product"),
    path('faq/', views.faq, name='faq'),
]
#The product_id is a dynamic parameter that will be passed to the product_detail view.