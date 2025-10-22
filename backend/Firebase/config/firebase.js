const admin = require('firebase-admin');
require('dotenv').config();

/**
 * Initialize Firebase Admin SDK
 * Uses environment variables for configuration
 */
const initializeFirebase = () => {
  try {
    // Prevent multiple initializations
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      
      console.log('✅ Firebase Admin SDK initialized successfully');
      console.log(`📦 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    }
    
    return admin.firestore();
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    process.exit(1);
  }
};

const db = initializeFirebase();

module.exports = { db, admin };