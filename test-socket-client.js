import { io } from 'socket.io-client';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzZiN2M2NTFiNjEyYjcxZGI0OWY3YyIsImVtYWlsIjoiSm9obkBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTc0ODQyOTc4MSwiZXhwIjoxNzQ5MDM0NTgxfQ.FX_147NWy21ML8cBlJM_aej2J5HM3Sz3nqFMwgw9K_4'; // shortened for readability

const socket = io('http://localhost:4000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('Connected to socket server');

  // Join a club (replace with actual club ID)
  const clubId = '6836b14debddec95117f75f3'; // Replace with real clubId
  socket.emit('joinClub', clubId);
});

socket.on('joinedClub', (clubId) => {
  console.log('Joined club:', clubId);

  socket.emit('send_message', {
    clubId,
    text: 'Hello from client!',
    bookReference: null,
      replyTo: "parentMessageId",  // add this for replies

  });
});

socket.on('newMessege', (messege) => {
  console.log('New message received:', messege);
});

socket.on('messegeEdited', (edited) => {
  console.log('Message edited:', edited);
});

socket.on('messegeDeleted', ({ messegeId }) => {
  console.log('Message deleted:', messegeId);
});

socket.on('error', (err) => {
  console.error('Error from server:', err);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
