var express = require('express');
var router = express.Router();
var pool = require('./pool');

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render("login", { message: '' });
});
router.get('/logout', function(req, res, next) {
    localStorage.clear()
    res.render("login",{message:''})
});
router.post('/checkadminpassword', function (req, res, next) {
    console.log(req.body)
    pool.query('select * from admins where (emailid=? or mobile=?) and password=?',
        [req.body.email_mobile, req.body.email_mobile, req.body.password], function (error, result) {
            if (error) {
                console.log(error)
                res.render("login", { message: 'Server Error' })
            }
            else {
                localStorage.setItem("ADMIN",JSON.stringify(result[0]))
                if (result.length == 1) {
                    res.render("dashboard"), { message: 'sucecess' }
                  
                   }
                else {
                    res.render("login", { message: 'invalid' })
                }
            }
        })
})

module.exports = router;