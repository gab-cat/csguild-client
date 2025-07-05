'use client';

import { AlertTriangle, CheckCircle, Info, XCircle, Code2 } from 'lucide-react';
import React from 'react';
import { type ExternalToast, toast } from 'sonner';

type ShowToastParams = {
    type: 'success' | 'error' | 'warning' | 'info' | 'code';
    title: string;
} & ExternalToast

// Custom styling for different toast types following CS Guild brand
const toastStyles = {
  success: {
    style: { 
      backgroundColor: 'hsl(142 71% 45%)', // CS Guild success green
      borderColor: 'hsl(142 71% 40%)', 
      color: 'white', 
      fontWeight: 'bold',
      border: '1px solid hsl(142 71% 40%)',
      backdropFilter: 'blur(10px)'
    },
    icon: () => React.createElement(CheckCircle, { 
      className: 'h-5 w-5 text-white'
    }),
    defaultDuration: 3000
  },
  error: {
    style: { 
      backgroundColor: 'hsl(0 72% 51%)', // Refined error red
      borderColor: 'hsl(0 72% 46%)', 
      color: 'white', 
      fontWeight: 'bold',
      border: '1px solid hsl(0 72% 46%)',
      backdropFilter: 'blur(10px)'
    },
    icon: () => React.createElement(XCircle, { 
      className: 'h-5 w-5 text-white'
    }),
    defaultDuration: 4000
  },
  warning: {
    style: { 
      backgroundColor: 'hsl(38 92% 50%)', // CS Guild warning orange
      borderColor: 'hsl(38 92% 45%)', 
      color: 'white', 
      fontWeight: 'bold',
      border: '1px solid hsl(38 92% 45%)',
      backdropFilter: 'blur(10px)'
    },
    icon: () => React.createElement(AlertTriangle, { 
      className: 'h-5 w-5 text-white'
    }),
    defaultDuration: 4000
  },
  info: {
    style: { 
      background: 'linear-gradient(135deg, hsl(330 81% 60%) 0%, hsl(262 83% 58%) 100%)', // CS Guild gradient
      borderColor: 'hsl(330 81% 55%)', 
      color: 'white', 
      fontWeight: 'bold',
      border: '1px solid hsl(330 81% 55%)',
      backdropFilter: 'blur(10px)'
    },
    icon: () => React.createElement(Info, { 
      className: 'h-5 w-5 text-white'
    }),
    defaultDuration: 3500
  },
  code: {
    style: { 
      background: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(271 81% 56%) 100%)', // CS Guild purple gradient
      borderColor: 'hsl(262 83% 53%)', 
      color: 'white', 
      fontWeight: 'bold',
      border: '1px solid hsl(262 83% 53%)',
      backdropFilter: 'blur(10px)'
    },
    icon: () => React.createElement(Code2, { 
      className: 'h-5 w-5 text-white'
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
      closeButton: 'text-white/70 hover:text-white transition-colors',
      actionButton: 'bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm border border-white/30',
      cancelButton: 'bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm border border-white/30',
      title: '!font-bold font-sans tracking-wide text-sm leading-tight text-white',
      description: 'text-xs opacity-90 leading-relaxed font-mono text-white/90',
      toast: 'backdrop-blur-sm shadow-2xl',
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
