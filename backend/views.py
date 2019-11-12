import json
from django.http import HttpResponse, JsonResponse
from backend.serializers import *
from backend.models import *


def home(request):
    books = Audiobook.objects.filter(has_audio=True, language='English')
    books = books.filter(goodreads_ratings_count__isnull=False)
    books = books.exclude(title__icontains='version').exclude(title__icontains='lippincott')

    books = books.order_by('-goodreads_ratings_count', 'id')
    books = books.all()[:20]

    serialized_books = AudiobookSerializer(books, many=True)
    print(serialized_books.data)
    print(books)

    return JsonResponse(serialized_books.data, status=201, safe=False)


def get_chapters(request, book_id):
    audiobook_query = Audiobook.objects.filter(id=book_id)

    if not audiobook_query.exists():
        # TODO: Return a valid error, and log that we received a request for an audiobook that doesn't exist
        return 404
    elif audiobook_query.count() > 1:
        # TODO: Return a valid error and log that we received a request that matched more than one audiobook
        return 404

    audiobook = audiobook_query.get()  # There's only one object that matches this audiobook
    chapters = audiobook.audiobookchapter_set.all().order_by('id')  # Chapter sorting order is important

    return HttpResponse(serializers.serialize('json'), chapters, content_type='application/json')
