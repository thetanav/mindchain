"use client"

import { Gamepad2, ExternalLink } from "lucide-react"
import { games } from "@/lib/games"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GamesPage() {
  const getGameName = (url: string) => {
    const parts = url.split("/")
    const slug = parts[parts.length - 1] || parts[parts.length - 2]
    return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  const getGameIcon = (index: number) => {
    const colors = [
      "from-red-500 to-orange-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-amber-500",
      "from-indigo-500 to-violet-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-emerald-500",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary" />
            Mind Games
          </h1>
          <p className="text-muted-foreground mt-1">
            Enjoy these brain-boosting games to relax and challenge yourself
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30">
            <div className={`absolute inset-0 bg-gradient-to-br ${getGameIcon(index)} opacity-5`} />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getGameIcon(index)} text-white shadow-lg`}>
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {getGameName(game)}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                Play this game on CrazyGames
              </p>
              <Button asChild className="w-full" variant="default">
                <a href={game} target="_blank" rel="noopener noreferrer">
                  Play Now
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
