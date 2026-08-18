from django.urls import path
from . import views

urlpatterns = [
  path('cart/',views.cart,name='cart'),
  path('userdetails/',views.userdetails,name='userdetails'),
  path('payment/',views.payment,name='payment'),
  path('update-cart/', views.update_cart, name='update_cart'),
  path('clear-cart/', views.clear_cart, name='clear_cart'),
  path('create_order/', views.create_order, name='create_order'),
]