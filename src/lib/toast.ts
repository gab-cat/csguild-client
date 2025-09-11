'use client';

import { AlertTriangle, CheckCircle, Info, XCircle, Code2 } from 'lucide-react';
import React from 'react';
import { type ExternalToast, toast } from 'sonner';

type ShowToastParams = {
    type: 'success' | 'error' | 'warning' | 'info' | 'code';
    title: string;
} & ExternalToast

// Custom styling for different toast types following CS Guild brand with darker theme and emphasized borders/glows
const toastStyles = {
  success: {
    style: { 
      backgroundColor: 'hsl(330 30% 8% / 0.7)', // Transparent dark pink background
      borderColor: 'hsl(330 81% 60%)', 
      color: 'hsl(330 81% 90%)', 
      fontWeight: 'bold',
      border: '2px solid hsl(330 81% 60%)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 0 25px hsl(330 81% 60% / 0.5), 0 0 40px hsl(330 81% 60% / 0.3), inset 0 1px 0 hsl(330 81% 65% / 0.2)'
    },
    icon: () => React.createElement(CheckCircle, { 
      className: 'h-5 w-5 text-pink-400'
    }),
    defaultDuration: 3000
  },
  error: {
    style: { 
      backgroundColor: 'hsl(0 30% 8% / 0.7)', // Transparent dark error red background
      borderColor: 'hsl(0 72% 51%)', 
      color: 'hsl(0 72% 85%)', 
      fontWeight: 'bold',
      border: '2px solid hsl(0 72% 51%)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 0 20px hsl(0 72% 51% / 0.4), inset 0 1px 0 hsl(0 72% 55% / 0.2)'
    },
    icon: () => React.createElement(XCircle, { 
      className: 'h-5 w-5 text-red-400'
    }),
    defaultDuration: 4000
  },
  warning: {
    style: { 
      backgroundColor: 'hsl(38 30% 8% / 0.7)', // Transparent dark warning orange background
      borderColor: 'hsl(38 92% 50%)', 
      color: 'hsl(38 92% 85%)', 
      fontWeight: 'bold',
      border: '2px solid hsl(38 92% 50%)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 0 20px hsl(38 92% 50% / 0.4), inset 0 1px 0 hsl(38 92% 55% / 0.2)'
    },
    icon: () => React.createElement(AlertTriangle, { 
      className: 'h-5 w-5 text-orange-400'
    }),
    defaultDuration: 4000
  },
  info: {
    style: { 
      backgroundColor: 'hsl(262 30% 8% / 0.7)', // Transparent dark violet background
      background: 'linear-gradient(135deg, hsl(262 30% 8% / 0.7) 0%, hsl(271 30% 8% / 0.7) 100%)',
      borderColor: 'hsl(262 83% 58%)', 
      color: 'hsl(262 83% 90%)', 
      fontWeight: 'bold',
      border: '2px solid hsl(262 83% 58%)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 0 25px hsl(262 83% 58% / 0.5), 0 0 40px hsl(271 81% 56% / 0.3), inset 0 1px 0 hsl(262 83% 63% / 0.2)'
    },
    icon: () => React.createElement(Info, { 
      className: 'h-5 w-5 text-violet-400'
    }),
    defaultDuration: 3500
  },
  code: {
    style: { 
      backgroundColor: 'hsl(262 30% 8% / 0.7)', // Transparent dark purple background
      background: 'linear-gradient(135deg, hsl(262 30% 8% / 0.7) 0%, hsl(271 30% 8% / 0.7) 100%)',
      borderColor: 'hsl(262 83% 58%)', 
      color: 'hsl(262 83% 90%)', 
      fontWeight: 'bold',
      border: '2px solid hsl(262 83% 58%)',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 0 25px hsl(262 83% 58% / 0.5), 0 0 40px hsl(271 81% 56% / 0.3), inset 0 1px 0 hsl(262 83% 63% / 0.2)'
    },
    icon: () => React.createElement(Code2, { 
      className: 'h-5 w-5 text-violet-400'
    }),
    defaultDuration: 3500
  }
};

export const showToast = ({ 
  type, 
  title, 
  ...options
}: ShowToastParams) => {
  const defaultStyle = toastStyles[type];
  
  // Extract custom options and merge with defaults
  const {
    description,
    duration,
    style,
    position,
    richColors,
    unstyled,
    ...restOptions
  } = options;
  
  toast[type === 'code' ? 'info' : type](title, {
    description,
    duration: duration ?? defaultStyle.defaultDuration,
    style: unstyled ? style : { ...defaultStyle.style, ...style },
    icon: unstyled ? undefined : defaultStyle.icon(),
    position: position ?? 'top-right',
    richColors: richColors ?? false, // Using custom styles instead
    closeButton: true,
    classNames: unstyled ? undefined : {
      closeButton: 'text-white/50 hover:text-white/80 transition-colors',
      actionButton: 'bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20 shadow-lg',
      cancelButton: 'bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20 shadow-lg',
      title: '!font-bold font-sans tracking-wide text-sm leading-tight',
      description: 'text-xs text-gray-300! opacity-80 leading-relaxed font-mono',
      toast: 'backdrop-blur-sm shadow-2xl border-2',
    },
    ...restOptions
  });
};

// Convenience functions for common CS Guild toast scenarios
export const showSuccessToast = (title: string, description?: string) => {
  showToast({ 
    type: 'success', 
    title, 
    description 
  });
};

export const showErrorToast = (title: string, description?: string) => {
  showToast({ 
    type: 'error', 
    title, 
    description 
  });
};

export const showWarningToast = (title: string, description?: string) => {
  showToast({ 
    type: 'warning', 
    title, 
    description 
  });
};

export const showInfoToast = (title: string, description?: string) => {
  showToast({ 
    type: 'info', 
    title, 
    description 
  });
};

export const showCodeToast = (title: string, description?: string) => {
  showToast({ 
    type: 'code', 
    title, 
    description 
  });
};
