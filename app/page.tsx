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
  const { user, userProfile, loading, profileSetupComplete, signOut, error } = useAuth()
  const audioPlayer = useAudioPlayer()
  const { showOnboarding, isLoading: onboardingLoading, completeOnboarding, resetOnboarding } = useOnboarding()
  const { toast } = useToast()

  // Debug logging
  useEffect(() => {
    console.log('🎯 App state:', {
      user: !!user,
      userProfile: !!userProfile,
      loading,
      profileSetupComplete,
      showOnboarding,
      error: !!error
    });
  }, [user, userProfile, loading, profileSetupComplete, showOnboarding, error]);

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
  if (loading || onboardingLoading) {
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

  // Show authentication forms if not logged in
  if (!user) {
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

  // Show profile setup if needed
  if (user && userProfile && !profileSetupComplete) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ProfileSetup onComplete={handleProfileSetupComplete} />
      </div>
    )
  }

  // Show onboarding tutorial
  if (showOnboarding && profileSetupComplete) {
    return (
      <OnboardingTutorial
        onComplete={completeOnboarding}
        onReset={resetOnboarding}
      />
    )
  }

  // Show loading if userProfile is not ready
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Main app layout
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
