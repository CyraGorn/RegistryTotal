const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 5,
	message: {
		error: `Too many login attempts. You have been locked for 60 minutes. Next login at ${new Date(Date.now() + 60 * 60 * 1000).toLocaleString('en-US', {
			timeZone: 'Asia/Jakarta'
		})
			}.`
	}
});

module.exports = limiter;