import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative w-full h-screen heropattern-polka-dots-primary">
        <SidebarTrigger className="absolute top-4 left-4 z-10 p-2 md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  )
}