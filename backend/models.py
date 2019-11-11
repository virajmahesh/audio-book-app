import re
from django.db import models


class PrintableObject:
    def __repr__(self):
        return ''

    def __str__(self):
        return repr(self)


class GutenbergBook(PrintableObject, models.Model):
    gutenberg_id = models.CharField(max_length=16, unique=True)
    title = models.CharField(max_length=1024, null=True)

    def text_url(self):
        for uri in self.formaturi_set.all():
            if uri.is_text_url():
                return uri.url
        return None

    def __repr__(self):
        string = 'Text URL: {0}\n'.format(self.text_url())
        return Book.__repr__(self) + string

    def authors(self):
        author_set = self.author_set.all()
        return ', '.join(map(str, author_set))

    @staticmethod
    def book_type():
        return 'Gutenberg Book'

    class Meta:
        db_table = 'gutenberg_book'


class FormatURI(models.Model):
    book = models.ForeignKey(GutenbergBook, on_delete=models.SET_NULL, null=True)
    url = models.URLField(null=True, unique=True, max_length=1024)

    class Meta:
        db_table = "format_uri"

    def is_text_url(self):
        return '.txt' in self.url


class GoodreadsBook(models.Model):
    gutenberg_book = models.OneToOneField(GutenbergBook, on_delete=models.SET_NULL, null=True)
    goodreads_id = models.CharField(max_length=64, null=False)
    gutenberg_id = models.CharField(max_length=16, null=True)

    title = models.TextField(null=True)
    author = models.CharField(max_length=256, null=True)
    description = models.TextField(null=True)

    average_rating = models.DecimalField(null=True, decimal_places=2, max_digits=3)
    rating_dist = models.CharField(max_length=128, null=True)
    ratings_count = models.IntegerField(null=True)
    text_reviews_count = models.IntegerField(null=True)

    num_pages = models.IntegerField(null=True)
    publisher = models.CharField(max_length=256, null=True)
    language_code = models.CharField(max_length=16, null=True)

    link = models.URLField(null=True, max_length=1024)
    image_url = models.URLField(null=True, max_length=1024)
    small_image_url = models.URLField(null=True, max_length=1024)

    isbn = models.CharField(max_length=32, null=True)
    isbn13 = models.CharField(max_length=32, null=True)

    class Meta:
        db_table = 'goodreads_book'

    @staticmethod
    def top_books():
        """
        Returns the books with the most ratings.
        """
        return GoodreadsBook.objects.order_by('-ratings_count')

    def authors(self):
        return self.author

    def is_authored_by(self, author):
        return author.full_name().lower() == self.author.lower()

    def get_image_URL(self):
        return re.sub('._(SX|SY)(\d+)_.', '.', self.image_url)

    def get_ISBN_URL(self):
        isbn = self.isbn13
        if self.isbn13 is None:
            isbn = self.isbn
        return 'http://covers.openlibrary.org/b/isbn/{0}-L.jpg'.format(isbn)


class LibriVoxBook(PrintableObject, models.Model):
    librivox_id = models.CharField(null=True, max_length=32, unique=True)
    gutenberg_id = models.CharField(null=True, max_length=32)

    title = models.CharField(null=True, max_length=1024)
    description = models.TextField()

    language = models.CharField(null=True, max_length=32)
    copyright_year = models.CharField(null=True, max_length=4)
    num_sections = models.IntegerField(null=True)

    url_text_source = models.URLField(max_length=4096)
    url_rss = models.URLField(null=True, max_length=4096)
    url_zip_file = models.URLField(null=True, max_length=4096)

    totaltime = models.CharField(null=True, max_length=32)
    totaltimesecs = models.IntegerField()

    class Meta:
        db_table = 'librivox_book'

    @staticmethod
    def book_type():
        return 'Librivox Book'

    def text_url(self):
        return self.url_text_source

    def audio_url(self):
        return self.url_zip_file

    def authors(self):
        author_set = self.author_set.all()
        return ', '.join(map(str, author_set))


class LibriVoxRecording(models.Model):
    librivox_book = models.ForeignKey(LibriVoxBook, on_delete=models.SET_NULL, null=True)
    librivox_id = models.CharField(null=True, max_length=32)

    title = models.TextField(null=True)
    duration = models.CharField(null=True, max_length=32)
    url = models.URLField(null=True, max_length=4096)

    class Meta:
        db_table = 'librivox_recording'


class Audiobook(PrintableObject, models.Model):
    gutenberg_book = models.ForeignKey(GutenbergBook, null=True, on_delete=models.SET_NULL)
    librivox_book = models.OneToOneField(LibriVoxBook, null=True, on_delete=models.SET_NULL)

    title = models.CharField(max_length=1024, null=True)
    description = models.TextField(null=True)

    text_url = models.URLField(max_length=4096, null=True)
    audio_url = models.URLField(max_length=4096, null=True)
    primary_image_url = models.URLField(max_length=4096, null=True)
    secondary_image_url = models.URLField(max_length=4096, null=True)

    language = models.CharField(max_length=32, null=True)
    has_audio = models.BooleanField(null=True)

    goodreads_ratings_count = models.IntegerField(null=True)

    @staticmethod
    def book_type():
        return 'Audiobook'

    def authors(self):
        print('Audiobook author called')
        author_set = self.author_set.all()
        return ', '.join(map(str, author_set))

    class Meta:
        db_table = 'audiobook'
        unique_together = ['gutenberg_book', 'librivox_book']


class AudiobookChapter(models.Model):
    title = models.TextField(null=True)
    duration = models.CharField(null=True, max_length=32)
    audio_url = models.URLField(null=True, max_length=4096)

    audiobook = models.ForeignKey(Audiobook, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'audiobook_chapter'


class Subject(models.Model):
    gutenberg_books = models.ManyToManyField(GutenbergBook)
    description = models.TextField(null=True, unique=True)

    class Meta:
        db_table = "subject"


class Author(models.Model):
    first_name = models.CharField(max_length=256, null=True)
    last_name = models.CharField(max_length=256, null=True)

    gutenberg_books = models.ManyToManyField(GutenbergBook)
    librivox_books = models.ManyToManyField(LibriVoxBook)
    audio_books = models.ManyToManyField(Audiobook)

    class Meta:
        db_table = "author"
        unique_together = ['first_name', 'last_name']

    def full_name(self):
        return self.first_name + ' ' + self.last_name

    @staticmethod
    def find_by_full_name(first_name, last_name):
        return Author.objects.filter(first_name__exact=first_name, last_name__exact=last_name)
