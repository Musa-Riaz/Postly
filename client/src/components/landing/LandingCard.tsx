import { cn } from "@/lib/utils";
import React from "react";

interface LandingCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "main" | "accent" | "secondary";
}

export const LandingCard = ({
  children,
  className,
  variant = "default",
}: LandingCardProps) => {
  const variants = {
    default: "bg-white",
    main: "bg-main",
    accent: "bg-color-accent",
    secondary: "bg-color-secondary",
  };

  return (
    <div
      className={cn(
        "neo-border neo-shadow p-6",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
};
