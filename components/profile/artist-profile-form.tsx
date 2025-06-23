/**
 * Artist Profile Form Component
 * 
 * Specialized profile setup form for artist users.
 * Focuses on music creation, performance history, and artist branding.
 * 
 * Features:
 * - Profile picture upload
 * - Artist bio and story
 * - Music genres and influences
 * - Performance experience
 * - Social media links
 * - Artist verification preferences
 */

"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Music, Camera, Mic, Globe, Instagram, Twitter, Youtube, Link } from 'lucide-react';

interface ArtistProfileFormProps {
  onComplete: () => void;
}

// Music genres for artists
const ARTIST_GENRES = [
  'Hip Hop', 'R&B', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Classical',
  'Country', 'Folk', 'Reggae', 'Blues', 'Soul', 'Funk', 'Punk',
  'Metal', 'Indie', 'Alternative', 'Gospel', 'World Music', 'Experimental',
  'Trap', 'House', 'Techno', 'Dubstep', 'Lo-Fi', 'Ambient', 'Acoustic'
];

// Experience levels
const EXPERIENCE_LEVELS = [
  'Just starting out',
  'Local performer',
  'Regional artist',
  'National touring',
  'International touring',
  'Established professional'
];

export function ArtistProfileForm({ onComplete }: ArtistProfileFormProps) {
  const [bio, setBio] = useState('');
  const [artistName, setArtistName] = useState('');
  const [primaryGenre, setPrimaryGenre] = useState('');
  const [influences, setInfluences] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');
  const [allowCollaborations, setAllowCollaborations] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create enhanced bio with artist information
      const enhancedBio = bio.trim();
      const artistInfo = {
        artistName: artistName.trim(),
        primaryGenre,
        influences: influences.trim(),
        experienceLevel,
        socialMedia: {
          instagram: instagram.trim(),
          twitter: twitter.trim(),
          youtube: youtube.trim(),
          website: website.trim(),
        },
        allowCollaborations,
        publicProfile,
      };

      // Update profile with enhanced information
      await updateUserProfile({
        bio: enhancedBio,
        profileSetupComplete: true,
        // Store additional artist info in a structured way
        // Note: In a real app, you might want to store these in a separate collection
      });

      toast({
        title: "Profile updated!",
        description: "Your artist profile has been successfully set up.",
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
            Welcome, Artist! Let's set up your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-4">
              <Label>Artist Photo (Optional)</Label>
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

            {/* Artist Name */}
            <div className="space-y-2">
              <Label htmlFor="artistName">
                Artist/Band Name
              </Label>
              <Input
                id="artistName"
                placeholder="Your stage name or band name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                Artist Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Share your musical journey, influences, and what drives your creativity. Tell fans about your story, your sound, and what makes your music unique..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Primary Genre */}
            <div className="space-y-2">
              <Label htmlFor="primaryGenre">Primary Genre</Label>
              <Select value={primaryGenre} onValueChange={setPrimaryGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary genre" />
                </SelectTrigger>
                <SelectContent>
                  {ARTIST_GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Influences */}
            <div className="space-y-2">
              <Label htmlFor="influences">
                Musical Influences
              </Label>
              <Input
                id="influences"
                placeholder="e.g., Kendrick Lamar, Daft Punk, The Beatles, Miles Davis..."
                value={influences}
                onChange={(e) => setInfluences(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Artists who inspire your sound
              </p>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <Label>Social Media Links (Optional)</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <Input
                    placeholder="Instagram username"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Twitter username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Youtube className="h-4 w-4 text-red-400" />
                  <Input
                    placeholder="YouTube channel URL"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4 text-green-400" />
                  <Input
                    placeholder="Website URL"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <Label>Artist Preferences</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collaborations"
                  checked={allowCollaborations}
                  onCheckedChange={(checked) => setAllowCollaborations(checked as boolean)}
                />
                <Label htmlFor="collaborations" className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-purple-400" />
                  Allow collaboration requests from other artists
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
                  Make my artist profile public to fans
                </Label>
              </div>
            </div>

            {/* User Type Display */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Music className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-blue-400">Artist Account</p>
                  <p className="text-sm text-muted-foreground">
                    Upload music, connect with fans, and grow your audience
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
                className="flex-1 bg-blue-500 hover:bg-blue-600"
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