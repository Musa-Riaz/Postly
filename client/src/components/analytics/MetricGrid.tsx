import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus, Bookmark, Eye, Heart, MessageCircle, Share2, Users, Pointer, MousePointer2, ChartNoAxesCombined } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalyticsOverview, DailyResponse } from "@/hooks/use-analytics";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changePercentage?: number;
  icon?: React.ReactNode;
}

const MetricCard = ({ label, value, changePercentage, icon }: MetricCardProps) => {
  const isPositive = changePercentage && changePercentage > 0;
  const isNegative = changePercentage && changePercentage < 0;

  return (
    <Card className="hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 border-2 border-black rounded-base bg-main/10">
            {icon}
          </div>
          {changePercentage !== undefined && (
            <div className={cn(
              "flex items-center text-xs font-black px-1.5 py-0.5 rounded-base border-2 border-black",
              isPositive ? "bg-green-400" : isNegative ? "bg-red-400" : "bg-gray-400"
            )}>
              {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : isNegative ? <ArrowDownRight className="h-3 w-3 mr-0.5" /> : <Minus className="h-3 w-3 mr-0.5" />}
              {Math.abs(changePercentage)}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase">{label}</p>
          <h3 className="text-2xl font-black">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricGridProps {
  metrics?: AnalyticsOverview['metrics'] | DailyResponse['totalMetrics'];
}

export const MetricGrid = ({ metrics }: MetricGridProps) => {
  if (!metrics) return null;

  const getValue = (val: any) => typeof val === 'object' ? (val?.current ?? 0) : (val ?? 0);
  const getChange = (val: any) => typeof val === 'object' ? val?.changePercentage : undefined;

  const items = [
    { label: 'Likes', value: getValue(metrics.likes), changePercentage: getChange(metrics.likes), icon: <Heart className="h-4 w-4" /> },
    { label: 'Comments', value: getValue(metrics.comments), changePercentage: getChange(metrics.comments), icon: <MessageCircle className="h-4 w-4" /> },
    { label: 'Shares', value: getValue(metrics.shares), changePercentage: getChange(metrics.shares), icon: <Share2 className="h-4 w-4" /> },
    { label: 'Saves', value: getValue(metrics.saves), changePercentage: getChange(metrics.saves), icon: <Bookmark className="h-4 w-4" /> },
    { label: 'Views', value: getValue(metrics.views), changePercentage: getChange(metrics.views), icon: <Eye className="h-4 w-4" /> },
    { label: 'Impressions', value: getValue(metrics.impressions), changePercentage: getChange(metrics.impressions), icon: <ChartNoAxesCombined className="h-4 w-4" /> },
    { label: 'Reach', value: getValue(metrics.reach), changePercentage: getChange(metrics.reach), icon: <Users className="h-4 w-4" /> },
    { label: 'Clicks', value: getValue(metrics.clicks), changePercentage: getChange(metrics.clicks), icon: <MousePointer2 className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </div>
  );
};
