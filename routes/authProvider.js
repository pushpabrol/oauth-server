var passport = require('passport');
var login = require('connect-ensure-login');
module.exports.index = function (request, response) { 
  
  response.send('OAuth 2.0 Server'); 
}

module.exports.loginForm = function (request, response) { response.render('authProvider/login.ejs', { message: request.flash('loginMessage') }); }

module.exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' });

module.exports.logout = function (request, response) {
  request.logout();
 response.redirect('/');
};

module.exports.account = [
  login.ensureLoggedIn(),
  function (request, response) {
    console.log(request.user);
    response.render('authProvider/account.ejs', { user: request.user });
  }
];