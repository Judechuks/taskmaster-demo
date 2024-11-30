const jwt = require("jsonwebtoken");

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); // No token, unauthorized
  }

  jwt.verify(
    token,
    "V32PJUakuHKtVfxl2wFazDD+ItEddSwUzHnSzhWeins=",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" }); // Token invalid, forbidden
      }
      req.user = user; // Attach user info to request object
      next(); // Proceed to next middleware or route handler
    }
  );
};

// Authorization middleware for task actions
const authorizeTaskAction = (req, res, next) => {
  const action = req.method; // Get the HTTP method (POST, PUT, DELETE)

  // Here you can define what actions are allowed for different roles
  const allowedActions = {
    POST: ["create"],
    PUT: ["update"],
    DELETE: ["delete"],
  };

  // Check if the user has permission based on the action
  if (
    allowedActions[action].includes("create") ||
    allowedActions[action].includes("update") ||
    allowedActions[action].includes("delete")
  ) {
    next(); // User is authorized for this action
  } else {
    return res.status(403).json({ message: "Forbidden" }); // User is not authorized for this action
  }
};

module.exports = { authenticateToken, authorizeTaskAction };
