import {
  BookOpen,
  Code2,
  Users,
  Calendar,
  Trophy,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Home,
  Mail,
  Info,
  Heart,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Main",
    items: [
      { title: "Home", url: "#hero", icon: Home },
      { title: "About", url: "#about", icon: Info },
      { title: "Contact", url: "#contact", icon: Mail },
    ],
  },
  {
    title: "Learning",
    items: [
      { title: "Courses", url: "#courses", icon: BookOpen },
      { title: "Code Labs", url: "#labs", icon: Code2 },
      { title: "Workshops", url: "#workshops", icon: GraduationCap },
    ],
  },
  {
    title: "Community",
    items: [
      { title: "Members", url: "#community", icon: Users },
      { title: "Events", url: "#events", icon: Calendar },
      { title: "Competitions", url: "#competitions", icon: Trophy },
      { title: "Forum", url: "#forum", icon: MessageSquare },
    ],
  },
  {
    title: "Career",
    items: [{ title: "Job Board", url: "#jobs", icon: Briefcase }],
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 shadow-lg">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-space-mono font-semibold text-sm">CS Guild</span>
            <span className="font-space-mono text-xs text-pink-400">v2.0.dev</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="font-space-mono text-xs uppercase tracking-wider text-pink-400">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="font-space-grotesk text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 transition-colors duration-200">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <div className="font-space-mono text-xs text-pink-400 flex items-center gap-1">
            <span>{"// Built with"}</span>
            <Heart className="h-3 w-3 text-pink-400 fill-current" />
            <span>{"by CS Guild"}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
