
var util = require('util');
var express = require("express");
var http = require("http");
var app     = express();
var passport = require('passport');
var router = express.Router();

var User = require('../models/fbuser.js');
var Tripmodel = require('../models/tripview.js');
var Upcmodel = require('../models/upcomings.js');
var Daymodel = require('../models/dayviews.js');

var rating = require('../models/rating.js');
var reviews = require('../models/reviews.js');

var mongoose = require('mongoose');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var monk = require('monk');
var db = monk('localhost:27017/sample31');


router.post('/register', function(req, res) {
  var newUser = new User();
  newUser.local.username = req.body.username;
  newUser.local.password = req.body.password;
    newUser.save(function(err) {
    if (err) {
      return res.status(500).json({err: err});
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({status: 'Registration successful!'});
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (!user) {
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'});
      }
      res.status(200).json({status: 'Login successful!'});
    });
  })(req, res, next);
});


router.get('/day_data', function(req, res, next){
      Daymodel.find({}, function(err, result) {
        if (err) {
            res.send("There was an error finding user");
        }
        else {
             res.send(result);
        }
    });
});
  
router.get('/trip_data', function(req, res, next){
      Tripmodel.find({}, function(err, result) {
          if (err) {
              res.send("There was an error finding user");
          }
          else {
               res.send(result);
          }
      });
});

router.put('/edit_trip/:id', function(req, res){
  Tripmodel.findById(req.params.id, function(err, trip) {
  if (err)
    res.send(err);
  // console.log(trip);
  trip.Act = req.body.Act;  // update the bears info

  // save the bear
    trip.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Trip updated!' });
    });
  });
});

router.delete('/delete_day/:id', function(req, res){
  // console.log("in delete day");
  Tripmodel.remove({_id: req.params.id}, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
});

router.delete('/delete_trip/:id', function(req, res){
  // console.log("in delete day");
  Upcmodel.remove({_id: req.params.id}, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
});


router.put('/edit_day/:id', function(req, res){
  Daymodel.findById(req.params.id, function(err, day) {
  if (err)
    res.send(err);
  // console.log(trip);
  day.Act = req.body.Act;  // update the bears info
  day.Hr = req.body.Hr;
  day.Place = req.body.Place;
  day.Hotel = req.body.Hotel;
  // save the bear
    day.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Day updated!' });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////////////

router.post('/newrating1', function(req, res, next){
      var collection = db.get('upcomings');
      console.log("upcomingsssssssss");
      console.log(req.body);
    collection.update(
      { _id : req.body.oldid},
      { $set : { stars:req.body.stars} },
      function( err, result ) {
        if ( err ) throw err;
      }
    );
});
///////////////////////////////////////////////////////////////////////////////////////
router.post('/newrating2', function(req, res, next){
    var rating1 = new rating();
    rating1.to = req.body.oldid;
    rating1.from = req.body.from;
    rating1.rating = req.body.rating;
   
    
    rating1.save(function(err, result){
        res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
    });
});
////////////////////////////////////////////////////////////////////////////////
router.post('/reviews', function(req, res, next){
    var reviews1 = new reviews();
    reviews1.reviews = req.body.review;
    reviews1.forr = req.body.forr;
   
    console.log(req.body.review);
    console.log(req.body.forr);
    reviews1.save(function(err, result){
        res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
    });
});
///////////////////////////////////////////////////////////////////////////////////////
router.get('/getreviews/:id', function(req, res, next){
  console.log("sssssssssssssssssss");
  var ObjectID = require('mongodb').ObjectID;
  var objectId = new ObjectID();
  var toid = req.params.id;
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
  console.log(req.params);
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&55555555555555555555555555");
  reviews.find({'forr': toid}, function(err, result) {
    if (err) {
        res.send("There was an error finding user");
    }
    else {
         res.send(result);
    }
  });
});

router.get('/getrating/:id', function(req, res, next){
  console.log("sssssssssssssssssss");
  var ObjectID = require('mongodb').ObjectID;
  var objectId = new ObjectID();
  var toid = req.params.id;
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
  console.log(req.params);
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&55555555555555555555555555");
  rating.find({'to': toid}, function(err, result) {
    if (err) {
        res.send("There was an error finding user");
    }
    else {
         res.send(result);
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////
router.post('/updaterating', function(req, res, next){
  var collection = db.get('ratings');
      console.log("updated");
      console.log(req.body);
    collection.update(
      {  _id : req.body.rid},
      { $set : { rating:req.body.rating } },
      function( err, result ) {
        if ( err ) throw err;
         res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
      }
    );
});

////////////////////////////////////////////////////////////////////////////////////////

router.get('/findsamecity/:cityid', function(req, res, next){
  Upcmodel.find({"Places" : {"$in" : [req.params.cityid]}, "privacy":"public"}, function(err, upcdata) {
      if (err)
          res.send(err);
      // console.log(upcdata);
      res.json(upcdata);
  });
});


router.get('/findbycity/:cityid', function(req, res, next){
  Upcmodel.find({"Places" : {"$in" : [req.params.cityid]}, "privacy":"public"}, function(err, upcdata) {
      if (err)
          res.send(err);
      // console.log(upcdata);
      res.json(upcdata);
  });
});

////////////////////////////////////////////////////////////////////////////////////////

router.get('/getUser', function(req, res, next){
  console.log(req.user + " ----req.user" + req);
  res.send(req.user);
});

///////////////////////////////////////////////////////////////////////////////////////////////
router.get('/getUsers', function(req, res, next){
  User.find({}, function(err, result) {
    console.log(result);
    if (err) {
        res.send("There was an error finding user");
    }
    else {
         res.send(result);
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/upc_data', function(req, res, next){
          Upcmodel.find({'privacy' : 'public'}, function(err, result) {
          
          if (err) {
              res.send("There was an error finding user");
          }
          else {
               res.send(result);
          }
      });
});

router.get('/upc_data_all', function(req, res, next){
        Upcmodel.find({}, function(err, result) {
          if (err) {
              res.send("There was an error finding user");
          }
          else {
               res.send(result);
          }
      });
});

//////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/newgroupdata', function(req, res, next){
  var collection = db.get('groupdata');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/groupdata1', function(req, res, next){
  var ObjectID = require('mongodb').ObjectID;
  var objectId = new ObjectID();
  var userid = req.user._id.toString();
  var finalresult = [];
  var k = 0;
  db.get('groupdata').find({'pid': userid}, function(err, result) {
    if (err) {
        res.send("There was an error finding user");
    }
    else {
        for (i = 0; i < result.length; i++) {
          Upcmodel.find({'_id': result[i].from}, function(err, result1) {
            if (err) {
                res.send("There was an error finding user");
            }
            else {
              finalresult.push(result1[0]);
            }
            k++;
              if (k == result.length) {
            res.send(finalresult);
          }
          });
          
        }
        console.log("finalresult",finalresult);
        
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/upc_data1', function(req, res, next){
  var ObjectID = require('mongodb').ObjectID;
  var objectId = new ObjectID();
  var userid = req.user._id.toString();
  Upcmodel.find({'dataid': userid}, function(err, result) {
    if (err) {
        res.send("There was an error finding user");
    }
    else {
         res.send(result);
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/newupcdata', function(req, res) {
    var newupc = new Upcmodel();
    newupc.Name = req.body.Name;
    newupc.dataid = req.body.dataid;
    newupc.Places = req.body.Places;
    newupc.Src = req.body.Src;
    newupc.privacy = req.body.privacy;
    
    newupc.save(function(err, result){
        res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
    });
});


//////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/newtripdata', function(req, res) {
    var newtrip = new Tripmodel();
    newtrip.upc = req.body.upc;
    newtrip.Day = req.body.Day;
    newtrip.Act = req.body.Act;
    
    newtrip.save(function(err, result){
        res.send(
            (err === null) ? { msg: result } : { msg: err }
        );
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/edittripdata', function(req, res) {
    var collection = db.get('tripviews');
    collection.update(
      { _id : req.body.createddayid},
      { $set : { Act:req.body.Act } },
      function( err, result ) {
        if ( err ) throw err;
      }
    );
});

//////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/newdata', function(req, res) {
  var total = req.body.length;
  result = [];

  function saveAll(){
    var newday = new Daymodel();
    var doc = req.body.shift();
    newday.upc = doc.upc,
    newday.tripid = doc.tripid,
    newday.Hr= doc.Hr,
    newday.Act= doc.Act,
    newday.Place= doc.Place,
    newday.Hotel= doc.Hotel,
    newday.save(function(err, saved) {
      if (err) throw err;//handle error

      result.push(saved[0]);

      if (--total) {
        saveAll();
      }
    });
  }

  saveAll();
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;