var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    hash = require('bcrypt-nodejs'),
    path = require('path'),
    passport = require('passport'),
    localStrategy = require('passport-local' ).Strategy;
    FacebookStrategy = require('passport-facebook').Strategy
    cors = require('cors');
    User = require('./app/models/fbuser.js');

// mongoose
mongoose.connect('localhost:27017/sample31');

// user schema/model
//var User = require('./models/user.js');
// console.log("whyyyyyy");

// create instance of express
var app = express();
app.use(cors());
// require routes
var routes = require('./app/routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(function(username, password, done) {
  User.findOne({'local.username': username}, function(err, user) {
     if (user) {
    //console.log(user);
      return done(null, user);
    }
    if (err)
      return done(err);
    if (!user)
      return done(null, false, { message: 'Username or password incorrect' });
  })
}));
passport.use(new FacebookStrategy({
    clientID: "1536158780034198",
    clientSecret: "f63e8b528f6b51d4e71abab0466d7eda",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['emails', 'id','name']
  },
  function(accessToken, refreshToken, profile, done) {
  console.log(profile);
   User.findOne({'facebook.id': profile.id}, function(err, user) {
     if (err) {
     // console.log(err);
      return done(err); 
    }
    if (user) {
    //console.log(user);
      return done(null, user);
    }
    else {
       var newUser = new User();
       console.log(newUser);
        newUser.facebook.id = profile.id;
        newUser.facebook.token = accessToken;
        newUser.facebook.email = profile.emails[0].value;
        newUser.facebook.name = profile.displayName;
        newUser.save(function(err) {
          if (err) 
            throw err;
            return done (err,user);
        })
    }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log("JJJJJJJJJJJJJJ");

    //console.log(user);
    console.log("KKKK");
    done(err, user);
  });
});

app.get('/loggedin', function(req, res)

{
  //console.log(req);
  res.send(req.isAuthenticated() ? req.user : '0');
});
// routes
app.use('/user/', routes);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/logout', function(req, res) {
  console.log("logggggggggggoutttttt");
  req.session.destroy();
  res.redirect('/');
});

//app.use(routes);

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '../client', 'index.html'));
// });


app.get('/auth/facebook', function(req, res, next){
    passport.authenticate('facebook', {scope: ['email'], authType: 'reauthenticate', authNonce: 'foo123'})(req, res, next);
});
//app.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email'}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
// app.get('/auth/facebook/callback',
//   //console.log(req.user);
//   passport.authenticate('facebook', { successRedirect: '/#/home1',
//                                       failureRedirect: '/#/login' }));

app.get('/auth/facebook/callback', function(req, res, next){
  console.log(req);
    passport.authenticate('facebook', {
        successRedirect: '/#/upc',
        failureRedirect: '/#/login' }
    )(req, res, next); // missing function call
});


// router.post('/logoutFromFacebook', function(req, res) {
//     res.redirect('https://www.facebook.com/logout.php?next='+'http://localhost:3000'+'/logout&access_token='+req.body['accessToken']);
// });


// error hndlers
app.use(function(req, res, next) {
    var err = new Error('Not ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;