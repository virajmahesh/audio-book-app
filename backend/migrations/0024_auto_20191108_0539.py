# Generated by Django 2.2.6 on 2019-11-08 05:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0023_auto_20191108_0532'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goodreadsbook',
            name='book',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='backend.Book', unique=True),
        ),
    ]
