import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCalc } from '../contexts/CalcContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isInitialized, isLoading, error } = useCalc();

  // Redirect to loading screen if there's an error, still loading, or not initialized
  if (error || isLoading || !isInitialized) {
    return <Navigate to="/loading" replace />;
  }

  // Render protected content when ready
  return <>{children}</>;
};

