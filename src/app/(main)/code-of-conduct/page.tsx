import { CodeOfConductContent } from "@/components/static/code-of-conduct-content"

export const metadata = {
  title: "Code of Conduct | CS Guild",
  description: "Community guidelines and expectations for all CS Guild members and participants."
}

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-5 pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-6 py-8">
          <CodeOfConductContent />
        </div>
      </main>
    </div>
  )
} 