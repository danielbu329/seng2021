from facebook import Facebook
import json
import time

feed = Facebook.getFeed()

#t = parseTime(feed[0]['updated_time'])
#print(time.strftime('%a, %d %b %Y %H:%M:%S +0000', t))

def formatTime(t):
    return time.strftime('%a, %d %b %Y %H:%M:%S +0000', t)

for post in feed:
    print(formatTime(post['time']))
    print(post['post_id'])
    print(post['message'])

