// Creating a middleware to protect routes that require authentication.
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from request headers
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    req.userId = decoded.id; // Attaching user ID to request object for later use in protected routes
    next(); // To proceed to next middleware or route handler
  });
};

module.exports = authMiddleware; // Export middleware for use in protected routes
