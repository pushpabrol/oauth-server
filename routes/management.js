var mongoose = require('mongoose');
var configDB = require('../config/database');
var utils = require('../utils');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

var Client = require('../models/client');
var User = require('../models/authProvider/user');


module.exports.index = function (request, response) {
    response.render('management/landing.ejs',{ user: request.user });


}

module.exports.getClients = function (request, response) {
    Client.find({}, function (err, clients) {
        response.render('management/client/list.ejs', { clients: clients });
    });

}

module.exports.deleteclient = function (request, response) {

    Client.remove({ _id: request.params.id }, function (err) {
        if (err) response.json({ "id": request.params.id, "success": false, "err": err });
        else response.json({ "id": request.params.id, "success": true });

    });
}

module.exports.getUsers = function (request, response) {
    User.find({}, function (err, users) {
        response.render('management/user/list.ejs', { users: users });
    });

}

module.exports.deleteuser = function (request, response) {

    User.remove({ _id: request.params.id }, function (err) {
        if (err) response.json({ "id": request.params.id, "success": false, "err": err });
        else response.json({ "id": request.params.id, "success": true });
    });
}

module.exports.createclientform = function (request, response) {
    var client_id = utils.getClientId();
    utils.getClientSecret(function (err, secret) {
        response.render('management/client/create.ejs', { data: { client_id: client_id, client_secret: secret } });
    });


}



module.exports.createclientformpost = function (request, response) {
    console.log(request.body);

    var client = new Client(
        {
            client_id: request.body.client_id,
            client_secret: request.body.client_secret,
            name: request.body.name,
            isTrusted: (request.body.trusted ? true : false)
        });
    if (request.body.redirect_uris != null || request.body.redirect_uris.trim() != '') {
        var uriArray = request.body.redirect_uris.split('\r\n');
        for (var i = 0; i < uriArray.length; i++) {
            // Trim the excess whitespace.
            uriArray[i] = uriArray[i].replace(/^\s*/, "").replace(/\s*$/, "");
        }
        client.redirect_uris = uriArray;

    }

    client.save(function (err) {
        if (err) {
            response.json(err);
        } else {
            console.log('done');
            response.redirect('/management/clients');
        }
    });

}

module.exports.editclientform = function (request, response) { 

    Client.findOne({client_id: request.params.id}, function (err, client) {
        response.render('management/client/edit.ejs', {client: client }); 
    });

    
}

module.exports.editclientformpost = function (request, response) {
    console.log(request.body);
    var client = { name : request.body.name, 
        isTrusted: request.body.hasOwnProperty("trusted") ? true  : false , 
        redirect_uris: request.body.redirect_uris
     }
     console.log(client);
    Client.update({client_id : request.params.id},client,function (err) {
        if (err) {
            response.json(err);
        } else {
            console.log('done');
            response.redirect('/management/clients');
        }
    });

}



module.exports.createuserform = function (request, response) { response.render('management/user/create.ejs'); }



module.exports.edituserform = function (request, response) { 

    User.findOne({_id: request.params.id}, function (err, user) {
        response.render('management/user/edit.ejs', {user: user }); 
    });

    
}

module.exports.edituserformpost = function (request, response) {

    var user = { email : request.body.email, 
        givenName: request.body.givenName ? request.body.givenName : '' , 
        familyName: request.body.familyName ? request.body.familyName : '',
        isAdmin: false
     }
     if(request.body.password != null && request.body.familyName.trim() !== '')
     user.password = User.generateHash(request.body.password);
    User.update({_id: request.params.id},user,function (err) {
        if (err) {
            response.json(err);
        } else {
            console.log('done');
            response.redirect('/management/users');
        }
    });

}

module.exports.createuserformpost = function (request, response) {
     console.log('here');
    console.log(request.body);
    var user = new User({ email: request.body.username, 
        givenName: request.body.givenName, 
        familyName: request.body.familyName,
        isAdmin : false });
        console.log(user);
    user.password = user.generateHash(request.body.password);
    user.save(function (err) {
        if (err) {
            response.json(err);
        } else {
            console.log('done');
            response.redirect('/management/users');
        }
    });

}


