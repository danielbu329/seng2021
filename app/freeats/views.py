from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Sum, Count
import json
from .models import Food, User, Vote
from .utils import *

def index(request):
    return render(request, 'freeats/index.html', {})

# freeats/food 
# GET returns json
# POST uses same variable names as model, gets each entry
# then inserts it into to the database
def food(request):
    user_id = authenticate(request)
    if request.method == 'GET':
        # The '-' in -creation-time makes it sort in descending order
        foods = list(Food.objects \
            .annotate(likes=Sum('vote__like'), votes=Count('vote')) \
            .order_by('-creation_time') \
            .values())
        if user_id:
            # User is logged in
            fb_user = getUserOrCreate(user_id)
            for i in foods:
                if Vote.objects.filter(food=i['id'], fb_user=fb_user).exists():
                    vote = Vote.objects.get(food=i['id'], fb_user=fb_user).like
                    i['vote'] = 'up' if vote == 1 else 'down'
        foodData = json.dumps(foods, cls=DjangoJSONEncoder)
        return HttpResponse(foodData, content_type='application/json')
    if request.method == 'POST':
        if user_id:
            # User is logged in
            data = json.loads(request.body.decode('utf-8'))
            title = data['title'] if 'title' in data else ''
            location = data['location'] if 'location' in data else ''
            description = data['description'] if 'description' in data else ''
            img_url = ''
            fb_user = getUserOrCreate(user_id)
            new_food = Food(
                    title=title, location=location, description=description,
                    fb_user=fb_user, img_url=img_url)
            new_food.save()
        return HttpResponse("saved request");

# freeats/vote
# POST
def vote(request):
    user_id = authenticate(request)
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        postId = data['postId'] if 'postId' in data else None
        vote = data['vote'] if 'vote' in data else None
        like = 0
        if vote == 'up':
            like = 1
        if user_id:
            # User is logged in
            fb_user = getUserOrCreate(user_id)
            if postId != None and Food.objects.filter(id=postId).exists():
                food = Food.objects.get(id=postId)
                vote = None
                if Vote.objects.filter(fb_user=fb_user, food=food).exists():
                    vote = Vote.objects.get(fb_user=fb_user, food=food)
                    vote.like = like
                else:
                    vote = Vote(fb_user=fb_user, food=food, like=like)
                vote.save()
        return HttpResponse("saved vote");

# freeats/myposts
def myposts(request):
    user_id = authenticate(request)
    if user_id:
        fb_user = getUserOrCreate(user_id)
        # The '-' in -creation-time makes it sort in descending order
        foods = Food.objects \
            .filter(fb_user=fb_user.id) \
            .order_by('-creation_time') \
            .values()
        foodData = json.dumps(list(foods), cls=DjangoJSONEncoder)
    return HttpResponse(foodData, content_type='application/json')
