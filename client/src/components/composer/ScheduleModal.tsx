"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (date: Date) => void
}

export function ScheduleModal({ open, onOpenChange, onSchedule }: ScheduleModalProps) {
  const [date, setDate] = React.useState<string>("")
  const [time, setTime] = React.useState<string>("12:00")

  // Default to tomorrow 12:00
  React.useEffect(() => {
    if (open && !date) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDate(format(tomorrow, "yyyy-MM-dd"))
    }
  }, [open, date])

  const handleSchedule = () => {
    if (!date || !time) return
    const [year, month, day] = date.split("-").map(Number)
    const [hours, minutes] = time.split(":").map(Number)
    const scheduledDate = new Date(year, month - 1, day, hours, minutes)
    onSchedule(scheduledDate)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
          <DialogDescription>
            Choose a date and time for your post to go live.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-wider">
              Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 border-2 border-black focus-visible:ring-0 focus-visible:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-wider">
              Time
            </label>
            <div className="relative">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 border-2 border-black focus-visible:ring-0 focus-visible:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSchedule}
            className="w-full bg-[#FFB800] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
