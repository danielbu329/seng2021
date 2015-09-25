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

def food(request):
    if request.method == "GET":
        foods = Food.objects.all()
        foodData = serializers.serialize('json', foods)
        return HttpResponse(foodData, content_type='application/json')
