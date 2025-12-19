"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import Dashboard from "@/components/dashboard"
import ScannerScreen from "@/components/scanner-screen"
import RewardsScreen from "@/components/rewards-screen"
import LeaderboardScreen from "@/components/leaderboard-screen"
import ProfileScreen from "@/components/profile-screen"

type Screen =
  | "welcome"
  | "dashboard"
  | "scanner"
  | "rewards"
  | "leaderboard"
  | "profile"

export default function CitizenAppPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [isOnboarded, setIsOnboarded] = useState(false)

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen)
  }

  const handleOnboardingComplete = () => {
    setIsOnboarded(true)
    setCurrentScreen("dashboard")
  }

  const renderScreen = () => {
    if (!isOnboarded) {
      return <WelcomeScreen onComplete={handleOnboardingComplete} />
    }

    switch (currentScreen) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />
      case "scanner":
        return <ScannerScreen onNavigate={handleNavigate} />
      case "rewards":
        return <RewardsScreen onNavigate={handleNavigate} />
      case "leaderboard":
        return <LeaderboardScreen onNavigate={handleNavigate} />
      case "profile":
        return <ProfileScreen onNavigate={handleNavigate} />
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return <div className="min-h-screen bg-background">{renderScreen()}</div>
}
