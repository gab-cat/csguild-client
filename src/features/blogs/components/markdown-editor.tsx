'use client'

import { Bold, Italic, Code, Link, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Eye, EyeOff, Type, Code2, Minus } from 'lucide-react'
import { useState, useRef, useCallback, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: number
}

interface FormatAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  shortcut?: string
  action: () => void
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  className = "",
  minHeight = 300 
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Get current selection in textarea
  const getSelection = useCallback(() => {
    if (!textareaRef.current) return { start: 0, end: 0, text: '' }
    const { selectionStart, selectionEnd } = textareaRef.current
    const text = value.substring(selectionStart, selectionEnd)
    return { start: selectionStart, end: selectionEnd, text }
  }, [value])

  // Insert text at cursor position
  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    if (!textareaRef.current) return

    const { start, end, text } = getSelection()
    const hasSelection = text.length > 0
    const content = hasSelection ? text : placeholder
    
    const newText = value.substring(0, start) + 
                   before + content + after + 
                   value.substring(end)
    
    onChange(newText)

    // Set cursor position after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = hasSelection 
          ? start + before.length + content.length + after.length
          : start + before.length + content.length
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }, [value, onChange, getSelection])

  // Insert text at start of line
  const insertLinePrefix = useCallback((prefix: string) => {
    if (!textareaRef.current) return

    const { start } = getSelection()
    const lines = value.split('\n')
    let currentPos = 0
    let lineIndex = 0

    // Find which line cursor is on
    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= start) {
        lineIndex = i
        break
      }
      currentPos += lines[i].length + 1 // +1 for newline
    }

    // Toggle prefix if it already exists
    if (lines[lineIndex].startsWith(prefix)) {
      lines[lineIndex] = lines[lineIndex].substring(prefix.length)
    } else {
      lines[lineIndex] = prefix + lines[lineIndex]
    }

    onChange(lines.join('\n'))

    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(start, start)
        textareaRef.current.focus()
      }
    }, 0)
  }, [value, onChange, getSelection])

  // Format actions
  const formatActions: FormatAction[] = useMemo(() => [
    {
      icon: Bold,
      label: 'Bold',
      shortcut: 'Cmd+B',
      action: () => insertText('**', '**', 'bold text')
    },
    {
      icon: Italic,
      label: 'Italic',
      shortcut: 'Cmd+I',
      action: () => insertText('*', '*', 'italic text')
    },
    {
      icon: Code,
      label: 'Inline Code',
      action: () => insertText('`', '`', 'code')
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertText('[', '](url)', 'link text')
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertLinePrefix('# ')
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => insertLinePrefix('## ')
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => insertLinePrefix('### ')
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => insertLinePrefix('- ')
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => insertLinePrefix('1. ')
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertLinePrefix('> ')
    },
    {
      icon: Code2,
      label: 'Code Block',
      action: () => insertText('```\n', '\n```', 'code here')
    },
    {
      icon: Minus,
      label: 'Horizontal Rule',
      action: () => insertText('\n---\n', '', '')
    }
  ], [insertText, insertLinePrefix])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
      case 'b':
        e.preventDefault()
        formatActions[0].action() // Bold
        break
      case 'i':
        e.preventDefault()
        formatActions[1].action() // Italic
        break
      case 'k':
        e.preventDefault()
        formatActions[3].action() // Link
        break
      }
    }

    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      insertText('  ')
    }
  }, [formatActions, insertText])

  // Simple markdown to HTML converter for preview
  const markdownToHtml = useCallback((markdown: string) => {
    if (!markdown.trim()) return ''
    
    return markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mt-6 mb-3 border-b border-gray-800 pb-1">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mt-8 mb-4 border-b border-gray-700 pb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-10 mb-6 border-b border-gray-600 pb-3">$1</h1>')
      // Code blocks (basic)
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 border border-gray-700 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-gray-200 font-mono text-sm">$1</code></pre>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-200">$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-purple-400 px-2 py-1 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-400 hover:text-purple-300 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li class="text-gray-200 ml-6 list-disc mb-1">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li class="text-gray-200 ml-6 list-decimal mb-1">$1</li>')
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 text-gray-300 italic my-4 bg-gray-800/30 py-2 rounded-r">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-gray-700">')
      // Paragraphs (split by double line breaks)
      .split('\n\n')
      .map(paragraph => {
        const trimmed = paragraph.trim()
        // Skip if already formatted as header, list, quote, etc.
        if (trimmed.startsWith('<') || trimmed === '') return trimmed
        return `<p class="mb-4 text-gray-200 leading-relaxed">${trimmed}</p>`
      })
      .join('\n')
      // Line breaks
      .replace(/\n/g, '<br>')
  }, [])

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toolbar */}
      <Card className="bg-gray-800/50 border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            {formatActions.map((action, index) => (
              <div key={action.label}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                  title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                >
                  <action.icon className="h-4 w-4" />
                </Button>
                {/* Add separator after certain groups */}
                {(index === 2 || index === 3 || index === 6 || index === 9) && (
                  <Separator orientation="vertical" className="h-6 bg-gray-600 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Preview Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
          </Button>
        </div>
      </Card>

      {/* Editor/Preview Area */}
      <div className="grid grid-cols-1 gap-4" style={{ minHeight }}>
        {showPreview ? (
          /* Preview Mode */
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Eye className="h-4 w-4" />
                Preview
              </div>
              <div 
                className="prose prose-invert max-w-none text-gray-200 min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
              />
              {!value.trim() && (
                <div className="text-gray-500 italic flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nothing to preview yet.</p>
                    <p className="text-sm">Start writing to see your content formatted.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          /* Editor Mode */
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none font-mono"
              style={{ minHeight }}
            />
            
            {/* Helper text */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Use markdown formatting</span>
                <span>• **bold** • *italic* • `code` • [link](url)</span>
              </div>
              <div className="flex items-center gap-1">
                <Type className="h-3 w-3" />
                <span>{value.length} characters</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      {!showPreview && (
        <Card className="bg-gray-900/50 border-gray-700 p-4">
          <div className="text-xs text-gray-400">
            <div className="font-medium mb-3 flex items-center gap-2">
              <Type className="h-4 w-4" />
              Markdown Quick Reference
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="font-medium text-gray-300 mb-1">Headers</div>
                <div><code className="text-purple-400"># Heading 1</code></div>
                <div><code className="text-purple-400">## Heading 2</code></div>
                <div><code className="text-purple-400">### Heading 3</code></div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-300 mb-1">Text Formatting</div>
                <div><code className="text-purple-400">**bold text**</code></div>
                <div><code className="text-purple-400">*italic text*</code></div>
                <div><code className="text-purple-400">`inline code`</code></div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-300 mb-1">Lists & Links</div>
                <div><code className="text-purple-400">- Bullet item</code></div>
                <div><code className="text-purple-400">1. Numbered item</code></div>
                <div><code className="text-purple-400">[Link text](url)</code></div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-300 mb-1">Other</div>
                <div><code className="text-purple-400">&gt; Quote text</code></div>
                <div><code className="text-purple-400">```code block```</code></div>
                <div><code className="text-purple-400">---</code> (horizontal rule)</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-300 mb-1">Shortcuts</div>
                <div><span className="text-gray-500">Cmd/Ctrl + B</span> - Bold</div>
                <div><span className="text-gray-500">Cmd/Ctrl + I</span> - Italic</div>
                <div><span className="text-gray-500">Cmd/Ctrl + K</span> - Link</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
