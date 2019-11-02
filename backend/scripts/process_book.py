"""
Processes a plain text file for a book from Project Gutenberg
Input: A single plain text (.txt) file
Output: Multiple MP3 files (one for every chapter)

Processing stages:
0. Download the book from Project Gutenberg servers
1. Upload book to Google Cloud storage. TODO: Add a flag to switch between local and cloud processing
2. Split book into chapters. This step also removes Project Gutenberg cruft
   such as copyright information, headers and footers, and any special characters that can't be converted to
   audio
3. Upload Chapter text to Google Cloud. Chapter file names are <Chapter #>.txt
4. Convert Chapter text to SSML. This step adds artificial pauses around commas and periods
5. Upload Chapter SSML to Google Cloud. SSML file names are <Chapter #>.ssml
6. Convert Chapter SSML to Audio using either AWS Polly or Cloud TTS
7. Store Chapter Audio in Google Cloud. This will either (1) require an upload or (2) require migrating files
   between AWS and Google Cloud or (3) Happen automatically if Cloud TTS saved the files to a Google Cloud bucket
"""

import os
import json
import requests
import random
from chapterize import Chapter

from django.core.wsgi import get_wsgi_application
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError

os.environ['DJANGO_SETTINGS_MODULE'] = 'audiobookapp.settings'
application = get_wsgi_application()

from audiobookapp.settings import *

# Debug Variables. These should eventually be over-written and not used directly.
BOOK_ID = 84

# These should eventually come from a cloud bucket
DATA_DIRECTORY = os.path.join(STATIC_ROOT, "data")
BOOK_METADATA_PATH = os.path.join(DATA_DIRECTORY, "book_metadata_complete.json")

# Google Cloud Settings
GOOGLE_CLOUD_BUCKET = 'audiobookapp'
BASE_PATH = 'books/{0}'
CHAPTER_PATH = os.path.join(BASE_PATH, 'chapters/{1}.txt')
SSML_PATH = os.path.join(BASE_PATH, 'chapters/{1}.ssml')
RECORDING_PATH = os.path.join(BASE_PATH, 'recordings/{1}.mp3')

# Google Cloud Clients
storage_client = storage.Client()
bucket = storage_client.get_bucket(GOOGLE_CLOUD_BUCKET)


def get_book_metadata(metadata_path):
    """
    Returns a dict with the metadata for every Project Gutenberg book
    :param metadata_path: Path to the JSON file that contains the metadata for every Project Gutenberg book
    :type metadata_path: str
    :return: A python dictionary with {
        key = (string) The Project Gutenberg Book ID
        value = (dictionary) with the following keys:
            - "author",
            - "formaturi"
            - "language"
            - "rights"
            - "subject"
            - "title"
    }
    :rtype: dict
    """
    with open(metadata_path, 'r') as f:
        return json.loads(f.read())


def download_gutenberg_book(book_id, book_metadata):
    """
    Downloads the text file from gutenberg servers
    :param book_id: The Project Gutenberg id of the book
    :type book_id: int
    :param book_metadata: A dict with metadata for every book
    :type book_metadata: dict

    :return: The book text
    :rtype: str or None
    """
    format_uris = book_metadata[str(book_id)]['formaturi']

    # Find the first URI that contains .txt (indicating that it's a plain text file)
    for uri in format_uris:
        if '.txt' in uri:
            response = requests.get(uri)
            response.encoding = response.apparent_encoding
            return response.text
    return None  # A URI for a plain text file couldn't be found


def upload_book(book_id, book):
    """
    Upload the raw text to the Google Cloud storage bucket
    :param book_id: The Project Gutenberg id of the book
    :type book_id: int
    :param book: The book text
    :type book: str
    :return: True if the upload succeeded
    :rtype: bool
    """
    path = os.path.join(BASE_PATH, 'book_text.txt').format(book_id)
    blob = bucket.blob(path)
    try:
        blob.upload_from_string(book, content_type='text/plain;charset=utf-8')
    except GoogleCloudError:
        return False
    return True


def get_book_chapters(book):
    """
    Converts a Project Gutenberg book into individual chapters.
    #TODO: Add tests for this method to confirm that it works on different types of books
    :param book: A string containing the book text
    :type book: str
    :return: A list of strings. Each item in the list is a chapter.
    :rtype: list
    """
    chapters = []  # List of chapters to return
    # Iterate through each chapter and join the lines together
    for c in Chapter(book).chapters:
        text = '\n'.join(c)
        chapters.append(text)
    return chapters


def upload_book_chapters(book_id, chapters):
    """
    Uploads chapters to cloud storage
    :param book_id: The Project Gutenberg id of the book
    :type book_id: int
    :param chapters: A list of chapter text strings
    :type chapters: list
    :return: True if the upload succeeded
    :rtype: bool
    """
    for idx, c in enumerate(chapters):
        blob = bucket.blob(CHAPTER_PATH.format(book_id, idx + 1))
        blob.upload_from_string(c, content_type='text/plain;charset=utf-8')
    pass


def chapter_to_ssml(chapter):
    """
    Converts a chapter to SSML. Inserts pauses between sentences and after punctuation.
    :param chapter:
    :type chapter: str
    :return: SSML text for that chapter
    """
    punctuation_breaths = {
        ',': lambda: random.random() < 0.4,
        ';': lambda: random.random() < 0.5,
        ':': lambda: random.random() < 0.6,
        '?': lambda: random.random() < 0.6,
        '.': lambda: random.random() < 0.8
    }
    punctuation_marks = ',;:.?'
    ssml = '<speak> {0} </speak>'

    chapter = chapter.replace('"', '&quot;')
    chapter = chapter.replace('&', '&amp;')
    chapter = chapter.replace("'", '&apos;')
    chapter = chapter.replace('<', '&lt;')
    chapter = chapter.replace('>', '&gt;')

    chapter_with_breaths = ''
    punctuation_idx = [i for i, s in enumerate(chapter) if s in punctuation_marks]

    # Insert breaths after punctuation to increase pauses
    start = 0
    for i in punctuation_idx:
        splice = chapter[start : i] # Everything between start and the punctuation (not including the punctuation).
        punctuation = chapter[i]
        insert_breath = punctuation_breaths[punctuation]()  # True if a breath should be inserted after this punctuation

        chapter_with_breaths += splice

        if insert_breath:
            chapter_with_breaths += '<amazon:breath />'
        start = i

    # Grab anything that's left after the last punctuation
    chapter_with_breaths +=  chapter[start:]

    return ssml.format(chapter_with_breaths)


def upload_ssml(book_id, chapter_ssml):
    """
    :param chapter_ssml: A list of strings. Each item in the list is chapter text that's been converted to SSML.
    :return: True if the upload succeeded
    """
    pass


def create_audio_files():
    pass


def upload_audio_files():
    pass


def main():
    book_id = BOOK_ID
    book_metadata = get_book_metadata(BOOK_METADATA_PATH)
    book = download_gutenberg_book(book_id, book_metadata)
    # print(book[:10000])
    #upload_book(book_id, book)  # TODO: Log success/fail for this step
    chapters = get_book_chapters(book)
    upload_book_chapters(book_id, chapters)
    print(chapters[0])


if __name__ == '__main__':
    random.seed()
    book_id = BOOK_ID
    book_metadata = get_book_metadata(BOOK_METADATA_PATH)
    book = download_gutenberg_book(book_id, book_metadata)
    # print(book[:10000])
    # upload_book(book_id, book)  # TODO: Log success/fail for this step
    chapters = get_book_chapters(book)
    # upload_book_chapters(book_id, chapters)
    print(chapter_to_ssml(chapters[0]))
