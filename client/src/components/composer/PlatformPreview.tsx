"use client"

import React from 'react'
import { Briefcase, Camera, MoreHorizontal, Heart, MessageCircle, Share2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PlatformPreviewProps {
  content: string
  mediaUrls: string[]
  platform: 'linkedin' | 'instagram' | 'x'
}

const PlatformPreview = ({ content, mediaUrls, platform }: PlatformPreviewProps) => {
  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const plainText = stripHtml(content)

  const renderLinkedIn = () => (
    <div className="bg-white border-2 border-border shadow-shadow rounded-base p-4 max-w-[400px] mx-auto font-sans">
      <div className="flex items-center gap-2 mb-3">
        <div className="size-10 bg-main border-2 border-border rounded-full" />
        <div>
          <h4 className="text-sm font-bold">Postly User</h4>
          <p className="text-xs text-secondary-foreground">Social Media Manager • 1m</p>
        </div>
      </div>
      <div className="text-sm text-foreground mb-4 whitespace-pre-wrap">
        {plainText || "Your post content will appear here..."}
      </div>
      {mediaUrls.length > 0 && (
        <div className="border-2 border-border rounded-base overflow-hidden mb-4 aspect-video relative bg-secondary-background">
             <Image src={mediaUrls[0]} alt="Post media" fill className="object-cover" />
        </div>
      )}
      <div className="flex border-t-2 border-border pt-2 gap-4">
        <span className="text-xs flex items-center gap-1 font-bold"><Heart size={14} /> Like</span>
        <span className="text-xs flex items-center gap-1 font-bold"><MessageCircle size={14} /> Comment</span>
        <span className="text-xs flex items-center gap-1 font-bold"><Share2 size={14} /> Share</span>
      </div>
    </div>
  )

  const renderInstagram = () => (
    <div className="bg-white border-2 border-border shadow-shadow rounded-base max-w-[400px] mx-auto font-sans overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-main border-2 border-border rounded-full" />
          <span className="text-xs font-bold">postly_user</span>
        </div>
        <MoreHorizontal size={16} />
      </div>
      <div className="aspect-square bg-secondary-background border-y-2 border-border relative flex items-center justify-center">
        {mediaUrls.length > 0 ? (
          <Image src={mediaUrls[0]} alt="Post media" fill className="object-cover" />
        ) : (
          <Camera size={48} className="text-border opacity-20" />
        )}
      </div>
      <div className="p-3">
        <div className="flex gap-3 mb-2">
          <Heart size={20} />
          <MessageCircle size={20} />
          <Send size={20} />
        </div>
        <p className="text-xs"><span className="font-bold mr-2">postly_user</span>{plainText || "Caption goes here..."}</p>
      </div>
    </div>
  )

  const renderX = () => (
    <div className="bg-white border-2 border-border shadow-shadow rounded-base p-4 max-w-[400px] mx-auto font-sans">
        <div className="flex gap-3">
            <div className="size-10 bg-main border-2 border-border rounded-full shrink-0" />
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">Postly User</span>
                    <span className="text-xs text-secondary-foreground">@postly_user • 1m</span>
                </div>
                <div className="text-sm text-foreground mt-1 mb-3 whitespace-pre-wrap">
                    {plainText || "What's happening?"}
                </div>
                {mediaUrls.length > 0 && (
                    <div className="border-2 border-border rounded-xl overflow-hidden mb-3 aspect-video relative bg-secondary-background">
                        <Image src={mediaUrls[0]} alt="Post media" fill className="object-cover" />
                    </div>
                )}
                <div className="flex justify-between max-w-[300px] text-secondary-foreground">
                    <MessageCircle size={16} />
                    <Share2 size={16} />
                    <Heart size={16} />
                    <MoreHorizontal size={16} />
                </div>
            </div>
        </div>
    </div>
  )

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <div className={cn("p-2 rounded-base border-2 cursor-pointer transition-all", platform === 'linkedin' ? "bg-main border-border" : "bg-white border-border/20")}>
            <Briefcase size={20} />
        </div>
        <div className={cn("p-2 rounded-base border-2 cursor-pointer transition-all", platform === 'instagram' ? "bg-main border-border" : "bg-white border-border/20")}>
            <Camera size={20} />
        </div>
        <div className={cn("p-2 rounded-base border-2 cursor-pointer transition-all", platform === 'x' ? "bg-main border-border" : "bg-white border-border/20")}>
            <Send size={20} />
        </div>
      </div>
      
      <div className="p-8 bg-secondary-background border-2 border-dashed border-border rounded-base min-h-[400px] flex items-center justify-center">
        {platform === 'linkedin' && renderLinkedIn()}
        {platform === 'instagram' && renderInstagram()}
        {platform === 'x' && renderX()}
      </div>
    </div>
  )
}

export default PlatformPreview
