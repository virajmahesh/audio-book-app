from django.forms import ModelForm
from backend.models import Audiobook

class AudiobookForm(ModelForm):
    pass
    class Meta:
        model = Audiobook
        exclude = ['gutenberg_book', 'librivox_book']
