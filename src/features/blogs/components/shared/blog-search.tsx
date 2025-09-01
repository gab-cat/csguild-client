import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BlogSearchProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
}

export function BlogSearch({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Search blogs...",
  className = ""
}: BlogSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
