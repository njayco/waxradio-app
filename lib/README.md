# Lib Directory

This directory contains utility libraries, configurations, and helper functions for the WaxRadio application.

## 📁 Structure

```
lib/
├── firebase.ts             # Firebase configuration and initialization
├── storage.ts              # File storage utilities and operations
└── utils.ts                # General utility functions
```

## 🔥 Firebase Configuration

### `firebase.ts`

**Purpose**: Firebase SDK configuration and service initialization.

**Features**:
- Firebase app initialization
- Authentication service setup
- Firestore database configuration
- Storage bucket configuration
- Environment variable validation

**Key Functions**:
- `initializeFirebase()` - Initialize Firebase app
- `getAuth()` - Get authentication instance
- `getFirestore()` - Get Firestore instance
- `getStorage()` - Get Storage instance
- `validateConfig()` - Validate environment variables

**Configuration**:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```

## 📁 Storage Utilities

### `storage.ts`

**Purpose**: File storage operations and management utilities.

**Features**:
- File upload to Firebase Storage
- File download and URL generation
- File metadata management
- Image optimization
- Audio file processing

**Key Functions**:
- `uploadFile()` - Upload file to storage
- `getDownloadURL()` - Get file download URL
- `deleteFile()` - Delete file from storage
- `updateMetadata()` - Update file metadata
- `optimizeImage()` - Optimize image files

**File Types Supported**:
- Audio files (MP3, WAV, FLAC)
- Image files (JPG, PNG, WebP)
- Document files (PDF, DOC)

**Usage**:
```typescript
// Upload audio file
const audioUrl = await uploadFile(audioFile, 'audio/');

// Upload image with optimization
const imageUrl = await uploadFile(imageFile, 'images/', { optimize: true });

// Get download URL
const url = await getDownloadURL(filePath);
```

## 🛠️ Utility Functions

### `utils.ts`

**Purpose**: General utility functions used throughout the application.

**Features**:
- String manipulation
- Date formatting
- Validation helpers
- Format conversion
- Common calculations

**Key Functions**:
- `formatDuration()` - Format time duration
- `formatFileSize()` - Format file size
- `validateEmail()` - Email validation
- `generateId()` - Generate unique IDs
- `debounce()` - Debounce function calls

**Usage**:
```typescript
// Format audio duration
const duration = formatDuration(125); // "2:05"

// Format file size
const size = formatFileSize(1024000); // "1.0 MB"

// Validate email
const isValid = validateEmail('user@example.com'); // true
```

## 🔧 Development Guidelines

### Firebase Configuration

1. **Environment Variables**: All Firebase config must use environment variables
2. **Validation**: Always validate config before initialization
3. **Error Handling**: Provide meaningful error messages
4. **Security**: Never expose sensitive keys in client code

### Storage Operations

1. **File Validation**: Validate file types and sizes
2. **Progress Tracking**: Implement upload progress indicators
3. **Error Recovery**: Handle upload failures gracefully
4. **Cleanup**: Remove temporary files after processing

### Utility Functions

1. **Pure Functions**: Keep utilities pure and predictable
2. **Type Safety**: Use TypeScript for all utilities
3. **Performance**: Optimize for common use cases
4. **Testing**: Write tests for complex utilities

## 🚀 Usage Examples

### Firebase Setup
```typescript
import { initializeFirebase, getAuth } from '@/lib/firebase';

// Initialize Firebase
initializeFirebase();

// Use authentication
const auth = getAuth();
```

### File Upload
```typescript
import { uploadFile, getDownloadURL } from '@/lib/storage';

// Upload audio file
const handleUpload = async (file: File) => {
  try {
    const uploadResult = await uploadFile(file, 'audio/');
    const downloadUrl = await getDownloadURL(uploadResult.ref.fullPath);
    return downloadUrl;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Utility Functions
```typescript
import { formatDuration, validateEmail } from '@/lib/utils';

// Format time
const timeString = formatDuration(seconds);

// Validate input
const isValidEmail = validateEmail(email);
```

## 🔒 Security Considerations

### Firebase Security
- Use Firebase Security Rules
- Validate user permissions
- Implement proper authentication
- Monitor usage and costs

### File Storage Security
- Validate file types
- Implement size limits
- Use secure URLs
- Clean up unused files

### Data Validation
- Validate all inputs
- Sanitize user data
- Use TypeScript for type safety
- Implement proper error handling

## 📊 Performance Optimization

### Firebase Optimization
- Use offline persistence
- Implement caching strategies
- Optimize queries
- Monitor performance

### Storage Optimization
- Compress files before upload
- Use CDN for delivery
- Implement lazy loading
- Cache frequently accessed files

### Utility Optimization
- Memoize expensive calculations
- Use efficient algorithms
- Minimize bundle size
- Profile performance impact 