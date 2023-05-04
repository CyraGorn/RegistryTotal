const JWTHelper = require('../helpers/JWTHelper.js');

module.exports = async (req, res, next) => {
	try {
		if (req.cookies.session === undefined) {
			return res.redirect("/login");
		}
		return JWTHelper.verify(req.cookies.session)
			.then(user => {
				req.user = user;
				console.log(user);
				next();
			})
			.catch((e) => {
				res.redirect('/logout');
			});
	} catch (e) {
		console.log(e);
		return res.redirect('/logout');
	}
}