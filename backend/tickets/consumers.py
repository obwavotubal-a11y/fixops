import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TicketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'tickets'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        pass # We don't need to receive messages from React right now

    # Receive message from room group (Triggered when Django saves a ticket)
    async def ticket_update(self, event):
        await self.send(text_data=json.dumps(event['message']))