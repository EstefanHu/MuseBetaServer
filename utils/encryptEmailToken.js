const crypto = require('crypto');

const encryptEmailToken =
  token => crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

module.exports = encryptEmailToken;