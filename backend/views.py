import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from backend.serializers import *
from backend.models import *
from backend.forms import *


def home(request):
    books = Audiobook.objects.filter(has_audio=True, language='English')
    books = books.filter(goodreads_ratings_count__isnull=False)
    books = books.exclude(title__icontains='version')
    books = books.exclude(title__icontains='dramatic')
    books = books.exclude(title__icontains='abridged')
    books = books.exclude(hidden=True)

    books = books.order_by('-goodreads_ratings_count', 'id')
    books = books.all()[:90]

    serialized_books = AudiobookSerializer(books, many=True)
    return JsonResponse(serialized_books.data, status=201, safe=False)


def book(request, book_id):
    if request.method == 'POST':
        book = Audiobook.objects.filter(id=book_id).get()
        form = AudiobookForm(request.POST, instance=book)

        if form.is_valid():
            form.save()
            return redirect('/book/{}'.format(book.id))
        else:
            return 'Invalid form'
    elif book_id is None:
        form = AudiobookForm()
        return render(request, 'audiobook.html', {'form': form})
    else:
        book = Audiobook.objects.filter(id=book_id).get()
        form = AudiobookForm(instance=book)
        return render(request, 'audiobook.html', {'form': form, 'id': book.id})


def get_chapters(request, book_id):
    audiobook_query = Audiobook.objects.filter(id=book_id)

    if not audiobook_query.exists():
        # TODO: Return a valid error, and log that we received a request for an audiobook that doesn't exist
        return HttpResponse(status=404)
    elif audiobook_query.count() > 1:
        # TODO: Return a valid error and log that we received a request that matched more than one audiobook
        return HttpResponse(status=404)

    audiobook = audiobook_query.get()  # There's only one object that matches this audiobook
    chapter_groups = audiobook.audiobookchaptergroup_set.all().order_by('id')  # Chapter sorting order is important

    serialized_chapters = ChapterGroupSerializer(chapter_groups, many=True)
    return JsonResponse(serialized_chapters.data, status=201, safe=False)
