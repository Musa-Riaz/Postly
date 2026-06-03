import { 
  LayoutDashboard, 
  UserCircle, 
  Send, 
  BarChart3, 
  Calendar,
  FileText,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle"

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Social Accounts', icon: UserCircle, href: '/dashboard/accounts' },
  { name: 'Post Composer', icon: Send, href: '/dashboard/composer' },
  { name: 'Content Manager', icon: FileText, href: '/dashboard/posts' },
  { name: 'Schedule', icon: Calendar, href: '/dashboard/schedule' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' }
]

export function DashboardSidebar() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  }

  return (
    <Sidebar className="border-r-2 border-border bg-background">
      <SidebarHeader className="p-4 border-b-2 border-border">
        <h1 className="text-2xl font-black tracking-tighter uppercase">Postly</h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading uppercase text-xs">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name} className="hover:bg-main hover:text-main-foreground font-bold">
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarContent className="flex justify-end p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Theme" className="hover:bg-main hover:text-main-foreground font-bold">
                  <ThemeToggle />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t-2 border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut} 
              className="w-full hover:bg-red-400 hover:text-white font-bold transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
