import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from Authorization header

    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware or handler
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Use this middleware for routes that need authentication
