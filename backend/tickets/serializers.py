from rest_framework import serializers
from .models import RepairTicket
from .models import RepairTicket, InventoryPart

class RepairTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairTicket
        fields = '__all__'

# ... keep the RepairTicketSerializer here ...

class InventoryPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryPart
        fields = '__all__'