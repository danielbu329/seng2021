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

#Pass a param=<model.py Food field>
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
        return HttpResponse("recieved post request");
