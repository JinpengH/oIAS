var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login1', function(req, res, next) {
    res.render('index', { title: 'Login' });
});

router.get('/login2', function(req, res, next) {
    res.render('login2', { title: 'Login' });
});

router.get('/login3', function(req, res, next) {
    res.render('login3', { title: 'Login' });
});

module.exports = router;
