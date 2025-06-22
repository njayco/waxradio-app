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

// Extend Window interface for debugging
declare global {
  interface Window {
    lastDebugState?: string;
  }
}

export default function WaxRadioApp() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  const { user, userProfile, loading, profileSetupComplete, signOut, error } = useAuth()
  const audioPlayer = useAudioPlayer()
  const { showOnboarding, isLoading: onboardingLoading, completeOnboarding, resetOnboarding } = useOnboarding()
  const { toast } = useToast()

  // Add timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading || onboardingLoading) {
        console.log('⏰ Loading timeout reached - showing auth forms as fallback');
        setLoadingTimeout(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [loading, onboardingLoading]);

  // Enhanced debug logging
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
    
    // Log specific flow decisions
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

  const handleProfileSetupComplete = () => {
    console.log('✅ Profile setup completed');
    setShowProfileSetup(false)
  }

  // Show loading state
  if ((loading || onboardingLoading) && !loadingTimeout) {
    console.log('⏳ Showing loading screen');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Wax Radio...</p>
        </div>
      </div>
    )
  }

  // Show error state
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

  // Show authentication forms if not logged in OR if loading timed out
  if (!user || loadingTimeout) {
    console.log('🔐 Showing auth forms (user:', !!user, 'timeout:', loadingTimeout, ')');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
          
          {authMode === "login" ? (
            <LoginForm onSwitchToSignUp={() => setAuthMode("signup")} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setAuthMode("login")} />
          )}
        </div>
      </div>
    )
  }

  // Show loading if userProfile is not ready
  if (!userProfile) {
    console.log('👤 Showing user profile loading');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  // SIMPLIFIED FLOW: Show profile setup only for artists who haven't completed it
  if (userProfile.userType === 'artist' && !profileSetupComplete) {
    console.log('🎨 Artist needs profile setup');
    return (
      <div className="min-h-screen bg-black text-white">
        <ProfileSetup onComplete={handleProfileSetupComplete} />
      </div>
    )
  }

  // For fans: Skip profile setup and onboarding, go straight to main app
  if (userProfile.userType === 'fan') {
    console.log('🎵 Fan user - showing main app directly');
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
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm">Fan</span>
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
          <FanDashboard />
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

  // For artists: Show onboarding tutorial if needed, then main app
  if (userProfile.userType === 'artist') {
    if (showOnboarding && profileSetupComplete) {
      console.log('📚 Artist showing onboarding tutorial');
      return (
        <OnboardingTutorial
          onComplete={completeOnboarding}
          onReset={resetOnboarding}
        />
      )
    }

    console.log('🎨 Artist showing main app');
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
                  <Music className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Artist</span>
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
          <ArtistDashboard />
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

  // Fallback - should never reach here
  console.log('⚠️ Fallback case reached - showing loading');
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Setting up your experience...</p>
      </div>
    </div>
  )
}
