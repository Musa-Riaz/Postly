"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAccounts } from "@/hooks/use-accounts"
import { usePosts } from "@/hooks/use-posts"
import { QueueView } from "@/components/dashboard/QueueView"
import { LayoutDashboard, Users, Send, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: accounts } = useAccounts()
  const { posts, isLoading: postsLoading } = usePosts()

  const stats = [
    { title: "Total Posts", value: posts?.length.toString() || "0", icon: Send, color: "bg-main" },
    { title: "Accounts", value: accounts?.length.toString() || "0", icon: Users, color: "bg-coral" },
    { title: "Engagement", value: "0%", icon: BarChart3, color: "bg-accent" },
    { title: "Scheduled", value: posts?.filter(p => p.status === 'SCHEDULED').length.toString() || "0", icon: LayoutDashboard, color: "bg-white" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Workspace Overview</h1>
          <p className="text-muted-foreground font-bold">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <Card key={i} className="hover:translate-x-1 hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-heading uppercase">{item.title}</CardTitle>
              <div className={`${item.color} p-2 border-2 border-black rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="text-2xl uppercase tracking-tighter">Upcoming Queue</CardTitle>
              <CardDescription className="font-bold">Your scheduled content roadmap.</CardDescription>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <QueueView posts={posts || []} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-accent/10">
            <CardHeader>
              <CardTitle className="text-xl uppercase tracking-tighter">Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!accounts || accounts.length === 0 ? (
                <Link href="/dashboard/accounts" className="block">
                  <div className="flex items-center gap-4 p-4 border-2 border-black rounded-base bg-main hover:translate-x-1 transition-transform cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="h-8 w-8 flex items-center justify-center font-black border-2 border-black rounded-base bg-white">1</div>
                    <div>
                      <p className="font-heading uppercase text-xs">Connect Accounts</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-4 border-2 border-black rounded-base bg-green-400 opacity-50">
                   <div className="h-8 w-8 flex items-center justify-center font-black border-2 border-black rounded-base bg-white text-green-600">✓</div>
                   <p className="font-heading uppercase text-xs">Accounts Connected</p>
                </div>
              )}
              
              <Link href="/dashboard/composer" className="block">
                <div className="flex items-center gap-4 p-4 border-2 border-black rounded-base bg-coral hover:translate-x-1 transition-transform cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="h-8 w-8 flex items-center justify-center font-black border-2 border-black rounded-base bg-white">2</div>
                  <div>
                    <p className="font-heading uppercase text-xs">Draft A Post</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
