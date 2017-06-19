'use strict';

const passport = require('passport');

module.exports.info = [
  passport.authenticate('bearer', { session: false }),
  (request, response) => {
    response.json({ client_id: request.user.client_id, name: request.user.name, scope: request.authInfo.scope });
  }
];