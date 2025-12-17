import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { PAGE_CONTENT } from '@/Sim/Content';
import { useCalc } from '@/contexts/CalcContext';
import { getCurrentRound, getNextScreen, getPreviousScreen, getDashboardRoute, getNextDecisionScreen, getPreviousDecisionScreen, getDecisionScreenInfo } from '@/Sim/FlowConfig';

interface NavigationControlsProps {
  showDashboard?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  onDashboard?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  centerDashboard?: boolean;
  dashboardVariant?: "outline" | "secondary-gradient" | "default";
}

export function NavigationControls({
  showDashboard = true,
  onNext,
  onBack,
  onDashboard,
  nextDisabled = false,
  nextLabel,
  backLabel,
  centerDashboard = false,
  dashboardVariant = "outline"
}: NavigationControlsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getValue } = useCalc();

  // Auto-detect current round and navigation from FlowConfig
  const currentRound = getCurrentRound(getValue);
  const currentRoute = location.pathname;
  
  // Get navigation info from FlowConfig
  const nextScreen = getNextScreen(currentRoute, currentRound);
  const previousScreen = getPreviousScreen(currentRoute, currentRound);
  const dashboardRoute = getDashboardRoute(currentRoute, currentRound);
  
  // Check if we're on a decision screen for cycling navigation
  const decisionInfo = getDecisionScreenInfo(currentRoute);
  const nextDecisionInfo = decisionInfo ? getNextDecisionScreen(currentRoute) : null;
  const prevDecisionInfo = decisionInfo ? getPreviousDecisionScreen(currentRoute) : null;

  const handleDashboard = () => {
    if (onDashboard) {
      onDashboard();
    } else {
      navigate(dashboardRoute);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (previousScreen) {
      navigate(previousScreen.route);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextScreen) {
      navigate(nextScreen.route);
    }
  };

  // Use auto-detected labels or custom overrides
  const effectiveNextLabel = nextLabel || nextScreen?.title || "Next";
  const effectiveBackLabel = backLabel || previousScreen?.title || "Back";

  if (centerDashboard && showDashboard) {
    return (
      <div className="grid grid-cols-3 items-center py-6">
        <div className="flex gap-2 justify-start">
          {prevDecisionInfo && (
            <Button 
              variant="outline" 
              onClick={() => navigate(prevDecisionInfo.route)} 
              className="px-10 py-4 rounded-full text-lg font-semibold border-destructive bg-background text-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {prevDecisionInfo.label}
            </Button>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="secondary-gradient" onClick={() => navigate('/dashboard')} className="px-10 py-4 rounded-full text-lg font-semibold">
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>

        <div className="flex gap-2 justify-end">
          {nextDecisionInfo && (
            <Button 
              onClick={() => navigate(nextDecisionInfo.route)} 
              variant="outline"
              className="px-10 py-4 rounded-full text-lg font-semibold border-destructive bg-background text-foreground hover:bg-muted hover:text-foreground"
            >
              {nextDecisionInfo.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-6 w-full">
      {/* Left side - Back button */}
      <div>
        {(previousScreen || onBack) && (
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {effectiveBackLabel}
          </Button>
        )}
      </div>

      {/* Center - Dashboard button */}
      <div>
        {showDashboard && (
          <Button variant={dashboardVariant} onClick={handleDashboard}>
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        )}
      </div>

      {/* Right side - Next/Submit button */}
      <div>
        {(nextScreen || onNext) && (
          <Button 
            onClick={handleNext} 
            disabled={nextDisabled}
            variant="secondary-gradient"
            className="font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {effectiveNextLabel}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}