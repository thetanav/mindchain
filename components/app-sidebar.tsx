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
import { CircleCheck, Bot, Files, Globe, Home, Album, AudioWaveform, BrainCircuit, LogIn } from "lucide-react";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ModeToggle } from "@/components/theme-mode";

const routes = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/chat", icon: Bot, label: "AI Chat" },
  { href: "/documents", icon: Files, label: "Documents" },
  { href: "/community", icon: Globe, label: "Community" },
  { href: "/check", icon: CircleCheck, label: "Quiz" },
  { href: "/relaxo", icon: AudioWaveform, label: "Relaxo" },
  { href: "/journal", icon: Album, label: "Journal" },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-4">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <BrainCircuit />
            <h2 className="text-xl font-bold">MindChain</h2>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
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
      <SidebarFooter>
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