const JWTHelper = require('../helpers/JWTHelper.js');

module.exports = (req, res, next) => {
	try {
		if (req.cookies.session === undefined) {
			return res.status(403).json("FORBIDDEN");
		}
		let user = JWTHelper.verify(req.cookies.session);
		req.user = user;
		console.log(user);
		next();
	} catch (e) {
		return res.status(403).json("FORBIDDEN");
	}
}