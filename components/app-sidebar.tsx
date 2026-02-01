"use client";

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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { CircleCheck, Bot, Globe, Home, Album, AudioWaveform, LogIn, ListChecks, Gamepad2, Music2, Heart, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const overviewRoutes = [
  { href: "/home", icon: Home, label: "Home" },
];

const toolRoutes = [
  { href: "/journal", icon: Album, label: "Journal" },
  { href: "/lofi", icon: Music2, label: "Lofi" },
  { href: "/relaxo", icon: AudioWaveform, label: "Relaxo" },
  { href: "/check", icon: CircleCheck, label: "Quiz" },
  { href: "/meditation", icon: Heart, label: "Meditate" },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/todo", icon: ListChecks, label: "Todo" },
];

const communityRoutes = [
  { href: "/games", icon: Gamepad2, label: "Games" },
  { href: "/community", icon: Globe, label: "Community" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-4">
          <Link href="/" className="flex items-center gap-3 group-data-[collapsible=icon]:hidden transition-all">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
               <Image src="/logo.png" alt="Mindchain" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <h2 className="text-xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Mindchain
            </h2>
          </Link>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-4 mb-2">Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewRoutes.map(r => (
                <SidebarMenuItem key={r.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === r.href}
                    tooltip={r.label}
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-2"
                  >
                    <Link href={r.href}>
                      <r.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className="font-medium">{r.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="mx-4 my-4 opacity-50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-4 mb-2">Wellness Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname?.startsWith(`/chat`)}
                    tooltip="AI Chat"
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-2"
                  >
                    <Link href="/chat">
                      <Bot className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className="font-medium">AI Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              {toolRoutes.map(r => (
                <SidebarMenuItem key={r.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === r.href || pathname?.startsWith(`${r.href}/`)}
                    tooltip={r.label}
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-2"
                  >
                    <Link href={r.href}>
                      <r.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className="font-medium">{r.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 my-4 opacity-50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-4 mb-2">Connect</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
               {communityRoutes.map(r => (
                <SidebarMenuItem key={r.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === r.href}
                    tooltip={r.label}
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-2"
                  >
                    <Link href={r.href}>
                      <r.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span className="font-medium">{r.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 w-full items-center border-t border-sidebar-border/50">
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="w-full justify-start gap-2 shadow-sm" variant="outline">
              <LogIn className="w-4 h-4" />
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3 w-full p-2 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/50">
             <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-lg"
                }
             }}/>
             <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-medium">My Account</span>
                <span className="text-[10px] text-muted-foreground">Manage settings</span>
             </div>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  )
}