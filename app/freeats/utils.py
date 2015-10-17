from .models import User
import json
from .facebook import Facebook

def authenticate(request):
    user_id = None
    access_token = None
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        access_token = request.GET.get('access_token')
    elif request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        if 'user_id' in data:
            user_id = data['user_id']
        if 'access_token' in data:
            access_token = data['access_token']
    user_id = Facebook().authorize(user_id, access_token)
    if len(user_id) > 0:
        return user_id
    else:
        return False

def getUserOrCreate(user_id):
    fb_user = None
    if User.objects.filter(fb_user_id=user_id).exists():
        fb_user = User.objects.get(fb_user_id=user_id)
    else:
        fb_user = User(fb_user_id=user_id)
        fb_user.save()
    assert fb_user != None and type(fb_user) is User
    return fb_user
