import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCalc } from '@/contexts/CalcContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PAGE_CONTENT, markScreenAsVisited, VALIDATION, getSelectedInitiativesFromCalcModel } from '@/Sim/Content';
import { INVESTMENT_RANGE_NAMES_R1, INVESTMENT_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES, KPI_RANGE_NAMES_R1, KPI_RANGE_NAMES_R2 } from '@/Sim/RangeNameMap';
import { calculateCurrentStepFromTracking } from '@/Sim/FlowConfig';

export function FlowNavigation() {
  const { getValue, setValue } = useCalc();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate investment range object based on current round
  const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;

  // Only show navigation buttons on the dashboard page
  if (location.pathname !== '/dashboard') {
    return null;
  }

  // Calculate current step from screen tracking flags (single source of truth)
  const currentStep = calculateCurrentStepFromTracking(getValue, currentRound);

  const getNavigationConfig = () => {
    switch (currentStep) {
      case 'dashboard':
        return {
          buttons: [
            { 
              label: 'Select Special Initiatives', 
              onClick: () => {
                navigate('/initiatives');
              }
            }
          ]
        };

      case 'initiatives':
        return {
          buttons: [
            { 
              label: 'View Initiative Impacts', 
              onClick: () => {
                navigate('/initiative-impacts');
              }
            }
          ]
        };

      case 'initiative-impacts':
        return {
          buttons: [
            { 
              label: 'Continue to Event 1', 
              onClick: () => {
                navigate(`/events/${currentRound}/1`);
              }
            }
          ]
        };

      case 'event-1':
        return {
          buttons: [
            { 
              label: 'View Event 1 Impacts', 
              onClick: () => {
                navigate(`/event-outcomes/${currentRound}/1`);
              }
            }
          ]
        };

      case 'event-1-impacts':
        return {
          buttons: [
            { 
              label: 'Continue to Event 2', 
              onClick: () => {
                navigate(`/events/${currentRound}/2`);
              }
            }
          ]
        };

      case 'event-2':
        return {
          buttons: [
            { 
              label: 'View Event 2 Impacts', 
              onClick: () => {
                navigate(`/event-outcomes/${currentRound}/2`);
              }
            }
          ]
        };

      case 'event-2-impacts':
        return {
          buttons: [
            { 
              label: PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE, 
              onClick: () => {
                navigate('/bu1');
              },
              isDecisionNav: true
            },
            { 
              label: PAGE_CONTENT.DECISION_SCREENS.PRODUCT.TITLE, 
              onClick: () => {
                navigate('/bu2');
              },
              isDecisionNav: true
            },
            { 
              label: PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY.TITLE, 
              onClick: () => {
                navigate('/corporate');
              },
              isDecisionNav: true
            },
            { 
              label: 'Submit Decisions', 
              onClick: () => {
                if (!canSubmitDecisions) {
                  setValidationMessage(getValidationMessage());
                  setShowValidationDialog(true);
                } else {
                  setShowSubmitDialog(true);
                }
              },
              variant: 'destructive' as const,
              isSubmit: true
            }
          ]
        };

      case 'investments':
        return {
          buttons: [
            { 
              label: PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE, 
              onClick: () => {
                navigate('/bu1');
              },
              isDecisionNav: true
            },
            { 
              label: PAGE_CONTENT.DECISION_SCREENS.PRODUCT.TITLE, 
              onClick: () => {
                navigate('/bu2');
              },
              isDecisionNav: true
            },
            { 
              label: PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY.TITLE, 
              onClick: () => {
                navigate('/corporate');
              },
              isDecisionNav: true
            },
            { 
              label: 'Submit Decisions', 
              onClick: () => {
                if (!canSubmitDecisions) {
                  setValidationMessage(getValidationMessage());
                  setShowValidationDialog(true);
                } else {
                  setShowSubmitDialog(true);
                }
              },
              variant: 'destructive' as const,
              isSubmit: true
            }
          ]
        };

      case 'results':
        return {
          buttons: [
            { 
              label: 'Continue to Event 3', 
              onClick: () => {
                navigate(`/events/${currentRound}/3`);
              }
            }
          ]
        };

      case 'event-3':
        return {
          buttons: [
            { 
              label: 'View Event 3 Impacts', 
              onClick: () => {
                navigate(`/event-outcomes/${currentRound}/3`);
              }
            }
          ]
        };

      case 'event-3-impacts':
        return {
          buttons: [
            { 
              label: 'Continue to Event 4', 
              onClick: () => {
                navigate(`/events/${currentRound}/4`);
              }
            }
          ]
        };

      case 'event-4':
        return {
          buttons: [
            { 
              label: 'View Event 4 Impacts', 
              onClick: () => {
                navigate(`/event-outcomes/${currentRound}/4`);
              }
            }
          ]
        };

      case 'event-4-impacts':
        return {
          buttons: [
            { 
              label: 'View Final Results', 
              onClick: () => {
                navigate('/debrief-pbnh');
              }
            }
          ]
        };

      case 'final-results':
        return {
          buttons: [
            { 
              label: 'Show Final Results', 
              onClick: () => {
                navigate('/debrief-pbnh');
              }
            }
          ]
        };

      default:
        return { buttons: [] };
    }
  };

  const { buttons } = getNavigationConfig();

  // Check capacity status - read directly from CalcModel
  const checkCapacity = () => {
    // Get capacity remaining from CalcModel (already calculated by the model)
    const capacityRangeName = currentRound === 2 
      ? KPI_RANGE_NAMES_R2.CAPACITY_REMAINING 
      : KPI_RANGE_NAMES_R1.CAPACITY_REMAINING;
    
    const remainingCapacityStr = getValue(capacityRangeName);
    const remainingCapacity = remainingCapacityStr ? parseFloat(remainingCapacityStr) : 0;
    
    return remainingCapacity >= 0;
  };

  // Check that all investment decisions have been made
  // Note: Only checks decisions that are actually displayed to the user
  // Hidden decisions (like PROD_FORMAUTO, GTM decisions) are excluded from validation
  const allDecisionsMade = () => {
    // ⚠️ GTM decisions removed from UI - no longer validated
    
    // Product decisions (excluding PROD_FORMAUTO which is hidden)
    const productDecisions = [
      investmentRanges.PROD_PATNOTIF,
      investmentRanges.PROD_PHARMFUNC,
      investmentRanges.PROD_PROVFUNC,
      // investmentRanges.PROD_FORMAUTO, // REMOVED - Decision 7 no longer in UI
    ];
    
    // Technology decisions
    const technologyDecisions = [
      investmentRanges.TECH_PREDINT,
      investmentRanges.TECH_PLATUNIF,
      investmentRanges.TECH_PERFREL,
      investmentRanges.TECH_DEVPROD,
    ];
    
    // Operations decisions
    const operationsDecisions = [
      investmentRanges.OPS_NWKOPS,
      investmentRanges.OPS_DATAANALY,
    ];
    
    const allDecisionRanges = [
      ...productDecisions,
      ...technologyDecisions,
      ...operationsDecisions,
    ];
    
    // Check that all decisions have values (not null, undefined, or empty)
    return allDecisionRanges.every(rangeName => {
      const value = getValue(rangeName);
      return value !== null && value !== undefined && value !== '' && value !== '0';
    });
  };
                           
  const canSubmit = allDecisionsMade();
  const hasPositiveCapacity = checkCapacity();
  
  // Combined validation check
  const canSubmitDecisions = canSubmit && hasPositiveCapacity;
  
  // Get validation message when submission is blocked
  const getValidationMessage = () => {
    const decisionsComplete = canSubmit;
    const capacityValid = hasPositiveCapacity;
    
    if (!decisionsComplete && !capacityValid) {
      return VALIDATION.SUBMIT_BLOCKED.BOTH_ISSUES;
    } else if (!decisionsComplete) {
      return VALIDATION.SUBMIT_BLOCKED.INCOMPLETE_DECISIONS;
    } else if (!capacityValid) {
      return VALIDATION.SUBMIT_BLOCKED.NEGATIVE_CAPACITY;
    }
    return '';
  };

  const handleSubmitConfirm = () => {
    // Mark screen 8 as visited when user submits decisions (Finalize Investments)
    markScreenAsVisited('SCREEN_8', setValue, getValue);
    navigate('/dashboard');
    setShowSubmitDialog(false);
  };

  if (buttons.length === 0) return null;

  return (
    <>
      <div className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40 mt-auto">
        <div className="w-full max-w-none px-8 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 py-6 bg-orange-500/5">
          <div className="flex gap-6 justify-center">
            {buttons.map((button, index) => {
              // Only grey out buttons explicitly marked as decision navigation buttons
              const shouldGreyOutDecision = button.isDecisionNav && canSubmitDecisions;
              
              // Determine the variant to use
              const buttonVariant = shouldGreyOutDecision 
                ? "grey" 
                : (button.variant || "secondary-gradient");
              
              return (
                <Button
                  key={index}
                  onClick={button.onClick}
                  variant={buttonVariant}
              className={`px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
                button.isSubmit 
                  ? canSubmitDecisions 
                    ? 'shadow-lg shadow-secondary/30 hover:shadow-xl hover:scale-105' 
                    : 'opacity-50 cursor-pointer grayscale'
                  : ''
              }`}
                >
                  {button.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit All Decisions?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit all your investment decisions? Once submitted, you cannot go back to make changes for this round.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSubmitConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Submit Decisions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Validation Error Dialog */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              {VALIDATION.SUBMIT_BLOCKED.TITLE}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base whitespace-pre-line">
              {validationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowValidationDialog(false)}
              className="bg-primary hover:bg-primary/90"
            >
              {VALIDATION.SUBMIT_BLOCKED.BUTTON}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}