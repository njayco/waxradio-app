"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserType = 'artist' | 'fan';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  bio?: string;
  profileImageUrl?: string;
  profileSetupComplete?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileSetupComplete: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, userType: UserType) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    console.log('🔥 Firebase auth object:', !!auth);
    console.log('🔥 Current auth user:', auth.currentUser ? 'User exists' : 'No user');
    
    // Immediate check of current user
    if (auth.currentUser) {
      console.log('🚀 Found existing user, processing immediately');
      // Process the existing user immediately
      setUser(auth.currentUser);
      setLoading(false);
    }
    
    // Set up a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Auth timeout reached, setting loading to false');
      if (loading) {
        setLoading(false);
      }
    }, 3000); // Reduced to 3 seconds
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 Auth state changed:', user ? `User logged in (${user.uid})` : 'No user');
      clearTimeout(timeoutId); // Clear timeout since auth state changed
      setUser(user);
      setError(null);
      
      if (user) {
        // Retry logic for Firestore connection
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            console.log('👤 Fetching user profile for:', user.uid, `(attempt ${retryCount + 1})`);
            // Fetch user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              console.log('✅ User profile found in Firestore');
              const data = userDoc.data();
              setUserProfile({
                uid: user.uid,
                email: user.email || '',
                displayName: data.displayName,
                userType: data.userType,
                bio: data.bio || '',
                profileImageUrl: data.profileImageUrl || '',
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
              });
              // Profile is complete if it has a bio OR is explicitly marked as complete
              const isProfileComplete = !!(data.bio && data.bio.trim()) || !!data.profileSetupComplete;
              setProfileSetupComplete(isProfileComplete);
              console.log('📋 Profile setup complete:', isProfileComplete, 'bio:', !!data.bio, 'explicit:', !!data.profileSetupComplete);
              break; // Success, exit retry loop
            } else {
              console.log('❌ User profile not found in Firestore - creating minimal profile');
              // Create a minimal profile for existing users who don't have one
              const minimalProfile: Omit<UserProfile, 'uid'> = {
                email: user.email || '',
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                userType: 'fan', // Default to fan
                bio: '',
                profileImageUrl: '',
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              
              try {
                await setDoc(doc(db, 'users', user.uid), minimalProfile);
                console.log('✅ Created minimal profile for user');
                // Set the profile in state but mark setup as incomplete
                setUserProfile({
                  uid: user.uid,
                  ...minimalProfile,
                });
                setProfileSetupComplete(false); // Force profile setup
              } catch (createError: any) {
                console.error('💥 Failed to create minimal profile:', createError);
                setError('Failed to create user profile. Please try again.');
              }
              break;
            }
          } catch (err: any) {
            console.error('💥 Error fetching user profile (attempt', retryCount + 1, '):', err);
            console.error('💥 Detailed error:', {
              code: err.code,
              message: err.message,
              stack: err.stack,
              customData: err.customData,
              uid: user.uid,
              userExists: !!user,
              attemptNumber: retryCount + 1
            });
            
            // Additional debugging for specific error types
            if (err.code === 'permission-denied') {
              console.error('🚫 Permission denied - check Firestore rules');
              console.error('🔐 User auth details:', {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified
              });
            }
            if (err.code === 'unauthenticated') {
              console.error('🔐 User not authenticated - check auth state');
            }
            if (err.code === 'unavailable') {
              console.error('🌐 Firestore unavailable - network issue');
            }
            
            retryCount++;
            
            if (retryCount >= maxRetries) {
              setUserProfile(null);
              setProfileSetupComplete(false);
              if (err.code === 'unavailable' || err.message.includes('offline')) {
                setError('Connection to database failed. Please check your internet connection and try again.');
              } else if (err.code === 'permission-denied') {
                setError('Permission denied: Unable to access user profile. Check Firestore rules.');
              } else {
                setError(err.message || 'Failed to load user profile. Please try again.');
              }
            } else {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }
      } else {
        console.log('🚪 No user, clearing profile');
        setUserProfile(null);
        setProfileSetupComplete(false);
      }
      console.log('✨ Setting loading to false');
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, userType: UserType) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: Omit<UserProfile, 'uid'> = {
        email: user.email || '',
        displayName,
        userType,
        bio: '',
        profileImageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // For Google sign-in, default to 'fan' user type
        const userProfile: Omit<UserProfile, 'uid'> = {
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          userType: 'fan',
          bio: '',
          profileImageUrl: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await updateDoc(doc(db, 'users', user.uid), updateData);
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...updates,
          updatedAt: new Date(),
        });
      }
      
      // Mark profile setup as complete if bio is provided or explicitly set
      if (updates.bio && updates.bio.trim()) {
        setProfileSetupComplete(true);
      }
      
      // Allow explicit profile setup completion
      if (updates.hasOwnProperty('profileSetupComplete')) {
        setProfileSetupComplete(!!updates.profileSetupComplete);
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    profileSetupComplete,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: signOutUser,
    updateUserProfile,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 