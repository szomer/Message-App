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
        origin: "http://localhost:4000"
    }
});
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Msg from server',
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