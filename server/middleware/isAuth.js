import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const getTokenFromRequest = (req) => {
    if (req.cookies?.token) {
        return req.cookies.token;
    }
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
};

const isAuth = async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            return res.status(401).json({ message: 'token not found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'user not found' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'invalid or expired token' });
    }
};

export default isAuth;