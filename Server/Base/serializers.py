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


from .models import News
class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    display_title = serializers.CharField(read_only=True)

    class Meta:
        model = News
        fields = "__all__"  # 👈 contient automatiquement is_active

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None


    @property
    def display_title(self):
        lang = self.context.get('request').LANGUAGE_CODE if self.context.get('request') else 'en'
        return self.title_fr if lang.startswith('fr') else self.title_en or self.title_fr



from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    # Retourne l'URL de l'image Cloudinary au lieu de l'objet
    cover_photo = serializers.SerializerMethodField()
    
    # Pour toutes les images facultatives, tu peux faire pareil
    image_1 = serializers.SerializerMethodField()
    image_2 = serializers.SerializerMethodField()
    # ... jusqu'à image_20 si besoin

    class Meta:
        model = Portfolio
        fields = "__all__"

    # Méthodes pour renvoyer l'URL si l'image existe
    def get_cover_photo(self, obj):
        if obj.cover_photo:
            return obj.cover_photo.url
        return None

    def get_image_1(self, obj):
        if obj.image_1:
            return obj.image_1.url
        return None

    def get_image_2(self, obj):
        if obj.image_2:
            return obj.image_2.url
        return None

    # ... idem pour image_3 à image_20

    # Les CloudinaryFields peuvent être uploadés directement en tant que fichiers

