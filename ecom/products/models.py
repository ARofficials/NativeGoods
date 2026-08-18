from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

# Model for product
User = get_user_model()

class Product(models.Model):
  LIVE=1
  DELETE=0
  DELETE_CHOICES = ((LIVE,"Live"),(DELETE,"Delete"))
  pname = models.CharField(max_length=200)
  pprice = models.FloatField()
  pdesc = models.TextField()
  cmp_name = models.CharField(max_length=255, default="Default Company")
  user = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True)
  pqty = models.PositiveIntegerField(default=0)
  ppriority = models.IntegerField(default=0)
  category = models.CharField(max_length=200,default="Other")
  delete_status = models.IntegerField(choices=DELETE_CHOICES,default=LIVE)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  image = models.ImageField(upload_to='product_images/', null=True, blank=True)

  def __str__(self) -> str:
    return self.pname

