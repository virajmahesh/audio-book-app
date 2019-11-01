"""
Processes a plain text file for a book from Project Gutenberg
Input: A single plain text (.txt) file
Output: Multiple MP3 files (one for every chapter)

Processing stages:
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


def upload_book(book_id, book):
    """
    Upload the raw text to the Google Cloud storage bucket
    :param book_id: The Project Gutenberg id of the book
    :param book: The book text
    :return: True if the upload succeeded
    """
    pass


def get_book_chapters(book):
    """
    Converts a Project Gutenberg book into individual chapters.
    #TODO: Add tests for this method to confirm that it works on different types of books
    :param book: A string containing the book text
    :return: A list of strings. Each item in the list is a chapter.
    """
    pass


def upload_book_chapters(book_id, chapter_text_list):
    """

    :param chapter_text_list: A list of chapter text strings
    :return: True if the ipload succeeded
    """
    pass


def chapter_to_ssml(chapter, comma_pause, colon_pause, semi_colon_pause, period_pause):
    """
    Converts a chapter to SSML. Inserts pauses between sentences and after punctuation.
    :param chapter:
    :return: SSML text for that chapter
    """
    pass


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
