import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyResponse, DailyMetricData } from "@/hooks/use-analytics";

interface DailyData {
  date: string;
  metrics: {
    clicks: number;
    comments: number;
    impressions: number;
    likes: number;
    reach: number;
    saves: number;
    shares: number;
    views: number;
  }
  platforms?: {
    instagram?: number;
    tiktok?: number;
    facebook?: number;
    twitter?: number;
    linkedin?: number;
    youtube?: number;
  }
  postCount: number;
}

interface ActivityHeatmapProps {
  data?: DailyResponse | DailyMetricData[];
}

export const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  if (!data) return null;

  // Normalize data (Zernio returns it wrapped in an object with dailyData)
  const rawData = Array.isArray(data) 
    ? data 
    : (data as DailyResponse)?.dailyData || [];

  if (rawData.length === 0) return null;

  // Transform data for Nivo Calendar (expects { day: 'YYYY-MM-DD', value: number })
  const calendarData = rawData.map((item: DailyData) => ({
    day: item.date,
    value: item.postCount || 0
  }));

  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  const to = new Date();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-black uppercase tracking-tighter">Posting Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveCalendar
          data={calendarData}
          from={from}
          to={to}
          emptyColor="#eeeeee"
          colors={['#ebedf0', '#FFE500', '#FFD800', '#FFCC00', '#FFBF00']}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left'
            }
          ]}
        />
      </CardContent>
    </Card>
  );
};
