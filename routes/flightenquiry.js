var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
/* GET home page. */
router.get('/flightinterface', function (req, res) {
var admin=JSON.parse(localStorage.getItem('ADMIN'))
if(admin)

  res.render('flightinterface', { message: '' });
  else
  res.render('login', { message: '' });
});

router.get('/displayallflights', function (req, res) {
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  if(!admin)
  res.render('login', { message: '' });
else
 pool.query("select F.*,(select C.cityname from cities C where C.citiesid=F.sourcecity) as source ,(select C.cityname from cities C where C.citiesid=F.destinationcity) as destination from flightsdetails F", function (error, result) {
    if (error) {
      console.log(error)
      res.render('displayallflights', { 'data': [], 'message': 'Server Error' })
    }
    else {
      res.render('displayallflights', { 'data': result, 'message': 'Sucessfull WORKING' })

    }
  })
});


router.get('/searchbyid', function (req, res) {
  pool.query("select F.*,(select C.cityname from cities C where C.citiesid=F.sourcecity) as source ,(select C.cityname from cities C where C.citiesid=F.destinationcity) as destination from flightsdetails F where flightid=?", [req.query.fid],
    function (error, result) {
      if (error) {
        console.log(error)
        res.render('flightbyid', { 'data': [], 'message': 'Server Error' })
      }
      else {
        res.render('flightbyid', { 'data': result[0], 'message': 'Sucessfull WORKING' })

      }
    })
});

router.get('/searchbyidforimage', function (req, res) {
  pool.query("select F.*,(select C.cityname from cities C where C.citiesid=F.sourcecity) as source ,(select C.cityname from cities C where C.citiesid=F.destinationcity) as destination from flightsdetails F where flightid=?", [req.query.fid],
    function (error, result) {
      if (error) {
        console.log(error)
        res.render('showimage', { 'data': [], 'message': 'Server Error' })
      }
      else {
        res.render('showimage', { 'data': result[0], 'message': 'Sucessfull WORKING' })

      }
    })
});




router.post('/flightsubmit', upload.single('logo'), function (req, res) {

  //var days=(""+req.query.days).replaceAll("'",'"')
  var days = ("" + req.body.days)
  //console.log("BODY",req.body)
  // console.log("FILE",req.body)
  pool.query("insert into flightsdetails ( flightname, flighttype, flightseats, days, sourcecity, departuretime, destinationcity, arrivaltime, company, logo)values(?,?,?,?,?,?,?,?,?,?)",
    [req.body.flightname, req.body.flighttype, req.body.flightseats, days, req.body.sourcecity, req.body.deptime, req.body.destinationcity,
    req.body.arrtime, req.body.company, req.file.originalname], function (error, result) {
      if (error) {
        console.log(error)
        res.render('flightinterface', { 'message': 'Server Error' })
      }
      else {
        res.render('flightinterface', { 'message': 'Record Submitted Succesfully' })
      }
    })
})
router.get('/flightinterface', function (req, res) {
  res.render('flightinterface', { message: '' });
});

router.get('/fetchallcities', function (req, res) {
  pool.query("select * from cities", function (error, result) {

    if (error) {
      res.status(500).json({ result: [], message: 'Server Error' })
    }
    else {
      res.status(200).json({ result: result, message: 'Sucessfull WORKING' })

    }
  })
})


router.post('/flight_edit_delete', function (req, res) {
  console.log(req.body.flightid)
  if(req.body.btn=="Edit")
  {

  //var days=(""+req.query.days).replaceAll("'",'"')
  var days = ("" + req.body.days)
  console.log("BODY",req.body.days)
  // console.log("FILE",req.body)
  pool.query("update flightsdetails set flightname=?, flighttype=?, flightseats=?, days=?, sourcecity=?, departuretime=?, destinationcity=?, arrivaltime=?, company=? where flightid=?",
    [req.body.flightname, req.body.flighttype, req.body.flightseats, days, req.body.sourcecity, req.body.deptime, req.body.destinationcity,
    req.body.arrtime, req.body.company, req.body.flightid], function (error, result) {
      if (error) {
        console.log(error)
        res.redirect('/flightenquiry/displayallflights')
      }
      else {
        res.redirect('/flightenquiry/displayallflights')
           }
    })
  }
  
  else
  
 {
   //console.log("BODY",req.body)
   // console.log("FILE",req.body)
   pool.query("delete from flightsdetails where flightid=?",
[req.body.flightid], function (error, result) {
       if (error) {
         console.log(error)
         res.redirect('/flightenquiry/displayallflights')
       }
       else {
         res.redirect('/flightenquiry/displayallflights')
            }
     })
    }
})


router.post('/editimage', upload.single('logo'), function (req, res) {

  //var days=(""+req.query.days).replaceAll("'",'"')

   console.log("BODY",req.body)
   console.log("FILE",req.body)
  pool.query("update flightsdetails set logo=? where flightid=?",[req.file.originalname,req.body.flightid], function (error, result) {
      if (error) {
        console.log(error)
        res.redirect('/flightenquiry/displayallflights')
      }
      else {
        res.redirect('/flightenquiry/displayallflights')
      }
    })
})
module.exports = router;