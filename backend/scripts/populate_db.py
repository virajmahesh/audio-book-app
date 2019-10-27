import os
import json
from django.core.wsgi import get_wsgi_application

os.environ['DJANGO_SETTINGS_MODULE'] = 'audiobookapp.settings'
application = get_wsgi_application()

from audiobookapp.settings import *
from backend.models import *

MAX_BOOKS = 60564
BOOKS = 10000
FRANKENSTEIN_BOOK_INDEX = "84"

BOOK_METADATA_URL = 'https://gutenberg.justamouse.com/texts/{0}'
EXPORT_DIRECTORY = os.path.join(STATIC_ROOT, "data")
EXPORT_FILE_NAME = os.path.join(EXPORT_DIRECTORY, "book_metadata_complete.json")

CHAPTERS = 4
S3_BUCKET_BASE_URL_RECORDING = 'https://audio-book-recordings.s3-us-west-2.amazonaws.com/{0}/{1}.mp3'
S3_BUCKET_BASE_URL_TEXT = 'https://audio-book-text.s3-us-west-2.amazonaws.com/{0}/{1}.txt'

books = {}
with open(EXPORT_FILE_NAME, 'r') as f:
    books = json.load(f)


def populate_book(idx):
    metadata = books[str(idx)]
    book = Book()

    book.title = metadata['title'][0]
    book.gutenberg_id = str(idx)
    book.save()

    # Populate Authors
    for a in metadata['author']:
        last_name, first_name = a.split(', ')
        author = Author()
        author.first_name = first_name
        author.last_name = last_name
        author.save()

        author.books.add(book)
        author.save()

    # Populate Format URIs
    for uri in metadata['formaturi']:
        format_uri = FormatURI()
        format_uri.book = book
        format_uri.url = uri
        format_uri.save()

    # Create subjects
    for s in metadata['subject']:
        subject = Subject()
        subject.book = book
        subject.description = s
        subject.save()

    for i in range(CHAPTERS):
        chapter = Chapter()
        chapter.number = i + 1
        chapter.title = "Letter {0}".format(i + 1)
        chapter.url = S3_BUCKET_BASE_URL_TEXT.format(idx, i + 1)
        chapter.book = book
        chapter.save()

        recording = AudioRecording()
        recording.chapter = chapter
        recording.url = S3_BUCKET_BASE_URL_RECORDING.format(idx, i + 1)
        recording.save()


populate_book(FRANKENSTEIN_BOOK_INDEX)
