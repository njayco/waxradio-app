"use client"

import { useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { uploadTrack, UploadProgress } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, Music, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function TrackUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [uploadResult, setUploadResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('audio/')) {
        setError('Please select an audio file (.mp3, .wav, .m4a, etc.)')
        return
      }
      
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 50MB')
        return
      }
      
      setFile(selectedFile)
      setError(null)
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) {
      setError('Please select a file and make sure you are logged in')
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(null)

    try {
      console.log('🎵 Starting upload for user:', user.uid)
      
      const result = await uploadTrack(
        file,
        user.uid,
        (progress) => {
          setUploadProgress(progress)
        }
      )

      console.log('🎵 Upload successful:', result)
      setUploadResult(result.downloadURL)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      toast({
        title: "Upload successful!",
        description: "Your track has been uploaded successfully.",
      })

    } catch (error: any) {
      console.error('🎵 Upload failed:', error)
      setError(error.message || 'Upload failed')
      
      toast({
        title: "Upload failed",
        description: error.message || 'Please try again.',
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p>Please log in to upload tracks</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Upload Track
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="track-file">Select Audio File</Label>
          <Input
            ref={fileInputRef}
            id="track-file"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">
            Supported formats: MP3, WAV, M4A, etc. (Max 50MB)
          </p>
        </div>

        {file && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {file.type}
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress.progress.toFixed(1)}%</span>
            </div>
            <Progress value={uploadProgress.progress} className="w-full" />
            <p className="text-xs text-gray-500">
              {formatFileSize(uploadProgress.bytesTransferred)} of {formatFileSize(uploadProgress.totalBytes)}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {uploadResult && (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-400">Upload successful!</p>
            </div>
            <div className="mt-2">
              <Label className="text-xs">Download URL:</Label>
              <Input
                value={uploadResult}
                readOnly
                className="text-xs"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Track
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 