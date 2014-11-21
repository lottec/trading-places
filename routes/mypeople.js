var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
    res.render('mypeople', { title: 'My People' });
});

module.exports = router;