"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Send, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Workspace Overview</h1>
        <p className="text-muted-foreground font-bold">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Posts", value: "0", icon: Send, color: "bg-main" },
          { title: "Accounts", value: "0", icon: Users, color: "bg-coral" },
          { title: "Engagement", value: "0%", icon: BarChart3, color: "bg-accent" },
          { title: "Scheduled", value: "0", icon: LayoutDashboard, color: "bg-white" },
        ].map((item, i) => (
          <Card key={i} className="hover:translate-x-1 hover:-translate-y-1 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-heading uppercase">{item.title}</CardTitle>
              <div className={`${item.color} p-2 border-2 border-black rounded-base`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-shadow">
        <CardHeader>
          <CardTitle className="text-2xl uppercase tracking-tighter">Get Started</CardTitle>
          <CardDescription className="font-bold">Follow these steps to set up your AI-powered social workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border-2 border-black rounded-base bg-main hover:translate-x-1 transition-transform cursor-pointer">
            <div className="h-10 w-10 flex items-center justify-center font-black border-2 border-black rounded-base bg-white">1</div>
            <div>
              <p className="font-heading uppercase">Connect Social Accounts</p>
              <p className="text-xs font-bold">Link your X, LinkedIn, or Mastodon accounts.</p>
            </div>
            <Link href="/dashboard/accounts" className="ml-auto">
                <Button variant="neutral" size="sm">Connect</Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 p-4 border-2 border-black rounded-base bg-accent hover:translate-x-1 transition-transform cursor-pointer opacity-50 grayscale">
            <div className="h-10 w-10 flex items-center justify-center font-black border-2 border-black rounded-base bg-white">2</div>
            <div>
              <p className="font-heading uppercase text-foreground">Draft Your First Post</p>
              <p className="text-xs font-bold">Use AI to generate high-engagement content.</p>
            </div>
            <Button variant="neutral" size="sm" className="ml-auto" disabled>Compose</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
