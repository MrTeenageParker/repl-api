/*
  Written by Jacob Parker
  
  Uses:
  Express 4,
  body-parser,
  cookie-parser,
  express-session,
  path,
  replit-client (the only reason this project works lol)
  ejs
  mongodb
  passport
  passport-oauth
  fs (for debug)
  cron (for generating API tokens every 5 days)
  
  This file contains all the back-end for the replit clone. This file handles registration, logins and REPL related tasks.
  This file also collects analytics for general purposes ;)
  
  This is open-source and allowed to be used, only if you have your own API token ;)
*/

// Dependencies
var express         = require('express');
var replitClient    = require('replit-client');
var path            = require('path');
var mongo           = require('mongodb').MongoClient;
var passport        = require('passport');
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var bodyParser      = require('body-parser');
var session         = require('express-session');
var cookieParser    = require('cookie-parser');
var fs              = require('fs');
var cron            = require('cron').CronJob;
var crypto          = require('crypto');

// The most useful snippet out there

// The app itself
var app = express();

// CONFIGURATION (most organized section ever)
app.set("port",process.env.PORT || 3558); // Server port, with support for environments with fixed ports
app.set("ip",process.env.IP); // Server address (for servers with more than one IP allocated, or forced IP restrictions)
app.set('view engine', 'ejs'); // our sexxy view engine!
app.set('views', path.join(__dirname, 'views'));

var url = 'db_connection';

mongo.connect(url, function(err,db){
  if(err){
    console.log('Login API will not work unless on live server, do not attempt to login.');
  } else {
    console.log('Connection made, able to accept login details!');
    
    db.close();
  }
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({secret: 'l33thaxxorz1337asd42069blazeitmichaelwhyudodismane', cookie: {maxAge:60000}}));
app.use(function(req, res, next) {res.locals.user = req.session.user;next();});
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.serializeUser(function(userString, done) {
  done(null, JSON.parse(userString));
});


passport.use(new GoogleStrategy({
    clientID: "client_api_key",
    clientSecret: "client_secret",
    callbackURL: "callback_url"
  },
  function(accessToken, refreshToken, profile, done) {
      mongo.connect(url, function(err,db){
        if(err){
          console.log(err, ' was the err');
          
          /*fs.open('views/debug/debug.txt', 'rw', 'a+', function(err,data){
            fs.writeFileSync('views/debug/debug.txt', err);
          });*/
          
          done(err);
        } else {
          db.collection('users').find({profile:profile}, function(err, user) {
            if (err) {
              /*fs.open('views/debug/debug.txt', 'rw', 'a+', function(err,data){
                fs.writeFileSync('views/debug/debug.txt', err);
              });*/
            } else if (user == null) {
              db.collection('users').insertOne({profile:profile, name:"John Doe"}, function(err, newUser){
                if(err){
                  done(err);
                  console.log("LOL YOU FAILED HORRIBLY DUDE", err);
                } else {
                  done(null, newUser);
                  console.log('Registered a new user!');
                }
              });
            } else {
              console.log('We have a returning user!');
              done(null, user);
            }
            
            console.log('ayyyyyy');
            
            /*fs.open('views/debug/debug.txt', 'rw', 'a+', function(err,data){
              fs.writeFileSync('views/debug/debug.txt', err);
            });*/
          });
        }
      });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: 'consumerKey',
    consumerSecret:'consumerSecret',
    callbackURL: "callback_url"
  },
  function(token, tokenSecret, profile, done) {
    passport.serializeUser(function(user,done){
      mongo.connect(url, function(err,db){
        if(err){
          
        } else {
          db.collection('users').find({profile:profile}, function(err, user) {
            if (err) {
              db.collection('users').insertOne({profile:profile, name:"John Doe"}, function(err, user){
                if(err){
                  console.log("LOL YOU FAILED HORRIBLY DUDE", err);
                } else {
                  console.log('Registered a new user!');
                }
              });
            } else {
              console.log('We have a returning user!');
            }
            
            console.log('ayyyy');
            
            done(null, user);
          });
        }
      });
    });
  }
));

app.use('/assets', express.static(path.join(__dirname, "views/assets"),{setHeaders: function(res,path,stat){res.set('X-FRAME-OPTIONS','DENY');}}));

// End of the most useful snippet out there

// API token for repl.it
var api_token = "";
var generated_token = {};

// REPL API CALL
app.post('/post/run', function(req,res){
  var language     = req.body.language;
  var code         = req.body.code;
  var repl         = new replitClient('api.repl.it', 80, language, generated_token);
  var signOnCookie = req.session.user;
  
  // Require login to reduce calls
  //if (signOnCookie){
    // TODO: add validation
    repl.evaluateOnce(code, {
      stdout: function(output) {
        // All output from the code
        res.send(output.toString());
      },
      stderr: function(output){
        res.send(output.toString());
      }
    }).then(
      function success(result) {
      if (result.error) {
        res.send("Error:\n" + result.toString());
      } else {
        res.send("Result:\n" + result.toString());
      }
    },
    function error(error) {
      // There was an error connecting to the service :(
      res.send(error.toString());
    });
  //} else {
    //res.end("yo man why u tryin to steal our api man ;( thats not cool man we don wan our apis to be taken ups man ;(");
  //}
  
  // No websockets since there are restrictions on how many people can be connected at once
});

app.get('/post/run', function(req,res){
  res.end('lol no getty 4 u lol rip u man u just wasted bandwidth lol gg broksi 10/10 challenge much haks much wow very good');
});

// REGISTRATION
app.post('/post/register', function(req,res){
  // TODO: Add logic and make facebook, google, and twitter an option to register
});

// LOGIN
app.post('/post/login', function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  
  // TODO: Add logic to login using email, password and add logic to allow optional twitter, facebook and google login options.
});
app.get('/login', function(req,res){
  if(req.session.user){
    res.redirect('/languages');
  } else {
    res.render('public/login.ejs');
  }
});

// SEXY STATS
app.get('/stats', function(req,res){
  res.send('ayy fam wyd here lol rip'); // will this ever get done to my satisfaction? who knows at this point fam.
});

app.get('/auth/google',passport.authorize('google', { scope: ['https://www.googleapis.com/auth/plus.login']}));
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/oauth/google', passport.authenticate('google', { failureRedirect: '/login' }),function(req, res) {
  res.redirect('/languages', {user:true});
});

app.get('/auth/oauth/twitter',passport.authenticate('twitter', { successRedirect: '/languages',failureRedirect: '/login' }));

// REST
app.get('/', function(req,res){
  res.render('public/index'/*, {user:{name:"asd"}}*/);
});

app.get('/privacy', function(req,res){
  res.end('soon(tm)');
});

app.get('/terms', function(req,res){
  res.end('soon(tm)');
});

app.get('/languages', function(req,res){
  res.render('logged-in-pages/languages.ejs', {user:"yo"});
});




/// TEMP STUFF
app.get('/debug/:asd', function(req,res){
  res.send(fs.readFileSync('views/debug/debug.txt', "utf-8"));
});





app.get('/languages/:language', function(req,res){
  var language = (req.params.language).toString();
  var Fakelanguage = language;
  
  if(language == "cpp11" || language == "cpp"){
    Fakelanguage = "c_cpp";
  }
  
  res.render("logged-in-pages/language.ejs", {language:Fakelanguage.replace(/[0-9]/g, ''), rawlang:language}); // ehh, use ejs to do ur thing ok
  
  // TODO: server pages accordingly
});


var cron = new cron('00 30 11 * * *', function(){
  // generate api token
});

// BREATHE MY CHILD
var server = app.listen(app.get('port'), app.get('ip'), function(){
  // Get diagnostics
  var port = server.address().port;
  var address = server.address().address;
  
  // For general purposes
  console.log("Listening on", address.toString() + ':' + port.toString() + " \n\nWebsite should be located at: c9_url (if you are debugging through c9)\n or your_url if you want to see the site.");
});
