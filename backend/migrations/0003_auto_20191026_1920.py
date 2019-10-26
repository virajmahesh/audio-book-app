# Generated by Django 2.2.6 on 2019-10-26 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_book_album_art_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='isbn',
        ),
        migrations.AlterField(
            model_name='book',
            name='gutenberg_id',
            field=models.CharField(max_length=16, null=True),
        ),
    ]
