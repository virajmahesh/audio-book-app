# Generated by Django 2.2.6 on 2019-11-10 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0029_librivoxbook_librivoxrecordings'),
    ]

    operations = [
        migrations.AddField(
            model_name='librivoxbook',
            name='gutenberg_id',
            field=models.CharField(max_length=32, null=True),
        ),
        migrations.AddField(
            model_name='librivoxbook',
            name='url_rss',
            field=models.URLField(max_length=1024, null=True),
        ),
    ]
