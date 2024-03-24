const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const randomList = require('./random');
const countryJSON = require('./country.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const PORT = 8080;

const rooms = [];

function createRoomId() {
    let roomId = generateRoomId();
    rooms.push([roomId, 1]);
    return roomId;
}

function joinRoomId(roomId) {
    if (roomId === -1) {
        let availableRoomId = joinAnyRoom();
        if (availableRoomId === -1) {
            let newRoomId = createRoomId();
            return newRoomId;
        } else {
            rooms[availableRoomId][1]++;
            return availableRoomId;
        }
    } else {
        let roomIndex = rooms.findIndex(([id, count]) => id === roomId);
        if (roomIndex === -1) {
            return -1;
        }
        if (rooms[roomIndex][1] >= 2) {
            return -2;
        }
        rooms[roomIndex][1]++;
        return roomId;
    }
}

function joinAnyRoom() {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i][1] < 2) {
            return i;
        }
    }
    return -1;
}

function generateRoomId() {
  if (!rooms.length) {
    return rooms.length;
  } else {
    return rooms.length + 1;
  }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/socket.html');
});

app.get('/randomlist', (req, res) => {
    return res.send(randomList(countryJSON));
});

app.get('/createroomid', (req, res) => {
    let result = createRoomId();
    console.log(rooms);
    return res.json(result);
});

app.post('/joinroomid', (req, res) => {
    let result = joinRoomId(parseInt(req.body.id));
    console.log(rooms);
    return res.json(result);
});

io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket: ', socket.id);

  socket.on('sendmessage', (data) => {
    console.log('Message reçu:', data);

    io.emit('message', data);
  });

  socket.on('answer', (data) => {
    console.log('Réponse reçu:', data);

    socket.broadcast.emit('answer', `on a proposé ${data}`);
  });
  socket.on('disconnect', () => {
    console.log('Déconnexion socket: ', socket.id);
  });
});

function getRoomForUser(userId) {
  for (const [roomId, _] of rooms) {
      if (rooms[roomId].includes(userId)) {
          return roomId;
      }
  }
  return null;
}

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
