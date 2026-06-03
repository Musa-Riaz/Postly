"use client"

import React, { useState } from 'react'
import { usePosts, PostFilterOptions } from '@/hooks/use-posts'
import { PostFilterBar } from '@/components/dashboard/PostFilterBar'
import { PostCard } from '@/components/dashboard/PostCard'
import { PostTableView } from '@/components/dashboard/PostTableView'
import { Loader2, Plus, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PostsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [filters, setFilters] = useState<PostFilterOptions>({})

  const { posts, isLoading, deletePost } = usePosts(filters)

  const handleEdit = (id: string) => {
    router.push(`/dashboard/composer?edit=${id}`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Content Manager</h1>
          <p className="text-muted-foreground font-bold">Manage, filter, and organize your social media presence.</p>
        </div>
        <Link href="/dashboard/composer">
          <Button className="bg-main border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-transform">
            <Plus size={20} className="mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      <PostFilterBar 
        filters={filters} 
        setFilters={setFilters} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-main" />
        </div>
      ) : posts && posts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <PostTableView 
            posts={posts} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border-4 border-dashed border-black rounded-base bg-accent/5">
          <div className="h-20 w-20 bg-main border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <Inbox size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-black uppercase">No posts found</h3>
          <p className="text-muted-foreground font-bold mb-8">Try adjusting your filters or create a new post.</p>
          <Link href="/dashboard/composer">
             <Button className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               Create first post
             </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
