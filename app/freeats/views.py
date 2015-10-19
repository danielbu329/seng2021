from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import F Sum, Count
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
            .filter(finished=False) \
            .annotate(likes=Sum('vote__like'), votes=Count('vote')) \
            .annotate(dislikes=F('votes')-F('likes')) \
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
    elif request.method == 'POST':
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
            return HttpResponse(status=201)
        return HttpResponse(status=401)
    elif request.method == 'PUT':
        if user_id:
            # User is logged in
            data = json.loads(request.body.decode('utf-8'))
            post_id = int(data['id']) if 'id' in data else 0
            title = data['title'] if 'title' in data else ''
            location = data['location'] if 'location' in data else ''
            description = data['description'] if 'description' in data else ''
            img_url = ''
            finished = data['finished'] if 'finished' in data else False
            updatingFinished = False
            if 'updatingFinished' in data:
                updatingFinished = data['updatingFinished']
            fb_user = getUserOrCreate(user_id)
            if Food.objects.filter(id=post_id, fb_user=fb_user).exists() or \
                (Food.objects.filter(id=post_id).exists() and fb_user.admin_status):
                post = Food.objects.get(id=post_id)
                if updatingFinished:
                    post.finished = finished
                else:
                    post.title = title
                    post.location = location
                    post.description = description
                    if len(img_url) > 0:
                        post.img_url = img_url
                post.save(skip_autotimestamp=True)
                return HttpResponse()
            return HttpResponse(status=401)
        return HttpResponse(status=401)
    elif request.method == 'DELETE':
        if user_id:
            # User is logged in
            post_id = request.GET.get('postId')
            fb_user = getUserOrCreate(user_id)
            if Food.objects.filter(id=post_id, fb_user=fb_user).exists() or \
                (Food.objects.filter(id=post_id).exists() and fb_user.admin_status):
                Food.objects.get(id=post_id).delete()
                return HttpResponse()
            return HttpResponse(status=400)
        return HttpResponse(status=401)

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
                return HttpResponse()
            return HttpResponse(status=400)
        return HttpResponse();

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
    return HttpResponse(status=401)

# freeats/mystats
def mystats(request):
    user_id = authenticate(request)
    if user_id:
        fb_user = getUserOrCreate(user_id)
        myfoods = Food.objects \
            .filter(fb_user=fb_user) \
            .annotate(likes=Sum('vote__like'), votes=Count('vote')) \
            .annotate(dislikes=F('votes')-F('likes'))
        stats = json.dumps({
            'admin_status': fb_user.admin_status,
            'likes': myfoods.aggregate(Sum('likes'))['likes__sum'],
            'dislikes': myfoods.aggregate(Sum('dislikes'))['dislikes__sum']
        }, cls=DjangoJSONEncoder)
        return HttpResponse(stats, content_type='application/json')
    return HttpResponse(status=401)

# freeats/allposts
def allposts(request):
    user_id = authenticate(request)
    if request.method == 'GET':
        if user_id:
            # User is logged in
            fb_user = getUserOrCreate(user_id)
            if fb_user.admin_status:
                # The '-' in -creation-time makes it sort in descending order
                posts = list(Food.objects.all().order_by('-creation_time').values())
                data = json.dumps(posts, cls=DjangoJSONEncoder)
                return HttpResponse(data, content_type='application/json')
            return HttpResponse(status=401)
        return HttpResponse(status=400)
