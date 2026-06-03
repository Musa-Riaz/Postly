"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Send, X, Bot, User, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatSidebarProps {
  onApplyContent: (content: string) => void
  onClose: () => void
}

const AIChatSidebar = ({ onApplyContent, onClose }: AIChatSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Postly AI assistant. How can I help you craft the perfect post today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const { data } = await apiClient.post('/ai/generate', {
        prompt: userMessage,
        tone: 'professional' // Default for now
      })

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (error) {
      toast.error('Failed to generate response')
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-l-2 border-border font-base">
      {/* Header */}
      <div className="p-4 border-b-2 border-border bg-main flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <h3 className="font-heading">AI Assistant</h3>
        </div>
        <Button variant="noShadow" size="icon" onClick={onClose} className="size-8">
          <X size={16} />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary-background/20">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex gap-3",
            m.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "size-8 rounded-full border-2 border-border flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-white" : "bg-main"
            )}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-3 rounded-base border-2 border-border max-w-[85%] text-sm shadow-shadow-sm",
              m.role === 'user' ? "bg-white" : "bg-white"
            )}>
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.role === 'assistant' && i !== 0 && (
                <div className="mt-3 pt-3 border-t-2 border-border/10 flex gap-2">
                   <Button 
                    variant="noShadow" 
                    size="sm" 
                    className="h-7 text-[10px] bg-main"
                    onClick={() => onApplyContent(m.content)}
                   >
                     <Wand2 size={12} className="mr-1" /> Use Content
                   </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 animate-pulse">
            <div className="size-8 rounded-full border-2 border-border bg-main/50" />
            <div className="h-12 w-[60%] bg-white border-2 border-border rounded-base" />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-t-2 border-border flex gap-2 overflow-x-auto bg-white">
        <Button variant="neutral" size="sm" className="h-7 text-[10px] whitespace-nowrap" onClick={() => setInput("Suggest hashtags for this post")}>
          # Hashtags
        </Button>
        <Button variant="neutral" size="sm" className="h-7 text-[10px] whitespace-nowrap" onClick={() => setInput("Make this more professional")}>
          👔 Professional
        </Button>
        <Button variant="neutral" size="sm" className="h-7 text-[10px] whitespace-nowrap" onClick={() => setInput("Make this post shorter")}>
          ✂️ Shorter
        </Button>
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-border bg-white">
        <div className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI to help..."
            className="pr-12"
          />
          <Button 
            variant="noShadow" 
            size="icon" 
            onClick={handleSendMessage}
            className="absolute right-1 top-1 size-8 bg-main"
            disabled={!input.trim() || isLoading}
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AIChatSidebar
