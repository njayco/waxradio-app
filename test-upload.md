# Firebase Storage Upload Testing Guide

## 🎯 Quick Test

### 1. Add Upload Component to Your App

Add this to your main dashboard or any page:

```tsx
import { TrackUpload } from '@/components/upload/track-upload'

// In your component:
<TrackUpload />
```

### 2. Test Upload Process

1. **Log in** to your app
2. **Select an audio file** (.mp3, .wav, etc.)
3. **Click "Upload Track"**
4. **Watch progress bar** and check console logs
5. **Copy download URL** when complete

### 3. Expected Behavior

✅ **Success**: File uploads, progress shown, download URL returned
❌ **CORS Error**: Firebase Storage not enabled or CORS not configured
❌ **Auth Error**: User not logged in or insufficient permissions

## 🔧 Manual Test Code

If you want to test without the component, use this in browser console:

```javascript
// Test upload function
import { uploadTrack } from './lib/storage';
import { auth } from './lib/firebase';

// Create a test file (you'll need to select one in file input)
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'audio/*';
fileInput.click();

fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (file && auth.currentUser) {
    try {
      console.log('🎵 Starting test upload...');
      const result = await uploadTrack(file, auth.currentUser.uid);
      console.log('✅ Upload successful:', result);
    } catch (error) {
      console.error('❌ Upload failed:', error);
    }
  }
};
```

## 🐛 Troubleshooting

### CORS Error
- **Cause**: Firebase Storage not enabled
- **Fix**: Enable Storage in Firebase Console first

### Unauthorized Error  
- **Cause**: Storage rules too restrictive
- **Fix**: Check storage.rules file is deployed

### File Too Large
- **Cause**: File > 50MB
- **Fix**: Use smaller file or increase limit in code

### Network Error
- **Cause**: Poor connection or Firebase down
- **Fix**: Check internet connection and Firebase status 