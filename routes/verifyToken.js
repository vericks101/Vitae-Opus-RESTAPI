const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Ensure that the request contains a JWT.
    const token = req.header('auth-token');
    if (!token)
        return res.status(401).send('Access Denied.');

    // Make sure that the JWT is valid.
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token.');
    }
}