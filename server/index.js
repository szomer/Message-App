// Modules
require("dotenv").config();
const express = require("express");
const path = require("path");

// Controllers
const dbController = require('./controllers/dbController');

// Models

// ENV 
const PORT = process.env.PORT || 3001;

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../message-app/build')));

// Routes
var backendRouter = require('./routes/backend');
var frontendRouter = require('./routes/frontend');
app.use('/api/', backendRouter);
app.use('/', frontendRouter);

// Database
dbController(app);

// Listen on port
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));