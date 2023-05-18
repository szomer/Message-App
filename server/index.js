// Modules
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require('cors');
const dbController = require('./controllers/dbController');

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

// Crypto
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

// Session
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();


// Middleware that checks the username
io.use(async (socket, next) => {
  // Exisitng session
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.userName;
  if (!username) return next(new Error('invalid username'));
  // New session
  // Generate random session and user id
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  // persistent session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true
  });
  // Send session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch all existing users
  let users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected
    })
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true
  });

  // forward the private message to the recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.userID,
    });
  });

  // Disconnect user
  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      socket.broadcast.emit("user disconnected", socket.userID);
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false
      });
    };
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