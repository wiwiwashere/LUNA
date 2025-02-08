const { verifyToken } = require('../services/firebase');

// Middleware function to authenticate using Firebase token
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; // Assumes token is passed as a Bearer token
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await verifyToken(token);
    req.userId = decodedToken.uid; // Store user ID from the decoded token
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };
