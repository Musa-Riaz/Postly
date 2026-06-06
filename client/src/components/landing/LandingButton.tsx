"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface LandingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const LandingButton = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: LandingButtonProps) => {
  const variants = {
    primary: "bg-main text-main-foreground",
    secondary: "bg-color-secondary text-white",
    accent: "bg-color-accent text-black",
    outline: "bg-white text-black border-2 border-black",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <button
      className={cn(
        "neo-border neo-shadow neo-interactive font-black uppercase tracking-tight inline-flex items-center justify-center",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
