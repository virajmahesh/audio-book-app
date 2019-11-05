# Generated by Django 2.2.6 on 2019-11-05 05:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0018_auto_20191105_0519'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subject',
            old_name='book',
            new_name='books',
        ),
        migrations.AlterField(
            model_name='formaturi',
            name='url',
            field=models.URLField(null=True, unique=True),
        ),
    ]
