var express = require('express');
var router = express.Router();

/* GET home page. */

router.post('/', function(req,res) {
  console.log('asdfadsfadf');
  res.render('index', { title: 'registering' });
});


module.exports = router;
