"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  heatScore: number
  previewUrl: string
  fullUrl: string
  artwork: string
  duration: number // in seconds
}

export interface AudioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  isPreview: boolean
  hasVoted: boolean
  error: string | null
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isPreview: true,
    hasVoted: false,
    error: null,
  })

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.crossOrigin = "anonymous"

    const audio = audioRef.current

    const handleLoadStart = () => setState((prev) => ({ ...prev, isLoading: true, error: null }))
    const handleLoadedData = () => setState((prev) => ({ ...prev, isLoading: false, duration: audio.duration }))
    const handleTimeUpdate = () => setState((prev) => ({ ...prev, currentTime: audio.currentTime }))
    const handlePlay = () => setState((prev) => ({ ...prev, isPlaying: true }))
    const handlePause = () => setState((prev) => ({ ...prev, isPlaying: false }))
    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }))
      if (state.isPreview) {
        // Auto-skip to next track after preview ends
        skipToNext()
      }
    }
    const handleError = () => {
      setState((prev) => ({ ...prev, error: "Failed to load audio", isLoading: false, isPlaying: false }))
    }
    const handleVolumeChange = () => setState((prev) => ({ ...prev, volume: audio.volume }))

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("volumechange", handleVolumeChange)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("volumechange", handleVolumeChange)

      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current)
      }
    }
  }, [])

  const loadTrack = useCallback((track: Track, isPreview = true) => {
    if (!audioRef.current) return

    const audio = audioRef.current
    const url = isPreview ? track.previewUrl : track.fullUrl

    // Stop current playback
    audio.pause()
    audio.currentTime = 0

    // Clear any existing preview timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
    }

    // Load new track
    audio.src = url
    setCurrentTrack(track)
    setState((prev) => ({
      ...prev,
      isPreview,
      hasVoted: !isPreview,
      currentTime: 0,
      error: null,
      isPlaying: false, // Don't auto-play
    }))

    // Don't auto-play - wait for user interaction
    console.log(`Loaded ${isPreview ? "preview" : "full track"}: ${track.title}`)
  }, [])

  const play = useCallback(() => {
    if (!audioRef.current || !currentTrack) return

    audioRef.current
      .play()
      .then(() => {
        // Set 30-second timeout for preview mode
        if (state.isPreview && !state.hasVoted) {
          previewTimeoutRef.current = setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause()
            }
            setState((prev) => ({ ...prev, isPlaying: false }))
          }, 30000) // 30 seconds
        }
      })
      .catch((error) => {
        console.error("Play failed:", error)
        setState((prev) => ({
          ...prev,
          error: "Click play to start listening",
          isPlaying: false,
        }))
      })
  }, [currentTrack, state.isPreview, state.hasVoted])

  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
  }, [])

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [state.isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = Math.max(0, Math.min(1, volume))
  }, [])

  const voteUp = useCallback(() => {
    if (!currentTrack || state.hasVoted) return

    // Clear preview timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
    }

    // Load full track
    loadTrack(currentTrack, false)
    setState((prev) => ({ ...prev, hasVoted: true }))
  }, [currentTrack, state.hasVoted, loadTrack])

  const voteDown = useCallback(() => {
    if (state.hasVoted) return

    setState((prev) => ({ ...prev, hasVoted: true }))
    skipToNext()
  }, [state.hasVoted])

  const skipToNext = useCallback(() => {
    // In a real app, this would load the next track from a playlist
    // For demo purposes, we'll just stop playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      hasVoted: false,
      isPreview: true,
    }))
    setCurrentTrack(null)
  }, [])

  const getTimeRemaining = useCallback(() => {
    if (state.isPreview && !state.hasVoted) {
      return Math.max(0, 30 - Math.floor(state.currentTime))
    }
    return Math.max(0, Math.floor(state.duration - state.currentTime))
  }, [state.isPreview, state.hasVoted, state.currentTime, state.duration])

  return {
    state,
    currentTrack,
    loadTrack,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    voteUp,
    voteDown,
    skipToNext,
    getTimeRemaining,
  }
}
