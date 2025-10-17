export interface GameScript {
  id: string
  name: string
  description: string
  category: "FPS" | "RPG" | "Simulator" | "Adventure" | "Obby" | "Horror" | "Other"
  features: string[]
  logoUrl: string
  scriptUrl: string
  trending?: boolean
  new?: boolean
}

export const gameScripts: GameScript[] = [
  {
    id: "99-nights-forest",
    name: "99 Nights in the Forest",
    description: "",
    category: "Horror",
    features: ["Diamonds Finder", "Godmode", "Kill-Aura", "Auto Rescue Child", "FLY"],
    logoUrl: "/99-nights-logo.png",
    scriptUrl: "https://99nightsscripts.vercel.app/",
    trending: true,
    new: true,
  },
  {
    id: "plants-vs-brainrots",
    name: "Plants Vs Brainrots",
    description: "",
    category: "Other",
    features: ["Item Dupe", "Auto Farm & Auto Buy", "Auto-Attack", "Kill-Aura", "No Cooldown"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-549f1500c07a8bbd19537056d34b605e/150/150/Image/Webp/noFilter",
    scriptUrl: "https://plantsvsbrainrotsscripts.vercel.app/",
    trending: true,
  },
  {
    id: "grow-garden",
    name: "Grow a Garden",
    description: "",
    category: "Simulator",
    features: ["Spawn Pets & Seeds", "Steal People Fruits", "Dupe Fruits", "Instant Grow", "Teleport"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-900822048ca4e4fdda877229576ffc04/150/150/Image/Webp/noFilter",
    scriptUrl: "https://premiumscripts.vercel.app/",
    new: true,
  },
  {
    id: "steal-brainrot",
    name: "Steal a Brainrot",
    description: "",
    category: "Adventure",
    features: ["Auto Steal", "Item ESP", "Speed Hack", "TELEPORT", "FLY"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-706a6a11a02ea7f005b60e0a7cfe9fd5/150/150/Image/Webp/noFilter",
    scriptUrl: "https://stealbrainrotscripts.vercel.app/",
  },
]
