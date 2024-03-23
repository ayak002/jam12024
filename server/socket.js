const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socket.html');
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', ({ username, room }) => {
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }

    socket.join(room);
    rooms.get(room).add(socket.id);

    io.to(room).emit('chat message', `${username} joined the room`);

    const usersInRoom = Array.from(rooms.get(room));
    io.to(socket.id).emit('users in room', usersInRoom);

    if (usersInRoom.length >= 2) {
      io.to(room).emit('ready to chat');
    }
  });

  socket.on('chat message', (msg) => {
    const userRoom = getRoomForUser(socket.id);
    if (userRoom) {
      io.to(userRoom).emit('chat message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    rooms.forEach((users, room) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        io.to(room).emit('chat message', `User left the room`);
      }
    });
  });
});

function getRoomForUser(userId) {
  for (const [room, users] of rooms.entries()) {
    if (users.has(userId)) {
      return room;
    }
  }
  return null;
}

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
