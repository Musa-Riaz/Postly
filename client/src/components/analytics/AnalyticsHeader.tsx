import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  filters: any;
  setFilters: (filters: any) => void;
}

export const AnalyticsHeader = ({ onRefresh, isRefreshing, filters, setFilters }: AnalyticsHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Analytics</h1>
          <p className="text-muted-foreground font-bold">View post performance metrics across your platforms</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="neutral" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="border-2 font-black uppercase"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="default" className="border-2 font-black uppercase shadow-shadow">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filters.platform || 'all'} onValueChange={(val) => setFilters({ ...filters, platform: val === 'all' ? undefined : val })}>
          <SelectTrigger className="w-[180px] border-2 font-bold bg-background">
            <SelectValue placeholder="All platforms" />
          </SelectTrigger>
          <SelectContent className="border-2">
            <SelectItem value="all">All platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">X / Twitter</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30">
          <SelectTrigger className="w-[180px] border-2 font-bold bg-background">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="border-2">
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px] border-2 font-bold bg-background">
            <SelectValue placeholder="Newest first" />
          </SelectTrigger>
          <SelectContent className="border-2">
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="engagement">Highest engagement</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4 ml-auto text-xs font-bold text-muted-foreground">
          <div>Last sync: 1h ago</div>
          <div>Next sync: 5m ago</div>
        </div>
      </div>
    </div>
  );
};
