import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Reading token from HTTP-only cookie

    // If no token, skip over authentication
    if (!token) {
        req.user = null;
        return next();
    }

    // If token exists, verify it
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
            return next();
        }
        req.user = user;
        next();
    });
};