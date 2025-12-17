import React from 'react';
import { useLocation } from 'react-router-dom';
import { KPIBar } from './KPIBar';
import { FlowNavigation } from './FlowNavigation';
import { AthenaButton } from '@/components/AthenaButton';

interface AppLayoutWithKPIProps {
  children: React.ReactNode;
}

export function AppLayoutWithKPI({ children }: AppLayoutWithKPIProps) {
  const location = useLocation();
  
  // Define pages where Athena should NOT appear
  const excludedRoutes = ['/', '/loading', '/strategy-planning'];
  const shouldShowAthena = !excludedRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith('/events')
  );
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Fixed KPI Bar at top */}
      <div className="shrink-0">
        <KPIBar />
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto relative">
        {children}
        
        {/* Flow Navigation positioned within content area */}
        <FlowNavigation />
        
        {/* Athena Chatbot - positioned bottom-left */}
        {shouldShowAthena && <AthenaButton />}
      </div>
    </div>
  );
}