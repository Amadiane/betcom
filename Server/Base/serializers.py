from rest_framework import serializers
from .models import About
from rest_framework import serializers
from .models import About

class AboutSerializer(serializers.ModelSerializer):
    # Transformation des CloudinaryField en URL pour React
    historique_image_url = serializers.SerializerMethodField()
    vision_image_url = serializers.SerializerMethodField()
    organisation_image_url = serializers.SerializerMethodField()
    direction_image_url = serializers.SerializerMethodField()

    class Meta:
        model = About
        fields = '__all__'  # garde tous les champs du modèle

    # Méthodes pour générer les URLs
    def get_historique_image_url(self, obj):
        if obj.historique_image:
            return obj.historique_image.url
        return None

    def get_vision_image_url(self, obj):
        if obj.vision_image:
            return obj.vision_image.url
        return None

    def get_organisation_image_url(self, obj):
        if obj.organisation_image:
            return obj.organisation_image.url
        return None

    def get_direction_image_url(self, obj):
        if obj.direction_image:
            return obj.direction_image.url
        return None









from rest_framework import serializers
from .models import EquipeMember


class EquipeMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    display_position = serializers.CharField(read_only=True)

    class Meta:
        model = EquipeMember
        fields = "__all__"

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None

from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'title_fr',
            'title_en',
            'description_fr',
            'description_en',
            'image',
            'is_active',
            'created_at',
            'updated_at'
        ]
