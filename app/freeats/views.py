from django.shortcuts import render

def index(request):
    return render(request, 'freeats/index.html', {})

def createpost(request):
	return render(request, 'freeats/createpost.html', {})