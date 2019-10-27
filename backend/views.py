import json
from django.http import HttpResponse
from backend.models import *


def get_books(request, book_id=None):
    if book_id is None:
        books = Book.objects.all()
    else:
        books = Book.objects.filter(gutenberg_id=book_id)
    response = []
    for b in books:
        authors = list(b.author_set.all())
        response.append(
            {
                'id': b.gutenberg_id,
                'title': b.title,
                'author_ids': [a.id for a in authors],
                'author_names': [a.full_name() for a in authors]
            }
        )
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_chapters(request, book_id):
    book = Book.objects.filter(gutenberg_id=book_id)
    if book is None:
        pass
        #TODO: Raise and log an error. Track what % of requests result in an error
    elif book.count() != 1:
        pass
        #TODO: Log when we get more or less than 1 book in response

    book = book.get()
    chapters = book.chapter_set.order_by('number').all()
    response = []
    for c in chapters:
        recordings = list(c.audiorecording_set.all())
        response.append(
            {
                'id': c.number,
                'title': c.title,
                'text_url': c.url,
                'audio_urls': [r.url for r in recordings]
            }
        )
    return HttpResponse(json.dumps(response), content_type='application/json')
