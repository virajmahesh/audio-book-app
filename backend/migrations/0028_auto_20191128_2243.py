# Generated by Django 2.2.6 on 2019-11-28 22:43
import re
from django.db import migrations


def remove_summary_text(apps, schema_editor):
    Audiobook = apps.get_model('backend', 'Audiobook')

    for a in Audiobook.objects.all():
        desc = a.description
        m = re.search('(\(Summary(.+?)\))', desc)
        if m is not None:
            a.description = desc.replace(m.group(0), '')
            a.save()
            #print(m.group(0))
            #print(len(m.group(0)))


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0027_auto_20191117_0506'),
    ]

    operations = [
        migrations.RunPython(remove_summary_text)
    ]
