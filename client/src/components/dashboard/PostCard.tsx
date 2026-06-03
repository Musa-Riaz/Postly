"use client"

import React from 'react'
import { Post } from '@/hooks/use-posts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { MoreVertical, Trash2, Edit2, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

interface PostCardProps {
  post: Post
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}

export function PostCard({ post, onDelete, onEdit }: PostCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-400'
      case 'SCHEDULED': return 'bg-main'
      case 'FAILED': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  const platforms = post.accounts?.map(acc => acc.platform) || []

  return (
    <Card className="flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-transform">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex gap-2 flex-wrap">
          {platforms.map((p, i) => (
            <Badge key={i} variant="outline" className="text-[10px] uppercase font-black border-2 border-black">
              {p}
            </Badge>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral" size="icon" className="h-8 w-8 hover:bg-accent border-2 border-transparent hover:border-black rounded-base transition-all">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-2 border-black font-bold">
            <DropdownMenuItem onClick={() => onEdit(post.id)} className="cursor-pointer">
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(post.id)} className="cursor-pointer text-red-500 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <div className="mb-4 text-sm line-clamp-3 font-medium bg-secondary/30 p-2 border-2 border-black rounded-base min-h-18">
          {post.content.replace(/<[^>]*>/g, '') || <span className="text-muted-foreground italic">No content</span>}
        </div>
        
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="relative aspect-video mb-4 rounded-base border-2 border-black overflow-hidden bg-accent/10">
            <Image 
              src={post.mediaUrls[0]} 
              alt="Post media" 
              fill
              className="object-cover"
            />
            {post.mediaUrls.length > 1 && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-white border-2 border-black rounded-base text-xs font-black">
                +{post.mediaUrls.length - 1}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(post.status)} text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase text-[10px] font-black`}>
              {post.status}
            </Badge>
            <div className="flex items-center text-[10px] font-bold text-muted-foreground">
               <Clock className="mr-1 h-3 w-3" />
               {format(new Date(post.createdAt), 'MMM d, h:mm a')}
            </div>
          </div>
          
          {(post.scheduledAt || post.publishedAt) && (
            <div className="flex items-center text-[10px] font-bold text-muted-foreground">
               <Calendar className="mr-1 h-3 w-3" />
               {post.status === 'PUBLISHED' ? 'Published' : 'Scheduled'}: {format(new Date((post.scheduledAt ?? post.publishedAt)!), 'MMM d, h:mm a')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
