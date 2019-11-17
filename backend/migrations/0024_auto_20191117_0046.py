# Generated by Django 2.2.6 on 2019-11-17 00:46

from django.db import migrations
from django.utils.html import strip_tags

def clean_text_fields(apps, schema_editor):
    Audiobook = apps.get_model('backend', 'Audiobook')
    AudiobookChapter = apps.get_model('backend', 'AudiobookChapter')
    Author = apps.get_model('backend', 'Author')

    print('Cleaning Audiobook data')
    for i, a in enumerate(Audiobook.objects.all()):
        print(i)
        a.title = strip_tags(a.title.lstrip().rstrip())
        a.audio_url = a.audio_url.lstrip().rstrip()
        a.description = strip_tags(a.description.lstrip().rstrip().replace('\n', ''))
        a.save()

    print('Cleaning Chapters')
    for i, c in enumerate(AudiobookChapter.objects.all()):
        print(i)
        if c.title is not None:
            c.title = strip_tags(c.title.lstrip().rstrip())
        c.save()

    print('Cleaning Authors')
    for i, a in enumerate(Author.objects.all()):
        print(i)
        a.first_name = strip_tags(a.first_name.lstrip().rstrip())
        a.last_name = strip_tags(a.last_name.lstrip().rstrip())
        a.save()


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0023_audiobook_hidden'),
    ]

    operations = [
        migrations.RunPython(clean_text_fields)
    ]
