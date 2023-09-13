var express = require('express');
var router = express.Router();
var pool=require('./pool')
var Localstorage=require('node-localstorage').LocalStorage;
Localstorage = new Localstorage('./scratch');
date=new Date()

/* GET users listing. */
router.get('/adminlogin', function(req, res, next) {
  res.render("adminlogin");
});
router.get('/adminlogout', function(req, res, next) {
  localStorage.clear()
  res.render("adminlogin",{message:''})
});
router.post('/chkadminlogin', function(req, res, next) {
  pool.query("select * from administrator where (emailid=? or mobilenumber=?) and password=?",[req.body.email_mobile,req.body.email_mobile,req.body.pwd],function(error,result){
    if(error){
      console.log(error)
      res.render("adminlogin",{message:'Server Error...'})
    }
    else{
      if(result.length==1){
        localStorage.setItem("ADMIN",JSON.stringify(result[0]))
        res.render("dashboard",{data:result})
      }
      else{
        res.render("adminlogin",{message:'Invalid emailaddress/mobile number/password....'})
      }
    }
  })
 
});

module.exports = router;