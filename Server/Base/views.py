from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import About
from .serializers import AboutSerializer


@method_decorator(csrf_exempt, name='dispatch')
class AboutViewSet(viewsets.ModelViewSet):
    """
    CRUD complet pour la section About
    """
    queryset = About.objects.all()
    serializer_class = AboutSerializer

    def get_permissions(self):
        """
        DEV :
        - Lecture publique
        - Création / modification / suppression autorisées
        PROD :
        - Remplacer AllowAny par IsAdminUser
        """
        return [AllowAny()]

        # 🔐 Version PROD (à activer plus tard)
        # if self.action in ['list', 'retrieve']:
        #     return [AllowAny()]
        # return [IsAdminUser()]

    def list(self, request, *args, **kwargs):
        """
        GET /api/about/
        """
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        GET /api/about/{id}/
        """
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        POST /api/about/
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        PUT /api/about/{id}/
        """
        serializer = self.get_serializer(
            self.get_object(),
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        PATCH /api/about/{id}/
        """
        serializer = self.get_serializer(
            self.get_object(),
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        DELETE /api/about/{id}/
        """
        self.get_object().delete()
        return Response(
            {"detail": "Contenu About supprimé avec succès"},
            status=status.HTTP_204_NO_CONTENT
        )




from rest_framework import viewsets
from .models import EquipeMember
from .serializers import EquipeMemberSerializer

class EquipeMemberViewSet(viewsets.ModelViewSet):
    queryset = EquipeMember.objects.all()
    serializer_class = EquipeMemberSerializer