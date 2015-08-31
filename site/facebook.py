import http.client
import urllib
import json

access_token = '1633260020259993|4J_v5RbtjG8CFhnfBYsHagTlsiw'
group_id = 428460270539887
params = urllib.parse.urlencode({'access_token': access_token})
class Facebook:
    def getFeed():
        req = '/v2.4/%d/feed?%s' % (group_id, params)

        conn = http.client.HTTPSConnection('graph.facebook.com')
        conn.request('GET', req)
        res = conn.getresponse()
        feed = json.loads(res.read().decode("utf-8"))
        conn.close()

        return feed['data']

