// Configuration for API keys and environment settings
export const Config = {
  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.uride.com/v1',
  API_TIMEOUT: 30000, // 30 seconds

  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',

  // Payment Configuration
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_KEY',

  // Push Notifications
  FIREBASE_CONFIG: {
    apiKey: process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'uride.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'uride',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'uride.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
    appId: process.env.FIREBASE_APP_ID || 'YOUR_APP_ID'
  },

  // Map Configuration
  DEFAULT_ZOOM_LEVEL: 15,
  LOCATION_UPDATE_INTERVAL: 10000, // 10 seconds

  // Ride Configuration
  RIDE_SEARCH_RADIUS: 5000, // 5 km in meters
  RIDE_REQUEST_TIMEOUT: 300000, // 5 minutes

  // App Configuration
  APP_VERSION: '1.0.0',
  MIN_PASSWORD_LENGTH: 6,

  // Feature Flags
  ENABLE_REAL_TIME_TRACKING: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_IN_APP_PAYMENTS: true,
};

export default Config;
