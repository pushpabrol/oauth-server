'use strict';
var IdGenerator = require('auth0-id-generator');
var crypto = require('crypto');
var generator = new IdGenerator();



var base64uid = function (length, done) {
  crypto.randomBytes(length, function (ex, buff) {
    if (ex) {
      return done(ex);
    }
    done(null, buff.toString('base64'));
  });
};

/**
 * Return a unique identifier with the given `len`.
 *
 * @param {Number} length
 * @return {String}
 * @api private
 */
module.exports.getUid = function (length) {
  let uid = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  for (let i = 0; i < length; ++i) {
    uid += chars[getRandomInt(0, charsLength - 1)];
  }

  return uid;
};

/**
 * Return a random int, used by `utils.getUid()`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.getClientId = function () {
  return generator.newUid(32);
}

module.exports.getClientSecret = function (done) {
  urlEscapedBase64uid(48, done);
}

var urlEscapedBase64uid = function (length, done) {
  base64uid(length, function (err, result) {
    var r = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    done(null, r);
  });
};