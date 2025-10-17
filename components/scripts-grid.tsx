"use client"

import { useState } from "react"
import { GameCard } from "./game-card"
import { gameScripts } from "@/lib/scripts-data"
import { Button } from "@/components/ui/button"

export function ScriptsGrid() {
  const [filter, setFilter] = useState<"all" | "trending" | "new">("all")

  const filteredScripts = gameScripts.filter((game) => {
    if (filter === "trending") return game.trending
    if (filter === "new") return game.new
    return true
  })

  return (
    <section id="scripts" className="relative py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          {/* Section header - optimized for mobile */}
          <div className="text-center space-y-2 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Premium Scripts
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Choose from our collection of premium scripts for the most popular Roblox games
            </p>
          </div>

          {/* Filter buttons - optimized for mobile touch */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap px-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={`text-xs sm:text-sm ${filter === "all" ? "bg-gradient-to-r from-primary to-secondary" : ""}`}
              size="sm"
            >
              All Scripts
            </Button>
            <Button
              variant={filter === "trending" ? "default" : "outline"}
              onClick={() => setFilter("trending")}
              className={`text-xs sm:text-sm ${filter === "trending" ? "bg-gradient-to-r from-primary to-secondary" : ""}`}
              size="sm"
            >
              Trending
            </Button>
            <Button
              variant={filter === "new" ? "default" : "outline"}
              onClick={() => setFilter("new")}
              className={`text-xs sm:text-sm ${filter === "new" ? "bg-gradient-to-r from-primary to-secondary" : ""}`}
              size="sm"
            >
              New
            </Button>
          </div>

          {/* Scripts grid - optimized for mobile with better spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredScripts.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
