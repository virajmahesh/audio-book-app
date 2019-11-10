import xmltodict
import requests
import grequests
import csv
import utils

MAX_BOOKS = 13943
REQUEST_SIZE = 100
LIBRIVOX_URL = 'https://librivox.org/api/feed/audiobooks?url_text_source=gutenberg.org&format=json&limit={0}&offset={1}'
LIBRIVOX_CSV_PATH = 'staticfiles/data/librivox_data/librivox_gutenberg_books.csv'



if __name__ == '__main__':
        books = {}
        fbc = util.FeedbackCounter()

        requests = [grequests.get(LIBRIVOX_URL.format(REQUEST_SIZE, i), callback=utils.grequests_feedback_function()) for i in range(0, MAX_BOOKS, REQUEST_SIZE)]
        responses = grequests.map(requests, exception_handler=exception_handler)

        f = open(LIBRIVOX_CSV_PATH, 'w+')

        csv_writer = csv.DictWriter(f, fieldnames=utils.librivox_field_names(), extrasaction='ignore')
        csv_writer.writeheader()

        for i, r in enumerate(responses):
            librivox_response = r.json()

            # Iterate through each item in the response
            for j, row in enumerate(librivox_response['books']):
                print('Scraping Book {0} of Response {1}'.format(j, i))
                csv_writer.writerow(row)
