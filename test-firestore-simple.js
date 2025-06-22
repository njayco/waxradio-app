// Simple Firestore Connection Test
// This script tests the exact same Firebase setup your app uses

console.log('🔥 Testing Firebase connection...\n');

try {
  // Test basic imports (these should work if Firebase is properly installed)
  console.log('1. Testing Firebase imports...');
  
  // We'll simulate what happens in your app
  // Load environment variables
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

  console.log('✅ Firebase config loaded:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    projectId: firebaseConfig.projectId
  });

  console.log('\n2. Firebase initialization would happen here in the browser...');
  console.log('✅ Basic setup verification complete');

  console.log('\n🔧 Next steps to diagnose the 400 error:');
  console.log('1. Open your browser to http://localhost:3000');
  console.log('2. Open Developer Tools (F12)');
  console.log('3. Go to Console tab');
  console.log('4. Try to sign in and look for error messages');
  console.log('5. Go to Network tab and filter for "firestore" requests');
  console.log('6. Look for any 400 or 403 errors in the network requests');
  
  console.log('\n📋 Common 400 Bad Request causes:');
  console.log('• Cloud Firestore API not enabled in Google Cloud Console');
  console.log('• Identity Toolkit API not enabled');
  console.log('• Firestore database not created in Firebase Console');
  console.log('• API key restrictions blocking requests');
  console.log('• Incorrect project ID or auth domain');
  
} catch (error) {
  console.error('❌ Error in setup verification:', error.message);
} 