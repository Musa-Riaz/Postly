import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

import { AnalyticsInsights } from "@/hooks/use-analytics";

// Need to dynamic import ApexCharts as it uses window
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InsightsDashboardProps {
  insights?: AnalyticsInsights;
}

export const InsightsDashboard = ({ insights }: InsightsDashboardProps) => {
  if (!insights) return null;

  const { bestTime, contentDecay, postingFreq, followerStats } = insights;

  // Best Time to Post Heatmap Data transformation for ApexCharts
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const heatmapData = days.map((day, dayIndex) => ({
    name: day,
    data: Array.from({ length: 24 }, (_, hour) => {
      const slot = bestTime?.slots?.find(s => s.day_of_week === dayIndex && s.hour === hour);
      return {
        x: `${hour}:00`,
        y: slot ? Math.round(slot.avg_engagement) : 0
      };
    })
  }));

  const heatmapOptions: any = {
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    colors: ["#FFE500"],
    title: {
      text: 'BEST TIME TO POST',
      style: { fontSize: '14px', fontWeight: 900, fontFamily: 'Public Sans' }
    },
    xaxis: {
      type: 'category',
    },
    plotOptions: {
      heatmap: {
        radius: 2,
        enableShades: true,
        shadeIntensity: 0.5
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Best Time Heatmap */}
      <Card className="col-span-full border-2 border-black">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase">Engagement Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {typeof window !== 'undefined' && (
            <Chart 
              options={heatmapOptions} 
              series={heatmapData} 
              type="heatmap" 
              height="100%" 
            />
          )}
        </CardContent>
      </Card>

      {/* Content Decay Chart */}
      <Card className="col-span-1 border-2 border-black">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase">Content Decay</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contentDecay?.buckets || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="bucket_label" />
              <YAxis />
              <Tooltip 
                 contentStyle={{ 
                    borderRadius: '8px', 
                    border: '2px solid black',
                    fontWeight: 800,
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                 }}
              />
              <Bar dataKey="avg_pct_of_final" name="Avg % of Final" fill="#FFE500" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Posting Frequency vs Engagement */}
      <Card className="col-span-1 lg:col-span-2 border-2 border-black">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase">Frequency vs. Engagement</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="posts_per_week" name="Posts / Week" />
              <YAxis type="number" dataKey="avg_engagement" name="Avg Engagement" />
              <ZAxis type="number" dataKey="avg_engagement_rate" name="ER" range={[60, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Activity" data={postingFreq?.frequency || []} fill="#4ECDC4" stroke="#000" strokeWidth={2} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Follower Growth Chart */}
      <Card className="col-span-full border-2 border-black">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase">Follower Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.values(followerStats?.stats || {}).flat()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => {
                  try {
                    return format(new Date(str), 'MMM d');
                  } catch (e) {
                    return str;
                  }
                }}
              />
              <YAxis />
              <Tooltip 
                 contentStyle={{ 
                    borderRadius: '8px', 
                    border: '2px solid black',
                    fontWeight: 800,
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                 }}
              />
              <Bar dataKey="followers" name="Followers" fill="#4ECDC4" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
