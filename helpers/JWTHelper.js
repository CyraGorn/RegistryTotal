const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SECRET = crypto.randomBytes(69).toString('hex');

module.exports = {
    sign(data) {
        return jwt.sign(data, SECRET, {
            algorithm: 'HS256',
            expiresIn: 3600 * 5
        });
    },
    verify(token) {
        return jwt.verify(token, SECRET, {
            algorithm: 'HS256'
        });
    }
};