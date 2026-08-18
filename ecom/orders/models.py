import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from products.models import Product  # Assuming you have a Product model

User = get_user_model()

class Order(models.Model):
    # Status Choices
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    # 1) Unique Order ID (auto-generated UUID)
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    
    # 2) User who placed the order
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    
    # 3) User's name (cached at time of order)
    user_name = models.CharField(max_length=100)
    
    # 4) User's phone (cached at time of order)
    user_phone = models.CharField(max_length=15)
    
    # 5) Order creation date
    created_at = models.DateTimeField(default=timezone.now)
    
    # 6) Total amount
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # 7) Items in cart (stored as JSON)
    items = models.JSONField()
    
    # 8) Order status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # 9) Delivery address
    delivery_address = models.TextField()

    def __str__(self):
        return f"Order #{self.order_id} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']