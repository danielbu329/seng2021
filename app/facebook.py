import http.client
import urllib
from json import loads as parseJson
import time
import re

access_token = '1633260020259993|4J_v5RbtjG8CFhnfBYsHagTlsiw'
group_id = 428460270539887
params = urllib.parse.urlencode({'access_token': access_token})

def parseTime(s):
    return time.strptime(s, '%Y-%m-%dT%H:%M:%S+0000')

class Facebook:
    def getFeed(self):
        req = '/v2.4/%d/feed?%s' % (group_id, params)

        conn = http.client.HTTPSConnection('graph.facebook.com')
        conn.request('GET', req)
        res = conn.getresponse()
        json = parseJson(res.read().decode("utf-8"))
        conn.close()

        feed = []
        for i in json['data']:
            if 'id' not in i or 'updated_time' not in i or 'message' not in i:
                continue
            feed.append({
                'post_id': i['id'],
                'time': parseTime(i['updated_time']),
                'message': i['message']
            })

        return feed

f = Facebook()
messages = f.getFeed()
filtered = []

foods = [line.rstrip('\n') for line in open('foods.txt')]

for m in messages:
    for f in foods:
        if f in m['message']:
            filtered.append({
                'post_id': m['post_id'],
                'time': m['time'],
                'message': m['message']
            })

for i in filtered:
    print (i, "\n")

