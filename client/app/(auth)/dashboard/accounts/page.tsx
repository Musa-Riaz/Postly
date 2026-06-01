"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { useAccounts, useConnectPlatform, useDisconnectAccount } from "@/hooks/use-accounts"
import { Skeleton } from "@/components/ui/skeleton"

const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'X / Twitter', icon: X, color: 'bg-main', type: 'social' },
  { id: 'linkedin', name: 'LinkedIn', icon: '', color: 'bg-accent', type: 'social' },
  { id: 'mastodon', name: 'Mastodon', icon: '', color: 'bg-secondary-background', type: 'social' },
  {id: 'instagram', name: 'Instagram', icon: '', color: 'bg-main', type: 'social'}
]

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts()
  const connectMutation = useConnectPlatform()
  const disconnectMutation = useDisconnectAccount()

  const handleConnect = (platform: string) => {
    connectMutation.mutate({ 
        platform, 
        redirectUri: `${window.location.origin}/dashboard/accounts/callback` 
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Social Accounts</h1>
        <p className="text-muted-foreground font-bold">Manage your connected platforms and publishing permissions.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-border shadow-shadow">
          <CardHeader>
            <CardTitle className="text-2xl uppercase tracking-tighter">Connected Accounts</CardTitle>
            <CardDescription className="font-bold">Your currently linked profiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array(2).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-base border-2 border-black" />
              ))
            ) : accounts?.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-black rounded-base text-center bg-secondary-background">
                <p className="font-bold text-muted-foreground italic">No accounts connected yet.</p>
              </div>
            ) : (
              accounts?.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between p-4 border-2 border-black rounded-base bg-white shadow-shadow">
                   <div className="flex items-center gap-3">
                     <div className="bg-main p-2 border-2 border-black rounded-base">
                        <X className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="font-heading uppercase text-sm">{acc.displayName}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">@{acc.handle}</p>
                     </div>
                   </div>
                   <Button 
                    variant="neutral" 
                    size="icon" 
                    className="hover:bg-coral transition-colors"
                    onClick={() => disconnectMutation.mutate(acc.id)}
                    disabled={disconnectMutation.isPending}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-shadow">
          <CardHeader>
            <CardTitle className="text-2xl uppercase tracking-tighter">Available Platforms</CardTitle>
            <CardDescription className="font-bold">Connect a new social platform to start posting.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {SOCIAL_PLATFORMS.map((platform) => (
               <div key={platform.id} className="flex items-center justify-between p-4 border-2 border-black rounded-base bg-white hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-shadow group">
                  <div className="flex items-center gap-4">
                    <div className={`${platform.color} p-2 border-2 border-black rounded-base group-hover:rotate-6 transition-transform`}>
                      {platform.icon ? <platform.icon className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-heading uppercase text-sm">{platform.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">Ready to connect</p>
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="font-heading uppercase text-xs"
                    onClick={() => handleConnect(platform.id)}
                    disabled={connectMutation.isPending}
                  >
                    {connectMutation.isPending && connectMutation.variables?.platform === platform.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : 'Connect'}
                  </Button>
               </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-main border-2 border-black shadow-shadow">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
           <div className="bg-white p-4 border-2 border-black rounded-base rotate-3">
              <Plus className="h-8 w-8" />
           </div>
           <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Need another platform?</h3>
              <p className="font-bold text-sm">We&apos;re constantly adding new integrations. Suggest a platform you&apos;d like to see next!</p>
           </div>
           <Button variant="neutral" className="md:ml-auto font-heading uppercase">Suggest Integration</Button>
        </CardContent>
      </Card>
    </div>
  )
}
