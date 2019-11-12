from rest_framework import serializers
from backend.models import Audiobook


class AudiobookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audiobook
        fields = ['id', 'title', 'description', 'primary_image_url', 'secondary_image_url', ]
