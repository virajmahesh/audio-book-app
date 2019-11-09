# Generated by Django 2.2.6 on 2019-11-09 20:49
from django.utils.html import strip_tags
from django.db import migrations


def clean_description(apps, schema_editor):
    GoodreadsBook = apps.get_model('backend', 'GoodreadsBook')
    for idx, book in enumerate(GoodreadsBook.objects.all()):
        print(idx)
        book.description = strip_tags(book.description).lstrip().rstrip()
        book.save()


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0026_auto_20191109_0823'),
    ]

    operations = [
        migrations.RunPython(clean_description)
    ]
