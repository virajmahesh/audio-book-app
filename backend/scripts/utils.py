"""
Utility functions and variables.
"""

import csv
import json


def gutenberg_field_names():
    return ['book_id', 'author', 'formaturi', 'language', 'rights', 'subject', 'title']


def goodreads_field_names():
    return ['idx', 'gutenberg_id', 'goodreads_id', 'title', 'author', 'description', 'average_rating',
            'rating_dist', 'ratings_count', 'text_reviews_count', 'num_pages', 'publisher', 'language_code',
            'image_url', 'small_image_url', 'isbn', 'isbn13', 'link']


def librivox_field_names():
    return ['id', 'title', 'description', 'url_text_source',
            'language', 'copyright_year', 'num_sections', 'url_rss',
            'url_zip_file', 'totaltime', 'totaltimesecs']


def str_to_int(x):
    return int(float(x)) if x != '' and x is not None else None


def str_to_float(x):
    return float(x) if x != '' and x is not None else None


def grequests_feedback_function():
    """
    Creates a new feedback counter object to track which URLs have been requested
    and returns the feedback function of this object.
    """

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

    return FeedbackCounter().feedback


def grequests_exception_handler(request, exception):
    print("Request failed", request.url)


def gutenberg_meta_json_to_csv(input_file_path, output_file_path):
    input_file = open(input_file_path, 'r')
    gutenberg_json = json.loads(input_file.read())

    output_file = open(output_file_path, 'w')
    csv_file = csv.DictWriter(output_file, fieldnames=gutenberg_field_names())
    csv_file.writeheader()

    for book_id in gutenberg_json:
        row = {'book_id': book_id}
        for field in gutenberg_field_names()[1:]:
            value = ';'.join(gutenberg_json[book_id][field])
            row[field] = value
        csv_file.writerow(row)
