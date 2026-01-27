import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { CircleCheck, Bot, Files, Globe, Home, Album, AudioWaveform, Layers, BrainCircuit, LogIn } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button";

const routes = [
  { href: "/home", icon: <Home className="w-4" />, label: "Home" },
  { href: "/chat", icon: <Bot className="w-4" />, label: "AI Chat" },
  { href: "/documents", icon: <Files className="w-4" />, label: "Documents" },
  { href: "/community", icon: <Globe className="w-4" />, label: "Community" },
  { href: "/check", icon: <CircleCheck className="w-4" />, label: "Quiz" },
  { href: "/relaxo", icon: <AudioWaveform className="w-4" />, label: "Relaxo" },
  { href: "/journal", icon: <Album className="w-4" />, label: "Journal" },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-4">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <BrainCircuit />
            <h2 className="text-xl font-bold">MindChain</h2>
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map(r => (
                <SidebarMenuItem key={r.label}>
                  <SidebarMenuButton asChild>
                    <a href={r.href}>
                      {r.icon}
                      <span>{r.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <SignedOut>
          <Button>
            <LogIn />
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  )
}