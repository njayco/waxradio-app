"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MusicTrack, useMusic } from '@/hooks/useMusic';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { ThumbsUp, ThumbsDown, Play, Pause, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrackCardProps {
  track: MusicTrack;
  isCurrentTrack?: boolean;
  onVote?: (trackId: string, voteType: 'up' | 'down') => void;
}

export function TrackCard({ track, isCurrentTrack = false, onVote }: TrackCardProps) {
  const [voting, setVoting] = useState(false);
  const audioPlayer = useAudioPlayer();
  const { getHeatColor, getHeatLevel } = useMusic();
  const { toast } = useToast();

  const isPlaying = audioPlayer.currentTrack?.id === track.id && audioPlayer.state.isPlaying;
  const isLoading = audioPlayer.currentTrack?.id === track.id && audioPlayer.state.isLoading;

  const handlePlayPause = () => {
    // Don't allow playing placeholder tracks
    if (track.id.startsWith('placeholder-')) {
      toast({
        title: "No preview available",
        description: "This is a placeholder. Upload your own music to hear it!",
        variant: "destructive",
      });
      return;
    }

    if (isCurrentTrack) {
      audioPlayer.togglePlayPause();
    } else {
      // Load this track and play it
      const trackData = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.genre, // Using genre as album for compatibility
        heatScore: track.heatScore,
        previewUrl: track.previewUrl,
        fullUrl: track.audioUrl,
        artwork: track.coverArt || '/placeholder.svg?height=300&width=300&text=Music',
        duration: track.duration,
      };
      audioPlayer.loadTrack(trackData, true);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    // Don't allow voting on placeholder tracks
    if (track.id.startsWith('placeholder-')) {
      toast({
        title: "Cannot vote on placeholder",
        description: "This is a placeholder track. Upload real music to get votes!",
        variant: "destructive",
      });
      return;
    }

    if (voting) return;
    
    setVoting(true);
    try {
      if (onVote) {
        await onVote(track.id, voteType);
      }
      
      toast({
        title: voteType === 'up' ? 'Voted up!' : 'Voted down!',
        description: `Your vote has been recorded for "${track.title}"`,
      });
    } catch (error) {
      toast({
        title: 'Vote failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVoting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isCurrentTrack ? 'ring-2 ring-primary' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Cover Art */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              {track.coverArt ? (
                <img
                  src={track.coverArt}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {track.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Play/Pause Button Overlay */}
            <Button
              size="sm"
              className={`absolute inset-0 w-full h-full ${
                track.id.startsWith('placeholder-') 
                  ? 'bg-gray-500/50 hover:bg-gray-500/70' 
                  : 'bg-black/50 hover:bg-black/70'
              } text-white rounded-lg flex items-center justify-center`}
              onClick={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : track.id.startsWith('placeholder-') ? (
                <span className="text-xs font-medium">Upload</span>
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{track.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{track.genre}</span>
                  {track.duration > 0 && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(track.duration)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Heat Score */}
              <div className="flex-shrink-0 text-right">
                <div className={`text-lg font-bold ${getHeatColor(track.heatScore)}`}>
                  {track.heatScore}°
                </div>
                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500`}
                    style={{ width: `${getHeatLevel(track.heatScore)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Vote Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8"
                onClick={() => handleVote('up')}
                disabled={voting || track.id.startsWith('placeholder-')}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {track.upvotes}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8"
                onClick={() => handleVote('down')}
                disabled={voting || track.id.startsWith('placeholder-')}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                {track.downvotes}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 