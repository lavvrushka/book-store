import jwt from 'jsonwebtoken';

const JWT_SECRET = 'bebra';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log("Received token:", token);  

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error verifying token:", err);  
            return res.status(403).json({ error: 'Invalid token' });
        }

        console.log("Decoded user:", user); 
        req.user = user;
        next();
    });
};


export default authenticateToken;