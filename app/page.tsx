/**
 * WaxRadio Main Application Component
 * 
 * This is the main page component that handles the entire application flow including:
 * - User authentication state management
 * - Profile setup for new users
 * - Dashboard rendering based on user type (Fan/Artist)
 * - Onboarding tutorial for new users
 * - Audio player integration
 * - Loading and error states
 * 
 * The component implements a state machine pattern to handle different user states
 * and provides appropriate UI for each state.
 */

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/auth/login-form"
import { SignUpForm } from "@/components/auth/signup-form"
import { ProfileSetup } from "@/components/profile/profile-setup"
import { FanDashboard } from "@/components/dashboard/fan-dashboard"
import { ArtistDashboard } from "@/components/dashboard/artist-dashboard"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import { OnboardingTutorial } from "@/components/onboarding-tutorial"
import { useOnboarding } from "@/hooks/useOnboarding"
import { LogOut, User, Settings, Home, Radio, Music, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Extend Window interface for debugging purposes
declare global {
  interface Window {
    lastDebugState?: string;
  }
}

/**
 * WaxRadioApp Component
 * 
 * Main application component that orchestrates the entire user experience.
 * Handles authentication flow, user onboarding, and dashboard rendering.
 * 
 * State Management:
 * - authMode: Controls whether to show login or signup form
 * - showProfileSetup: Controls profile setup modal visibility
 * - loadingTimeout: Fallback for loading states
 * 
 * State Flow Order:
 * 1. LoadingState - Initial app loading with timeout fallback
 * 2. ErrorState - Display errors with retry functionality
 * 3. AuthenticationState - Login/signup forms for unauthenticated users
 * 4. ProfileSetupState - Profile setup for both artists and fans
 * 5. OnboardingState - Tutorial for first-time users
 * 6. DashboardState - Main application interface
 * 
 * @returns JSX element representing the current application state
 */
export default function WaxRadioApp() {
  // Local state management
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  
  // Custom hooks for application state
  const { user, userProfile, loading, profileSetupComplete, signOut, error, updateUserProfile } = useAuth()
  const audioPlayer = useAudioPlayer()
  const { showOnboarding, isLoading: onboardingLoading, completeOnboarding, resetOnboarding } = useOnboarding()
  const { toast } = useToast()

  // Immediate Firebase configuration check on component mount
  useEffect(() => {
    console.log('🚀 WaxRadioApp mounted');
    console.log('🔧 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }, []);

  // Loading timeout fallback to prevent infinite loading states
  // This ensures users can still access the app even if there are loading issues
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading || onboardingLoading) {
        console.log('⏰ Loading timeout reached - showing auth forms as fallback');
        setLoadingTimeout(true);
      }
    }, 10000); // 10 second timeout for loading states

    return () => clearTimeout(timeoutId);
  }, [loading, onboardingLoading]);

  // Enhanced debug logging for development and troubleshooting
  useEffect(() => {
    const debugInfo = {
      user: !!user,
      userProfile: !!userProfile,
      userProfileData: userProfile ? {
        uid: userProfile.uid,
        userType: userProfile.userType,
        displayName: userProfile.displayName,
        profileSetupComplete: userProfile.profileSetupComplete,
        hasBio: !!userProfile.bio
      } : null,
      loading,
      loadingTimeout,
      profileSetupComplete,
      showOnboarding,
      error: !!error,
      onboardingLoading,
      firebaseConfig: {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      }
    };
    
    console.log('🎯 App state:', debugInfo);
    
    // Detailed flow analysis for authenticated users
    if (user && userProfile) {
      console.log('🔍 Flow analysis:');
      console.log('  - User authenticated:', !!user);
      console.log('  - User profile loaded:', !!userProfile);
      console.log('  - User type:', userProfile.userType);
      console.log('  - Profile setup complete:', profileSetupComplete);
      console.log('  - Show onboarding:', showOnboarding);
      console.log('  - Loading states:', { loading, onboardingLoading });
    }
  }, [user, userProfile, loading, loadingTimeout, profileSetupComplete, showOnboarding, error, onboardingLoading]);

  /**
   * Handle user sign out with error handling and user feedback
   */
  const handleSignOut = async () => {
    try {
      await signOut()
      setShowProfileSetup(false)
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Handle profile setup completion
   */
  const handleProfileSetupComplete = async () => {
    console.log('✅ Profile setup completed');
    try {
      // Mark profile setup as complete in Firestore
      await updateUserProfile({ profileSetupComplete: true });
      setShowProfileSetup(false);
      console.log('✅ Profile setup marked complete in Firestore');
    } catch (error) {
      console.error('❌ Failed to mark profile setup complete:', error);
      // Still close the modal even if Firestore update fails
      setShowProfileSetup(false);
    }
  }

  // Loading state with animated spinner and descriptive text
  if ((loading || onboardingLoading) && !loadingTimeout) {
    console.log('⏳ Showing loading screen');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Wax Radio...</p>
          <p className="text-sm text-muted-foreground mt-2">Setting up your music experience</p>
        </div>
      </div>
    )
  }

  // Error state with retry functionality
  if (error) {
    console.log('❌ Showing error screen:', error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl font-bold mb-4">Error</div>
          <p className="mb-2">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // Authentication forms for unauthenticated users or loading timeout fallback
  if (!user || loadingTimeout) {
    console.log('🔐 Showing auth forms (user:', !!user, 'timeout:', loadingTimeout, ')');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand header with colored logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-red-500 font-bold text-4xl">W</span>
              <span className="text-yellow-500 font-bold text-4xl">a</span>
              <span className="text-green-500 font-bold text-4xl">x</span>
              <span className="text-white font-light text-3xl italic">radio</span>
            </div>
            <p className="text-muted-foreground">
              Discover and share music with the community
            </p>
          </div>
          
          {/* Toggle between login and signup forms */}
          {authMode === "login" ? (
            <LoginForm onSwitchToSignUp={() => setAuthMode("signup")} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setAuthMode("login")} />
          )}
        </div>
      </div>
    )
  }

  // User profile loading state
  if (!userProfile) {
    console.log('👤 Showing user profile loading');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your profile...</p>
          <p className="text-sm text-muted-foreground mt-2">Getting your music preferences ready</p>
        </div>
      </div>
    )
  }

  // Profile setup for both artists and fans who haven't completed their profile
  if (!profileSetupComplete) {
    console.log('👤 User needs profile setup (userType:', userProfile.userType, ')');
    return (
      <div className="min-h-screen bg-black text-white">
        <ProfileSetup onComplete={handleProfileSetupComplete} />
      </div>
    )
  }

  // Onboarding tutorial for first-time users (after profile setup is complete)
  if (showOnboarding) {
    console.log('📚 Showing onboarding tutorial for first-time user');
    return (
      <OnboardingTutorial
        onComplete={async () => {
          console.log('🎓 Onboarding completed, marking as complete');
          try {
            // Mark onboarding as complete in Firestore
            await updateUserProfile({ onboarded: true });
            console.log('✅ Onboarding marked complete in Firestore');
            completeOnboarding();
          } catch (error) {
            console.error('❌ Failed to mark onboarding complete:', error);
            // Still complete onboarding even if Firestore update fails
            completeOnboarding();
          }
        }}
        onReset={resetOnboarding}
      />
    )
  }

  // Main application dashboard for both user types
  console.log('🎵 Showing main app for user type:', userProfile.userType);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold text-2xl">W</span>
              <span className="text-yellow-500 font-bold text-2xl">a</span>
              <span className="text-green-500 font-bold text-2xl">x</span>
              <span className="text-white font-light text-xl italic">radio</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* User Type Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                {userProfile.userType === 'artist' ? (
                  <>
                    <Music className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Artist</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-sm">Fan</span>
                  </>
                )}
              </div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.profileImageUrl} alt={userProfile.displayName} />
                      <AvatarFallback>
                        {userProfile.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userProfile.displayName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {userProfile.userType === 'artist' ? (
          <ArtistDashboard />
        ) : (
          <FanDashboard />
        )}
      </main>

      {/* Mobile Audio Player */}
      {audioPlayer.currentTrack && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {audioPlayer.currentTrack.artwork ? (
                <img
                  src={audioPlayer.currentTrack.artwork}
                  alt={audioPlayer.currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {audioPlayer.currentTrack.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{audioPlayer.currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{audioPlayer.currentTrack.artist}</p>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={audioPlayer.togglePlayPause}
              className="flex-shrink-0"
            >
              <Radio className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
