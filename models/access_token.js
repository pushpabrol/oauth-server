var mongoose = require('mongoose');

var accessTokenSchema = mongoose.Schema({
        email: { type: String, required: false, unique: false },
        client_id: { type: String, required: true, unique: false },
        token: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);