from django.db import models


class Book(models.Model):
    gutenberg_id = models.CharField(max_length=16, null=True)
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


class Subject(models.Model):
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    description = models.TextField(null=True)

    class Meta:
        db_table = "subject"


class FormatURI(models.Model):
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    url = models.URLField(null=True)

    class Meta:
        db_table = "format_uri"


class Author(models.Model):
    first_name = models.CharField(max_length=256, null=True)
    last_name = models.CharField(max_length=256, null=True)
    books = models.ManyToManyField(Book)
    description = models.TextField(null=True)
    wikipedia_url = models.URLField(null=True)

    class Meta:
        db_table = "author"

    def __repr__(self):
        return "{0} {1}".format(self.first_name, self.last_name)

    def __str__(self):
        return repr(self)

    def full_name(self):
        return repr(self)


class Chapter(models.Model):
    number = models.IntegerField(null=True)
    title = models.CharField(max_length=1024, null=True)
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    url = models.URLField(null=True)

    class Meta:
        db_table = "chapter"


class AudioRecording(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True)
    length_seconds = models.IntegerField(null=True)
    url = models.URLField(null=True)

    class Meta:
        db_table = "audio_recording"
