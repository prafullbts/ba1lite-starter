import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { useCalc } from '@/contexts/CalcContext';
import { useNavigate, useParams } from 'react-router-dom';
import { EVENTS, PAGE_CONTENT, UI_TEXT, getEventsForRound, getEventByRoundAndNumber, getEventRangeName, getEventDecisionFromCalcModel, isConditionalOutcomeEvent } from '@/Sim/Content';
import { ROUND_MANAGEMENT_RANGE_NAMES, DASH_CUM_RANGE_NAMES_R1, DASH_CUM_RANGE_NAMES_R2 } from '@/Sim/RangeNameMap';
export default function EventsPage() {
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
          <p>Event not found. Please check the event number.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  // Get current decision from calc model
  const currentDecision = getEventDecisionFromCalcModel(currentRound, eventNum, getValue);
  const [selectedOption, setSelectedOption] = useState<string>(currentDecision);
  const [disabledOptions, setDisabledOptions] = useState<Set<string>>(new Set());
  
  // Update selected option when calc model value changes
  useEffect(() => {
    const newDecision = getEventDecisionFromCalcModel(currentRound, eventNum, getValue);
    setSelectedOption(newDecision);
  }, [currentRound, eventNum, getValue]);

  // Evaluate contingency logic for conditional events
  useEffect(() => {
    // If no contingent logic, clear any disabled options from previous events
    if (!CURRENT_EVENT?.contingent) {
      setDisabledOptions(new Set());
      return;
    }
    
    const { thresholdRangeName, thresholdValue, thresholdOperator, optionIfMet, optionIfNotMet, autoSelect } = CURRENT_EVENT.contingent;
    
    const currentValue = parseFloat(getValue(thresholdRangeName) || '0');
    let thresholdMet = false;
    
    // Evaluate threshold
    switch (thresholdOperator) {
      case '>=': thresholdMet = currentValue >= thresholdValue; break;
      case '>': thresholdMet = currentValue > thresholdValue; break;
      case '<=': thresholdMet = currentValue <= thresholdValue; break;
      case '<': thresholdMet = currentValue < thresholdValue; break;
      case '==': thresholdMet = currentValue === thresholdValue; break;
    }
    
    const selectedLetter = thresholdMet ? optionIfMet : optionIfNotMet;
    const disabledLetter = thresholdMet ? optionIfNotMet : optionIfMet;
    
    // Auto-select the appropriate option
    if (autoSelect) {
      setSelectedOption(selectedLetter);
    }
    
    // Disable the other option
    setDisabledOptions(new Set([disabledLetter]));
    
    console.log('Contingent event evaluated:', {
      event: CURRENT_EVENT.title,
      thresholdValue: currentValue,
      thresholdMet,
      selectedLetter,
      disabledLetter
    });
  }, [currentRound, eventNum, CURRENT_EVENT?.contingent, getValue]);
  const handleSave = async () => {
    if (selectedOption && selectedOption !== '0') {
      try {
        // Get the range name for this event
        const rangeName = getEventRangeName(currentRound, eventNum);
        
        console.log('Saving event decision to calc model:', { 
          round: currentRound, 
          eventNumber: eventNum, 
          decision: selectedOption, 
          rangeName 
        });
        
        // Set letter value directly in calc model (A, B, C, D, etc.)
        await setValue(rangeName, selectedOption, 'EventsPage');
        
        console.log('Event decision saved to calc model, navigating to outcomes');
        // Navigate to event outcomes using React Router with round and event number
        navigate(`/event-outcomes/${currentRound}/${eventNumber || '1'}`);
      } catch (error) {
        console.error('Error saving event decision:', error);
      }
    }
  };
  return (
    <AppLayout title={PAGE_CONTENT.EVENTS.PAGE_TITLE}>
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="flex">
          <Card className="flex-1 flex flex-col bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300">
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
                
                {CURRENT_EVENT.financials && (
                  <div className="mt-6 p-4 bg-primary/10 border-l-4 border-primary rounded">
                    {CURRENT_EVENT.financials.map((item, i) => (
                      <div key={i} className="flex justify-between py-1.5">
                        <span className="font-medium text-foreground">{item.label}:</span>
                        <span className="text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex">
          <Card className="flex-1 flex flex-col bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-primary/20 overflow-hidden hover:shadow-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle>
                {isConditionalEvent 
                  ? PAGE_CONTENT.EVENTS.CONDITIONAL_RESPONSE_HEADER 
                  : PAGE_CONTENT.EVENTS.RESPONSE_HEADER}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-4">
                  {CURRENT_EVENT.options.map((option, index) => {
                    const letterValue = String.fromCharCode(65 + index); // A, B, C, D, E, etc. (dynamic)
                    const isDisabled = disabledOptions.has(letterValue);
                    
                    return (
                      <Card 
                        key={option.id} 
                        className={`transition-all bg-card/95 backdrop-blur-sm border ${
                          isDisabled 
                            ? 'opacity-50 cursor-not-allowed border-muted' 
                            : `cursor-pointer border-white/10 shadow-lg shadow-accent-1/20 hover:shadow-accent-1/30 ${
                                selectedOption === letterValue ? 'border-primary bg-primary/5' : 'hover:shadow-md'
                              }`
                        }`}
                        onClick={() => !isDisabled && setSelectedOption(letterValue)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem 
                              value={letterValue} 
                              id={option.id} 
                              disabled={isDisabled}
                              className="pointer-events-none" 
                            />
                            <div className="flex-1">
                              <Label 
                                htmlFor={option.id} 
                                className={`font-semibold text-lg block pointer-events-none ${
                                  isDisabled ? 'text-muted-foreground' : 'cursor-pointer'
                                }`}
                              >
                                {isConditionalEvent ? 'Outcome' : 'Option'} {letterValue}: {option.title}
                              </Label>
                              <p className={`text-base mt-2 ${
                                isDisabled ? 'text-muted-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={!selectedOption || selectedOption === '0'}
          variant="secondary-gradient"
          className="px-10 py-4 rounded-full text-lg font-semibold"
        >
          {UI_TEXT.BUTTONS.SUBMIT}
        </Button>
      </div>
    </AppLayout>
  );
}