from django.contrib import admin
from .models import RepairTicket, UserProfile, InventoryPart

admin.site.register(RepairTicket)
admin.site.register(UserProfile)
admin.site.register(InventoryPart)