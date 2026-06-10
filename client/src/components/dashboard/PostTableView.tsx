"use client"

import React from 'react'
import { Post } from '@/hooks/use-posts'
import { format } from 'date-fns'
import { MoreVertical, Trash2, Edit2, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface PostTableViewProps {
  posts: Post[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onClickRow?: (post: Post) => void
}

export function PostTableView({ posts, onDelete, onEdit, onClickRow }: PostTableViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-400'
      case 'SCHEDULED': return 'bg-main'
      case 'FAILED': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="border-4 border-black rounded-base overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-4 border-black bg-accent/10">
              <th className="p-4 font-black uppercase text-sm">Post</th>
              <th className="p-4 font-black uppercase text-sm">Platforms</th>
              <th className="p-4 font-black uppercase text-sm">Status</th>
              <th className="p-4 font-black uppercase text-sm">Date</th>
              <th className="p-4 font-black uppercase text-sm w-20"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr 
                key={post.id} 
                onClick={() => onClickRow?.(post)}
                className="border-b-2 border-black last:border-0 hover:bg-accent/5 transition-colors cursor-pointer"
              >
                <td className="p-4">
                  <div className="font-bold line-clamp-1 max-w-xs">
                    {post.content.replace(/<[^>]*>/g, '') || <span className="text-muted-foreground italic">No content</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {post.accounts?.map((acc, i) => (
                      <Badge key={i} variant="default" className="text-[10px] uppercase font-black border border-black px-1 py-0">
                        {acc.platform}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={`${getStatusColor(post.status)} text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase text-[10px] font-black`}>
                    {post.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex flex-col text-[11px] font-bold">
                    <span className="flex items-center text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(new Date(post.createdAt), 'MMM d, h:mm a')}
                    </span>
                    {(post.scheduledAt || post.publishedAt) && (
                      <span className="flex items-center text-black">
                        <Calendar className="mr-1 h-3 w-3" />
                        {post.status === 'PUBLISHED' ? 'Published' : 'Scheduled'}: {format(new Date((post.scheduledAt ?? post.publishedAt)!), 'MMM d, h:mm a')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
