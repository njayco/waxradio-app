"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrackCard } from '@/components/music/track-card';
import { SongUploader } from '@/components/music/song-uploader';
import { useMusic } from '@/hooks/useMusic';
import { useAuth } from '@/hooks/useAuth';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Music, Upload, TrendingUp, BarChart3, Play, Star, Users } from 'lucide-react';

export function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [myTracks, setMyTracks] = useState<any[]>([]);
  const { tracks, loading } = useMusic();
  const { userProfile } = useAuth();
  const audioPlayer = useAudioPlayer();

  // Filter tracks by current artist
  useEffect(() => {
    if (userProfile) {
      const artistTracks = tracks.filter(track => track.artist === userProfile.displayName);
      setMyTracks(artistTracks);
    }
  }, [tracks, userProfile]);

  const handleTrackPlay = (track: any) => {
    audioPlayer.playTrack(track);
  };

  const handleSongUploaded = () => {
    // Refresh tracks
    console.log('Song uploaded, refreshing...');
  };

  const sortedTracks = tracks.sort((a, b) => b.heatScore - a.heatScore);
  const totalPlays = myTracks.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const averageHeat = myTracks.length > 0 
    ? Math.round(myTracks.reduce((sum, track) => sum + track.heatScore, 0) / myTracks.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Artist Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userProfile?.displayName}! Share your music with the world.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Tracks</p>
                <p className="text-2xl font-bold">{myTracks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Plays</p>
                <p className="text-2xl font-bold">{totalPlays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Heat</p>
                <p className="text-2xl font-bold">{averageHeat}°</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Listeners</p>
                <p className="text-2xl font-bold">
                  {myTracks.length > 0 ? Math.floor(totalPlays / myTracks.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="tracks">My Tracks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myTracks.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tracks yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your first track to start building your audience
                    </p>
                    <Button onClick={() => setActiveTab('upload')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Track
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myTracks.slice(0, 3).map((track) => (
                      <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
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
                          <p className="text-sm text-muted-foreground">{track.genre}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{track.heatScore}°</p>
                          <p className="text-xs text-muted-foreground">Heat</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Tracks on Platform</span>
                    <span className="font-medium">{tracks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hottest Track</span>
                    <span className="font-medium">
                      {tracks.length > 0 ? `${sortedTracks[0].heatScore}°` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Market Share</span>
                    <span className="font-medium">
                      {tracks.length > 0 ? `${((myTracks.length / tracks.length) * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upload New Track</h2>
            <div className="text-sm text-muted-foreground">
              Share your music with the Wax Radio community
            </div>
          </div>
          
          <SongUploader onUploadComplete={handleSongUploaded} />
        </TabsContent>

        {/* My Tracks Tab */}
        <TabsContent value="tracks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Tracks</h2>
            <Button onClick={() => setActiveTab('upload')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Track
            </Button>
          </div>
          
          {myTracks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tracks uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your music catalog by uploading your first track
                </p>
                <Button onClick={() => setActiveTab('upload')}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Track
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handleTrackPlay(track)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <div className="text-sm text-muted-foreground">
              Track your performance and growth
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Plays</span>
                    <span className="font-medium">{totalPlays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Heat Score</span>
                    <span className="font-medium">{averageHeat}°</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Track Count</span>
                    <span className="font-medium">{myTracks.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                {myTracks.length === 0 ? (
                  <p className="text-muted-foreground">No tracks to analyze yet</p>
                ) : (
                  <div className="space-y-3">
                    {myTracks
                      .sort((a, b) => b.heatScore - a.heatScore)
                      .slice(0, 3)
                      .map((track, index) => (
                        <div key={track.id} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{track.title}</p>
                            <p className="text-xs text-muted-foreground">{track.heatScore}° heat</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 