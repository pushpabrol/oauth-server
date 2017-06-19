var passport = require('passport');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var debug = require('debug')('opensso-bridge');
var flash = require('connect-flash');
var routes = require('./routes');
const login = require('connect-ensure-login');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'allieverwantedwasarollyrollyrolly',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Passport configuration
require('./auth');

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');

app.get('/', routes.authProvider.index);
app.get('/login', routes.authProvider.loginForm);
app.post('/login', routes.authProvider.login);
app.get('/logout', routes.authProvider.logout);
app.get('/account', routes.authProvider.account);

app.get('/oauth/authorize', routes.oauth2.authorization);
app.post('/oauth/authorize/decision', routes.oauth2.decision);
app.post('/oauth/token', routes.oauth2.token);

app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);

app.use('/management', login.ensureLoggedIn('/login'), checkLevel);

app.get('/management', routes.management.index);

app.get('/management/users', routes.management.getUsers);

//create user
app.get('/management/users/create', routes.management.createuserform);
app.post('/management/users/create', routes.management.createuserformpost);

//edit single user form
app.get('/management/users/:id/edit', routes.management.edituserform);
app.post('/management/users/:id/edit', routes.management.edituserformpost);

//delete a user 
app.delete('/management/users/:id', routes.management.deleteuser);

app.get('/management/clients', routes.management.getClients);
app.delete('/management/clients/:id', routes.management.deleteclient);


app.get('/management/clients/create', routes.management.createclientform);
app.post('/management/clients/create', routes.management.createclientformpost);

app.get('/management/clients/:id/edit', routes.management.editclientform);
app.post('/management/clients/:id/edit', routes.management.editclientformpost);




function startServer() {
    debug('starting server...');
    var port = 3000;
    app.listen(port, function () {
        debug(`started on ${port}`);
    });
}

function checkLevel(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin === true) next();
    else {
        res.statusCode = 401;
        res.json({ err: 'You are not admin' });
    }

};

startServer();

