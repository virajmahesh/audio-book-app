# Generated by Django 2.2.6 on 2019-10-26 21:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_auto_20191026_2127'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='books',
            new_name='book',
        ),
    ]
