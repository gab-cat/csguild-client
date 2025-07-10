import Footer from "@/components/shared/footer"
import NavBar from "@/components/shared/navbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen w-screen"> 
      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
} 