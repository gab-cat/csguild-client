import { Separator } from '@radix-ui/react-separator'
import { Code2 } from 'lucide-react'

import { SidebarTrigger } from '@/components/ui/sidebar'

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-pink-500/20 bg-black/80 backdrop-blur-md px-4">
      <SidebarTrigger className="-ml-1 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-pink-500/20" />
      <div className="flex items-center gap-2">
        <Code2 className="h-4 w-4 text-pink-400" />
        <span className="font-jetbrains text-sm text-pink-300">{"// CS Guild - Where Code Meets Community"}</span>
      </div>
    </header>
  )
}

export default NavBar