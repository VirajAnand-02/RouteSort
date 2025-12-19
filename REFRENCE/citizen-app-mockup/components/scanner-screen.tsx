"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload } from "lucide-react"

interface ScannerScreenProps {
  onNavigate: (screen: string) => void
}

export default function ScannerScreen({ onNavigate }: ScannerScreenProps) {
  const [scanned, setScanned] = useState<null | {
    material: string
    recyclable: boolean
    category: string
    tips: string
  }>(null)

  const materialDatabase = {
    plastic_1: {
      material: "Plastic #1 (PET)",
      recyclable: true,
      category: "Plastic",
      tips: "Rinse and remove caps before recycling. Common in soda and water bottles.",
    },
    plastic_2: {
      material: "Plastic #2 (HDPE)",
      recyclable: true,
      category: "Plastic",
      tips: "Accepted at most facilities. Found in milk jugs and detergent bottles.",
    },
    aluminum: {
      material: "Aluminum Cans",
      recyclable: true,
      category: "Metal",
      tips: "Highly valuable and infinitely recyclable. Rinse before recycling.",
    },
    glass: {
      material: "Glass Bottles",
      recyclable: true,
      category: "Glass",
      tips: "Keep separate from other recyclables. No lids or caps.",
    },
    plastic_foam: {
      material: "Polystyrene Foam",
      recyclable: false,
      category: "Plastic",
      tips: "Not accepted at most facilities. Consider reusing for storage.",
    },
  }

  const handleScan = (type: keyof typeof materialDatabase) => {
    setScanned(materialDatabase[type])
  }

  const handleAddPoints = () => {
    setScanned(null)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-1 hover:bg-primary-foreground/20 rounded transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Scan Material</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6 pt-6">
        {!scanned ? (
          <>
            {/* Scanner Preview */}
            <div className="bg-gradient-to-b from-primary/20 to-accent/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-64 border-2 border-dashed border-primary/30">
              <Camera className="w-12 h-12 text-primary mb-4" />
              <p className="text-center text-sm text-muted-foreground mb-6">
                Point your camera at a material to scan its recyclability
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Camera className="w-4 h-4 mr-2" />
                Open Camera
              </Button>
            </div>

            {/* Or upload */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">Or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>

            {/* Demo Results */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Scan Results</p>
              <div className="grid gap-2">
                {Object.entries({
                  plastic_1: "Plastic #1",
                  aluminum: "Aluminum Can",
                  glass: "Glass Bottle",
                  plastic_foam: "Foam Packaging",
                }).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleScan(key as keyof typeof materialDatabase)}
                    className="bg-card border border-border rounded-lg p-3 hover:border-primary transition text-left"
                  >
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">Tap to see results</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Result Card */}
            <Card
              className={`border-2 ${scanned.recyclable ? "border-accent/50 bg-accent/5" : "border-destructive/50 bg-destructive/5"}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">{scanned.material}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 font-normal">{scanned.category}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      scanned.recyclable ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {scanned.recyclable ? "♻️ Recyclable" : "⚠️ Not Recyclable"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-foreground leading-relaxed">{scanned.tips}</p>
                </div>

                {scanned.recyclable && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-accent">+150 Points</p>
                    <p className="text-xs text-accent/70 mt-1">For recycling this correctly</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {scanned.recyclable && (
              <>
                <Button
                  onClick={handleAddPoints}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                >
                  I'm Recycling This
                </Button>
                <p className="text-xs text-center text-muted-foreground">✓ 150 points added to your account</p>
              </>
            )}

            <Button
              onClick={() => setScanned(null)}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              Scan Another
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
