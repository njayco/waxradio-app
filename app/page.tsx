"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  const { user, userProfile, loading, profileSetupComplete, signOut, error } = useAuth()
  const audioPlayer = useAudioPlayer()
  const { showOnboarding, isLoading: onboardingLoading, completeOnboarding, resetOnboarding } = useOnboarding()
  const { toast } = useToast()
  const router = useRouter()

  // Debug logging with throttling to prevent spam
  useEffect(() => {
    const debugInfo = {
      user: !!user,
      userProfile: !!userProfile,
      loading,
      onboardingLoading,
      profileSetupComplete,
      showOnboarding,
      error: !!error
    };
    
    // Only log if state has actually changed
    const currentState = JSON.stringify(debugInfo);
    if (window.lastDebugState !== currentState) {
      console.log('🎯 App state changed:', debugInfo);
      window.lastDebugState = currentState;
    }
  }, [user, userProfile, loading, onboardingLoading, profileSetupComplete, showOnboarding, error]);

  // Check if user needs profile setup and redirect to dedicated page
  // Add debouncing to prevent rapid redirects
  useEffect(() => {
    if (user && userProfile && !profileSetupComplete && !loading && !onboardingLoading) {
      console.log('🔧 User needs profile setup - redirecting to create-profile page');
      
      // Add a small delay to ensure all state updates are complete
      const redirectTimer = setTimeout(() => {
        router.push('/create-profile');
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, userProfile, profileSetupComplete, loading, onboardingLoading, router]);

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
    setShowProfileSetup(false)
  }

  // Show loading state while checking authentication or onboarding
  if (loading || onboardingLoading) {
    console.log('⏳ Showing loading screen - loading:', loading, 'onboardingLoading:', onboardingLoading);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Wax Radio...</p>
        </div>
      </div>
    )
  }

  // Show authentication forms if not logged in
  if (!user) {
    console.log('🔐 Showing auth forms');
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

  // Show loading if userProfile is not loaded yet
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

  // Show error if user profile cannot be loaded
  if (error) {
    console.log('❌ Showing error screen:', error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl font-bold mb-4">Error</div>
          <p className="mb-2">{error}</p>
          <p className="text-muted-foreground mb-4">If this is a permissions issue, check your Firestore rules.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // Show onboarding tutorial for users who completed profile but haven't seen onboarding
  if (showOnboarding && profileSetupComplete) {
    console.log('📚 Showing onboarding tutorial');
    return (
      <OnboardingTutorial
        onComplete={completeOnboarding}
        onReset={resetOnboarding}
      />
    )
  }

  // If profile setup is not complete, redirect (this should be handled by the redirect effect)
  if (!profileSetupComplete) {
    console.log('🔧 Profile setup not complete, should redirect soon...');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Setting up your profile...</p>
        </div>
      </div>
    )
  }

  console.log('🎉 Showing main app');

  // Main app layout for authenticated users
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
                {userProfile?.userType === 'artist' ? (
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

      {/* Mobile Audio Player (if track is playing) */}
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
              {audioPlayer.state.isPlaying ? (
                <Radio className="h-5 w-5" />
              ) : (
                <Radio className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
