"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ExternalLink, Star, Zap, Shield } from "lucide-react"
import { fetchOffers, getUserIP, type Offer } from "@/lib/offer-api"
import Image from "next/image"
import { gameScripts } from "@/lib/scripts-data"

interface OfferOverlayProps {
  isOpen: boolean
  onClose: () => void
  gameName: string
  gameLogo: string
  onOfferComplete: () => void
}

const difficultyConfig = {
  'VERY EASY': {
    color: 'rgba(77, 255, 77, 0.3)',
    borderColor: '#4dff4d',
    textColor: '#4dff4d',
    icon: Star
  },
  'EASY': {
    color: 'rgba(255, 204, 0, 0.3)',
    borderColor: '#ffcc00',
    textColor: '#ffcc00',
    icon: Zap
  },
  'MEDIUM': {
    color: 'rgba(255, 165, 0, 0.3)',
    borderColor: '#ffa500',
    textColor: '#ffa500',
    icon: Shield
  }
}

export function OfferOverlay({ isOpen, onClose, gameName, gameLogo, onOfferComplete }: OfferOverlayProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdownActive, setCountdownActive] = useState(false)
  const [showScriptLink, setShowScriptLink] = useState(false)
  const [scriptLink, setScriptLink] = useState<string>("")
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION_MS = 60_000

  useEffect(() => {
    if (isOpen) {
      loadOffers()
    }
  }, [isOpen])

  const loadOffers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const userIP = await getUserIP()
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0'
      const response = await fetchOffers(userIP, userAgent, 4)
      
      if (response && response.success) {
        setOffers(response.offers || [])
      } else {
        setError('Failed to load offers')
      }
    } catch (err) {
      setError('Failed to load offers. Please try again.')
      console.error('Error loading offers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOfferClick = (offer: Offer) => {
    // Open offer in new tab
    if (typeof window !== 'undefined') {
      // Store offer completion tracking
      localStorage.setItem('pendingOffer', JSON.stringify({
        offerId: offer.id,
        gameName: gameName,
        timestamp: Date.now()
      }))
      
      window.open(offer.url, '_blank', 'noopener,noreferrer')

      // Prepare target script link based on the selected game
      const match = gameScripts.find(g => g.name === gameName)
      setScriptLink(match?.scriptUrl || 'https://premiumscripts.vercel.app/')

      // Start hidden countdown (keep overlay open)
      if (!countdownActive) {
        setCountdownActive(true)
        setShowScriptLink(false)
        startTimeRef.current = Date.now()
        // Update progress smoothly without showing numbers
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
          const start = startTimeRef.current ?? Date.now()
          const elapsed = Date.now() - start
          if (elapsed >= DURATION_MS) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setCountdownActive(false)
            setShowScriptLink(true)
            onOfferComplete?.()
          }
        }, 100)
      }
    }
  }

  // Cleanup interval when overlay closes/unmounts
  useEffect(() => {
    if (!isOpen && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setCountdownActive(false)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isOpen])

  return (
    <>
      <style jsx>{`
        @keyframes goldBlink {
          0%, 100% {
            color: #ffcc00;
            text-shadow: 0 0 6px #ffcc00, 0 0 12px rgba(255,204,0,0.7);
          }
          50% {
            color: #fff4c2;
            text-shadow: 0 0 12px #ffcc00, 0 0 28px rgba(255,215,0,1);
          }
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50 animate-in fade-in-0 zoom-in-95 duration-300 relative sm:max-w-lg md:max-w-2xl lg:max-w-4xl !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
          showCloseButton={false}
        >
          {/* Modern Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <span className="text-red-400 text-lg font-bold">×</span>
          </button>
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Unlock Premium Scripts
            </DialogTitle>
          </div>
          
          {/* Game Info Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50 animate-in slide-in-from-top-4 duration-500">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/20">
              <Image 
                src={gameLogo} 
                alt={gameName} 
                fill 
                className="object-cover" 
                unoptimized
              />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                Complete 1 Task to unlock your{' '}
                <span style={{color: '#ffcc00', textShadow: '0 0 6px #ffcc00, 0 0 12px rgba(255,204,0,0.7)', animation: 'goldBlink 1.2s infinite'}}>
                  Premium Scripts
                </span>{' '}
                <span style={{color: '#ffcc00', textShadow: '0 0 8px #ffcc00, 0 0 16px rgba(255,204,0,0.8)'}}>
                </span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading offers...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadOffers} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && offers && offers.length > 0 && (
            <div className="grid gap-4">
              {offers.map((offer, index) => {
                const config = difficultyConfig[offer.difficulty]
                const IconComponent = config.icon
                
                return (
                  <Card
                    key={offer.id}
                    className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div 
                        className="text-xs font-bold px-2 py-1 rounded-lg border whitespace-nowrap"
                        style={{
                          background: config.color,
                          color: config.textColor,
                          borderColor: config.borderColor,
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          border: `1px solid ${config.borderColor}`,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {offer.difficulty}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Offer Header */}
                      <div className="flex items-start gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20">
                          <Image 
                            src={offer.icon} 
                            alt={offer.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                            onError={(e) => {
                              // Fallback to a default icon if image fails to load
                              const target = e.target as HTMLImageElement
                              target.src = 'https://cdn-icons-png.flaticon.com/512/888/888857.png'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {offer.title}
                          </h4>
                          <p 
                            className="text-sm font-semibold mt-1"
                            style={{
                              color: '#00ff88',
                              textShadow: '0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.6)'
                            }}
                          >
                            {offer.description}
                          </p>
                        </div>
                      </div>

                      {/* Reward Info */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Reward: {offer.reward}</span>
                      </div>

                      {/* Start Offer Button */}
                      <Button
                        onClick={() => handleOfferClick(offer)}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                        size="lg"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Start Task
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && !error && offers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No offers available at the moment.</p>
              <Button onClick={loadOffers} variant="outline">
                Refresh
              </Button>
            </div>
          )}

          {/* Hidden Countdown & Reveal Area - sits under the tasks */}
          {(countdownActive || showScriptLink) && (
            <div className="mt-2 flex items-center justify-between p-3 border rounded-md border-border/50 bg-card/40">
              <div className="flex items-center gap-3">
                {/* Small circular loader without numbers */}
                <div className="relative w-6 h-6">
                  <span className="absolute inset-0 rounded-full" style={{
                    background: 'conic-gradient(var(--accent) 0deg, var(--accent) 45deg, transparent 45deg 360deg)'
                  }} />
                  <span className="absolute inset-[2px] rounded-full" style={{
                    background: 'radial-gradient(circle at center, var(--background) 60%, transparent 61%)'
                  }} />
                  {/* Rotating mask to imply progress without revealing time */}
                  {countdownActive && (
                    <span className="absolute inset-0 rounded-full animate-[spin_1.2s_linear_infinite]" style={{
                      border: '3px solid transparent',
                      borderTopColor: 'var(--accent)'
                    }} />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {countdownActive ? 'Preparing your access…' : 'Ready'}
                </span>
              </div>

              {showScriptLink && scriptLink && (
                <a
                  href={scriptLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  Open Scripts
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}



