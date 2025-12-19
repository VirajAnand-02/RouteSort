"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import Dashboard from "@/components/dashboard"
import ScannerScreen from "@/components/scanner-screen"
import RewardsScreen from "@/components/rewards-screen"
import LeaderboardScreen from "@/components/leaderboard-screen"
import ProfileScreen from "@/components/profile-screen"

type Screen = "welcome" | "dashboard" | "scanner" | "rewards" | "leaderboard" | "profile"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [isOnboarded, setIsOnboarded] = useState(false)

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
        return <Dashboard onNavigate={setCurrentScreen} />
      case "scanner":
        return <ScannerScreen onNavigate={setCurrentScreen} />
      case "rewards":
        return <RewardsScreen onNavigate={setCurrentScreen} />
      case "leaderboard":
        return <LeaderboardScreen onNavigate={setCurrentScreen} />
      case "profile":
        return <ProfileScreen onNavigate={setCurrentScreen} />
      default:
        return <Dashboard onNavigate={setCurrentScreen} />
    }
  }

  return <div className="min-h-screen bg-background">{renderScreen()}</div>
}
