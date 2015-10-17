from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Sum, Count
import json
from .models import Food, User, Vote
from .facebook import Facebook

def index(request):
    return render(request, 'freeats/index.html', {})

# freeats/food 
# GET returns json
# Can GET a specific post id using paramter post=<integer>, or no paramter
#   to get entire list of food
# POST uses same variable names as model, gets each entry
# then inserts it into to the database
def food(request):
    if request.method == "GET":
        param = request.GET.get('post','')
        foodData = "";
        if (param != ""):
            try:
                value = int(param)
                print(value)
                if Food.objects.filter(id=value).exists():
                    foodData = Food.objects.get(id=value)
            except ValueError:
                print(param)
                if Food.objects.filter(title=param).exists():
                    foodData = Food.objects.get(title=param)
        else:
            # The '-' in -creation-time makes it sort in descending order
            foods = Food.objects \
                .annotate(likes=Sum('vote__like'), votes=Count('vote')) \
                .order_by('-creation_time') \
                .values()
            foodData = json.dumps(list(foods), cls=DjangoJSONEncoder)
        return HttpResponse(foodData, content_type='application/json')
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        title = data['title'] if 'title' in data else ''
        location = data['location'] if 'location' in data else ''
        description = data['description'] if 'description' in data else ''
        likes = 0
        dislikes = 0
        f = Facebook()
        user_id = f.authorize(data['user_id'], data['access_token'])
        fb_user = None
        if User.objects.filter(fb_user_id=user_id).exists():
            fb_user = User.objects.get(fb_user_id=user_id)
        else:
            fb_user = User(fb_user_id=user_id)
            fb_user.save()
        img_url = ''
        new_food = Food(
                title=title, location=location, description=description,
                fb_user=fb_user, img_url=img_url)
        new_food.save()
        return HttpResponse("saved request");

# freeats/vote
# POST
def vote(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        postId = data['postId'] if 'postId' in data else None
        vote = data['vote'] if 'vote' in data else None
        if vote == 'up':
            vote = 1
        elif vote == 'down':
            vote = 0
        else:
            vote = 0
        f = Facebook()
        user_id = f.authorize(data['user_id'], data['access_token'])
        fb_user = None
        if User.objects.filter(fb_user_id=user_id).exists():
            fb_user = User.objects.get(fb_user_id=user_id)
        else:
            fb_user = User(fb_user_id=user_id)
            fb_user.save()
        if postId != None and Food.objects.filter(id=postId).exists():
            food = Food.objects.get(id=postId)
            v = None
            if Vote.objects.filter(fb_user=fb_user, food=food).exists():
                v = Vote.objects.get(fb_user=fb_user, food=food)
                v.like = vote
            else:
                v = Vote(fb_user=fb_user, food=food, like=vote)
            v.save()
        return HttpResponse("saved vote");
