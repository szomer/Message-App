// Modules
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require('cors');

// Controllers
const dbController = require('./controllers/dbController');

// Models

// ENV 
const PORT = process.env.PORT || 3001;

// App
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../message-app/build')));

// Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// Middleware that checks the username
io.use((socket, next) => {
  const username = socket.handshake.auth.userName;
  if (!username) return next(new Error('invalid username'));
  socket.username = username;
  next();
});
io.on('connection', (socket) => {
  // New connection with unique id
  console.log(`⚡: user [${socket.username}] just connected!`);

  // Send all connected users to client
  let users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
  socket.broadcast.emit("users", users);

  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // Disconnect user
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter((user) => user.socketID !== socket.id);
    socket.emit("users", users);
    socket.broadcast.emit("users", users);
    socket.disconnect();
  });
});


// Routes
var backendRouter = require('./routes/backend');
var frontendRouter = require('./routes/frontend');
app.use('/api/', backendRouter);
app.use('/', frontendRouter);

// Database
dbController(app);

// Listen on port
http.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));