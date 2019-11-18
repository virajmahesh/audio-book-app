from rest_framework import serializers
from backend.models import *


class AudiobookSerializer(serializers.ModelSerializer):
    author = serializers.CharField(max_length=1024, source='get_author')

    class Meta:
        model = Audiobook
        fields = ['id', 'title', 'description', 'primary_image_url',
                  'secondary_image_url', 'author', 'isbn', 'isbn13']


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudiobookChapter
        fields = ['id', 'title', 'audio_url']

class ChapterGroupSerializer(serializers.ModelSerializer):
    chapters = serializers.SerializerMethodField()

    def get_chapters(self, obj):
        print(obj)
        chapters = obj.audiobookchapter_set.all().order_by('id')
        return ChapterSerializer(chapters, many=True, context=self.context).data

    class Meta:
        model = AudiobookChapterGroup
        fields = ['id', 'title', 'chapters']
