# Generated by Django 2.2.6 on 2019-11-10 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_auto_20191110_2055'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='librivox_books',
            field=models.ManyToManyField(to='backend.LibriVoxBook'),
        ),
    ]
