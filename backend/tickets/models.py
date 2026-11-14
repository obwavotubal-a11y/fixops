from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class RepairTicket(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('AWAITING_PARTS', 'Awaiting Parts'),
        ('COMPLETED', 'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]

    # Basic Info
    ticket_number = models.CharField(max_length=20, unique=True, editable=False)
    customer_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    customer_name = models.CharField(max_length=100)
    customer_pin = models.CharField(max_length=4, default='0000')
    device_name = models.CharField(max_length=100)
    issue_description = models.TextField()
    
    # Status & Priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    # Assignment & Costs
    assigned_tech = models.CharField(max_length=100, blank=True, null=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            last_ticket = RepairTicket.objects.all().order_by('id').last()
            if last_ticket and last_ticket.ticket_number:
                last_num = int(last_ticket.ticket_number.split('#')[-1])
                self.ticket_number = f"#{last_num + 1}"
            else:
                self.ticket_number = "#1001"
        
        super().save(*args, **kwargs)

        channel_layer = get_channel_layer()
        ticket_data = {
            'id': self.id,
            'ticket_number': self.ticket_number,
            'customer_name': self.customer_name,
            'customer_pin': self.customer_pin,
            'device_name': self.device_name,
            'issue_description': self.issue_description,
            'status': self.status,
            'priority': self.priority,
            'assigned_tech': self.assigned_tech,
            'estimated_cost': str(self.estimated_cost),
            'final_cost': str(self.final_cost),
        }
        
        async_to_sync(channel_layer.group_send)(
            'tickets',
            {
                'type': 'ticket_update',
                'message': ticket_data
            }
        )

    def __str__(self):
        return f"{self.ticket_number} - {self.device_name}"


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('MANAGER', 'Manager'),
        ('TECH', 'Technician'),
        ('RECEPTIONIST', 'Receptionist'),
        ('CUSTOMER', 'Customer'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='TECH')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


class InventoryPart(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    stock_quantity = models.IntegerField(default=0)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.stock_quantity} in stock)"