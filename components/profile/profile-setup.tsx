"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, UserType } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, User, Camera } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile with bio and mark setup as complete
      await updateUserProfile({
        bio: bio.trim(),
        profileSetupComplete: true,
        // profileImageUrl: uploadedImageUrl // would be set after upload
      });

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully set up.",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const skipSetup = async () => {
    setLoading(true);
    try {
      // Even if skipping, mark profile setup as complete
      await updateUserProfile({
        profileSetupComplete: true,
      });
      onComplete();
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <span className="text-red-500 font-bold">W</span>
            <span className="text-yellow-500 font-bold">a</span>
            <span className="text-green-500 font-bold">x</span>
            <span className="text-white font-light italic">radio</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome to Wax Radio! Let's set up your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-4">
              <Label>Profile Picture (Optional)</Label>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">No image</p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                Bio {userProfile?.userType === 'artist' ? '(Tell us about your music)' : '(Tell us about your music taste)'}
              </Label>
              <Textarea
                id="bio"
                placeholder={
                  userProfile?.userType === 'artist' 
                    ? "Share your musical journey, influences, and what drives your creativity..."
                    : "What genres do you love? Who are your favorite artists? Share your music story..."
                }
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>

            {/* User Type Display */}
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                {userProfile?.userType === 'artist' ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Artist Account</p>
                      <p className="text-sm text-muted-foreground">
                        You can upload and share your music with the community
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Fan Account</p>
                      <p className="text-sm text-muted-foreground">
                        You can discover music and create playlists
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={skipSetup}
                className="flex-1"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 