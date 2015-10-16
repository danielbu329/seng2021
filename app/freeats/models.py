from django.db import models

# Create your models here.

class Food(models.Model):
    title = models.CharField(max_length=40)
    location = models.CharField(max_length=40)
    description = models.CharField("Description of Food", max_length=400)
    date = models.DateField()
    likes = models.IntegerField()
    dislikes = models.IntegerField()
    author = models.CharField(max_length=50)
    imgurl = models.CharField(max_length=100)

class User(models.Model):
    #username = models.CharField(max_length=50)
    #password = models.CharField(max_length=50)
    #email = models.CharField(max_length=100)
    fb_user_id = models.IntegerField()
    admin_status = models.BooleanField(default=0);
