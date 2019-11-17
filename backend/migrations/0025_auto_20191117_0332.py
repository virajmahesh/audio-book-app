# Generated by Django 2.2.6 on 2019-11-17 03:32

from django.db import migrations

def create_volumes(apps, schema_editor):
    Audiobook = apps.get_model('backend', 'Audiobook')
    AudiobookChapter = apps.get_model('backend', 'AudiobookChapter')
    AudiobookChapterGroup = apps.get_model('backend', 'AudiobookChapterGroup')

    for a in Audiobook.objects.all():
        has_chapter_group = (len(a.audiobookchaptergroup_set.all()) > 0)
        if has_chapter_group:
            print('{} has chapter group'.format(a.title))
            continue
        chapter_group = AudiobookChapterGroup()
        chapter_group.audiobook = a
        chapter_group.save()

        for c in a.audiobookchapter_set.all():
            c.group = chapter_group
            assert c.audiobook == c.group.audiobook
            c.save()



class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0024_auto_20191117_0046'),
    ]

    operations = [
        migrations.RunPython(create_volumes)
    ]
