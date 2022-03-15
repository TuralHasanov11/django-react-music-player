from django.urls import path
from .views import index

app_name='frontend'

urlpatterns = [
    path('', index, name='index'),
    path('join', index, name='join'),
    path('rooms/create', index, name='create'),
    path('join/<room>', index, name='join-room'),
    path('rooms/<str:code>', index, name='room'),
]
