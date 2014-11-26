var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
    console.log("here");
    res.render('mypeople', { title: 'My People' });
});

module.exports = router;