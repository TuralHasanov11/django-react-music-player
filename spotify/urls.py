from django.urls import path
from .views import AuthURL, CurrentSong, SkipSong, SpotifyIsAuthenticated, spotify_callback, PauseSong, PlaySong

app_name='spotify'

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', SpotifyIsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('skip', SkipSong.as_view())
]