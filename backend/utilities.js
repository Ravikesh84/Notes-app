const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        console.log('Authentication failed: No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            console.log('Authentication failed: Invalid token', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
};
