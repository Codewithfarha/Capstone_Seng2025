const { auth } = require('../config/firebase');

// Verify Firebase ID token
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token is required' 
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    res.json({
      success: true,
      message: 'Token verified successfully',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'user'
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token',
      message: error.message 
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await auth.getUser(req.user.uid);
    
    res.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        metadata: user.metadata
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get user profile',
      message: error.message 
    });
  }
};

// Set custom user claims (for admin role)
const setUserRole = async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'UID and role are required' 
      });
    }

    await auth.setCustomUserClaims(uid, { role });

    res.json({
      success: true,
      message: `User role set to ${role} successfully`
    });
  } catch (error) {
    console.error('Error setting user role:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to set user role',
      message: error.message 
    });
  }
};

module.exports = {
  verifyToken,
  getUserProfile,
  setUserRole
};