from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^createpost$', views.createpost, name='createpost'),
    url(r'^test$', views.test, name='test'),
    #url(r'^food$', views.food, name='food')
]
