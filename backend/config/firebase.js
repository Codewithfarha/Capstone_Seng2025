const admin = require('firebase-admin');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

let db, auth;

// Method 1: Try to load from service account JSON file
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    auth = admin.auth();
    
    console.log('✅ Firebase Admin initialized successfully (using JSON file)');
  } catch (error) {
    console.error('❌ Error initializing Firebase with JSON file:', error.message);
    console.warn('⚠️  Falling back to mock mode');
    initializeMockMode();
  }
}
// Method 2: Try to load from environment variables
else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore();
    auth = admin.auth();
    
    console.log('✅ Firebase Admin initialized successfully (using .env variables)');
  } catch (error) {
    console.error('❌ Error initializing Firebase with .env:', error.message);
    console.warn('⚠️  Falling back to mock mode');
    initializeMockMode();
  }
} else {
  console.warn('⚠️  Firebase credentials not found. API will return empty data.');
  console.warn('💡 Add serviceAccountKey.json file to backend folder OR update .env file');
  initializeMockMode();
}

function initializeMockMode() {
  // Create mock objects that won't crash
  db = {
    collection: (name) => ({
      get: async () => ({ 
        forEach: (callback) => {},
        size: 0,
        docs: []
      }),
      doc: (id) => ({
        get: async () => ({ exists: false }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      }),
      add: async (data) => ({ id: 'mock-id' }),
      where: () => db.collection(name)
    })
  };
  
  auth = {
    verifyIdToken: async (token) => {
      throw new Error('Firebase Auth not initialized. Add credentials.');
    },
    getUser: async (uid) => {
      throw new Error('Firebase Auth not initialized. Add credentials.');
    },
    setCustomUserClaims: async (uid, claims) => {
      throw new Error('Firebase Auth not initialized. Add credentials.');
    }
  };
}

module.exports = { admin, db, auth };