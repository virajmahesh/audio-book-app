import xmltodict
import requests
import grequests
import csv
import utils

RSS_URL = 'https://librivox.org/rss/47'


def get_recording_URLs(rss_URL):
    pass


if __name__ == '__main__':
    urls = [RSS_URL, RSS_URL]

    requests = [grequests.get(u) for u in urls]
    responses = grequests.map(requests)

    for r in responses:
         rss_dict = xmltodict.parse(r.content.decode())
         items = rss_dict['rss']['channel']['item']

         for item in items:
             title = item['title']
             link = item['media:content']['@url']
             duration = item['itunes:duration']

             print(title)
             print(link)
             print(duration)
