"use client"

import { Button } from "@/components/ui/button"
import { Leaf, Zap, Users } from "lucide-react"

interface WelcomeScreenProps {
  onComplete: () => void
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center pt-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">RouteSort</h1>
          <p className="text-lg text-muted-foreground">Smart Waste Rewards</p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="mt-1 p-2 bg-primary/20 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">Schedule pickups on your terms</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="mt-1 p-2 bg-accent/20 rounded-lg">
              <Leaf className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Instant Guidance</h3>
              <p className="text-sm text-muted-foreground">Scan & learn what&apos;s recyclable</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="mt-1 p-2 bg-secondary/20 rounded-lg">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Get points for every contribution</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onComplete}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Get Started
        </Button>

        <p className="text-xs text-muted-foreground">Join thousands making a difference</p>
      </div>
    </div>
  )
}
