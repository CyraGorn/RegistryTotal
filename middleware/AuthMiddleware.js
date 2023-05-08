const JWTHelper = require('../helpers/JWTHelper.js');

module.exports = async (req, res, next) => {
	try {
		if (req.cookies.session === undefined) {
			res.status(500).json("undefined ditmemay");
		}
		return JWTHelper.verify(req.cookies.session)
			.then(user => {
				req.user = user;
				console.log(user);
				next();
			})
			.catch((e) => {
				res.status(403).json("FORBIDDEN");
			});
	} catch (e) {
		console.log(e);
		res.status(504).json(e);
	}
}