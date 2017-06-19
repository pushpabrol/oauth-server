var passport = require('passport');

module.exports.info = [
  passport.authenticate('bearer', { session: false }),
  function(request, response) {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    console.log(request.user);
    response.json({ user_id: request.user._id, email: request.user.email, scope: request.authInfo.scope });
  }
];