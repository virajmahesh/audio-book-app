from django.contrib import admin
from django.urls import path, re_path, include
import backend.views as backend_views
from rest_framework_social_oauth2.views import ConvertTokenView

urlpatterns = [
    path('admin', admin.site.urls),
    path('home/', backend_views.home),
    path('home/<int:offset>', backend_views.home),
    path('book/<int:book_id>', backend_views.book),
    path('book/<int:book_id>/chapters', backend_views.get_chapters),
    path('auth/custom-social-auth', backend_views.social_auth),
    re_path(r'^auth/', include('rest_framework_social_oauth2.urls')),
]
