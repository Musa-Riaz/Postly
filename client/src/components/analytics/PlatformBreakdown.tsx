import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, BarChart2, Heart, MessageCircle, Share, Eye, ChartBarStackedIcon } from "lucide-react";
import { DailyResponse } from "@/hooks/use-analytics";

const PlatformIcon = ({ platform }: { platform: string }) => {
  // Lucide brand icons might vary by version, using generic fallbacks for safety
  return <Globe className="h-4 w-4" />;
};

interface PlatformBreakdownProps {
  data?: DailyResponse['platformBreakdown'];
}

export const PlatformBreakdown = ({ data }: PlatformBreakdownProps) => {
  if (!data || data.length === 0) return (
    <Card className="col-span-1 border-2 border-black">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase tracking-tighter">Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8 opacity-50">
        <BarChart2 className="h-12 w-12 mb-2" />
        <p className="font-bold text-xs uppercase">No platform data</p>
      </CardContent>
    </Card>
  );

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase tracking-tighter">Platform Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((platform) => (
            <div key={platform.platform} className="p-3 border-2 border-black rounded-base bg-secondary/10 flex flex-col gap-2 hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 border-2 border-black rounded-base bg-background">
                    <PlatformIcon platform={platform.platform} />
                  </div>
                  <span className="font-black text-sm uppercase">{platform.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500 " />
                  <span className="text-xs font-bold text-muted-foreground">{platform.likes || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500 " />
                  <span className="text-xs font-bold text-muted-foreground">{platform.comments || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share className="h-4 w-4 text-green-500 " />
                  <span className="text-xs font-bold text-muted-foreground">{platform.shares || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-red-500 " />
                  <span className="text-xs font-bold text-muted-foreground">{platform.views || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChartBarStackedIcon className="h-4 w-4 text-red-500 " />
                  <span className="text-xs font-bold text-muted-foreground">{platform.impressions || 0}</span>
                </div>
                <Badge variant="default" className="border-2 border-black font-black text-[10px]">
                  ER {(platform.engagementRate || 0).toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>{platform.postCount || 0} posts</span>
                <span>{((platform.likes || 0) + (platform.comments || 0)).toLocaleString()} interactions</span>
              </div>
              <div className="w-full bg-background border-2 border-black h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-main h-full" 
                  style={{ width: `${Math.min(100, (platform.engagementRate || 0) * 10)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
