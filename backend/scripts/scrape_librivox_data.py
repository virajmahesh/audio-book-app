import xmltodict
import requests
import grequests
import os
import xml
import csv
import utils

from django.core.wsgi import get_wsgi_application

os.environ['DJANGO_SETTINGS_MODULE'] = 'audiobookapp.settings'
application = get_wsgi_application()

from audiobookapp.settings import *
from backend.models import *


MAX_BOOKS = 13943
REQUEST_SIZE = 100
LIBRIVOX_URL = 'https://librivox.org/api/feed/audiobooks?url_text_source=gutenberg.org&format=json&limit={0}&offset={1}'
LIBRIVOX_CSV_PATH = 'staticfiles/data/librivox_data/librivox_gutenberg_books.csv'


def populate_recordings():
      print('Creating URLs')

      books = LibriVoxBook.objects.filter(id__lte=40664).order_by('id').all()
      urls =  [b.url_rss for b in books]

      print('Iterating through books')

      for idx, b in enumerate(books):
            print(idx, urls[idx])

            r = requests.get(urls[idx])

            try:
                rss_dict = xmltodict.parse(r.content.decode())
            except xml.parsers.expat.ExpatError as e:
                print('Error, skipping row ' + str(b.id))
                continue

            if 'item' not in rss_dict['rss']['channel']:
                continue

            items = rss_dict['rss']['channel']['item']

            if not isinstance(items, list):
                item_list = [items]
            else:
                item_list = items

            for item in item_list:
                title = item['title']
                duration = item['itunes:duration']
                url = item['media:content']['@url']

                LibriVoxRecordings.objects.create(
                    librivox_book=b,
                    title=title,
                    duration=duration,
                    url=url
                )


def populate_books():
    books = {}
    fbc = utils.grequests_feedback_function()

    requests = [grequests.get(LIBRIVOX_URL.format(REQUEST_SIZE, i), callback=utils.grequests_feedback_function()) for i in range(0, MAX_BOOKS, REQUEST_SIZE)]
    responses = grequests.map(requests)

    f = open(LIBRIVOX_CSV_PATH, 'w+')

    csv_writer = csv.DictWriter(f, fieldnames=utils.librivox_field_names(), extrasaction='ignore')
    csv_writer.writeheader()

    for i, r in enumerate(responses):
        librivox_response = r.json()

        # Iterate through each item in the response
        for j, row in enumerate(librivox_response['books']):
            print('Scraping Book {0} of Response {1}'.format(j, i))
            csv_writer.writerow(row)


def populate_authors():
    books = {}
    fbc = utils.grequests_feedback_function()

    requests = [grequests.get(LIBRIVOX_URL.format(REQUEST_SIZE, i), callback=utils.grequests_feedback_function()) for i in range(0, MAX_BOOKS, REQUEST_SIZE)]
    responses = grequests.map(requests)

    for i, r in enumerate(responses):
        librivox_response = r.json()
        for j, row in enumerate(librivox_response['books']):
            print('Proceessing Response {0} Book {1}'.format(i, j))

            authors = row['authors']
            book_search = LibriVoxBook.objects.filter(librivox_id=row['id'])

            if book_search.exists():
                book = book_search.get()
            else:
                continue

            for a in authors:
                first_name = a['first_name'].lstrip().rstrip()
                last_name = a['last_name'].lstrip().rstrip()

                author, created = Author.objects.get_or_create(
                    first_name=first_name,
                    last_name=last_name
                )

                if created:
                    print('Created new author: First Name:[{0}], Last Name: [{1}]'.format(first_name, last_name))

                author.librivox_books.add(book)
                author.save()


if __name__ == '__main__':
        populate_authors()
