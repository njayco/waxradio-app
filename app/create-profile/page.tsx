"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserType } from "@/hooks/useAuth"
import { Music, Heart, ArrowRight, User, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreateProfilePage() {
  const [displayName, setDisplayName] = useState("")
  const [userType, setUserType] = useState<UserType>("fan")
  const [bio, setBio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, userProfile, updateUserProfile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Pre-populate form with existing data if available
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
      setUserType(userProfile.userType || "fan")
      setBio(userProfile.bio || "")
    }
  }, [userProfile])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('🔐 No user found, redirecting to home')
      router.push("/")
    }
  }, [user, loading, router])

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!displayName.trim()) {
      setError("Display name is required")
      return
    }

    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters long")
      return
    }

    setIsLoading(true)
    try {
      console.log('🔧 Creating/updating profile:', { displayName: displayName.trim(), userType, bio: bio.trim() })
      
      await updateUserProfile({
        displayName: displayName.trim(),
        userType,
        bio: bio.trim(),
        profileSetupComplete: true, // Explicitly mark as complete
      })

      console.log('✅ Profile created/updated successfully')
      toast({
        title: "Profile saved!",
        description: "Welcome to Wax Radio! Your profile has been set up successfully.",
      })
      
      // Small delay to ensure state updates, then redirect
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error: any) {
      console.error("Profile creation failed:", error)
      const errorMessage = error?.message || 'Failed to save profile. Please try again.'
      setError(errorMessage)
      toast({
        title: "Profile creation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-red-500 font-bold text-4xl">W</span>
            <span className="text-yellow-500 font-bold text-4xl">a</span>
            <span className="text-green-500 font-bold text-4xl">x</span>
            <span className="text-white font-light text-3xl italic">radio</span>
          </div>
          <CardTitle className="text-2xl">
            {userProfile?.displayName ? "Update Your Profile" : "Create Your Profile"}
          </CardTitle>
          <CardDescription>
            {userProfile?.displayName 
              ? "Update your profile information" 
              : "Let's set up your profile to get started with Wax Radio"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-gray-800 border-gray-700"
                required
                minLength={2}
                maxLength={50}
              />
              <p className="text-sm text-gray-400">This is how other users will see your name</p>
            </div>

            <div className="space-y-4">
              <Label>I am a... *</Label>
              <RadioGroup
                value={userType}
                onValueChange={(value) => setUserType(value as UserType)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="fan" id="fan" />
                  <Label htmlFor="fan" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Heart className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="font-medium">Music Fan</div>
                      <div className="text-sm text-gray-400">Discover and enjoy music</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                  <RadioGroupItem value="artist" id="artist" />
                  <Label htmlFor="artist" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Music className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="font-medium">Artist</div>
                      <div className="text-sm text-gray-400">Share your music</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-gray-800 border-gray-700"
                rows={3}
                maxLength={500}
              />
              <p className="text-sm text-gray-400">
                {bio.length}/500 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !displayName.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {userProfile?.displayName ? "Updating..." : "Creating Profile..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {userProfile?.displayName ? "Update Profile" : "Create Profile"}
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 