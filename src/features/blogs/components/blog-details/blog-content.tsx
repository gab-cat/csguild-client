'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

// Import highlight.js styles
import 'highlight.js/styles/github-dark.css'

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-invert prose-purple max-w-none">
      <div className="text-gray-300 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-3 mt-5">{children}</h3>,
            p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-purple-400 hover:text-purple-300 underline"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <code className="bg-gray-800 text-purple-300 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              )
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-6">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4">{children}</ol>,
          }}
        >
          {content || 'Content not available.'}
        </ReactMarkdown>
      </div>
    </div>
  )
}
