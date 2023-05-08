const JWTHelper = require('../helpers/JWTHelper.js');

module.exports = async (req, res, next) => {
	try {
		if (req.cookies.session === undefined) {
			return res.status(403).json("FORBIDDEN");
		}
		return JWTHelper.verify(req.cookies.session)
			.then(user => {
				req.user = user;
				console.log(user);
				next();
			})
			.catch((e) => {
				return res.status(403).json("FORBIDDEN");
			});
	} catch (e) {
		console.log(e);
		return res.status(504).json(e);
	}
}