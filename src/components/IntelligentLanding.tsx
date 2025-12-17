import { Navigate, useLocation } from 'react-router-dom';
import { useCalc } from '../contexts/CalcContext';
import { getInitialRoute } from '../Sim/FlowConfig';

/**
 * IntelligentLanding Component
 * 
 * Analyzes simulation progress and redirects users to the appropriate starting screen:
 * - Fresh start → Team name entry (/)
 * - Partial progress → Strategy planning (/strategy-planning)
 * - Full progress → Dashboard (/dashboard)
 * 
 * This ensures users land exactly where they left off after page refresh.
 */
export const IntelligentLanding = () => {
  const { getValue, isInitialized } = useCalc();
  const location = useLocation();

  // Don't redirect if CalcModel isn't ready yet
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading simulation...</p>
        </div>
      </div>
    );
  }

  // Determine target route based on progress
  const targetRoute = getInitialRoute(getValue);
  
  // Only redirect if we're on the root landing route
  // This prevents redirecting when user explicitly navigates elsewhere
  if (location.pathname === '/landing' || location.pathname === '/') {
    return <Navigate to={targetRoute} replace />;
  }

  // If somehow accessed directly, redirect
  return <Navigate to={targetRoute} replace />;
};
