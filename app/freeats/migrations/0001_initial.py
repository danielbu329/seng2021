# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=40)),
                ('location', models.CharField(max_length=40)),
                ('description', models.CharField(max_length=200, verbose_name=b'Description of Food')),
                ('date', models.DateField()),
                ('likes', models.IntegerField()),
                ('dislikes', models.IntegerField()),
                ('author', models.CharField(max_length=100)),
                ('imgurl', models.CharField(max_length=100)),
            ],
        ),
    ]
