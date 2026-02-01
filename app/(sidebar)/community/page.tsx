"use client"

import { useState } from "react"
import { Search, Users, UserPlus, UserMinus, MessageSquare, Globe, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { comm } from "@/lib/comm"

type Group = {
  id: string
  name: string
  description: string
  members: number
  category: string
  joined: boolean
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Anxiety Support",
      description: "A safe space to discuss anxiety and share coping strategies.",
      members: 128,
      category: "Anxiety",
      joined: false,
    },
    {
      id: "2",
      name: "Depression Recovery",
      description: "Support group for those dealing with depression and working toward recovery.",
      members: 95,
      category: "Depression",
      joined: true,
    },
    {
      id: "3",
      name: "Mindfulness Practice",
      description: "Daily mindfulness exercises and discussions about meditation techniques.",
      members: 76,
      category: "Mindfulness",
      joined: false,
    },
    {
      id: "4",
      name: "Stress Management",
      description: "Strategies and support for managing stress in daily life.",
      members: 112,
      category: "Stress",
      joined: false,
    },
    {
      id: "5",
      name: "Sleep Improvement",
      description: "Discussions and tips for better sleep habits and overcoming insomnia.",
      members: 64,
      category: "Sleep",
      joined: true,
    },
  ])
  const { toast } = useToast()

  const toggleJoin = (id: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === id) {
          const newJoinedState = !group.joined

          toast({
            description: newJoinedState
              ? `You've joined the ${group.name} group`
              : `You've left the ${group.name} group`,
          })

          return {
            ...group,
            joined: newJoinedState,
            members: newJoinedState ? group.members + 1 : group.members - 1,
          }
        }
        return group
      }),
    )
  }

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCommunityInfo = (url: string) => {
    if (url.includes("discord")) {
      return { name: "Discord Community", icon: "from-indigo-500 to-purple-500", description: "Join our Discord server for real-time support and discussions" }
    }
    if (url.includes("reddit")) {
      return { name: "Reddit Depression", icon: "from-orange-500 to-red-500", description: "Connect with the Reddit depression community" }
    }
    if (url.includes("facebook")) {
      return { name: "Facebook Group", icon: "from-blue-500 to-cyan-500", description: "Join the WebMD Depression Community on Facebook" }
    }
    return { name: "Community Link", icon: "from-gray-500 to-gray-600", description: "Visit community resource" }
  }

  return (
    <div className="container py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8 text-primary" />
          External Communities
        </h1>
        <p className="text-muted-foreground">Connect with external support communities and resources</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {comm.map((link, index) => {
          const info = getCommunityInfo(link)
          return (
            <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 h-full">
              <div className={`absolute inset-0 bg-gradient-to-br ${info.icon} opacity-5`} />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${info.icon} text-white shadow-lg`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {info.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {info.description}
                </p>
                <Button asChild className="w-full" variant="default">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    Visit Community
                  </a>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">Support Groups</h1>
          <p className="text-muted-foreground mt-1">Connect with others on similar mental health journeys</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{group.name}</CardTitle>
                <Badge>{group.category}</Badge>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <Avatar key={i} className="border-2 border-background w-8 h-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>U{i + 1}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-xs">
                  +{group.members - 4}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {group.members} members
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Chat
                </Button>
                <Button
                  variant={group.joined ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleJoin(group.id)}
                >
                  {group.joined ? (
                    <>
                      <UserMinus className="mr-1 h-4 w-4" />
                      Leave
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-1 h-4 w-4" />
                      Join
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
