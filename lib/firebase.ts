/**
 * Firebase Configuration and Initialization
 * 
 * This module handles the initialization and configuration of Firebase services
 * for the WaxRadio application. It sets up authentication, Firestore database,
 * storage, and analytics services.
 * 
 * Features:
 * - Environment variable validation
 * - Firebase app initialization
 * - Service initialization (Auth, Firestore, Storage, Analytics)
 * - Error handling for missing configuration
 * - Debug logging for development
 * 
 * The module validates all required environment variables before initializing
 * Firebase to prevent runtime errors and provide clear error messages.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

/**
 * Firebase Configuration Object
 * Contains all Firebase configuration values from environment variables
 * These values are used to initialize the Firebase app
 * 
 * For static exports, we need to embed these values directly in the build
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBVyh4y9wvllKfdO0K-0YfF4tKweidlnHo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "wax-radio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wax-radio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "wax-radio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "881907029843",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:881907029843:web:77af63f60447c06b52b3a6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0DFQKQQCXW",
};

/**
 * Required Environment Variables
 * List of environment variables that must be present for Firebase to work
 * Missing variables will cause the app to throw an error during initialization
 */
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

/**
 * Environment Variable Validation
 * Logs the status of all required environment variables for debugging
 * This helps identify missing or incorrect configuration during development
 */
console.log('🔍 Environment Variables Debug:');
console.log('📁 Environment files loaded:', {
  hasEnvLocal: !!process.env.NODE_ENV === 'development' && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasEnv: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  nodeEnv: process.env.NODE_ENV
});

requiredEnvVars.forEach(envVar => {
  console.log(`  ${envVar}: ${process.env[envVar] ? '✅ SET' : '❌ MISSING'}`);
});

/**
 * Check for Missing Environment Variables
 * Filters out any missing required environment variables and logs warnings
 * but doesn't throw errors since we have fallback values for production
 */
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️ Missing environment variables:', missingEnvVars);
  console.warn('💡 Using fallback values for production build');
  console.warn('💡 For development, create a .env.local file with your Firebase configuration');
}

/**
 * Configuration Validation Logging
 * Logs the Firebase configuration status (without exposing sensitive values)
 * This helps verify that the configuration is properly loaded
 */
console.log('🔥 Firebase config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

/**
 * Firebase App Initialization
 * Creates the main Firebase app instance using the validated configuration
 * This is the first step in setting up Firebase services
 */
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

/**
 * Firebase Services Initialization
 * Initialize individual Firebase services that will be used throughout the app
 * Each service is exported for use in other modules
 */

// Authentication service for user login/logout
export const auth = getAuth(app);

// Firestore database for storing user data, playlists, tracks, etc.
export const db = getFirestore(app);

// Storage service for file uploads (audio files, images)
export const storage = getStorage(app);

console.log('✅ Firebase services initialized');

/**
 * Analytics Initialization (Browser Only)
 * Initialize Firebase Analytics only in browser environment
 * Analytics is not available during server-side rendering
 */
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Export analytics service and default app instance
export { analytics };
export default app; 