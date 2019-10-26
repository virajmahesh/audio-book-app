import os
from django.core.wsgi import get_wsgi_application

os.environ['DJANGO_SETTINGS_MODULE'] = 'audiobookapp.settings'
application = get_wsgi_application()

import json
from audiobookapp.settings import *
from backend.models import *

MAX_BOOKS = 60564
N_BOOKS = 10000
FRANKENSTEIN_BOOK_INDEX = "84"

BOOK_METADATA_URL = 'https://gutenberg.justamouse.com/texts/{0}'
EXPORT_DIRECTORY = os.path.join(STATIC_ROOT, "data")
EXPORT_FILE_NAME = os.path.join(EXPORT_DIRECTORY, "book_metadata_complete.json")

books = {}
with open(EXPORT_FILE_NAME, 'r') as f:
    books = json.load(f)


def populate_book(idx):
    metadata = books[str(idx)]
    book = Book()

    book.title = metadata['title'][0]
    book.gutenberg_id = str(idx)
    book.save()

    # Get Authors
    for a in metadata['author']:
        print(a)
        last_name, first_name = a.split(', ')
        author = Author()
        author.first_name = first_name
        author.last_name = last_name
        author.save()

        author.books.add(book)
        author.save()

    # Get Format URIs
    for uri in metadata['formaturi']:
        print(uri)
        format_uri = FormatURI()
        format_uri.book = book
        format_uri.url = uri
        format_uri.save()

    # Get Subject
    for s in metadata['subject']:
        print(s)
        subject = Subject()
        subject.book = book
        subject.description = s
        subject.save()

    print(metadata)
    print(book)

populate_book(FRANKENSTEIN_BOOK_INDEX)


