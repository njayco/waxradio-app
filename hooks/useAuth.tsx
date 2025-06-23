/**
 * Authentication Hook and Context Provider
 * 
 * This module provides comprehensive authentication functionality for the WaxRadio application.
 * It manages user authentication state, user profiles, and provides authentication methods
 * using Firebase Authentication and Firestore for profile data.
 * 
 * Features:
 * - Email/password authentication
 * - Google OAuth authentication
 * - User profile management
 * - Profile setup completion tracking
 * - Error handling and loading states
 * - Automatic profile creation for new users
 * 
 * The hook uses React Context to provide authentication state throughout the app
 * and includes retry logic for Firestore operations to handle network issues.
 */

"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/**
 * User type enumeration
 * Defines the two types of users in the system
 */
export type UserType = 'artist' | 'fan';

/**
 * User Profile Interface
 * Defines the structure of user profile data stored in Firestore
 */
export interface UserProfile {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User's email address
  displayName: string;            // User's display name
  userType: UserType;             // Type of user (artist or fan)
  bio?: string;                   // Optional user biography
  profileImageUrl?: string;       // Optional profile image URL
  profileSetupComplete?: boolean; // Whether profile setup is complete
  onboarded?: boolean;            // Whether user has completed onboarding
  createdAt: Date;                // Account creation timestamp
  updatedAt: Date;                // Last update timestamp
}

/**
 * Authentication Context Type
 * Defines the interface for the authentication context
 */
interface AuthContextType {
  user: FirebaseUser | null;                                    // Firebase Auth user object
  userProfile: UserProfile | null;                              // User profile data
  loading: boolean;                                             // Loading state
  profileSetupComplete: boolean;                                // Profile setup completion status
  signIn: (email: string, password: string) => Promise<void>;   // Email/password sign in
  signUp: (email: string, password: string, displayName: string, userType: UserType) => Promise<void>; // User registration
  signInWithGoogle: () => Promise<void>;                        // Google OAuth sign in
  signOut: () => Promise<void>;                                 // Sign out
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>; // Update profile
  error: string | null;                                         // Error state
}

// Create React Context for authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Manages authentication state, user profiles, and provides authentication methods.
 * 
 * State Management:
 * - user: Firebase Auth user object
 * - userProfile: User profile data from Firestore
 * - loading: Loading state for auth operations
 * - profileSetupComplete: Whether user has completed profile setup
 * - error: Error messages for failed operations
 * 
 * @param children - React components to be wrapped with auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Authentication state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Main authentication state listener
   * Sets up Firebase Auth state listener and handles user profile management
   * 
   * New State Flow:
   * 1. After successful login, redirect to ProfileSetupState regardless of role
   * 2. After profile setup, show OnboardingState only for first-time users
   * 3. Finally, show DashboardState for all users
   */
  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    console.log('🔥 Firebase auth object:', !!auth);
    console.log('🔥 Current auth user:', auth.currentUser ? 'User exists' : 'No user');
    
    // Check for redirect result from Google OAuth
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('🔄 Got redirect result:', result.user.email);
          await handleGoogleSignInResult(result);
        }
      } catch (error) {
        console.error('🔄 Redirect result error:', error);
      }
    };
    
    checkRedirectResult();
    
    // Immediate check of current user to avoid loading delay
    if (auth.currentUser) {
      console.log('🚀 Found existing user, processing immediately');
      setUser(auth.currentUser);
      setLoading(false);
    }
    
    // Timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Auth timeout reached, setting loading to false');
      if (loading) {
        setLoading(false);
      }
    }, 3000); // 3 second timeout
    
    // Set up Firebase Auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 Auth state changed:', user ? `User logged in (${user.uid})` : 'No user');
      clearTimeout(timeoutId); // Clear timeout since auth state changed
      setUser(user);
      setError(null);
      
      if (user) {
        // Retry logic for Firestore connection to handle network issues
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
                profileSetupComplete: data.profileSetupComplete || false,
                onboarded: data.onboarded || false,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
              });
              
              // NEW STATE FLOW LOGIC:
              // After successful login, check profile setup completion first
              if (!data.profileSetupComplete) {
                console.log('📋 User needs profile setup - redirecting to ProfileSetupState');
                setProfileSetupComplete(false);
              } else if (!data.onboarded) {
                console.log('🎓 User needs onboarding - redirecting to OnboardingState');
                setProfileSetupComplete(true);
              } else {
                console.log('✅ User is fully set up - redirecting to DashboardState');
                setProfileSetupComplete(true);
              }
              
              // Fix existing profiles that don't have profileSetupComplete or onboarded fields
              const needsUpdate = !data.hasOwnProperty('profileSetupComplete') || !data.hasOwnProperty('onboarded');
              if (needsUpdate) {
                console.log('🔧 Fixing existing profile - adding missing fields');
                try {
                  const updateData: any = { updatedAt: new Date() };
                  
                  if (!data.hasOwnProperty('profileSetupComplete')) {
                    // For existing users, determine if profile setup is complete based on bio
                    const shouldBeComplete = data.userType === 'fan' || !!(data.bio && data.bio.trim());
                    updateData.profileSetupComplete = shouldBeComplete;
                    console.log('🔧 Setting profileSetupComplete to:', shouldBeComplete);
                  }
                  
                  if (!data.hasOwnProperty('onboarded')) {
                    // For existing users, assume they've been onboarded
                    updateData.onboarded = true;
                    console.log('🔧 Setting onboarded to true for existing user');
                  }
                  
                  await updateDoc(doc(db, 'users', user.uid), updateData);
                  console.log('✅ Fixed existing profile');
                  
                  // Update local state with fixed values
                  if (updateData.hasOwnProperty('profileSetupComplete')) {
                    setProfileSetupComplete(updateData.profileSetupComplete);
                  }
                } catch (fixError) {
                  console.error('💥 Failed to fix existing profile:', fixError);
                }
              }
              
              break; // Success, exit retry loop
            } else {
              console.log('❌ User profile not found in Firestore - creating minimal profile');
              // Create a minimal profile for existing users who don't have one
              const minimalProfile: Omit<UserProfile, 'uid'> = {
                email: user.email || '',
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                userType: 'fan', // Default to fan
                bio: '',
                profileImageUrl: user.photoURL || '',
                profileSetupComplete: false, // Force profile setup for all users
                onboarded: false, // Force onboarding for new users
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              
              try {
                await setDoc(doc(db, 'users', user.uid), minimalProfile);
                console.log('✅ Created minimal profile for user');
                // Set the profile in state and mark setup as incomplete
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
        profileSetupComplete: false, // Force profile setup for all new users
        onboarded: false, // Force onboarding for all new users
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
      // Add custom parameters to ensure proper sign-in flow
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      let result;
      
      try {
        // Try popup first
        console.log('🔥 Attempting Google sign-in with popup...');
        result = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        console.warn('🚨 Popup failed, trying redirect...', popupError.code);
        
        // If popup fails due to COOP or other issues, use redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/cancelled-popup-request' ||
            popupError.message.includes('Cross-Origin-Opener-Policy')) {
          
          console.log('🔄 Using redirect method for Google sign-in...');
          await signInWithRedirect(auth, provider);
          return; // Redirect will handle the rest
        }
        
        throw popupError;
      }
      
      await handleGoogleSignInResult(result);
      
    } catch (error: any) {
      console.error('🔥 Google sign-in error:', error);
      // Handle specific popup errors
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      }
      throw error;
    }
  };

  // Helper function to handle Google sign-in result
  const handleGoogleSignInResult = async (result: any) => {
    if (!result?.user) return;
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      console.log('🆕 Creating new user profile for Google sign-in');
      // For Google sign-in, default to 'fan' user type
      const userProfile: Omit<UserProfile, 'uid'> = {
        email: result.user.email || '',
        displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Fan',
        userType: 'fan',
        bio: '',
        profileImageUrl: result.user.photoURL || '',
        profileSetupComplete: false, // Force profile setup for new users
        onboarded: false, // Force onboarding for new users
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      console.log('✅ New user profile created');
    } else {
      console.log('👤 Existing user profile found');
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
      
      // Handle profile setup completion
      if (updates.hasOwnProperty('profileSetupComplete')) {
        setProfileSetupComplete(!!updates.profileSetupComplete);
        console.log('📋 Profile setup completion updated:', !!updates.profileSetupComplete);
      }
      
      // Handle onboarding completion
      if (updates.hasOwnProperty('onboarded')) {
        console.log('🎓 Onboarding completion updated:', !!updates.onboarded);
      }
      
      // Mark profile setup as complete if bio is provided (legacy support)
      if (updates.bio && updates.bio.trim() && !updates.hasOwnProperty('profileSetupComplete')) {
        setProfileSetupComplete(true);
        console.log('📋 Profile setup marked complete due to bio update');
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