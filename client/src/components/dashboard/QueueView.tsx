"use client"

import React from 'react'
import { Post } from '@/hooks/use-posts'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar, Clock, MoreVertical } from 'lucide-react'

interface QueueViewProps {
  posts: Post[]
}

export function QueueView({ posts }: QueueViewProps) {
  const upcomingPosts = posts
    .filter(p => p.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())

  if (upcomingPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-black/20 rounded-base bg-secondary-background/10">
        <Calendar size={48} className="text-black/20 mb-4" />
        <p className="text-lg font-bold text-black/40">No posts scheduled yet.</p>
        <p className="text-sm font-medium text-black/30">Your upcoming content will appear here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {upcomingPosts.map((post) => (
        <Card key={post.id} className="group border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex flex-col items-center justify-center p-2 bg-main border-2 border-black rounded-base min-w-[70px]">
              <span className="text-[10px] uppercase font-black">{format(new Date(post.scheduledAt!), 'MMM')}</span>
              <span className="text-2xl font-black leading-none">{format(new Date(post.scheduledAt!), 'dd')}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={12} className="text-black/50" />
                <span className="text-xs font-bold uppercase tracking-wider text-black/50">
                  {format(new Date(post.scheduledAt!), 'hh:mm a')}
                </span>
                <div className="flex gap-1 ml-auto">
                   {post.accounts?.map((acc, i) => (
                       <div key={i} className="px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase rounded-full">
                           {acc.platform}
                       </div>
                   ))}
                </div>
              </div>
              <p className="text-sm font-bold truncate">
                {post.content.replace(/<[^>]*>/g, '') || 'No content'}
              </p>
            </div>

            <Button variant="neutral" size="icon" className="h-8 w-8 ml-2">
              <MoreVertical size={16} />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
