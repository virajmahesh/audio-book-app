# Generated by Django 2.2.6 on 2019-11-11 06:40

from django.db import migrations
from backend.models import *


def set_image_urls(apps, schema_editor):
    for i, a in enumerate(Audiobook.objects.all()):
        print(i)

        gutenberg_book = a.gutenberg_book
        if gutenberg_book is not None:
            goodreads_book = GoodreadsBook.objects.filter(gutenberg_book_id=gutenberg_book.id).first()
        else:
            goodreads_book = None

        if goodreads_book is not None:
            a.primary_image_url = goodreads_book.get_image_URL()
            a.secondary_image_url = goodreads_book.get_ISBN_URL()
            a.save()



class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0018_auto_20191111_0626'),
    ]

    operations = [
        migrations.RunPython(set_image_urls)
    ]
