var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
        client_id: { type: String, required: true, unique: true },
        client_secret: { type: String, required: true, unique: true },
        redirect_uris: [{ type: String, required: true, unique: false }],
        name: { type: String, required: true, unique: false },
        isTrusted: { type: Boolean, required: true, unique: false, default: false }
});

module.exports = mongoose.model('Client', clientSchema);