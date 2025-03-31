import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import db from "../db/config.js"; // Import MySQL pool

// Middleware to authenticate user via JWT
const authenticate = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        // Fetch user from MySQL database
        const [users] = await db.promise().query(
            "SELECT id, name, email,isAdmin,isVerified FROM Users WHERE id = ?",
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = users[0]; 
        // Store user in request object
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
});

// Middleware to authorize only Admin (HR)
const authorizeAdmin = (req, res, next) => {
    console.log(req.user.isAdmin);
    if (req.user && req.user.isAdmin  && req.user.isVerified ) {
        next();
    } else {
        res.status(403).json({ message: "Not authorized, Admin access only" });
    }
};

export { authenticate, authorizeAdmin };
