"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="neutral"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`w-full transition-all duration-200 ${collapsed ? "justify-center mr-4 p-2 h-10 w-10" : "justify-start px-4"}`}
    >
      {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      <span className={`transition-opacity duration-200 ${collapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"}`}>
        {theme === "light" ? "Dark" : "Light"}
      </span>
    </Button>
  )
}
