import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  UploadTaskSnapshot 
} from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface UploadResult {
  downloadURL: string;
  fullPath: string;
  name: string;
}

/**
 * Upload an audio track to Firebase Storage
 */
export const uploadTrack = async (
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('audio/')) {
      reject(new Error('File must be an audio file'));
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      reject(new Error('File size must be less than 50MB'));
      return;
    }

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    
    // Create storage reference
    const trackRef = ref(storage, `tracks/${userId}/${fileName}`);
    
    // Set metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    };

    console.log('🎵 Starting upload:', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      path: `tracks/${userId}/${fileName}`,
      storageBucket: storage.app.options.storageBucket,
      fullGSPath: `gs://${storage.app.options.storageBucket}/tracks/${userId}/${fileName}`
    });

    // Start upload
    const uploadTask = uploadBytesResumable(trackRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        // Progress monitoring
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`🎵 Upload progress: ${progress.toFixed(1)}%`);
        
        if (onProgress) {
          onProgress({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes
          });
        }
      },
      (error) => {
        // Handle upload errors
        console.error('🎵 Upload failed:', error);
        let errorMessage = 'Upload failed';
        
        switch (error.code) {
          case 'storage/unauthorized':
            errorMessage = 'You are not authorized to upload files';
            break;
          case 'storage/canceled':
            errorMessage = 'Upload was canceled';
            break;
          case 'storage/unknown':
            errorMessage = 'An unknown error occurred during upload';
            break;
          case 'storage/invalid-format':
            errorMessage = 'Invalid file format';
            break;
          case 'storage/invalid-checksum':
            errorMessage = 'File was corrupted during upload';
            break;
          default:
            errorMessage = error.message || 'Upload failed';
        }
        
        reject(new Error(errorMessage));
      },
      async () => {
        try {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('🎵 Upload completed:', downloadURL);
          
          resolve({
            downloadURL,
            fullPath: uploadTask.snapshot.ref.fullPath,
            name: uploadTask.snapshot.ref.name
          });
        } catch (error) {
          console.error('🎵 Failed to get download URL:', error);
          reject(new Error('Failed to get download URL'));
        }
      }
    );
  });
};

/**
 * Upload a profile image to Firebase Storage
 */
export const uploadProfileImage = async (
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      reject(new Error('Image size must be less than 5MB'));
      return;
    }

    // Create filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `profile_${timestamp}.${extension}`;
    
    // Create storage reference
    const imageRef = ref(storage, `profile-images/${userId}/${fileName}`);
    
    // Set metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      }
    };

    // Start upload
    const uploadTask = uploadBytesResumable(imageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes
          });
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            fullPath: uploadTask.snapshot.ref.fullPath,
            name: uploadTask.snapshot.ref.name
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (fullPath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fullPath);
    await deleteObject(fileRef);
    console.log('🗑️ File deleted:', fullPath);
  } catch (error) {
    console.error('🗑️ Failed to delete file:', error);
    throw error;
  }
};

/**
 * Get a download URL for a file
 */
export const getFileURL = async (fullPath: string): Promise<string> => {
  try {
    const fileRef = ref(storage, fullPath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('🔗 Failed to get download URL:', error);
    throw error;
  }
}; 