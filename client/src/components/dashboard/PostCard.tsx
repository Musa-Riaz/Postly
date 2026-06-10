"use client"

import React from 'react'
import { Post } from '@/hooks/use-posts'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Heart, 
  BarChart3,
  Globe,
  TrendingUp,
  MessageCircle,
  Copy,
  ExternalLink
} from 'lucide-react'
import { 
  FaLinkedin, 
  FaInstagram, 
  FaTwitter, 
  FaFacebook 
} from 'react-icons/fa'
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
  onClick?: () => void
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'linkedin': return <div className="relative"><FaLinkedin className="h-5 w-5" /><ExternalLink className="absolute -top-1 -right-1 h-2 w-2 text-slate-400" /></div>;
    case 'instagram': return <div className="relative"><FaInstagram className="h-5 w-5" /><ExternalLink className="absolute -top-1 -right-1 h-2 w-2 text-slate-400" /></div>;
    case 'twitter': 
    case 'x': return <div className="relative"><FaTwitter className="h-5 w-5" /><ExternalLink className="absolute -top-1 -right-1 h-2 w-2 text-slate-400" /></div>;
    case 'facebook': return <div className="relative"><FaFacebook className="h-5 w-5" /><ExternalLink className="absolute -top-1 -right-1 h-2 w-2 text-slate-400" /></div>;
    default: return <Globe className="h-5 w-5" />;
  }
}

export function PostCard({ post, onDelete, onEdit, onClick }: PostCardProps) {
  const statusLabels = {
    'PUBLISHED': 'published',
    'SCHEDULED': 'scheduled',
    'FAILED': 'failed',
    'DRAFT': 'draft'
  } as const

  const platforms = post.accounts?.map((acc) => acc.platform) || []

  return (
    <Card 
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
    >
      <div className="px-4 flex flex-row gap-6">
        {/* Left Side: Text and Metadata */}
        <div className="flex-1 flex flex-col pt-2">
          <div className="text-xl font-bold mb-4 line-clamp-2 leading-tight">
            {post.content.replace(/<[^>]*>/g, '') || <span className="text-slate-500 italic font-normal">No content</span>}
          </div>
          
          <div className="mb-6">
            {platforms.length > 0 && <PlatformIcon platform={platforms[0]} />}
          </div>

          <div className="space-y-1">
             <div className="text-sm font-medium text-[#888888]">
               {format(new Date((post.scheduledAt ?? post.publishedAt ?? post.createdAt)!), 'MMM d, yyyy, hh:mm aa')} UTC
             </div>
             <div className="flex items-center gap-2 text-[12px] text-[#555555]">
                <span className="font-mono truncate max-w-[150px]">{post.id}</span>
                <Copy className="h-3 w-3 cursor-pointer hover:text-slate-300 transition-colors" />
             </div>
          </div>
        </div>
        
        {/* Right Side: Media */}
        <div className="w-[140px] shrink-0">
          {post.mediaUrls && post.mediaUrls.length > 0 ? (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
              <Image 
                src={post.mediaUrls[0]} 
                alt="Post" 
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-zinc-900/50 border border-dashed border-white/5 flex items-center justify-center">
               <Globe className="opacity-10 h-8 w-8 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Analytics Bar */}
      <div className="mt-auto px-4 py-3  border-t border-black flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Status Badge */}
          <div className={`px-2 py-1 rounded-[4px] text-[12px] font-bold ${
            post.status === 'PUBLISHED' ? 'bg-[#103020] text-[#4ade80]' : 
            post.status === 'SCHEDULED' ? 'bg-[#102030] text-[#3b82f6]' : 
            'bg-[#202020] text-[#888888]'
          }`}>
            {statusLabels[post.status as keyof typeof statusLabels]}
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-[#888888]" />
              <span className="text-sm font-bold">{post.analytics?.likes || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#888888]" />
              <span className="text-sm font-bold">{post.analytics?.impressions || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#888888]" />
              <span className="text-sm font-bold">{post.analytics?.reach || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#888888]" />
              <span className="text-sm font-bold">{post.analytics?.comments || 0}</span>
            </div>
          </div>
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
      </div>
    </Card>
  )
}
