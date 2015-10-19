from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^food$', views.food, name='food'),
    url(r'^vote$', views.vote, name='vote'),
    url(r'^myposts$', views.myposts, name='myposts'),
    url(r'^mystats$', views.mystats, name='mystats'),
    url(r'^', views.index, name='index')
]
