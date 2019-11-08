from django.contrib import admin
from django.urls import path
import backend.views as backend_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/home', backend_views.get_books_home),
    path('books/<int:book_id>', backend_views.get_books),
    path('books/<int:book_id>/chapters', backend_views.get_chapters),
]
