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
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  }

  return (
    <Sidebar 
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="border-r-2 border-border bg-background transition-all duration-300 ease-in-out"
    >
      <SidebarHeader className="p-3 border-b-2 border-border flex flex-row items-center justify-start gap-3 overflow-hidden">
        <div className="w-8 h-8 bg-main border-2 border-black flex items-center justify-center font-black text-black shrink-0">P</div>
        <h1 className={`text-2xl font-black tracking-tighter uppercase transition-opacity duration-200 ${isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"}`}>
          Postly
        </h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading uppercase text-xs">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name} 
                      className={`font-bold transition-colors ${
          isActive
            ? "bg-main text-main-foreground border"
            : "hover:bg-main hover:text-main-foreground"
        }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
})}
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
                  <ThemeToggle collapsed={isCollapsed} />
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
