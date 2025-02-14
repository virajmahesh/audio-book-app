# Generated by Django 2.2.6 on 2019-11-05 05:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0014_auto_20191027_0006'),
    ]

    operations = [
        migrations.CreateModel(
            name='GoodreadsBook',
            fields=[
                ('gutenberg_id', models.CharField(max_length=16, null=True)),
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('title', models.TextField(null=True)),
                ('author', models.CharField(max_length=256, null=True)),
                ('description', models.TextField(null=True)),
                ('average_rating', models.DecimalField(decimal_places=2, max_digits=3, null=True)),
                ('rating_dist', models.CharField(max_length=128, null=True)),
                ('ratings_count', models.IntegerField(null=True)),
                ('text_reviews_count', models.IntegerField(null=True)),
                ('num_pages', models.IntegerField(null=True)),
                ('publisher', models.CharField(max_length=256, null=True)),
                ('language_code', models.CharField(max_length=16, null=True)),
                ('image_url', models.URLField(null=True)),
                ('small_image_url', models.URLField(null=True)),
                ('isbn', models.CharField(max_length=10, null=True)),
                ('isbn13', models.CharField(max_length=13, null=True)),
                ('link', models.URLField(null=True)),
            ],
        ),
    ]
