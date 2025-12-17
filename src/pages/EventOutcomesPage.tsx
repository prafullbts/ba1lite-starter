import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimulationStep } from '@/Sim/FlowConfig';
import { useCalc } from '@/contexts/CalcContext';
import { useNavigate, useParams } from 'react-router-dom';
import { EVENTS, PAGE_CONTENT, UI_TEXT, getEventsForRound, getEventOutcome, getEventByRoundAndNumber, getEventDecisionFromCalcModel, getEventRangeName, markScreenAsVisited, isConditionalOutcomeEvent } from '@/Sim/Content';
import { ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';

export default function EventOutcomesPage() {
  const { round, eventNumber } = useParams<{ round: string; eventNumber: string }>();
  const { getValue, setValue } = useCalc();
  const navigate = useNavigate();
  
  // Get current event based on URL parameters with fallback
  const currentRound = round ? parseInt(round) : parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  const eventNum = eventNumber ? parseInt(eventNumber) : 1;
  const CURRENT_EVENT = getEventByRoundAndNumber(currentRound, eventNum);
  const isConditionalEvent = isConditionalOutcomeEvent(currentRound, eventNum);
  
  // Handle case where event doesn't exist
  if (!CURRENT_EVENT) {
    return (
      <AppLayout title="Event Not Found">
        <div className="text-center">
          <p>Event outcomes not found. Please check the event number.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  // Get selected option from calc model
  const selectedOptionLetter = getEventDecisionFromCalcModel(currentRound, eventNum, getValue);
  const [activeTab, setActiveTab] = useState(selectedOptionLetter && selectedOptionLetter !== '0' ? selectedOptionLetter : 'A');

  // Update active tab when calc model value changes
  useEffect(() => {
    const newDecision = getEventDecisionFromCalcModel(currentRound, eventNum, getValue);
    if (newDecision && newDecision !== '0') {
      setActiveTab(newDecision);
    } else {
      // If no decision made yet, default to first option
      setActiveTab('A');
    }
  }, [currentRound, eventNum, getValue]);

  // Check if a decision has been made
  const hasDecision = selectedOptionLetter && selectedOptionLetter !== '0';

  // Debug logging
  console.log('EventOutcomesPage debug:', {
    round: currentRound,
    eventNumber: eventNum,
    selectedOptionLetter: selectedOptionLetter,
    hasDecision: hasDecision
  });
  
  // Debug: Check what the calc model actually contains
  const rangeName = getEventRangeName(currentRound, eventNum);
  const rawValue = getValue(rangeName);
  console.log('Raw calc model value:', {
    rangeName: rangeName,
    rawValue: rawValue
  });
  
  console.log('Available options:', CURRENT_EVENT.options.map((opt, index) => ({ 
    id: opt.id, 
    title: opt.title, 
    letter: String.fromCharCode(65 + index) 
  })));

  const handleReturnToDashboard = () => {
    // Mark the appropriate screen as visited based on event number
    switch (eventNum) {
      case 1:
        markScreenAsVisited('SCREEN_5', setValue, getValue); // Event 1
        break;
      case 2:
        markScreenAsVisited('SCREEN_6', setValue, getValue); // Event 2
        break;
      case 3:
        markScreenAsVisited('SCREEN_9', setValue, getValue); // Event 3
        break;
      case 4:
        markScreenAsVisited('SCREEN_10', setValue, getValue); // Event 4
        break;
    }
    
    // Determine the next step based on the current event number
    let nextStep: SimulationStep;
    
    // All rounds: events 1-4 → corresponding event impact steps
    switch (eventNum) {
      case 1:
        nextStep = 'event-1-impacts';
        break;
      case 2:
        nextStep = 'event-2-impacts';
        break;
      case 3:
        nextStep = 'event-3-impacts';
        break;
      case 4:
        nextStep = 'event-4-impacts';
        break;
      default:
        nextStep = 'dashboard';
    }
    
    // Note: Step is calculated from screen tracking flags in FlowNavigation
    // No need to manually update step here
    navigate('/dashboard');
  };

  return (
    <AppLayout title={PAGE_CONTENT.EVENTS.OUTCOMES_TITLE}>
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="flex">
          <Card className="flex-1 flex flex-col bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardHeader>
              <CardTitle>{CURRENT_EVENT.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {CURRENT_EVENT.scenario}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex">
          <Card className="flex-1 flex flex-col bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-primary/20 overflow-hidden hover:shadow-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle>
                {isConditionalEvent 
                  ? PAGE_CONTENT.EVENTS.CONDITIONAL_OUTCOMES_HEADER 
                  : PAGE_CONTENT.EVENTS.OUTCOMES_HEADER}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {!hasDecision && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> No decision has been made for this event yet. You can view all possible outcomes below.
                  </p>
                </div>
              )}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${CURRENT_EVENT.options.length}, 1fr)` }}>
                  {CURRENT_EVENT.options.map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, etc.
                    const isSelected = optionLetter === selectedOptionLetter;
                    const labelType = isConditionalEvent ? 'Outcome' : 'Option';
                    const optionLabel = `${labelType} ${optionLetter}`;
                    const selectedPrefix = isConditionalEvent ? 'You faced' : 'You selected';
                    return (
                      <TabsTrigger 
                        key={option.id} 
                        value={optionLetter}
                        className={`transition-all ${
                          isSelected 
                            ? 'data-[state=active]:bg-primary/20 data-[state=active]:text-primary' 
                            : ''
                        }`}
                      >
                        {isSelected ? `${selectedPrefix} - ${optionLabel}` : optionLabel}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {CURRENT_EVENT.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, etc.
                  
                  // Get round-specific outcome if available, otherwise use default
                  const eventOutcome = getEventOutcome(CURRENT_EVENT.id, option.id, currentRound);
                  const finalOutcome = eventOutcome?.outcome || option.outcome;
                  const finalImpact = eventOutcome?.impact || option.impact;
                  
                  return (
                    <TabsContent key={option.id} value={optionLetter} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{option.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                      
                      {/* Only show Feedback section for non-conditional events */}
                      {!isConditionalEvent && (
                        <div>
                          <h4 className="font-semibold mb-3 text-base">Feedback</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {finalOutcome}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-base">Impact:</h4>
                        <p className="text-foreground whitespace-pre-wrap">
                          {finalImpact}
                        </p>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleReturnToDashboard}
          variant="secondary-gradient"
          className="px-10 py-4 rounded-full text-lg font-semibold"
        >
          {UI_TEXT.BUTTONS.RETURN_TO_DASHBOARD}
        </Button>
      </div>
    </AppLayout>
  );
}