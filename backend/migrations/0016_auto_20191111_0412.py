# Generated by Django 2.2.6 on 2019-11-11 04:12

from django.db import migrations
from backend.models import *

def add_recordings(apps, schema_editor):
    for i, audiobook in enumerate(Audiobook.objects.all()):
        print(i)
        librivox_book = audiobook.librivox_book
        librivox_recordings = librivox_book.librivoxrecording_set.all().order_by('id')

        for lr in librivox_recordings:
            AudiobookChapter.objects.get_or_create(
                title=lr.title,
                duration=lr.duration,
                audio_url=lr.url,
                audiobook=audiobook
            )


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0015_auto_20191111_0016'),
    ]

    operations = [
        migrations.RunPython(add_recordings)
    ]
