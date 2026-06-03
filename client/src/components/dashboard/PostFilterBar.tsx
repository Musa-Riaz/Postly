"use client"

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { LayoutGrid, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostFilterOptions } from '@/hooks/use-posts'

interface PostFilterBarProps {
  filters: PostFilterOptions
  setFilters: (filters: PostFilterOptions) => void
  viewMode: 'grid' | 'table'
  setViewMode: (mode: 'grid' | 'table') => void
}

export function PostFilterBar({ filters, setFilters, viewMode, setViewMode }: PostFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          className="pl-9 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0"
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.status || 'all'}
          onValueChange={(value: string) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[140px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.platform || 'all'}
          onValueChange={(value: string) => setFilters({ ...filters, platform: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[140px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent className="border-2 border-black">
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border-2 border-black rounded-base overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Button
            variant="noShadow"
            size="sm"
            className={`rounded-none px-3 ${viewMode === 'grid' ? 'bg-main text-white' : 'bg-white'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant="noShadow"
            size="sm"
            className={`rounded-none px-3 border-l-2 border-black ${viewMode === 'table' ? 'bg-main text-white' : 'bg-white'}`}
            onClick={() => setViewMode('table')}
          >
            <List size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
