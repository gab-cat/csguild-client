'use client';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ApplicationsErrorProps {
  error: Error | unknown;
}

export function ApplicationsError({ error }: ApplicationsErrorProps) {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to load your applications
          </h2>
          
          <p className="text-gray-400 mb-2 max-w-md leading-relaxed">
            There was an error loading your applications. This might be a temporary issue.
          </p>
          
          <p className="text-xs text-gray-500 mb-6 font-mono">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium px-6 py-2.5"
            >
              Try Again
            </Button>
            <p className="text-xs text-gray-500">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
