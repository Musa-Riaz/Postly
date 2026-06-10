import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Heart, MessageCircle, TrendingUp, Eye, MousePointer2 } from 'lucide-react';
import Image from 'next/image';

import { Post } from '@/hooks/use-analytics';

interface PostAnalyticsCardProps {
  post: Post;
  onClick?: () => void;
}

export const PostAnalyticsCard = ({ post, onClick }: PostAnalyticsCardProps) => {
  const metrics = post.analytics || {
    likes: 0,
    comments: 0,
    views: 0,
    shares: 0,
    impressions: 0,
    reach: 0,
    engagementRate: 0
  };

  return (
    <Card 
      onClick={onClick}
      className="flex flex-col border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-all overflow-hidden cursor-pointer"
    >
      {post.mediaItems && post.mediaItems.length > 0 ? (
        <div className="relative aspect-video border-b-2 border-black overflow-hidden bg-slate-50">
          <Image 
            src={post.mediaItems[0].url || ''} 
            alt="Post media" 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-2 left-2 text-black border-2 border-black uppercase text-[10px] font-black h-6">
            {post.platforms?.[0]?.platform || 'Social'}
          </Badge>
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-400 text-black border-2 border-black px-2 py-0.5 rounded-base text-[10px] font-black italic">
            <TrendingUp className="h-3 w-3" />
            {(metrics.engagementRate || 0).toFixed(2)}%
          </div>
        </div>
      ) : (
        <div className="aspect-video border-b-2 border-black bg-slate-50 flex items-center justify-center p-4">
           <div className="text-center">
             <Badge className="mb-2 text-black border-2 border-black uppercase text-[10px] font-black h-6">
               {post.platforms?.[0]?.platform || 'Social'}
             </Badge>
             <div className="flex items-center gap-1 bg-green-400 text-black border-2 border-black px-2 py-0.5 rounded-base text-[10px] font-black italic">
               <TrendingUp className="h-3 w-3" />
               {(metrics.engagementRate || 0).toFixed(2)}%
             </div>
           </div>
        </div>
      )}
      
      <CardContent className="p-4 flex-1 flex flex-col gap-4">
        <div className="text-sm font-bold line-clamp-2 leading-tight min-h-10">
          {post.content.replace(/<[^>]*>/g, '') || <span className="text-slate-400 italic font-normal">No content description</span>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-slate-50 border-2 border-black rounded-base">
            <Heart className="h-4 w-4 text-rose-500" />
            <div className="flex flex-col">
              <span className="text-xs font-black">{(metrics.likes || 0).toLocaleString()}</span>
              <span className="text-[8px] uppercase font-bold text-slate-500">Likes</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 border-2 border-black rounded-base">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-xs font-black">{(metrics.comments || 0).toLocaleString()}</span>
              <span className="text-[8px] uppercase font-bold text-slate-500">Replies</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 border-2 border-black rounded-base">
            <Eye className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-xs font-black">{(metrics.views || 0).toLocaleString()}</span>
              <span className="text-[8px] uppercase font-bold text-slate-500">Impressions</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 border-2 border-black rounded-base">
            <MousePointer2 className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-xs font-black">{(metrics.shares || 0).toLocaleString()}</span>
              <span className="text-[8px] uppercase font-bold text-slate-500">Reach</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t-2 border-black/5 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            {format(new Date(post.publishedAt || post.scheduledFor || post.createdAt), 'MMM d, yyyy')}
          </div>
          <div className="text-[10px] font-black uppercase text-slate-400">
            ID: {post._id.substring(0, 8)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostDetailsGrid = ({ posts, onClickCard }: { posts?: Post[], onClickCard?: (post: Post) => void }) => {
  if (!posts || posts.length === 0) return (
    <div className="col-span-full py-12 text-center border-4 border-black border-dashed rounded-base bg-slate-50">
      <p className="font-black uppercase text-xl">No posts found</p>
      <p className="font-bold text-slate-500">Your recent posts will appear here once analytics are available</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post, idx) => (
        <PostAnalyticsCard 
          key={post._id || idx} 
          post={post} 
          onClick={() => onClickCard?.(post)}
        />
      ))}
    </div>
  );
};
