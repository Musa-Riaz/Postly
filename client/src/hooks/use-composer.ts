"use client"

import React, { useState, useRef, useEffect, startTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccounts } from '@/hooks/use-accounts'
import { usePosts } from '@/hooks/use-posts'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export type PreviewPlatform = 'linkedin' | 'instagram' | 'x'
export type InstagramAspectRatio = '1:1' | '4:5' | '16:9'

export function useComposer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts()
  const { 
    createPost, 
    publishPost, 
    schedulePost, 
    updatePost,
    posts,
    isLoading: isLoadingPosts,
    isCreating, 
    isPublishing, 
    isScheduling 
  } = usePosts()

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<{ url: string, file?: File }[]>([])
  const [activePreview, setActivePreview] = useState<PreviewPlatform>('linkedin')
  const [instagramAspectRatio, setInstagramAspectRatio] = useState<InstagramAspectRatio>('1:1')
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)

  // Pre-populate if editing — runs once when post data first becomes available
  useEffect(() => {
    if (editId && posts && !hasInitialized.current) {
      const postToEdit = posts.find(p => p.id === editId)
      if (postToEdit) {
        hasInitialized.current = true
        startTransition(() => {
          // Wrap plain text content in HTML tags for Tiptap editor
          const initialContent = postToEdit.content.includes('<p>') 
            ? postToEdit.content 
            : `<p>${postToEdit.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
          
          setContent(initialContent)
          setMedia(postToEdit.mediaUrls?.map(url => ({ url })) || [])
          setSelectedAccounts(postToEdit.accounts?.map(a => a.id) || [])
        })
      }
    }
  }, [editId, posts])

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleApplyAiContent = (aiContent: string) => {
    // Tiptap expects HTML, so we provide it, but we'll strip it on save
    const formattedContent = aiContent.includes('<p>') ? aiContent : `<p>${aiContent.replace(/\n/g, '</p><p>')}</p>`
    setContent(formattedContent)
    setIsAiOpen(false)
    toast.success('AI content applied to composer!')
  }

  const stripHtml = (html: string) => {
    if (!html) return ''
    
    // First, handle common block elements by adding double newlines
    let text = html
      .replace(/<\/p><p>/g, '\n\n')
      .replace(/<\/p>/g, '\n')
      .replace(/<p>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      
    // Strip remaining tags
    text = text.replace(/<[^>]+>/g, '')
    
    // Unescape common HTML entities if any remaining
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
    
    return text.trim()
  }

  const handleFiles = (files: FileList | File[]) => {
    const newMedia = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file
    }))
    setMedia(prev => [...prev, ...newMedia])
    toast.success(`${files.length} file(s) added`)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeMedia = (index: number) => {
    setMedia(prev => {
      const newMedia = [...prev]
      if (newMedia[index].url.startsWith('blob:')) {
        URL.revokeObjectURL(newMedia[index].url)
      }
      newMedia.splice(index, 1)
      return newMedia
    })
  }

  const reorderMedia = (startIndex: number, endIndex: number) => {
    setMedia(prev => {
      const result = [...prev]
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  const handlePost = async (status: 'DRAFT' | 'PUBLISH' | 'SCHEDULE', scheduledDate?: Date) => {
    if (selectedAccounts.length === 0) {
      const isDraft = status === 'DRAFT';
      if (!isDraft) {
        toast.error('Please select at least one account');
        return;
      }
    }
    if (!content || content === '<p></p>') {
      toast.error('Post content cannot be empty');
      return;
    }
    
    try {
      let postId = editId;
      
      // 1. Upload files if any
      const uploadedUrls = await Promise.all(media.map(async (item) => {
        if (!item.file) return item.url; // Already uploaded (editing)
        
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;
        
        const { error } = await supabase.storage.from('posts').upload(filePath, item.file);
        
        if (error) {
          console.error('Upload error:', error);
          throw new Error('Failed to upload media');
        }
        
        const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(filePath);
        return publicUrl;
      }));

      // 2. Strip HTML for social media platforms
      const plainContent = stripHtml(content);
      
      const postData = {
        accountIds: selectedAccounts,
        content: plainContent,
        mediaUrls: uploadedUrls, 
        status: (status === 'PUBLISH' ? 'PUBLISHED' : (status === 'SCHEDULE' ? 'SCHEDULED' : 'DRAFT')) as 'DRAFT' | 'SCHEDULED' | 'PUBLISHED',
        scheduledAt: scheduledDate
      };

      if (editId) {
        await updatePost({ id: editId, ...postData });
      } else {
        const post = await createPost(postData);
        postId = post.id;
      }

      if (status === 'PUBLISH' && postId) {
        await publishPost(postId);
        router.push('/dashboard/posts');
      } else if (status === 'SCHEDULE' && scheduledDate && postId) {
        await schedulePost({ postId, scheduledAt: scheduledDate });
        router.push('/dashboard/posts');
      } else {
        toast.success(editId ? 'Post updated successfully!' : 'Post draft saved successfully!');
        router.push('/dashboard/posts');
      }
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'Something went wrong');
    }
  }

  return {
    state: {
      accounts,
      selectedAccounts,
      content,
      mediaUrls: media.map(m => m.url),
      activePreview,
      instagramAspectRatio,
      isAiOpen,
      isDragging,
      isScheduleModalOpen,
      isLoading: isLoadingAccounts || isLoadingPosts,
      isCreating,
      isPublishing,
      isScheduling,
      editId
    },
    actions: {
      setSelectedAccounts,
      setContent,
      setMedia,
      setActivePreview,
      setInstagramAspectRatio,
      setIsAiOpen,
      setIsDragging,
      setIsScheduleModalOpen,
      toggleAccount,
      handleApplyAiContent,
      handleFiles,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeMedia,
      reorderMedia,
      handlePost
    },
    refs: {
      fileInputRef
    }
  }
}
