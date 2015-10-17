import threading
from time import sleep
from freeats.facebook import Facebook
from freeats.utils import getUserOrCreate
from freeats.models import Food, User

def collectFromFacebook():
    print("Collecting from Facebook...")
    posts = Facebook().filterPosts()
    for i in posts:
        if not Food.objects.filter(fb_post_id=i['post_id']).exists():
            title = i['title'].title() if len(i['title']) > 0 else i['message'][:10]
            fb_user = getUserOrCreate(i['from']['id'])
            image = Facebook().getImageUrl(i['image'])
            food = Food(title=title, location=i['location'],
                        description=i['message'], creation_time=i['time'],
                        fb_user=fb_user, fb_post_id=i['post_id'], img_url=image)
            food.save(skip_autotimestamp=True)
    sleep(30)
    collectFromFacebook()

def collector():
    thread = threading.Thread(target=collectFromFacebook)
    thread.start()
