var express = require('express');
var router = express.Router();
const path = require("path");


// get Home page
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/index.html"));
});


// Api test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Msg from server',
  });
});

module.exports = router;