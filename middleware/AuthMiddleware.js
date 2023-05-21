const JWTHelper = require('../utils/JWTHelpers.js');

module.exports = (req, res, next) => {
	try {
		if (req.cookies.session === undefined) {
			return res.status(403).json("UNAUTHORIZED");
		}
		let user = JWTHelper.verify(req.cookies.session);
		req.user = user;
		next();
	} catch (e) {
		return res.status(403).json("UNAUTHORIZED");
	}
}