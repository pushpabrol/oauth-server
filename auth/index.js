var passport = require('passport');
var mongoose = require('mongoose');
var configDB = require('../config/database');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

var Client = require('../models/client');
var User = require('../models/authProvider/user');
var AccessToken = require('../models/access_token');


var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email : email}, function(error, user) {
        console.log(user);
      if (error) return done(error);
      if (!user) return done(null, false);
      if (!user.validPassword(password)) return done(null, false);
      console.log(user);
      return done(null, user);
    });
  }
  
));

passport.serializeUser(function(user, done) {
      done(null, user.email)
    
});

passport.deserializeUser(function(email, done)  {
  User.findOne({ email : email}, function(error, user) { 
      console.log('de serialize');
      done(error, user)
    });
});

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
function verifyClient(clientId, clientSecret, done) {
    console.log(clientId);
  Client.findOne({ client_id: clientId} , function(error, client) {
    if (error) return done(error);
    if (!client) return done(null, false);
    if (client.client_secret !== clientSecret) return done(null, false);
    return done(null, client);
  });
}

passport.use(new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function(accessToken, done) {
    AccessToken.findOne({token:accessToken}, function(error, token) {
      if (error) return done(error);
      if (!token) return done(null, false);
      console.log(token);
      if (token.email) {

        User.findOne({ email: token.email}, function(error, user) {
          if (error) return done(error);
          if (!user) return done(null, false);
          // To keep this example simple, restricted scopes are not implemented,
          // and this is just for illustrative purposes.
          console.log(user);
          done(null, user, { scope: '*' });
        });
      } else {
        // The request came from a client only since userId is null,
        // therefore the client is passed back instead of a user.
        Client.findOne({client_id:token.clientId}, function(error, client) {
          if (error) return done(error);
          if (!client) return done(null, false);
          // To keep this example simple, restricted scopes are not implemented,
          // and this is just for illustrative purposes.
          done(null, client, { scope: '*' });
        });
      }
    });
  }
));