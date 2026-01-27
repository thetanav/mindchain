import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative w-full h-full overflow-auto">
        <SidebarTrigger className="absolute top-4 left-4 z-10 p-2" />
        {children}
      </main>
    </SidebarProvider>
  )
}