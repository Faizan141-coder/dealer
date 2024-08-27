from django.db import models

# Create your models here.


# myapp/models.py
from django.db import models

# from invoice.models import Invoice
from userauths.models import User

import uuid
from django.utils.timezone import now


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Ready to Pickup', 'Ready to Pickup'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=20, unique=True, blank=True)
    # invoice = models.OneToOneField('Invoice', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)

    def generate_order_number(self):
        import uuid
        return str(uuid.uuid4()).split('-')[0].upper()

    def __str__(self):
        return f"Order {self.order_number}"


class Load(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='loads')
    quantity = models.PositiveIntegerField()
    address = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Load {self.id} for Order {self.order.order_number}"


class OrderImage(models.Model):
    title = models.CharField(max_length=255, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='images', blank=True, null=True)
    image = models.ImageField(upload_to='images/order/%Y/%d/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.title:
            self.title = self.generate_image_title()
        super().save(*args, **kwargs)

    def generate_image_title(self):
        unique_identifier = str(uuid.uuid4()).split('-')[0].upper()
        if self.order:
            return f"Image for Order {self.order.order_number} - {unique_identifier}"
        else:
            timestamp = now().strftime('%Y%m%d%H%M%S')
            return f"Untitled Image - {timestamp}"

    def __str__(self):
        return f"Image for Order {self.order.order_number}" if self.order else "Image without Order"
