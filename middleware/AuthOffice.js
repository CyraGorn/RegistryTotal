const jwt = require('../utils/JWTHelpers.js');

module.exports = (req, res, next) => {
    try {
        var result = req.result;
        var id = req.params.id;
        if (result === undefined || (result['isAdmin'] !== 1 && id !== result['workFor'])) {
            return res.status(404).json("NOT FOUND");
        }
        next();
    } catch (err) {
        return res.status(500).json("SERVER UNAVAILABLE")
    }
}