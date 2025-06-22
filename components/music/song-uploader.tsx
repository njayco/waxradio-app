"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMusic } from '@/hooks/useMusic';
import { Loader2, Upload, Music, Image, X } from 'lucide-react';

interface SongUploaderProps {
  onUploadComplete: () => void;
}

const GENRES = [
  'Hip Hop', 'R&B', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Blues', 
  'Country', 'Folk', 'Classical', 'Reggae', 'Latin', 'World', 'Other'
];

export function SongUploader({ onUploadComplete }: SongUploaderProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string>('');
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);
  const { userProfile } = useAuth();
  const { uploadTrack, uploading } = useMusic();
  const { toast } = useToast();

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an audio file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }

      setAudioFile(file);
    }
  };

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setArtworkFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setArtworkPreview(url);
    }
  };

  const removeArtwork = () => {
    setArtworkFile(null);
    setArtworkPreview('');
    if (artworkInputRef.current) {
      artworkInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your song.",
        variant: "destructive",
      });
      return;
    }

    if (!audioFile) {
      toast({
        title: "Audio file required",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!genre) {
      toast({
        title: "Genre required",
        description: "Please select a genre for your song.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await uploadTrack({
        title: title.trim(),
        genre,
        audioFile,
        coverArtFile: artworkFile || undefined,
      });
      
      toast({
        title: "Song uploaded successfully!",
        description: `"${title}" has been uploaded and is now available on Wax Radio.`,
      });
      
      // Reset form
      setTitle('');
      setArtist('');
      setGenre('');
      setDescription('');
      setAudioFile(null);
      setArtworkFile(null);
      setArtworkPreview('');
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (artworkInputRef.current) artworkInputRef.current.value = '';
      
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Upload New Track
        </CardTitle>
        <CardDescription>
          Share your music with the Wax Radio community. Upload your audio file and add artwork to make it stand out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title *</Label>
              <Input
                id="title"
                placeholder="Enter song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist Name</Label>
              <Input
                id="artist"
                placeholder={userProfile?.displayName || "Enter artist name"}
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell us about this track..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Audio Upload */}
          <div className="space-y-4">
            <Label>Audio File *</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              {audioFile ? (
                <div className="space-y-2">
                  <Music className="h-8 w-8 mx-auto text-green-500" />
                  <p className="font-medium">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAudioFile(null);
                      if (audioInputRef.current) audioInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="font-medium">Click to upload audio file</p>
                  <p className="text-sm text-muted-foreground">
                    MP3, WAV, or other audio formats (max 50MB)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              )}
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Artwork Upload */}
          <div className="space-y-4">
            <Label>Album Artwork (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              {artworkPreview ? (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <img
                      src={artworkPreview}
                      alt="Artwork preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                      onClick={removeArtwork}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {artworkFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="font-medium">Click to upload artwork</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, or other image formats (max 5MB)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => artworkInputRef.current?.click()}
                  >
                    Choose Image
                  </Button>
                </div>
              )}
              <input
                ref={artworkInputRef}
                type="file"
                accept="image/*"
                onChange={handleArtworkChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uploading ? 'Uploading...' : 'Upload Track'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
