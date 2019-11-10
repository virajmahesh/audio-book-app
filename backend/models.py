from django.db import models


class Book(models.Model):
    gutenberg_id = models.CharField(max_length=16, unique=True)
    title = models.CharField(max_length=1024, null=True)
    description = models.TextField(null=True)
    album_art_url = models.URLField(null=True)

    class Meta:
        db_table = "book"

    def __repr__(self):
        author_set = self.author_set.all()
        authors = ', '.join(map(str, author_set))
        string = "Book\n----\n" \
                 "Title: {0}\n" \
                 "Author(s): {1}\n"
        return string.format(self.title, authors)

    def __str__(self):
        return repr(self)


class GoodreadsBook(models.Model):
    book = models.OneToOneField(Book, on_delete=models.SET_NULL, null=True, unique=True)
    goodreads_id = models.CharField(max_length=64, null=False)

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
        '''
        Returns the books with the most ratings.
        '''
        return GoodreadsBook.objects.order_by('-ratings_count')

    def is_authored_by(self, author):
        return author.full_name() == self.author


class LibriVoxBook(models.Model):
        librivox_id = models.CharField(null=True, max_length=32, unique=True)
        gutenberg_id = models.CharField(null=True, max_length=32)

        title = models.CharField(null=True, max_length=1024)
        description = models.TextField()

        language = models.CharField(null=True, max_length=32)
        copyright_year = models.CharField(null=True, max_length=4)
        num_sections = models.IntegerField(null=True)

        url_text_source = models.URLField(max_length=4096)
        url_rss =  models.URLField(null=True, max_length=4096)
        url_zip_file = models.URLField(null=True, max_length=4096)

        totaltime = models.CharField(null=True, max_length=32)
        totaltimesecs = models.IntegerField()

        class Meta:
            db_table = 'librivox_book'


class LibriVoxRecordings(models.Model):
    librivox_book = models.ForeignKey(LibriVoxBook, on_delete=models.SET_NULL, null=True)
    title = models.TextField(null=True)
    duration = models.CharField(null=True, max_length=32)
    url = models.URLField(null=True, max_length=4096)

    class Meta:
        db_table = 'librivox_recording'


class Subject(models.Model):
    books = models.ManyToManyField(Book)
    description = models.TextField(null=True, unique=True)

    class Meta:
        db_table = "subject"


class FormatURI(models.Model):
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    url = models.URLField(null=True, unique=True, max_length=1024)

    class Meta:
        db_table = "format_uri"


class Author(models.Model):
    first_name = models.CharField(max_length=256, null=True)
    last_name = models.CharField(max_length=256, null=True)

    books = models.ManyToManyField(Book)
    description = models.TextField(null=True)

    class Meta:
        db_table = "author"
        unique_together = ['first_name', 'last_name']

    def __repr__(self):
        return '{0} {1}'.format(self.first_name.lstrip(), self.last_name.rstrip())

    def __str__(self):
        return repr(self)

    def full_name(self):
        return repr(self)

    @staticmethod
    def find_by_full_name(first_name, last_name):
        return Author.objects.filter(first_name__exact=first_name, last_name__exact=last_name)


class Chapter(models.Model):
    number = models.IntegerField(null=True)
    title = models.CharField(max_length=1024, null=True)
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    url = models.URLField(null=True, max_length=1024)

    class Meta:
        db_table = "chapter"


class AudioRecording(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True)
    length_seconds = models.IntegerField(null=True)
    url = models.URLField(null=True, max_length=1024)

    class Meta:
        db_table = "audio_recording"
