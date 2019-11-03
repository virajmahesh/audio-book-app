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

import json
import os
import random
from time import sleep

import boto3
import requests
import spacy
from django.core.wsgi import get_wsgi_application
from google.cloud import storage, texttospeech
from google.cloud.exceptions import GoogleCloudError

from chapterize import Chapter

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
CHAPTER_PATH = os.path.join(BASE_PATH, 'chapters/{1}/chapter_text.txt')
SSML_PATH = os.path.join(BASE_PATH, 'chapters/{1}/chapter_ssml.ssml')
RECORDING_PATH = os.path.join(BASE_PATH, 'chapters/{1}/chapter_recording.mp3')

# Google Cloud Clients
storage_client = storage.Client()
bucket = storage_client.get_bucket(GOOGLE_CLOUD_BUCKET)

tts_client = texttospeech.TextToSpeechClient()
british_male_voice = texttospeech.types.VoiceSelectionParams(
    language_code='en-GB',
    name='en-GB-Standard-B'
)
audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.MP3,
    effects_profile_id=['headphone-class-device']
)

# AWS TTS Client
polly_client = boto3.client('polly')

# NLP Models. Used to identify punctuation marks
nlp = spacy.load("en_core_web_sm")


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


def break_chapter_into_sections(chapter, char_limit=5000):
    """

    :param chapter:
    :type chapter: str
    :param char_limit:
    :type char_limit: int
    :return:
    :rtype: list
    """
    result = []
    section = ''
    section_char_count = 0
    for line in chapter.splitlines(keepends=True):
        line_char_count = len(line)
        if section_char_count + line_char_count > char_limit:
            result.append(section)
            section = line
            section_char_count = line_char_count
        else:
            section += line
            section_char_count += line_char_count
    result.append(section)
    return result


def chapter_to_ssml(chapter):
    """
    Converts a chapter to SSML. Inserts pauses between sentences and after punctuation.
    :param chapter:
    :type chapter: str
    :return: A list of SSML texts for that chapter
    :rtype: str
    """
    # These can be used later to add custom spacing. For now, we're using Amazon's automatic
    # breath insertion.
    punctuation_breaks = {
        '-': lambda: random.uniform(0.05, 0.20),
        ',': lambda: random.uniform(0.05, 0.20),
        ';': lambda: random.uniform(0.50, 0.70),
        ':': lambda: random.uniform(0.40, 0.60),
        '?': lambda: random.uniform(0.60, 0.90),
        '.': lambda: random.uniform(0.70, 1.00)
    }

    def get_punct_break(punct):
        """
        :param punct: The punctuation token
        :return: Returns the SSML <break> element that corresponds to the punctuation token.
        """
        if punct.text not in punctuation_breaks:
            return ''
        break_length = punctuation_breaks[punct.text]()
        return '<break time="{0}ms" />'.format(round(break_length * 1000))

    # Clean up chapter text
    chapter = chapter.replace('"', '&quot;')
    chapter = chapter.replace('&', '&amp;')
    chapter = chapter.replace("'", '&apos;')
    chapter = chapter.replace('<', '&lt;')
    chapter = chapter.replace('>', '&gt;')
    chapter = chapter.replace('_', '')

    chapter_with_ssml_pauses = ''
    nlp_chapter = nlp(chapter)

    for token in nlp_chapter:
        chapter_with_ssml_pauses += token.text_with_ws
        if token.is_punct:
            chapter_with_ssml_pauses += get_punct_break(token)

    return chapter_with_ssml_pauses


def upload_chapter_ssml(book_id, chapter_ssml_strings):
    """
    :param book_id:
    :type book_id: int
    :param chapter_ssml_strings: A list of strings. Each item in the list is chapter text that's
    been converted to SSML (without the enclosing <speak> tags)
    :type chapter_ssml_strings: list
    :return: True if the upload succeeded
    """
    for idx, s in enumerate(chapter_ssml_strings):
        blob = bucket.blob(SSML_PATH.format(book_id, idx + 1))
        blob.upload_from_string(s, content_type='text/plain;charset=utf-8')
    pass


def google_ssml_to_audio_file(ssml_sections):
    for ssml in ssml_sections:
        input_text = texttospeech.types.SynthesisInput(ssml=ssml)
        response = tts_client.synthesize_speech(input_text, british_male_voice, audio_config)

        with open('output.mp3', 'wb') as out:
            out.write(response.audio_content)
            print('Audio content written to file "output.mp3"')

        break


def ssml_to_audio_file(book_id, chapter_id, ssml_string):
    ssml_template = '<speak> ' \
                    '{0}' \
                    '</speak>'

    response = polly_client.start_speech_synthesis_task(
        Engine='neural',
        LanguageCode='en-GB',
        VoiceId='Brian',
        OutputFormat='mp3',
        TextType='ssml',
        Text=ssml_template.format(ssml_string),
        OutputS3BucketName=GOOGLE_CLOUD_BUCKET,
        OutputS3KeyPrefix=RECORDING_PATH.format(book_id, chapter_id),
    )

    while True:
        response = polly_client.list_speech_synthesis_tasks(
            Status='completed'
        )
        print(response['SynthesisTasks'])
        sleep(2)
        if response is not None and len(response['SynthesisTasks']) > 0:
            break


def upload_chapter_recordings(book_id, recordings):
    pass
    pass


def main():
    book_id = BOOK_ID
    book_metadata = get_book_metadata(BOOK_METADATA_PATH)
    book = download_gutenberg_book(book_id, book_metadata)
    # print(book[:10000])
    # upload_book(book_id, book)  # TODO: Log success/fail for this step
    chapters = get_book_chapters(book)
    upload_book_chapters(book_id, chapters)
    print(chapters[0])


if __name__ == '__main__':
    random.seed()

    # Parse book metadata and download the book from Project Gutenberg
    book_id = BOOK_ID
    book_metadata = get_book_metadata(BOOK_METADATA_PATH)
    book = download_gutenberg_book(book_id, book_metadata)

    # Break book text into Chapters
    chapters = get_book_chapters(book)
    chapter_ssml_strings = list(map(chapter_to_ssml, chapters))

    # Upload all files to Google Cloud
    upload_book(book_id, book)
    upload_book_chapters(book_id, chapters)
    upload_chapter_ssml(book_id, chapter_ssml_strings)
