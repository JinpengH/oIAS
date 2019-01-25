var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Login' });
});

router.get('/main', function(req, res, next) {
    res.render('main', { title: 'mainpage' });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'signup' });
});

module.exports = router;
