"use client"

import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  genre: string;
  coverArt: string;
  audioUrl: string;
  previewUrl: string;
  duration: number;
  heatScore: number;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadData {
  title: string;
  genre: string;
  audioFile: File;
  coverArtFile?: File;
}

export function useMusic() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  // Sample placeholder tracks for when no real tracks exist
  const getPlaceholderTracks = (): MusicTrack[] => [
    {
      id: 'placeholder-1',
      title: 'Your Song Here',
      artist: 'Unknown Artist',
      artistId: 'placeholder',
      genre: 'Hip Hop',
      coverArt: '',
      audioUrl: '',
      previewUrl: '',
      duration: 180,
      heatScore: 30,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'placeholder-2',
      title: 'Your Song Here',
      artist: 'Unknown Artist',
      artistId: 'placeholder',
      genre: 'R&B',
      coverArt: '',
      audioUrl: '',
      previewUrl: '',
      duration: 210,
      heatScore: 30,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'placeholder-3',
      title: 'Your Song Here',
      artist: 'Unknown Artist',
      artistId: 'placeholder',
      genre: 'Pop',
      coverArt: '',
      audioUrl: '',
      previewUrl: '',
      duration: 195,
      heatScore: 30,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Calculate heat score based on upvotes and downvotes
  const calculateHeatScore = (upvotes: number, downvotes: number): number => {
    const totalVotes = upvotes + downvotes;
    if (totalVotes === 0) return 30; // Base temperature
    
    const ratio = upvotes / totalVotes;
    // Heat score ranges from 30° to 110°
    // 30° = all downvotes, 110° = all upvotes
    return Math.round(30 + (ratio * 80));
  };

  // Upload a new track
  const uploadTrack = async (data: UploadData) => {
    if (!user) throw new Error('User must be logged in');
    
    setUploading(true);
    try {
      // Upload audio file
      const audioRef = ref(storage, `tracks/${user.uid}/${Date.now()}_${data.audioFile.name}`);
      const audioSnapshot = await uploadBytes(audioRef, data.audioFile);
      const audioUrl = await getDownloadURL(audioSnapshot.ref);

      // Upload cover art if provided
      let coverArtUrl = '';
      if (data.coverArtFile) {
        const coverRef = ref(storage, `covers/${user.uid}/${Date.now()}_${data.coverArtFile.name}`);
        const coverSnapshot = await uploadBytes(coverRef, data.coverArtFile);
        coverArtUrl = await getDownloadURL(coverSnapshot.ref);
      }

      // Create track document in Firestore
      const trackData = {
        title: data.title,
        artist: user.displayName || user.email?.split('@')[0] || 'Unknown Artist',
        artistId: user.uid,
        genre: data.genre,
        coverArt: coverArtUrl,
        audioUrl,
        previewUrl: audioUrl, // For MVP, use same URL for preview
        duration: 0, // Will be calculated on client side
        heatScore: 30, // Base temperature
        upvotes: 0,
        downvotes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'tracks'), trackData);
      
      // Add the new track to local state
      const newTrack: MusicTrack = {
        id: docRef.id,
        ...trackData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTracks(prev => [newTrack, ...prev]);
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading track:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Fetch all tracks ordered by heat score
  const fetchTracks = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'tracks'),
        orderBy('heatScore', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tracksData: MusicTrack[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tracksData.push({
          id: doc.id,
          title: data.title,
          artist: data.artist,
          artistId: data.artistId,
          genre: data.genre,
          coverArt: data.coverArt,
          audioUrl: data.audioUrl,
          previewUrl: data.previewUrl,
          duration: data.duration,
          heatScore: data.heatScore,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });
      
      // If no real tracks exist, show placeholder tracks
      if (tracksData.length === 0) {
        setTracks(getPlaceholderTracks());
      } else {
        setTracks(tracksData);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      // On error, show placeholder tracks
      setTracks(getPlaceholderTracks());
    } finally {
      setLoading(false);
    }
  };

  // Vote on a track
  const voteTrack = async (trackId: string, voteType: 'up' | 'down') => {
    if (!user) throw new Error('User must be logged in');
    
    try {
      const trackRef = doc(db, 'tracks', trackId);
      const track = tracks.find(t => t.id === trackId);
      
      if (!track) throw new Error('Track not found');
      
      // Update vote counts
      const updates: any = {};
      if (voteType === 'up') {
        updates.upvotes = increment(1);
      } else {
        updates.downvotes = increment(1);
      }
      
      // Calculate new heat score
      const newUpvotes = track.upvotes + (voteType === 'up' ? 1 : 0);
      const newDownvotes = track.downvotes + (voteType === 'down' ? 1 : 0);
      const newHeatScore = calculateHeatScore(newUpvotes, newDownvotes);
      
      updates.heatScore = newHeatScore;
      updates.updatedAt = serverTimestamp();
      
      await updateDoc(trackRef, updates);
      
      // Update local state
      setTracks(prev => prev.map(t => 
        t.id === trackId 
          ? {
              ...t,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              heatScore: newHeatScore,
              updatedAt: new Date(),
            }
          : t
      ));
      
      return newHeatScore;
    } catch (error) {
      console.error('Error voting on track:', error);
      throw error;
    }
  };

  // Fetch tracks by artist
  const fetchArtistTracks = async (artistId: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'tracks'),
        where('artistId', '==', artistId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tracksData: MusicTrack[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tracksData.push({
          id: doc.id,
          title: data.title,
          artist: data.artist,
          artistId: data.artistId,
          genre: data.genre,
          coverArt: data.coverArt,
          audioUrl: data.audioUrl,
          previewUrl: data.previewUrl,
          duration: data.duration,
          heatScore: data.heatScore,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });
      
      return tracksData;
    } catch (error) {
      console.error('Error fetching artist tracks:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get heat color based on score
  const getHeatColor = (score: number) => {
    if (score >= 100) return "text-red-500";
    if (score >= 90) return "text-orange-500";
    if (score >= 80) return "text-yellow-500";
    if (score >= 70) return "text-green-500";
    return "text-blue-500";
  };

  // Get heat level for progress bar
  const getHeatLevel = (score: number) => {
    return Math.min(100, Math.max(0, ((score - 30) / 80) * 100));
  };

  return {
    tracks,
    loading,
    uploading,
    uploadTrack,
    fetchTracks,
    voteTrack,
    fetchArtistTracks,
    calculateHeatScore,
    getHeatColor,
    getHeatLevel,
  };
} 