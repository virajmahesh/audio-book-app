import os
import grequests
import json
from audiobookapp.settings import STATIC_ROOT


MAX_BOOKS = 60564
N_BOOKS = 10000

BOOK_METADATA_URL = 'https://gutenberg.justamouse.com/texts/{0}'
EXPORT_DIRECTORY = os.path.join(STATIC_ROOT, "data")
EXPORT_FILE_NAME = os.path.join(EXPORT_DIRECTORY, "book_metadata.json")


class FeedbackCounter:
    """
    Object to provide a feedback callback keeping track of total calls.
    """
    def __init__(self):
        self.counter = 0

    def feedback(self, r, **kwargs):
        self.counter += 1
        print("{0} fetched, {1} total.".format(r.url, self.counter))
        return r


def book_url(i):
    return BOOK_METADATA_URL.format(i)


def exception_handler(request, exception):
    print("Request failed", request.url)


def download_all_metadata():
    books = {}
    fbc = FeedbackCounter()

    requests = [grequests.get(book_url(i), callback=fbc.feedback) for i in range(N_BOOKS)]
    responses = grequests.map(requests, exception_handler=exception_handler)

    for i, r in enumerate(responses):
        if r is not None:
            books[i] = r.json()

    with open(EXPORT_FILE_NAME, 'w') as f:
        json.dump(books, f)

