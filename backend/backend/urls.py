from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from tickets.views import (
    RepairTicketViewSet, 
    track_ticket, 
    CustomTokenObtainPairView, 
    register_customer, 
    confirm_password_reset,
    InventoryPartViewSet
)

router = DefaultRouter()
router.register(r'tickets', RepairTicketViewSet, basename='tickets')
router.register(r'inventory', InventoryPartViewSet, basename='inventory')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/track/', track_ticket, name='track_ticket'),
    
    # Auth Routes
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_customer, name='register_customer'),
    
    # Password Reset Routes
    path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    
    # Custom React Reset Endpoint
    path('api/reset/confirm/', confirm_password_reset, name='confirm_password_reset'),
]