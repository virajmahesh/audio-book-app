# Generated by Django 2.2.6 on 2019-10-26 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='album_art_url',
            field=models.URLField(null=True),
        ),
    ]
