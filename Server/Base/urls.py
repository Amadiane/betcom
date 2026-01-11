from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, EquipeMemberViewSet, ServiceViewSet




router = DefaultRouter()
router.register(r'about', AboutViewSet, basename='about')
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r"services", ServiceViewSet, basename="services")


urlpatterns = [
    path("", include(router.urls)),
  

]