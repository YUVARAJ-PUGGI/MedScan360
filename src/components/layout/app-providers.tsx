
"use client";

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PatientDataProvider } from '@/context/PatientDataContext';

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PatientDataProvider>
          {children}
        </PatientDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
