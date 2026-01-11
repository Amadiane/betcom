from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, EquipeMemberViewSet




router = DefaultRouter()
router.register(r'about', AboutViewSet, basename='about')
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')


urlpatterns = [
    path("", include(router.urls)),
  

]