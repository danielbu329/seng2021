import http.client
import urllib
from json import loads as parseJson
from datetime import datetime
import re

access_token = '1633260020259993|4J_v5RbtjG8CFhnfBYsHagTlsiw'
group_id = 428460270539887
params = urllib.parse.urlencode({'access_token': access_token})

def parseTime(s):
    return datetime.strptime(s, '%Y-%m-%dT%H:%M:%S+0000')

class Facebook:
    def authorize(self, user_id, user_access_token):
        params = urllib.parse.urlencode({'access_token': user_access_token})
        req = '/me?%s' % (params)
        conn = http.client.HTTPSConnection('graph.facebook.com')
        conn.request('GET', req)
        res = conn.getresponse()

        statusCode = res.status
        json = parseJson(res.read().decode('utf-8'))
        conn.close()

        if statusCode == 200 and str(json['id']) == str(user_id):
            return str(json['id'])
        return ''

    def getFeed(self):
        params = urllib.parse.urlencode({
            'access_token': access_token,
            'fields': ','.join(['id', 'created_time', 'message', 'from', 'object_id'])
        })
        req = '/v2.4/%d/feed?%s' % (group_id, params)

        conn = http.client.HTTPSConnection('graph.facebook.com')
        conn.request('GET', req)
        res = conn.getresponse()
        json = parseJson(res.read().decode("utf-8"))
        conn.close()

        feed = []
        for i in json['data']:
            if 'message' not in i:
                continue
            feed.append({
                'post_id': i['id'],
                'time': (parseTime(i['created_time'])),
                'message': i['message'],
                'from': i['from'],
                'image': i['object_id'] if 'object_id' in i else ''
            })

        return feed

    def filterPosts(self):
        messages = self.getFeed()
        filtered = []

        foods = [line.rstrip('\n') for line in open('foods.txt')]
        locations = [line.rstrip('\n') for line in open('locations.txt')]

        for m in messages:
            post = m
            post['done'] = 0
            post['otherfoods'] = ''
            post['title'] = ''
            post['location'] = ''
            foodFound = 0
            locationFound = 0
            for f in foods:
                if f.lower() in m['message'].lower():
                    foodFound = 1
                    if (post['done'] == 0):
                        post['title'] = f
                        post['done'] = 1
                    else:
                        post['otherfoods'] += " " + f

                    for l in locations:
                        if (l.lower() in m['message'].lower() and locationFound == 0):
                            locationFound = 1;
                            post['location'] = l

            if (foodFound == 1 and locationFound == 1):
                filtered.append(post)

        return filtered

    def getImageUrl(self, object_id):
        params = urllib.parse.urlencode({ 'access_token': access_token })
        req = '/v2.4/%s/picture?%s' % (object_id, params)
        conn = http.client.HTTPSConnection('graph.facebook.com')
        conn.request('GET', req)
        res = conn.getresponse()
        return res.getheader('Location')
