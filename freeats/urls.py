"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from . import views

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    url(r'^django/admin', include(admin.site.urls)),
    url(r'^food$', views.food, name='food'),
    url(r'^vote$', views.vote, name='vote'),
    url(r'^myposts$', views.myposts, name='myposts'),
    url(r'^mystats$', views.mystats, name='mystats'),
    url(r'^allposts$', views.allposts, name='allposts'),
    url(r'^', views.index, name='index')
]

urlpatterns += staticfiles_urlpatterns()
