var express = require('express');
var router = express.Router();
const path = require("path");


// get Home page
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../message-app/build', 'index.html'));
});

module.exports = router;