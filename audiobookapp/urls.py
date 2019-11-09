from django.contrib import admin
from django.urls import path
import backend.views as backend_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home', backend_views.home),
    path('books/<int:book_id>', backend_views.get_books),
    path('books/<int:book_id>/chapters', backend_views.get_chapters),
]
