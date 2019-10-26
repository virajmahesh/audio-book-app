from django.db import models


class Book(models.Model):
    gutenberg_id = models.IntegerField(null=True)
    title = models.CharField(max_length=1024, null=True)
    isbn = models.CharField(max_length=13, null=True)
    published_year = models.CharField(max_length=4, null=True)
    description = models.TextField(null=True)
    album_art_url = models.URLField(null=True)

    class Meta:
        db_table = "book"


class Author(models.Model):
    first_name = models.CharField(max_length=256, null=True)
    last_name = models.CharField(max_length=256, null=True)
    books = models.ManyToManyField(Book)
    description = models.TextField(null=True)
    wikipedia_url = models.URLField(null=True)

    class Meta:
        db_table = "author"


class Chapter(models.Model):
    chapter_title = models.CharField(max_length=1024, null=True)
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    url = models.URLField(null=True)

    class Meta:
        db_table = "chapter"


class AudioRecording(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True)
    length_seconds = models.IntegerField(null=True)
    url = models.URLField(null=True)

    class Meta:
        db_table = "audio_recording"
