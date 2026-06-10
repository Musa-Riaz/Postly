"use client"

import React, { useState } from 'react';
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { MetricGrid } from "@/components/analytics/MetricGrid";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { PlatformBreakdown } from "@/components/analytics/PlatformBreakdown";
import { PostDetailsGrid } from "@/components/analytics/PostDetailsGrid";
import { InsightsDashboard } from "@/components/analytics/InsightsDashboard";
import { useAnalytics, AnalyticsFilters } from "@/hooks/use-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { PostDetailsModal } from "@/components/dashboard/PostDetailsModal";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    platform: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  // 📝 Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const { 
    overview, 
    daily, 
    insights, 
    posts, 
    isLoading, 
    isError, 
    isFetching,
    refetch 
  } = useAnalytics(filters);

  const handleViewDetails = (post: any) => {
    setSelectedPost(post)
    setDetailsOpen(true)
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 border-2" />
          <Skeleton className="h-20 w-full border-2" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 border-2" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-96 col-span-2 border-2" />
          <Skeleton className="h-96 border-2" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-red-100 border-4 border-black rounded-base shadow-shadow">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-black uppercase">Oops! Something went wrong</h2>
        <p className="font-bold text-muted-foreground">Failed to fetch analytics data. Please try again later.</p>
        <button 
          onClick={() => refetch()}
          className="px-6 py-2 bg-main border-2 border-black font-black uppercase shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-16 space-y-8">
      <AnalyticsHeader 
        filters={filters} 
        setFilters={setFilters} 
        onRefresh={refetch} 
        isRefreshing={isFetching} 
      />

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-background border-2 border-black p-1 h-auto inline-flex shadow-shadow">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-main data-[state=active]:text-black border-transparent data-[state=active]:border-black border-2 font-black uppercase text-xs px-6 py-2 transition-all"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="data-[state=active]:bg-main data-[state=active]:text-black border-transparent data-[state=active]:border-black border-2 font-black uppercase text-xs px-6 py-2 transition-all"
          >
            Insights
          </TabsTrigger>
          <TabsTrigger 
            value="posts" 
            className="data-[state=active]:bg-main data-[state=active]:text-black border-transparent data-[state=active]:border-black border-2 font-black uppercase text-xs px-6 py-2 transition-all"
          >
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-0 focus-visible:outline-none">
          <MetricGrid metrics={daily?.totalMetrics || overview?.metrics} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PerformanceChart data={daily} />
            <PlatformBreakdown data={daily?.platformBreakdown} />
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityHeatmap data={daily} />
            <div className="col-span-1 border-4 border-dashed border-black rounded-base bg-main/5 flex flex-col items-center justify-center p-8 text-center">
               <h3 className="text-xl font-black uppercase mb-2">Growth Tip</h3>
               <p className="font-bold text-sm text-black/70">Your Instagram engagement is up by 12% this week! Keep posting video content to maintain this momentum.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-0 focus-visible:outline-none">
          <InsightsDashboard insights={insights} />
        </TabsContent>

        <TabsContent value="posts" className="mt-0 focus-visible:outline-none">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Content Performance</h2>
          </div>
          <PostDetailsGrid posts={posts} onClickCard={handleViewDetails} />
        </TabsContent>
      </Tabs>

      <PostDetailsModal 
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        post={selectedPost}
      />
    </div>
  );
}
