"use client";

import Link from "next/link";
import { LandingButton } from "./LandingButton";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b-4 border-black px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-main border-2 border-black neo-shadow flex items-center justify-center font-black text-xl">
          P
        </div>
        <span className="font-black text-2xl uppercase tracking-tighter">Postly</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 font-bold uppercase text-sm tracking-widest">
        <Link href="#features" className="hover:underline underline-offset-4">Features</Link>
        <Link href="#demo" className="hover:underline underline-offset-4">Demo</Link>
        <Link href="#pricing" className="hover:underline underline-offset-4">Pricing</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/sign-in" className="hidden sm:block font-bold uppercase text-sm hover:underline">
          Sign In
        </Link>
        <LandingButton size="sm">Get Started</LandingButton>
      </div>
    </nav>
  );
};
