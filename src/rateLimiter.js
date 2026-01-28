const { rateLimit } = require('express-rate-limit');

const createPasteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 create requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many pastes created from this IP, please try again after 15 minutes' }
});

module.exports = createPasteLimiter;