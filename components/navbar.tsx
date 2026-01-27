"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Navbar() {
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
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <BrainCircuit className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-bold">MindChain</h2>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Button variant="ghost" asChild>
              <Link href="/home">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}