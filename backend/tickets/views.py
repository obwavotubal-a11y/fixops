from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from .models import RepairTicket, InventoryPart
from .serializers import RepairTicketSerializer, InventoryPartSerializer

# 1. View for the main dashboard
class RepairTicketViewSet(viewsets.ModelViewSet):
    serializer_class = RepairTicketSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'profile') and user.profile.role == 'CUSTOMER':
            return RepairTicket.objects.filter(customer_user=user).order_by('-created_at')
        return RepairTicket.objects.all().order_by('-created_at')

# 2. View for Inventory
class InventoryPartViewSet(viewsets.ModelViewSet):
    queryset = InventoryPart.objects.all().order_by('name')
    serializer_class = InventoryPartSerializer

# 3. View for the Customer Tracking Portal
@api_view(['GET'])
def track_ticket(request):
    ticket_number = request.query_params.get('ticket_number', '').strip()
    pin = request.query_params.get('pin', '').strip()

    if not ticket_number.startswith('#'):
        ticket_number = f"#{ticket_number}"

    try:
        ticket = RepairTicket.objects.get(ticket_number=ticket_number, customer_pin=pin)
        return Response({
            'ticket_number': ticket.ticket_number,
            'device_name': ticket.device_name,
            'status': ticket.status,
            'issue_description': ticket.issue_description,
            'priority': ticket.priority,
            'assigned_tech': ticket.assigned_tech,
            'final_cost': ticket.final_cost,
        })
    except RepairTicket.DoesNotExist:
        return Response({'error': 'Ticket not found or PIN incorrect'}, status=404)

# 4. Custom Login View
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.profile.role
        data['username'] = self.user.username
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# 5. Customer Registration
@api_view(['POST'])
def register_customer(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    user.profile.role = 'CUSTOMER'
    user.profile.save()

    return Response({'message': 'Customer registered successfully'}, status=status.HTTP_201_CREATED)

# 6. Custom Password Reset Confirmation
@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    try:
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid link'}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Invalid or expired token'}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({'message': 'Password reset successful'}, status=200)