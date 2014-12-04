var express = require('express');
var router = express.Router();
//Get user session!!!
var user = '';

///* GET home page. */
router.get('/', function(req, res) {
  if (req.session.user){
    res.redirect('/mypeople');
  } else {
    res.render('index', { title: 'Trading Places', user: req.session.user,  invalid: req.param("invalid")});
  }
});

module.exports = router;