// Creating a middleware to protect routes that require authentication.
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from request headers
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ error: "Unauthorized - No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      "V32PJUakuHKtVfxl2wFazDD+ItEddSwUzHnSzhWeins="
    );

    req.user = decoded;
    next(); // To proceed to next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized access." });
  }
};

module.exports = authMiddleware; // Export middleware for use in protected routes
