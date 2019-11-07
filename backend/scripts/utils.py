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
