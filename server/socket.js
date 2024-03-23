const express = require('express');
const http = require('http');
const core = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const randomList = require('./random');
const countryJSON = require('./country.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(core());

var room = [];

const PORT = 8080;

function createRoomId() {
  if (!room.length) {
    room.push([0, 1]);
  } else {
    room.push([(room[room.length - 1][0] + 1), 1]);
  }
  return room[room.length - 1][0];
};


function joinRoomId(id) {

    if (!room.length) {
      room.push([0, 1]);
    } else {
      for (let i = 0; i < room.length ; i++) {
        if (room[i][1] == 1) {
          room[i][1] =  2;
          console.log(room);
          return room[i][0];
        }
      }
      room.push([room[room.length - 1][0] + 1, 1]);
    }
    console.log(room);
    return room[room.length - 1];
};

// function joinRoomId(id) {

//   console.log("id de join:" + id);
//   if (id === -1 || !id) {
//     console.log("first")
//     if (!room.length) {
//       room.push([0, 1]);
//     } else {
//       for (let i = 0; i < room.length ; i++) {
//         if (room[i][1] == 1) {
//           room[i][1] =  2;
//           console.log(room);
//           return room[i][0];
//         }
//       }
//       room.push([room[room.length - 1][0] + 1, 1]);
//     }
//     console.log(room);
//     return room[room.length - 1];
//   } else {
//     console.log("second")
//     if (room[id]) {
//       room[id][1] = 2;
//       console.log(room);
//       return room[id][0];
//     } else
//       return -1;
//   }
// };

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socket.html');
});

app.get('/randomlist', (req, res) => {
   return res.send(randomList(countryJSON));
});

app.get('/createroomid', (req, res) => {
  return res.json(createRoomId());
});

app.post('/joinroomid', (req, res) => {
  return res.json(joinRoomId(req.body.id));
});

io.on('connection', (socket) => {
  let id = 0
  console.log('a user connected');

  socket.on('join', async ({ username, roomId }) => {
    id = await joinRoomId(roomId)[0];
    socket.join(id);

    io.to(id).emit('chat message', `${username} joined the room`);

    const usersInRoom = room[id][1];
    io.to(socket.id).emit('users in room', usersInRoom);

    //if (usersInRoom.length >= 2) {
      io.to(id).emit('ready to chat');
    //}
  });

  socket.on('chat message', (msg) => {
    const userRoom = getRoomForUser(socket.id);
    if (userRoom) {
      io.to(userRoom).emit('chat message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    room.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        io.to(roomId).emit('chat message', `User left the room`);
      }
    });
  });
});

function getRoomForUser(userId) {
  for (let i = 0; i < room.length; i++) {
    if (room[i].has(userId)) {
      return i;
    }
  }
  return null;
}
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
