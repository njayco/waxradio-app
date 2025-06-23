/**
 * Onboarding Hook
 * 
 * Manages the onboarding tutorial flow for first-time users.
 * Shows onboarding after profile setup is complete for new users.
 * 
 * Updated to work with Firestore-based onboarding system instead of localStorage.
 */

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { userProfile, updateUserProfile } = useAuth()

  useEffect(() => {
    console.log('🎓 Checking onboarding status...');
    
    if (userProfile) {
      // Check if user has completed onboarding from Firestore
      const hasCompletedOnboarding = userProfile.onboarded || false;
      console.log('🎓 Has completed onboarding (from Firestore):', hasCompletedOnboarding);

      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
        console.log('🎓 Showing onboarding for first-time user');
      } else {
        setShowOnboarding(false)
        console.log('🎓 User has completed onboarding, skipping');
      }
    } else {
      // If no user profile yet, assume onboarding is needed
      setShowOnboarding(true)
      console.log('🎓 No user profile yet, assuming onboarding needed');
    }

    setIsLoading(false)
  }, [userProfile])

  /**
   * Complete the onboarding tutorial
   * Saves completion status to Firestore and hides onboarding
   */
  const completeOnboarding = async () => {
    console.log('🎓 Completing onboarding...')
    
    try {
      // Update the user profile to mark onboarding as complete
      await updateUserProfile({ onboarded: true });
      console.log('🎓 Onboarding saved to Firestore')
      setShowOnboarding(false)
      console.log('🎓 showOnboarding set to false')
    } catch (error) {
      console.error('🎓 Failed to complete onboarding:', error);
      // Fallback to localStorage if Firestore fails
      if (typeof window !== 'undefined') {
        localStorage.setItem('waxradio-onboarding-completed', "true")
        console.log('🎓 Onboarding saved to localStorage as fallback')
      }
      setShowOnboarding(false)
    }
  }

  /**
   * Reset onboarding for testing or user preference
   * Removes completion status and shows onboarding again
   */
  const resetOnboarding = async () => {
    console.log('🎓 Resetting onboarding...')
    
    try {
      // Update the user profile to mark onboarding as incomplete
      await updateUserProfile({ onboarded: false });
      console.log('🎓 Onboarding reset in Firestore')
    } catch (error) {
      console.error('🎓 Failed to reset onboarding in Firestore:', error);
    }
    
    // Also clear localStorage for consistency
    if (typeof window !== 'undefined') {
      localStorage.removeItem('waxradio-onboarding-completed')
    }
    
    setShowOnboarding(true)
    console.log('🎓 showOnboarding set to true')
  }

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  }
}
