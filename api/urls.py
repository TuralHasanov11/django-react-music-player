from django.urls import path
from .views import RoomListCreateView, leaveRoom, roomsRetreiveUpdate, joinRoom, roomsRetreiveUpdate, userInRoom

app_name='api'

urlpatterns = [
    path('join-room', joinRoom),
    path('user-in-room', userInRoom),
    path('leave-room', leaveRoom),
    path('rooms', RoomListCreateView.as_view()),
    path('rooms/<str:code>', roomsRetreiveUpdate),
]
