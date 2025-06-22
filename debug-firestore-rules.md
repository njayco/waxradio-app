# Firestore Rules Debugging Guide

## Current Issue Analysis

You're experiencing a 400 Bad Request error when fetching user profiles. Here's a systematic approach to diagnose and fix the issue.

## 1. Firebase Console Verification Steps

### Step 1: Check Rules in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `wax-radio` project
3. Navigate to **Firestore Database** → **Rules**
4. Verify the deployed rules match your local `firestore.rules`

### Step 2: Check Authentication Status
1. In Firebase Console, go to **Authentication** → **Users**
2. Verify your test user exists and is active
3. Check if the user has a valid `uid`

### Step 3: Check Firestore Data
1. Go to **Firestore Database** → **Data**
2. Look for the `users` collection
3. Verify your user document exists with path: `users/{your-uid}`
4. Check if the document has the expected fields

## 2. Current Rules Configuration

Your current rules (deployed) include:

```javascript
// Primary rule - allows users to read their own profile
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;
}

// Temporary debugging rule - allows any authenticated user to read profiles
match /users/{userId} {
  allow read: if request.auth != null;
}
```

## 3. Common Rule Patterns for User Profiles

### Basic User Profile Access
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### More Permissive (for debugging)
```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

### Production-Ready with Additional Checks
```javascript
match /users/{userId} {
  allow read: if request.auth != null && 
    (request.auth.uid == userId || 
     request.auth.token.admin == true);
  allow write: if request.auth != null && 
    request.auth.uid == userId &&
    request.auth.token.email_verified == true;
}
```

## 4. Testing Strategy

### Step 1: Test with Firebase Console Rules Playground
1. In Firebase Console → Firestore → Rules
2. Click "Rules playground"
3. Set operation to "get"
4. Set path to `databases/(default)/documents/users/{your-uid}`
5. Set authentication to your test user
6. Run the simulation

### Step 2: Check Network Requests
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try to reproduce the error
4. Look for Firestore requests and check:
   - Request URL
   - Request headers (Authorization)
   - Response status and body

### Step 3: Add Debug Logging
Add this to your `useAuth.tsx` to get more detailed error information:

```javascript
} catch (err: any) {
  console.error('💥 Detailed error:', {
    code: err.code,
    message: err.message,
    stack: err.stack,
    customData: err.customData
  });
  
  // Additional debugging for permission errors
  if (err.code === 'permission-denied') {
    console.error('🚫 Permission denied - check Firestore rules');
  }
  if (err.code === 'unauthenticated') {
    console.error('🔐 User not authenticated - check auth state');
  }
}
```

## 5. Temporarily Loosen Rules for Testing

### Ultra-Permissive Rules (USE ONLY FOR TESTING)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: This allows all authenticated users to read/write everything
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Security Implications:**
- Any authenticated user can read/write any document
- Never use in production
- Only use temporarily for debugging
- Always revert to secure rules after testing

## 6. Debugging Checklist

- [ ] Rules are deployed to Firebase
- [ ] User is properly authenticated
- [ ] User document exists in Firestore
- [ ] Document path matches rule pattern
- [ ] Request includes proper authentication headers
- [ ] No network connectivity issues
- [ ] Firebase project settings are correct

## 7. Next Steps

1. **Immediate**: Check if the temporary permissive rules resolve the issue
2. **If resolved**: The issue is with rule specificity, not authentication
3. **If not resolved**: The issue is likely with authentication or network
4. **Always**: Revert to secure rules after debugging

## 8. Rollback Instructions

To revert to secure rules:
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

Then deploy: `firebase deploy --only firestore:rules` 