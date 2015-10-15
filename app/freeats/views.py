from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
import json
from .models import Food

def index(request):
    return render(request, 'freeats/index.html', {})

def createpost(request):
	return render(request, 'freeats/createpost.html', {})

def test(request):
	return render(request, 'freeats/test.html', {})

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
            foods = Food.objects.all()
            foodData = serializers.serialize('json', foods)
        return HttpResponse(foodData, content_type='application/json')
    if request.method == "POST":
        titleEntry = request.POST.get('title')
        locEntry = request.POST.get('location')
        descrEntry = request.POST.get('description')
        dateEntry = request.POST.get('date')
        likeEntry = request.POST.get('likes')
        dislikeEntry = request.POST.get('dislikes')
        authEntry = request.POST.get('author')
        urlEntry = request.POST.get('imgurl')
        new_entry = Food(title=titleEntry,location=locEntry,description=descrEntry,date=dateEntry,likes=likeEntry,dislikes=dislikeEntry,author=authEntry,imgurl=urlEntry)
        new_entry.save()
        return HttpResponse("saved request");






