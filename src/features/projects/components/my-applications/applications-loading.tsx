'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ApplicationsLoading() {
  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
              <p className="text-gray-400">Loading your applications...</p>
            </div>
          </div>
        </div>
        
        {/* Loading Table Skeleton */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Project</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Applied Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} className="border-gray-800">
                    <TableCell><Skeleton className="h-4 w-32 bg-gray-700" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-gray-700" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 bg-gray-700" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-gray-700" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 bg-gray-700" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
