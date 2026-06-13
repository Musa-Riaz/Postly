"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Square, RectangleVertical, RectangleHorizontal } from 'lucide-react'

interface AspectRatioSelectorProps {
  value: '1:1' | '4:5' | '16:9'
  onChange: (value: '1:1' | '4:5' | '16:9') => void
}

const AspectRatioSelector = ({ value, onChange }: AspectRatioSelectorProps) => {
  const options = [
    { label: '1:1', value: '1:1', icon: Square },
    { label: '4:5', value: '4:5', icon: RectangleVertical },
    { label: '16:9', value: '16:9', icon: RectangleHorizontal },
  ] as const

  return (
    <div className="flex items-center gap-2 mb-4 bg-secondary-background p-1 border-2 border-border rounded-base w-fit">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-base text-xs font-bold transition-all",
            value === option.value
              ? "bg-main border-2 border-border shadow-shadow -translate-y-0.5"
              : "bg-transparent border-2 border-transparent hover:bg-main/20"
          )}
        >
          <option.icon size={14} />
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default AspectRatioSelector
