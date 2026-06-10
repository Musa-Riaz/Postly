"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  MousePointer2, 
  Share2, 
  Calendar, 
  Hash,
  Globe,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Loader2
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Post } from '@/hooks/use-analytics'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"

interface PostDetailsModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
}

export function PostDetailsModal({ post, isOpen, onClose }: PostDetailsModalProps) {
  const [copied, setCopied] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set())

  // Sync carousel state
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  // Reset index and loading state when post changes or modal opens
  useEffect(() => {
    if (isOpen && api) {
      api.scrollTo(0)
      requestAnimationFrame(() => {
        setLoadedIndices(new Set())
        setCurrent(0)
      })
    }
  }, [post?._id, isOpen, api])

  if (!post) return null

  // Normalize data from different hooks
  const id = post._id
  const content = post.content || ""
  const mediaItems = post.mediaItems || post.mediaUrls?.map((u: string) => ({ url: u })) || []
  const status = post.status?.toUpperCase() || 'DRAFT'
  const date = post.publishedAt || post.scheduledFor || post.createdAt
  const analytics = post.analytics
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-400 text-black border-black'
      case 'SCHEDULED': return 'bg-blue-400 text-black border-black'
      case 'FAILED': return 'bg-red-400 text-black border-black'
      default: return 'bg-slate-200 text-black border-black'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[75vw] p-0 overflow-hidden border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          
          {/* Left Side: Media and Content */}
          <div className="flex-1 overflow-y-auto scrollbar-none border-r-4 border-black p-6 bg-slate-50">
            <div className="space-y-6">
              {/* Media Preview / Carousel */}
              {mediaItems.length > 0 ? (
                <div className="relative group border-4 border-black rounded-base overflow-hidden bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {!loadedIndices.has(current) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}
                  
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                      {mediaItems.map((item: { url?: string } | string, index: number) => (
                        <CarouselItem key={index} className="aspect-video relative">
                          <Image 
                            src={typeof item === 'string' ? item : item.url || ""} 
                            alt={`Post media ${index + 1}`} 
                            fill
                            className={`object-contain transition-all duration-500 ${!loadedIndices.has(index) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                            onLoadingComplete={() => {
                              setLoadedIndices(prev => new Set(prev).add(index))
                            }}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    
                    {mediaItems.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all z-20" />
                        <CarouselNext className="right-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all z-20" />
                        
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                          {mediaItems.map((_: unknown, i: number) => (
                            <div 
                              key={i} 
                              onClick={() => api?.scrollTo(i)}
                              className={`h-4 w-4 border-2 border-black cursor-pointer transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`} 
                            />
                          ))}
                        </div>

                        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-sm text-[10px] font-black backdrop-blur-sm z-20">
                           {current + 1} / {mediaItems.length}
                        </div>
                      </>
                    )}
                  </Carousel>
                </div>
              ) : (
                <div className="aspect-video border-4 border-black border-dashed rounded-base flex flex-col items-center justify-center gap-2 text-slate-400">
                   <Globe size={48} className="opacity-10" />
                   <span className="font-black uppercase text-sm">Text Only Post</span>
                </div>
              )}

              {/* Content Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`border-2 font-black uppercase text-xs px-3 py-1 ${getStatusColor(status)}`}>
                    {status}
                  </Badge>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(date), 'MMMM do, yyyy @ p')}
                  </p>
                </div>

                <div className="p-4 border-4 border-black rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   <div className="text-lg font-bold leading-relaxed whitespace-pre-wrap">
                      {content.replace(/<[^>]*>/g, '') || "No content provided."}
                   </div>
                </div>

                {/* Platform List */}
                <div className="flex gap-2 flex-wrap">
                  {(post.platforms || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1 bg-secondary/20 border-2 border-black rounded-base font-black uppercase text-[10px]">
                      <Globe size={12} />
                      {p.platform}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Analytics and Metadata */}
          <div className="w-full md:w-[320px] p-6 flex flex-col gap-8">
            <DialogHeader className="p-0 space-y-1">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Post Data</DialogTitle>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <Hash size={12} />
                <span className="truncate">{id}</span>
                <button onClick={handleCopyId} className="hover:text-black transition-colors">
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </div>
            </DialogHeader>

            {/* Analytics Grid */}
            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-1">Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <MetricBox icon={<Heart className="text-red-500" />} label="Likes" value={analytics.likes} />
                <MetricBox icon={<MessageCircle className="text-blue-500" />} label="Replies" value={analytics.comments} />
                <MetricBox icon={<TrendingUp className="text-amber-500" />} label="Impressions" value={analytics.views} />
                <MetricBox icon={<MousePointer2 className="text-emerald-500" />} label="Comments" value={analytics.comments} />
                <MetricBox icon={<Share2 className="text-purple-500" />} label="Shares" value={analytics.shares} />
                <MetricBox icon={<ArrowUpRight className="text-main" />} label="ER%" value={`${(analytics.engagementRate || 0).toFixed(2)}%`} />
              </div>
            </div>

            {/* Metadata Section */}
            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-1">Context</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 border-2 border-black rounded-full bg-main flex items-center justify-center font-black">
                     M
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black">Musa Riaz</span>
                    <span className="text-[10px] font-bold text-slate-400">Post Owner</span>
                  </div>
                </div>
                
                <div className="pt-2">
                   {status === 'PUBLISHED' && (
                     <Button className="w-full bg-black text-white font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                       <ExternalLink size={14} className="mr-2" />
                       View Original Post
                     </Button>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MetricBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | undefined }) {
  return (
    <div className="p-3 bg-slate-50 border-2 border-black rounded-base flex flex-col gap-1 items-center text-center">
      <div className="p-1 rounded-sm border border-black/10">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 16 }) : icon}
      </div>
      <span className="text-sm font-black">{value?.toLocaleString() || 0}</span>
      <span className="text-[8px] font-bold uppercase text-slate-400">{label}</span>
    </div>
  )
}
