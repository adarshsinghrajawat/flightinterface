var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/myfriend', function(req, res, next) {
  res.render('index', { title: 'Surbhi Bhandari', city:'Gwalior', state:'Madhya Pradesh' });
});

module.exports = router;
