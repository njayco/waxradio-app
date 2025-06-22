// Firebase API Verification Script
// This tests if Cloud Firestore API and Identity Toolkit API are enabled

const https = require('https');
const fs = require('fs');

console.log('🔥 Firebase API Verification Starting...\n');

// Load config from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const config = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    config[key.trim()] = value.trim();
  }
});

const projectId = config.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'wax-radio';
const apiKey = config.NEXT_PUBLIC_FIREBASE_API_KEY;

console.log('📋 Project Configuration:');
console.log(`   Project ID: ${projectId}`);
console.log(`   API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'Missing'}`);
console.log('');

// Test 1: Check if Firestore API is accessible
function testFirestoreAPI() {
  return new Promise((resolve) => {
    console.log('1. Testing Cloud Firestore API...');
    
    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: `/v1/projects/${projectId}/databases`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Cloud Firestore API is ENABLED and accessible');
          try {
            const parsed = JSON.parse(data);
            if (parsed.databases && parsed.databases.length > 0) {
              console.log('   ✅ Firestore database exists:', parsed.databases[0].name);
            }
          } catch (e) {
            console.log('   ✅ API accessible but response parsing failed');
          }
        } else if (res.statusCode === 403) {
          console.log('   ❌ Cloud Firestore API is DISABLED (403 Forbidden)');
          console.log('   🔧 Enable at: https://console.cloud.google.com/apis/library/firestore.googleapis.com');
        } else {
          console.log(`   ⚠️  Unexpected response: ${res.statusCode} ${res.statusMessage}`);
          console.log('   Response:', data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Network error:', error.message);
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log('   ⚠️  Request timeout - check network connection');
      req.destroy();
      resolve();
    });

    req.end();
  });
}

// Test 2: Check if Identity Toolkit API is accessible
function testIdentityAPI() {
  return new Promise((resolve) => {
    console.log('\n2. Testing Identity Toolkit API...');
    
    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      port: 443,
      path: `/v1/projects/${projectId}:fetchSignInMethodsForEmail`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const postData = JSON.stringify({
      email: 'test@example.com',
      key: apiKey
    });

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 400) {
          // 400 is expected for invalid email, but means API is working
          console.log('   ✅ Identity Toolkit API is ENABLED and accessible');
        } else if (res.statusCode === 403) {
          console.log('   ❌ Identity Toolkit API is DISABLED (403 Forbidden)');
          console.log('   🔧 Enable at: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com');
        } else {
          console.log(`   ⚠️  Unexpected response: ${res.statusCode} ${res.statusMessage}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Network error:', error.message);
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log('   ⚠️  Request timeout - check network connection');
      req.destroy();
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runVerification() {
  await testFirestoreAPI();
  await testIdentityAPI();
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. If APIs are enabled ✅ - your 400 error should be resolved');
  console.log('   2. If APIs are disabled ❌ - click the provided links to enable them');
  console.log('   3. Test your app at http://localhost:3000 and check browser console');
  console.log('   4. Look for detailed error messages with enhanced logging we added');
}

runVerification().catch(console.error); 