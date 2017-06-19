
var authProvider = require('./authProvider');
var oauth2 = require('./oauth2');
var management = require('./management');
var user = require('./userinfo');
var client = require('./clientinfo');

module.exports = {
  authProvider,
  oauth2,
  management,
  user,
  client
}
