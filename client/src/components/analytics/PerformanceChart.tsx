import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyResponse, DailyMetricData } from "@/hooks/use-analytics";

interface PerformanceChartProps {
  data?: DailyResponse | DailyMetricData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Normalize data (Zernio returns it wrapped in an object with dailyData)
  const rawData = Array.isArray(data) 
    ? data 
    : (data as DailyResponse)?.dailyData || [];

  if (rawData.length === 0) return null;

  // Transform data for Recharts (flatten metrics)
  const chartData = rawData.map((item: DailyMetricData) => ({
    date: item.date,
    likes: item.metrics?.likes || 0,
    impressions: item.metrics?.impressions || 0,
    reach: item.metrics?.reach || 0,
    views: item.metrics?.views || 0,
  }));

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase">Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFE500" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FFE500" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 700 }}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 700 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '2px solid black',
                fontWeight: 800,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="likes"
              stroke="#000"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorLikes)"
              name="Likes"
            />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke="#000"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorImpressions)"
              name="Impressions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
