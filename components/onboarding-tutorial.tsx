"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, X, ChevronRight, ChevronLeft } from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
  visual: React.ReactNode
  highlight?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to WaxRadio",
    description:
      "The underground music discovery platform where heat rises and the streets decide. Let's show you how it works!",
    visual: (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-red-500 font-bold text-4xl">W</span>
            <span className="text-yellow-500 font-bold text-4xl">a</span>
            <span className="text-green-500 font-bold text-4xl">x</span>
            <span className="text-white font-light text-3xl italic">radio</span>
          </div>
          <div className="text-sm text-gray-400">Heat rises. Let the streets decide.</div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "30-Second Previews",
    description:
      "Every track starts with a 30-second preview. Listen to discover new underground artists and decide if you want to hear more.",
    visual: (
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-radial from-gray-900 via-black to-gray-900 relative animate-spin-slow">
            <div className="absolute inset-4 rounded-full border border-gray-700"></div>
            <div className="absolute inset-8 rounded-full border border-gray-700"></div>
            <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-800"></div>
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-white font-bold">30</span>
          </div>
        </div>
      </div>
    ),
    highlight: "preview-timer",
  },
  {
    id: 3,
    title: "Heat Scoring System",
    description:
      "Every track has a heat score from 30° to 110°. The hotter the track, the more fans love it. Watch the thermometer rise!",
    visual: (
      <div className="flex items-center justify-center p-8 gap-8">
        <div className="text-center">
          <div className="w-4 h-20 bg-gray-800 rounded-full relative overflow-hidden mb-2">
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 via-orange-500 to-yellow-500 rounded-full h-4/5"></div>
          </div>
          <div className="text-red-500 font-bold">110°</div>
          <div className="text-xs text-gray-400">HOT</div>
        </div>
        <div className="text-center">
          <div className="w-4 h-20 bg-gray-800 rounded-full relative overflow-hidden mb-2">
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-green-500 rounded-full h-2/5"></div>
          </div>
          <div className="text-orange-500 font-bold">75°</div>
          <div className="text-xs text-gray-400">WARM</div>
        </div>
        <div className="text-center">
          <div className="w-4 h-20 bg-gray-800 rounded-full relative overflow-hidden mb-2">
            <div className="absolute bottom-0 w-full bg-green-500 rounded-full h-1/5"></div>
          </div>
          <div className="text-green-500 font-bold">45°</div>
          <div className="text-xs text-gray-400">COOL</div>
        </div>
      </div>
    ),
    highlight: "heat-thermometer",
  },
  {
    id: 4,
    title: "Vote with Your Thumbs",
    description:
      "👍 Love it? Hear the full track and boost its heat score.\n👎 Not feeling it? Skip to the next underground gem.",
    visual: (
      <div className="flex items-center justify-center p-8 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mb-2">
            <ThumbsUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-sm text-green-500 font-semibold">PLAY FULL TRACK</div>
          <div className="text-xs text-gray-400">Increases heat</div>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-2">
            <ThumbsDown className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-sm text-red-500 font-semibold">SKIP TRACK</div>
          <div className="text-xs text-gray-400">Next preview</div>
        </div>
      </div>
    ),
    highlight: "voting-buttons",
  },
  {
    id: 5,
    title: "Ready to Discover?",
    description:
      "You're all set! Start discovering underground artists and let your votes help decide what's hot on the streets.",
    visual: (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center mb-4 animate-pulse">
            <Play className="w-10 h-10 text-white" />
          </div>
          <div className="text-lg font-bold text-white mb-2">Let's Go!</div>
          <div className="text-sm text-gray-400">The streets are waiting...</div>
        </div>
      </div>
    ),
  },
]

interface OnboardingTutorialProps {
  onComplete: () => void
  onReset: () => void
}

export function OnboardingTutorial({ onComplete, onReset }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Auto-show when component mounts
    setIsVisible(true)
  }, [])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    console.log('🎓 Onboarding completed!')
    setIsVisible(false)
    setTimeout(() => {
      onComplete()
    }, 300)
  }

  const handleSkip = () => {
    console.log('🎓 Onboarding skipped!')
    handleComplete()
  }

  const step = onboardingSteps[currentStep]

  return (
    <div
      className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card className="w-full max-w-md bg-gray-900 border-gray-700 text-white">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {currentStep + 1} of {onboardingSteps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pt-2">
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Visual */}
          <div className="min-h-[200px] flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
            {step.visual}
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3 text-center">{step.title}</h2>
            <p className="text-gray-300 text-center leading-relaxed whitespace-pre-line">{step.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-gray-700">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button onClick={handleSkip} variant="ghost" className="text-gray-400 hover:text-white">
              Skip Tutorial
            </Button>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white hover:opacity-90"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                "Start Listening"
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
