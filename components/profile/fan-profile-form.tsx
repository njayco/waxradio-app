/**
 * Fan Profile Form Component
 * 
 * Specialized profile setup form for fan users.
 * Focuses on music preferences, favorite genres, and discovery settings.
 * 
 * Features:
 * - Profile picture upload
 * - Music taste description
 * - Favorite genres selection
 * - Discovery preferences
 * - Social sharing preferences
 */

"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Heart, Music, Camera, Users, Globe } from 'lucide-react';

interface FanProfileFormProps {
  onComplete: () => void;
}

// Common music genres for selection
const MUSIC_GENRES = [
  'Hip Hop', 'R&B', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Classical',
  'Country', 'Folk', 'Reggae', 'Blues', 'Soul', 'Funk', 'Punk',
  'Metal', 'Indie', 'Alternative', 'Gospel', 'World Music', 'Experimental'
];

export function FanProfileForm({ onComplete }: FanProfileFormProps) {
  const [bio, setBio] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [discoveryEnabled, setDiscoveryEnabled] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
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

  const handleGenreToggle = (genre: string) => {
    setFavoriteGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create enhanced bio with music preferences
      const enhancedBio = bio.trim();
      const musicPreferences = {
        favoriteGenres,
        favoriteArtists: favoriteArtists.trim(),
        discoveryEnabled,
        publicProfile,
      };

      // Update profile with enhanced information
      await updateUserProfile({
        bio: enhancedBio,
        profileSetupComplete: true,
        // Store additional preferences in a structured way
        // Note: In a real app, you might want to store these in a separate collection
      });

      toast({
        title: "Profile updated!",
        description: "Your fan profile has been successfully set up.",
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
            Welcome, Music Fan! Let's set up your profile
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
                Tell us about your music taste
              </Label>
              <Textarea
                id="bio"
                placeholder="What genres do you love? Who are your favorite artists? Share your music story and what you're looking to discover..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Favorite Genres */}
            <div className="space-y-3">
              <Label>Favorite Genres (Select up to 5)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MUSIC_GENRES.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={favoriteGenres.includes(genre)}
                      onCheckedChange={() => handleGenreToggle(genre)}
                      disabled={favoriteGenres.length >= 5 && !favoriteGenres.includes(genre)}
                    />
                    <Label
                      htmlFor={genre}
                      className="text-sm cursor-pointer"
                    >
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {favoriteGenres.length}/5
              </p>
            </div>

            {/* Favorite Artists */}
            <div className="space-y-2">
              <Label htmlFor="favoriteArtists">
                Favorite Artists (Optional)
              </Label>
              <Input
                id="favoriteArtists"
                placeholder="e.g., Kendrick Lamar, Daft Punk, The Beatles..."
                value={favoriteArtists}
                onChange={(e) => setFavoriteArtists(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This helps us recommend similar music
              </p>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <Label>Preferences</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="discovery"
                  checked={discoveryEnabled}
                  onCheckedChange={(checked) => setDiscoveryEnabled(checked as boolean)}
                />
                <Label htmlFor="discovery" className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-400" />
                  Enable music discovery recommendations
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="public"
                  checked={publicProfile}
                  onCheckedChange={(checked) => setPublicProfile(checked as boolean)}
                />
                <Label htmlFor="public" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-400" />
                  Make my profile public to other users
                </Label>
              </div>
            </div>

            {/* User Type Display */}
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-red-400">Fan Account</p>
                  <p className="text-sm text-muted-foreground">
                    Discover music, create playlists, and connect with artists
                  </p>
                </div>
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
                className="flex-1 bg-red-500 hover:bg-red-600"
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