from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from .serializers import RoomSerializer, RoomCreateUpdateSerializer
from .models import Room

# Create your views here.


class RoomListCreateView(generics.ListCreateAPIView):

    def get_queryset(self):
        return  Room.objects.all()

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = RoomCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

    def get_serializer_class(self):
        if self.request.POST:
            return RoomCreateUpdateSerializer
        return RoomSerializer


@api_view(['GET', 'PUT', 'DELETE'])
def roomsRetreiveUpdate(request, code):
    try:
        room = Room.objects.get(code=code)
    except Room.DoesNotExist:
        return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)        

    if request.method=='GET':
        data = RoomSerializer(room).data
        data['is_host'] = request.session.session_key == room.host
        return Response(data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        if not request.session.exists(request.session.session_key):
            request.session.create()

        user_id = request.session.session_key
        if room.host != user_id:
            return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = RoomCreateUpdateSerializer(room, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    
        return Response(RoomSerializer(room).data)


@api_view(['POST'])
def joinRoom(request):

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    if not request.session.exists(request.session.session_key):
        request.session.create()

    code = body.get('code', '')

    try:
        room = Room.objects.get(code=code)
    except Room.DoesNotExist:
        return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)        

    request.session['room_code'] = code
    return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def userInRoom(request):
    if not request.session.exists(request.session.session_key):
            request.session.create()

    data = {
        'code': request.session.get('room_code')
    }
    return JsonResponse(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def leaveRoom(request):
    if 'room_code' in request.session:
        request.session.pop('room_code')
        host_id = request.session.session_key
        room = Room.objects.get(host=host_id)
        room.delete()
    return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
