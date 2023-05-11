const jwt = require('../helpers/JWTHelper.js');

module.exports = (req, res, next) => {
    let token;
    let headers = req.headers.authorization;
    if (headers && headers.startsWith('Bearer')) {
        token = headers.split(' ')[1];
        try {
            var result = jwt.verify(token);
            req.result = result;
            next();
        } catch (err) {
            return res.status(404).json("NOT FOUND");
        }
    } else {
        return res.status(404).json("NOT FOUND");
    }
}