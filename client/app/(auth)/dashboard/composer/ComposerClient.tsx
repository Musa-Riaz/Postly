"use client"

import React from 'react'
import { useComposer } from '@/hooks/use-composer'
import RichTextEditor from '@/components/composer/RichTextEditor'
import PlatformPreview from '@/components/composer/PlatformPreview'
import AIChatSidebar from '@/components/composer/AIChatSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Check, Image as ImageIcon, Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ScheduleModal } from '@/components/composer/ScheduleModal'
import { Loader2 } from 'lucide-react'

const ComposerClient = () => {
  const {
    state: {
      accounts,
      selectedAccounts,
      content,
      mediaUrls,
      activePreview,
      isAiOpen,
      isDragging,
      isScheduleModalOpen,
      isLoading,
      isCreating,
      isPublishing,
      isScheduling
    },
    actions: {
      setContent,
      setActivePreview,
      setIsAiOpen,
      setIsScheduleModalOpen,
      toggleAccount,
      handleApplyAiContent,
      handleFiles,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeMedia,
      handlePost
    },
    refs: {
      fileInputRef
    }
  } = useComposer()

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Composer Area */}
      <div className={cn(
        "flex-1 overflow-y-auto scrollbar-none p-8 transition-all duration-300",
        isAiOpen ? "mr-0 lg:mr-[400px]" : "mr-0"
      )}>
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Post Composer</h1>
              <p className="text-secondary-foreground font-base">Craft and preview your social media content.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="neutral" onClick={() => handlePost('DRAFT')}>Save as Draft</Button>
              <Button 
                onClick={() => setIsScheduleModalOpen(true)} 
                className="bg-main"
                disabled={isCreating || isPublishing || isScheduling}
              >
                {(isCreating || isScheduling) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send size={18} className="mr-2" />}
                Schedule Post
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Editor & Selection */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Accounts</CardTitle>
                  <CardDescription>Choose where you want to publish this post.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {isLoading ? (
                      <div className="h-20 w-full animate-pulse bg-secondary-background rounded-base" />
                    ) : (
                      accounts?.map((account) => (
                        <div
                          key={account.id}
                          onClick={() => toggleAccount(account.id)}
                          className={cn(
                            "flex items-center gap-2 p-3 border-2 rounded-base cursor-pointer transition-all",
                            selectedAccounts.includes(account.id) 
                              ? "bg-main border-border shadow-shadow -translate-y-1" 
                              : "bg-white border-border/20 hover:border-border/50"
                          )}
                        >
                          <div className="size-8 bg-secondary-background border-2 border-border rounded-full overflow-hidden relative">
                            {account.avatarUrl && <Image src={account.avatarUrl} alt={account.handle} fill className="object-cover" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{account.displayName}</span>
                            <span className="text-[10px] uppercase opacity-60 font-bold">{account.platform}</span>
                          </div>
                          {selectedAccounts.includes(account.id) && <Check size={14} className="ml-1" />}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Editor */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-heading text-xl">Content</h3>
                    <Button 
                        variant="reverse" 
                        size="sm" 
                        className={cn("h-8", isAiOpen && "bg-main shadow-shadow translate-x-boxShadowX translate-y-boxShadowY")}
                        onClick={() => setIsAiOpen(!isAiOpen)}
                    >
                        <Sparkles size={14} className="mr-2" />
                        {isAiOpen ? "Close Assistant" : "AI Assistant"}
                    </Button>
                </div>
                <RichTextEditor 
                  content={content} 
                  onChange={setContent} 
                  placeholder="What do you want to share today?"
                  limit={2200}
                />
              </div>

              {/* Media Staging */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="grid gap-1">
                        <CardTitle>Media</CardTitle>
                        <CardDescription>Add images or videos to your post.</CardDescription>
                        {/* Note */}
                        <p className="text-xs text-yellow-500 font-semibold">Note: We currently support only images.</p>
                    </div>
                    <Button size="icon" variant="neutral">
                        <ImageIcon size={20} />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "border-2 border-dashed rounded-base p-8 flex flex-col items-center justify-center text-secondary-foreground gap-4 transition-all cursor-pointer",
                            isDragging 
                                ? "border-main bg-main/10 scale-[1.02]" 
                                : "border-border bg-secondary-background/30 hover:bg-secondary-background/50"
                        )}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            accept="image/*,video/*"
                            onChange={(e) => e.target.files && handleFiles(e.target.files)}
                        />
                        <div className="p-4 bg-white border-2 border-border shadow-shadow rounded-full">
                            <ImageIcon size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm">Drag and drop media files here</p>
                            <p className="font-base text-xs opacity-70">or click to browse from your computer</p>
                        </div>
                        <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}>
                            Upload Media
                        </Button>
                    </div>

                    {mediaUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                            {mediaUrls.map((url, index) => (
                                <div key={index} className="relative group aspect-square border-2 border-border rounded-base overflow-hidden bg-secondary-background shadow-shadow transition-all hover:-translate-y-1">
                                    <Image src={url} alt={`Media ${index}`} fill className="object-cover" />
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeMedia(index);
                                        }}
                                        className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-border"
                                    >
                                        <Check size={12} className="rotate-45" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Previews */}
            <div className="lg:col-span-5">
               <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-heading text-xl">Pre-visualization</h3>
                        <div className="text-xs font-bold px-2 py-1 bg-secondary-background border-2 border-border rounded-base">
                            LIVE PREVIEW
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <Button 
                            variant="noShadow" 
                            size="sm" 
                            className={cn(activePreview === 'linkedin' && "bg-main")}
                            onClick={() => setActivePreview('linkedin')}
                         >
                            LinkedIn
                         </Button>
                         <Button 
                            variant="noShadow" 
                            size="sm" 
                            className={cn(activePreview === 'instagram' && "bg-main")}
                            onClick={() => setActivePreview('instagram')}
                         >
                            Instagram
                         </Button>
                         <Button 
                            variant="noShadow" 
                            size="sm" 
                            className={cn(activePreview === 'x' && "bg-main")}
                            onClick={() => setActivePreview('x')}
                         >
                            X (Twitter)
                         </Button>
                    </div>
                    <PlatformPreview 
                        content={content} 
                        mediaUrls={mediaUrls} 
                        platform={activePreview}
                    />
                    
                    {/* Platform Switcher Guide */}
                    <div className="bg-main/10 border-2 border-border rounded-base p-4">
                        <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
                            <Sparkles size={14} /> Optimization Tips
                        </h4>
                        <ul className="text-xs space-y-1 font-base list-disc list-inside">
                            <li>Instagram requires at least one image or video.</li>
                            <li>LinkedIn posts perform better with 3-5 relevant hashtags.</li>
                            <li>X (Twitter) posts are limited to 280 characters.</li>
                        </ul>
                    </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <aside className={cn(
        "fixed right-0 top-[64px] bottom-0 w-full lg:w-[400px] z-40 transition-transform duration-300 ease-in-out",
        isAiOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <AIChatSidebar 
          onApplyContent={handleApplyAiContent}
          onClose={() => setIsAiOpen(false)}
        />
      </aside>

      <ScheduleModal 
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        onSchedule={(date) => handlePost('SCHEDULE', date)}
      />
    </div>
  )
}




export default ComposerClient
