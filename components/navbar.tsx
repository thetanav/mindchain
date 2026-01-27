"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Album,
  AudioWaveform,
  Bot,
  BrainCircuit,
  CircleCheck,
  Files,
  Globe,
  Home,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <header
      className={`sticky top-0 z-50 w-full ${scrolled
        ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        : ""
        }`}>
      <div className="container flex h-16 items-center justify-between">

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <BrainCircuit className="mr-2" />
            <h2 className="text-xl font-bold">MindChain</h2>
          </Link>
        </div>
      </div>
    </header>
  );
}
