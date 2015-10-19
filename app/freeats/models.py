from django.db import models
from datetime import datetime

# Create your models here.

class Food(models.Model):
    title = models.CharField(max_length=40)
    location = models.CharField(max_length=40)
    description = models.CharField(max_length=400, default='')
    creation_time = models.DateTimeField()
    fb_user = models.ForeignKey('User')
    fb_post_id = models.CharField(max_length=60, default=None, unique=True, null=True)
    img_url = models.CharField(max_length=250)
    finished = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not kwargs.pop('skip_autotimestamp', False):
            self.creation_time = datetime.now()
        super(Food, self).save(*args, **kwargs)

class User(models.Model):
    fb_user_id = models.CharField(max_length=50)
    admin_status = models.BooleanField(default=False);

class Vote(models.Model):
    fb_user = models.ForeignKey('User')
    food = models.ForeignKey('Food')
    like = models.IntegerField()
