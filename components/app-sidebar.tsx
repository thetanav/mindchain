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
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CircleCheck, Bot, Globe, Home, Album, AudioWaveform, BrainCircuit, LogIn, Joystick, ListChecks } from "lucide-react";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const routes = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/chat", icon: Bot, label: "AI Chat" },
  { href: "/community", icon: Globe, label: "Community" },
  { href: "/check", icon: CircleCheck, label: "Quiz" },
  { href: "/relaxo", icon: AudioWaveform, label: "Relaxo" },
  { href: "/journal", icon: Album, label: "Journal" },
  { href: "/game", icon: Joystick, label: "Game" },
  { href: "/todo", icon: ListChecks, label: "Todo" },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <BrainCircuit />
            <h2 className="text-xl font-bold">Mindchain</h2>
          </Link>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map(r => (
                <SidebarMenuItem key={r.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === r.href || pathname?.startsWith(`${r.href}/`)}
                    tooltip={r.label}
                  >
                    <Link href={r.href}>
                      <r.icon className="w-4" />
                      <span>{r.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 w-full items-center">
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="w-full justify-start gap-2">
              <LogIn className="w-4" />
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  )
}