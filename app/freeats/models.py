from django.db import models

# Create your models here.

class Food(models.Model):
    title = models.CharField(max_length=40)
    location = models.CharField(max_length=40)
    description = models.CharField("Description of Food", max_length=400)
    creation_time = models.DateTimeField(auto_now_add=True)
    fb_user = models.ForeignKey('User')
    img_url = models.CharField(max_length=100)

class User(models.Model):
    fb_user_id = models.CharField(max_length=50)
    admin_status = models.BooleanField(default=0);

class Vote(models.Model):
    fb_user = models.ForeignKey('User')
    food = models.ForeignKey('Food')
    like = models.IntegerField()
