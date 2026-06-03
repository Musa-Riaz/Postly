import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Heart, MessageCircle, BarChart2, Share2 } from 'lucide-react';
import Image from 'next/image';

import { Post } from '@/hooks/use-analytics';

interface PostAnalyticsCardProps {
  post: Post;
}

export const PostAnalyticsCard = ({ post }: PostAnalyticsCardProps) => {
  const metrics = post.analytics || {
    likes: 0,
    comments: 0,
    views: 0,
    shares: 0,
    engagementRate: 0
  };

  return (
    <Card className="flex flex-col border-2 border-black shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all overflow-hidden bg-background">
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative aspect-video border-b-2 border-black overflow-hidden bg-accent/10">
          <Image 
            src={post.mediaUrls[0]} 
            alt="Post media" 
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-main text-black border-2 border-black uppercase text-[10px] font-black">
            {post.platforms?.[0]?.platform || 'Social'}
          </Badge>
        </div>
      )}
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-3 text-xs line-clamp-2 font-bold bg-secondary/20 p-2 border-2 border-black rounded-base">
          {post.content.replace(/<[^>]*>/g, '') || <span className="text-muted-foreground italic">No content</span>}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-black">
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>{metrics.likes?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black">
            <MessageCircle className="h-3 w-3 text-blue-500 fill-current" />
            <span>{metrics.comments?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black">
            <BarChart2 className="h-3 w-3 text-green-500" />
            <span>{metrics.views?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black">
            <Share2 className="h-3 w-3 text-orange-500" />
            <span>{metrics.shares?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t-2 border-black/5 flex items-center justify-between">
          <div className="text-[10px] font-bold text-muted-foreground">
            {format(new Date(post.publishedAt || post.scheduledFor || post.createdAt), 'MMM d, yyyy')}
          </div>
          <div className="text-[10px] font-black uppercase bg-green-200 px-1.5 py-0.5 border-2 border-black rounded-base">
            ER {(metrics.engagementRate || 0).toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PostDetailsGrid = ({ posts }: { posts?: Post[] }) => {
  if (!posts || posts.length === 0) return (
    <div className="col-span-full py-12 text-center border-4 border-dashed border-black rounded-base bg-secondary/5">
      <p className="font-black uppercase text-xl">No posts found</p>
      <p className="font-bold text-muted-foreground">Your recent posts will appear here once analytics are available</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post, idx) => (
        <PostAnalyticsCard key={post._id || idx} post={post} />
      ))}
    </div>
  );
};
