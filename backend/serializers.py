from rest_framework import serializers
from backend.models import Audiobook, AudiobookChapter


class AudiobookSerializer(serializers.ModelSerializer):
    author = serializers.CharField(max_length=1024, source='get_author')

    class Meta:
        model = Audiobook
        fields = ['id', 'title', 'description', 'primary_image_url',
                  'secondary_image_url', 'author']


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudiobookChapter
        fields = ['id', 'title', 'audio_url']
