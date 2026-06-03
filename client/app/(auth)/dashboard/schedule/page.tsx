"use client"

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { usePosts } from '@/hooks/use-posts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import './calendar.css'

const SchedulePage = () => {
  const { posts, isLoading } = usePosts()

  const events = posts?.filter(p => p.status === 'SCHEDULED' || p.status === 'PUBLISHED').map(post => ({
    id: post.id,
    title: post.content.replace(/<[^>]*>/g, '').substring(0, 30) + '...',
    start: post.scheduledAt || post.publishedAt || post.createdAt,
    backgroundColor: post.status === 'PUBLISHED' ? '#22c55e' : '#FFB800',
    borderColor: '#000000',
    textColor: '#000000',
    extendedProps: { ...post }
  })) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Content Calendar</h1>
          <p className="text-secondary-foreground font-base">Manage and visualize your scheduled social media posts.</p>
        </div>
        <Link href="/dashboard/composer">
          <Button className="bg-main">
            <Plus size={18} className="mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
            <CardDescription>View your upcoming and past posts in a calendar format.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                height="auto"
                eventClick={(info) => {
                  // Handle event click - logic to show post details
                  console.log('Event clicked:', info.event.extendedProps)
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SchedulePage
