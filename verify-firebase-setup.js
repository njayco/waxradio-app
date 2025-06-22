// Firebase Setup Verification Script
// Run this with: node verify-firebase-setup.js

const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

async function verifyFirebaseSetup() {
  console.log('🔥 Starting Firebase Setup Verification...\n');
  
  try {
    // 1. Initialize Firebase
    console.log('1. Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    
    // 2. Initialize Auth
    console.log('\n2. Testing Firebase Auth...');
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
    
    // 3. Initialize Firestore
    console.log('\n3. Testing Firestore connection...');
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');
    
    // 4. Test Anonymous Auth (to get authenticated user for Firestore)
    console.log('\n4. Testing anonymous authentication...');
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('✅ Anonymous auth successful:', userCredential.user.uid);
      
      // 5. Test Firestore Write
      console.log('\n5. Testing Firestore write operation...');
      const testCollection = collection(db, 'test');
      const docRef = await addDoc(testCollection, {
        test: true,
        timestamp: new Date(),
        message: 'Firebase setup verification'
      });
      console.log('✅ Firestore write successful, doc ID:', docRef.id);
      
      // 6. Test Firestore Read
      console.log('\n6. Testing Firestore read operation...');
      const snapshot = await getDocs(testCollection);
      console.log('✅ Firestore read successful, found', snapshot.size, 'documents');
      
      console.log('\n🎉 ALL TESTS PASSED! Firebase is properly configured.');
      
    } catch (authError) {
      console.error('❌ Authentication error:', authError.message);
      if (authError.code === 'auth/api-key-not-valid') {
        console.log('💡 Check your API key configuration');
      }
    }
    
  } catch (error) {
    console.error('❌ Firebase setup error:', error.message);
    
    // Specific error handling
    if (error.code === 'app/invalid-api-key') {
      console.log('💡 Invalid API key - check your .env.local file');
    } else if (error.code === 'firestore/permission-denied') {
      console.log('💡 Permission denied - check your Firestore rules');
    } else if (error.code === 'firestore/unavailable') {
      console.log('💡 Firestore unavailable - check if Firestore API is enabled');
    } else if (error.message.includes('API key not valid')) {
      console.log('💡 API key restrictions - check Google Cloud Console');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Enable Cloud Firestore API in Google Cloud Console');
    console.log('2. Enable Identity Toolkit API in Google Cloud Console');
    console.log('3. Create Firestore database in Firebase Console');
    console.log('4. Check API key restrictions in Google Cloud Console');
  }
}

// Run verification
verifyFirebaseSetup().catch(console.error); 