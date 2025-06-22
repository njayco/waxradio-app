"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMusic, UploadData } from '@/hooks/useMusic';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Music, Image, X } from 'lucide-react';

const GENRES = [
  'Hip Hop',
  'R&B',
  'Pop',
  'Rock',
  'Electronic',
  'Jazz',
  'Blues',
  'Country',
  'Folk',
  'Classical',
  'Reggae',
  'Latin',
  'World',
  'Alternative',
  'Indie',
  'Other'
];

export function UploadForm() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadTrack, uploading } = useMusic();
  const { toast } = useToast();

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }

      setAudioFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setCoverArtFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview('');
    }
  };

  const removeCoverArt = () => {
    setCoverArtFile(null);
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
      setCoverPreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast({
        title: "No audio file selected",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your track",
        variant: "destructive",
      });
      return;
    }

    if (!genre) {
      toast({
        title: "Genre required",
        description: "Please select a genre for your track",
        variant: "destructive",
      });
      return;
    }

    try {
      const uploadData: UploadData = {
        title: title.trim(),
        genre,
        audioFile,
        coverArtFile: coverArtFile || undefined,
      };

      await uploadTrack(uploadData);
      
      // Reset form
      setTitle('');
      setGenre('');
      setAudioFile(null);
      setCoverArtFile(null);
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
        setAudioPreview('');
      }
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
        setCoverPreview('');
      }
      
      toast({
        title: "Upload successful!",
        description: "Your track has been uploaded and is now available for discovery.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Track
        </CardTitle>
        <CardDescription>
          Share your music with the Wax Radio community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Track Title *</Label>
            <Input
              id="title"
              placeholder="Enter track title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre *</Label>
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genreOption) => (
                  <SelectItem key={genreOption} value={genreOption}>
                    {genreOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audio File Upload */}
          <div className="space-y-2">
            <Label>Audio File *</Label>
            {!audioFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={() => audioInputRef.current?.click()}
              >
                <Music className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload audio file
                </p>
                <p className="text-xs text-muted-foreground">
                  MP3, WAV, or other audio formats (max 50MB)
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAudioFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioFileChange}
              className="hidden"
            />
          </div>

          {/* Cover Art Upload */}
          <div className="space-y-2">
            <Label>Cover Art (Optional)</Label>
            {!coverArtFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                <Image className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload cover art
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, or other image formats (max 5MB)
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{coverArtFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(coverArtFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeCoverArt}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {coverPreview && (
                  <div className="mt-3">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverArtChange}
              className="hidden"
            />
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