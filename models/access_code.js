var mongoose = require('mongoose');

var accessCodeSchema = mongoose.Schema({
        email: { type: String, required: true, unique: false },
        client_id: { type: String, required: true, unique: false },
        redirectUri: { type: String, required: true, unique: false },
        code: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AccessCode', accessCodeSchema);