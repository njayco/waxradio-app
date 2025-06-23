/**
 * Profile Setup Component
 * 
 * Main profile setup component that renders different forms based on user role.
 * Routes to FanProfileForm for fans and ArtistProfileForm for artists.
 * 
 * This component acts as a router to provide role-specific profile setup experiences.
 */

"use client"

import { useAuth } from '@/hooks/useAuth';
import { FanProfileForm } from './fan-profile-form';
import { ArtistProfileForm } from './artist-profile-form';

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { userProfile } = useAuth();

  // Render different forms based on user role
  if (userProfile?.userType === 'fan') {
    return (
      <FanProfileForm
        onComplete={() => {
          console.log('✅ Fan profile setup completed');
          onComplete();
        }}
      />
    );
  } else if (userProfile?.userType === 'artist') {
    return (
      <ArtistProfileForm
        onComplete={() => {
          console.log('✅ Artist profile setup completed');
          onComplete();
        }}
      />
    );
  }

  // Fallback for unknown user types or loading state
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading profile setup...</p>
        <p className="text-sm text-muted-foreground mt-2">Preparing your personalized setup</p>
      </div>
    </div>
  );
} 