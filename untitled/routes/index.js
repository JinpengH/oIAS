var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login1', function(req, res, next) {
    res.render('index', { title: 'Login' });
});

router.get('/login2', function(req, res, next) {
    res.render('login2', { title: 'Login' });
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome', { title: 'Login' });
});

router.get('/main', function(req, res, next) {
    res.render('main', { title: 'main' });
});

module.exports = router;
