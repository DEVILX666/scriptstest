"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Sparkles, Loader2, Download } from "lucide-react"
import type { GameScript } from "@/lib/scripts-data"
import Image from "next/image"
import { useState } from "react"
import { OfferOverlay } from "@/components/offer-overlay"

interface GameCardProps {
  game: GameScript
}

export function GameCard({ game }: GameCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showOfferOverlay, setShowOfferOverlay] = useState(false)

  const handleCardClick = async () => {
    if (isLoading || showOfferOverlay) return

    setIsLoading(true)

    // 2 second delay with loading animation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Show offer overlay instead of redirecting
    setShowOfferOverlay(true)
    setIsLoading(false)
  }

  const handleOfferComplete = () => {
    setShowOfferOverlay(false)
    // Don't redirect automatically - wait for API completion notification
  }

  const handleOverlayClose = () => {
    setShowOfferOverlay(false)
    setIsLoading(false)
  }

  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />

      <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Header with logo and badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors flex-shrink-0">
            <Image src={game.logoUrl || "/placeholder.svg"} alt={game.name} fill className="object-cover" />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
            {game.trending && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            {game.new && (
              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
          </div>
        </div>

        {/* Game info */}
        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {game.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">{game.description}</p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Features</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {game.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs border-border/50 bg-muted/30">
                {feature}
              </Badge>
            ))}
            {game.features.length > 3 && (
              <Badge variant="outline" className="text-xs border-border/50 bg-muted/30">
                +{game.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm sm:text-base py-5 sm:py-6 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Preparing Scripts...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              GET SCRIPTS
            </>
          )}
        </Button>
      </div>

      {/* Offer Overlay */}
      <OfferOverlay
        isOpen={showOfferOverlay}
        onClose={handleOverlayClose}
        gameName={game.name}
        gameLogo={game.logoUrl}
        onOfferComplete={handleOfferComplete}
      />
    </Card>
  )
}
