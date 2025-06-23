"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrackCard } from '@/components/music/track-card';
import { PlaylistCreator } from '@/components/playlist/playlist-creator';
import { useMusic } from '@/hooks/useMusic';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Heart, Music, Play, TrendingUp, Clock, Star, Upload } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  createdAt: Date;
}

export function FanDashboard() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState('discover');
  const { tracks, loading } = useMusic();
  const audioPlayer = useAudioPlayer();

  // Mock playlists for now
  useEffect(() => {
    setPlaylists([
      {
        id: '1',
        name: 'My Favorites',
        description: 'Songs I love',
        trackCount: 12,
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Chill Vibes',
        description: 'Perfect for relaxing',
        trackCount: 8,
        createdAt: new Date(),
      },
    ]);
  }, []);

  const handlePlaylistCreated = () => {
    // Refresh playlists
    console.log('Playlist created, refreshing...');
  };

  const handleTrackPlay = (track: any) => {
    audioPlayer.playTrack(track);
  };

  const sortedTracks = tracks.sort((a, b) => b.heatScore - a.heatScore);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Wax Radio</h1>
        <p className="text-muted-foreground">
          Discover amazing music and create your perfect playlists
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tracks</p>
                <p className="text-2xl font-bold">{tracks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Playlists</p>
                <p className="text-2xl font-bold">{playlists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hottest Track</p>
                <p className="text-2xl font-bold">
                  {tracks.length > 0 ? `${sortedTracks[0].heatScore}°` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="playlists">My Playlists</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Discover New Music</h2>
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" />
              Play All
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading tracks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handleTrackPlay(track)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Playlists</h2>
            <PlaylistCreator onPlaylistCreated={handlePlaylistCreated} />
          </div>
          
          {playlists.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first playlist to start organizing your favorite tracks
                </p>
                <PlaylistCreator onPlaylistCreated={handlePlaylistCreated} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{playlist.name}</CardTitle>
                    <CardDescription>{playlist.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{playlist.trackCount} tracks</span>
                      <span>{playlist.createdAt.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending Now</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Based on community votes</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading trending tracks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTracks.slice(0, 10).map((track, index) => (
                <div key={track.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {track.artwork ? (
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {track.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-500">{track.heatScore}°</p>
                    <p className="text-xs text-muted-foreground">Heat</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTrackPlay(track)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Artist-Only Features Locked Section */}
      <Card className="border-dashed border-muted-foreground/30">
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Artist-Only Features</h3>
          <p className="text-muted-foreground mb-4">
            Upload tracks and access music analytics are available exclusively for artist accounts.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Music className="h-4 w-4" />
            <span>Switch to an artist account to unlock these features</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 