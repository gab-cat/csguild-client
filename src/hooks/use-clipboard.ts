import { useState, useCallback } from 'react'

interface UseClipboardOptions {
  timeout?: number
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
}

interface UseClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<void>
  reset: () => void
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      if (!navigator.clipboard) {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      } else {
        await navigator.clipboard.writeText(text)
      }
      
      setCopied(true)
      onSuccess?.(text)
      
      // Reset copied state after timeout
      setTimeout(() => {
        setCopied(false)
      }, timeout)
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to copy to clipboard')
      onError?.(errorObj)
      console.error('Failed to copy to clipboard:', errorObj)
    }
  }, [timeout, onSuccess, onError])

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return { copied, copy, reset }
}
