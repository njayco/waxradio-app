"use client"

import { useState, useEffect } from "react"

const ONBOARDING_KEY = "waxradio-onboarding-completed"

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ensure we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      console.log('🎓 Checking onboarding status...');
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY)
      console.log('🎓 Has completed onboarding:', !!hasCompletedOnboarding);

      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
      }
    }

    setIsLoading(false)
  }, [])

  const completeOnboarding = () => {
    console.log('🎓 Completing onboarding...')
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, "true")
      console.log('🎓 Onboarding saved to localStorage')
    }
    setShowOnboarding(false)
    console.log('🎓 showOnboarding set to false')
  }

  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_KEY)
    }
    setShowOnboarding(true)
  }

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  }
}
