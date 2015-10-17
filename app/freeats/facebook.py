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
                'time': (parseTime(i['updated_time'])),
                'message': i['message']
            })

        return feed

    def filterPosts():
        f = Facebook()
        messages = f.getFeed()
        filtered = []

        foods = [line.rstrip('\n') for line in open('foods.txt')]
        locations = [line.rstrip('\n') for line in open('locations.txt')]

        for m in messages:
            new = ({
                'done': 0,
                'otherfoods': '',
                'post_id': '',
                'mainfoodtype': '',
                'time': '',
                'location': ''
            });
            found = 0
            for f in foods:
                if f.lower() in m['message'].lower():
                    found = 1
                    new['post_id'] = m['post_id']
                    new['time'] = m['time']

                    if (new['done'] == 0):
                        new['mainfoodtype'] = f   
                        new['done'] = 1               
                    else:
                        new['otherfoods'] += " " + f

                    for l in locations:
                        if l.lower() in m['message'].lower():
                            new['location'] = l
                    
            if found == 1:
                filtered.append(new)


        for i in filtered:
            print ("----------------")
            print ("Food Type: ", i['mainfoodtype'])
            print ("Other Food Types: ", i['otherfoods'])
            print ("Time Posted:", i['time'])
            print ("Post ID:", i['post_id'])
            print ("Location:", i['location'])

        return filtered

    def printAll():
        f = Facebook()
        messages = f.getFeed()
        for m in messages:
            print (m['message'], "\n")

#filterPosts()
#print ("--------------------------------------\n")
#printAll()

