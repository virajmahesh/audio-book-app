import os
import csv
import click
import utils

from django.core.wsgi import get_wsgi_application

os.environ['DJANGO_SETTINGS_MODULE'] = 'audiobookapp.settings'
application = get_wsgi_application()

from audiobookapp.settings import *
from backend.models import *

'''
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
        #subject = Subject()
        #subject.book = book
        #subject.description = s
        #subject.save()
'''


def populate_authors(book, row):
    for author_name in row['author'].split(';'):
        # Check if an author already exists
        if ',' in author_name:
            sub_names = author_name.split(',')
            last_name, first_name = sub_names[1], sub_names[0]
        else:
            last_name, first_name = '', author_name

        author, _ = Author.objects.get_or_create(
            first_name=first_name,
            last_name=last_name
        )

        author.books.add(book)
        author.save()


def populate_subjects(book, row):
    for subject_desc in row['subject'].split(';'):

        subject, _ = Subject.objects.get_or_create(
            description=subject_desc
        )

        subject.books.add(book)
        subject.save()


def populate_format_URIs(book, row):
    for format_uri_url in row['formaturi'].split(';'):
        format_uri = FormatURI(url=format_uri_url)
        format_uri.book = book
        format_uri.save()


@click.command()
@click.option('--gutenberg_csv', type=str, required=True)
@click.option('--goodreads_csv', type=str, required=False)
def main(gutenberg_csv, goodreads_csv):
    gutenberg_csv_file = open(gutenberg_csv)
    gutenberg_csv = csv.DictReader(gutenberg_csv_file, fieldnames=utils.gutenberg_field_names())

    headers = next(gutenberg_csv)

    # Populate Gutenberg data
    for row in gutenberg_csv:
        title = row['title']

        if title == '' or title is None:
            continue

        # Create a new book
        book = Book()
        book.gutenberg_id = row['book_id']
        book.title = title

        book.save()

        # Populate the books authors
        populate_authors(book, row)
        populate_subjects(book, row)
        populate_format_URIs(book, row)

    # Populate Goodreads data


if __name__ == '__main__':
    main()
