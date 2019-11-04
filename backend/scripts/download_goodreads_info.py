import csv
import click
import logging
from goodreads.client import GoodreadsClient
from process_book import *

# Initialize Goodreads Client
gr_client = GoodreadsClient(
    'nOFh8T2CUkC5sNZ1csNjQ',
    'RvXv4Y1TYGWwOkcKqkVcSxaF8lUeifvghtB0PlQo'
)

# These should eventually come from a cloud bucket
DATA_DIRECTORY = os.path.join(STATIC_ROOT, "data")
LOG_FORMAT = '%(asctime)s: %(name)s - %(levelname)s - %(message)s'
BOOK_METADATA_PATH = os.path.join(DATA_DIRECTORY, "book_metadata_complete.json")
GOODREADS_PATH = os.path.join(DATA_DIRECTORY, "goodreads_data.csv")
HEADER_PATH = os.path.join(DATA_DIRECTORY, "gutenberg_headers/{0}.txt")


def goodreads_csv_header():
    return [
        'gutenberg_id',
        'goodreads_id',
        'goodreads_title',
        'goodreads_author',
        'goodreads_description',
        'goodreads_average_rating',
        'goodreads_rating_dist',
        'goodreads_ratings_count',
        'goodreads_text_reviews_count',
        'goodreads_num_pages',
        'goodreads_publisher',
        'goodreads_language_code',
        'goodreads_image_url',
        'goodreads_small_image_url',
        'goodreads_isbn',
        'goodreads_isbn_13',
        'goodreads_link'
    ]


def goodreads_book_to_dict(book_id, b):
    return {
        'gutenberg_id': book_id,
        'goodreads_id': b.gid,
        'goodreads_title': b.title,
        'goodreads_author': b.authors[0],
        'goodreads_description': b.description,
        'goodreads_average_rating': b.average_rating,
        'goodreads_rating_dist': b.rating_dist,
        'goodreads_ratings_count': b.ratings_count,
        'goodreads_text_reviews_count': b.text_reviews_count,
        'goodreads_num_pages': b.num_pages,
        'goodreads_publisher': b.publisher,
        'goodreads_language_code': b.language_code,
        'goodreads_image_url': b.image_url,
        'goodreads_small_image_url': b.small_image_url,
        'goodreads_isbn': b.isbn,
        'goodreads_isbn_13': b.isbn13,
        'goodreads_link': b.link
    }


def file_exists(f):
    return f.tell()


@click.command()
@click.option('--start', required=True, type=int)
@click.option('--stop', required=True, type=int)
def main(start, stop):
    book_metadata = get_book_metadata(BOOK_METADATA_PATH)
    logging.basicConfig(filename='goodreads.log', filemode='w', format=LOG_FORMAT)
    logging.getLogger().setLevel(logging.DEBUG)

    with open(GOODREADS_PATH, 'a+') as f:
        csv_writer = csv.DictWriter(f, fieldnames=goodreads_csv_header())

        if not file_exists(f):
            csv_writer.writeheader()

        for book_id in range(start, stop):

            if not is_ebook(book_id, book_metadata):
                logging.debug('Skipping ID: {0}'.format(book_id))
                continue

            book_title = get_book_title(book_id, book_metadata)

            try:
                gr_search_result = gr_client.search_books(q=book_title)
            except TypeError:
                logging.error('Skipping ID: {0} because Goodreads API failed'.format(book_id))
                continue

            logging.debug('Found {0} results'.format(len(gr_search_result)))

            if len(gr_search_result) == 0:
                continue

            top_result = gr_search_result[0]
            csv_writer.writerow(goodreads_book_to_dict(book_id, top_result))
            f.flush()

    logging.shutdown()


if __name__ == '__main__':
    main()