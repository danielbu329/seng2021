from django.db import models

# Create your models here.

class Food(models.Model):
    title = models.CharField(max_length=40)
    location = models.CharField(max_length=40)
    description = models.CharField("Description of Food", max_length=200)
    date = models.DateField()
    likes = models.IntegerField()
    dislikes = models.IntegerField()
    author = models.CharField(max_length=100)
    imgurl = models.CharField(max_length=100)
