import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // Make sure req.cookies exists before accessing `token`
    if (!req.cookies || !req.cookies.token) {
        return res.status(401).json({ message: "Unauthorised (no token provided)" });
    }
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};