import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { InfoTooltip } from '@/components/InfoTooltip';
import { useCalc } from '@/contexts/CalcContext';
import { hideAllArrows } from '@/components/calc/CalcValueChanges';
import { cn } from '@/lib/utils';

export interface DecisionOption {
  /** The value stored in CalcModel for this option */
  value: string;
  /** Display text for this option */
  label: string;
  /** Range name for getting units/cost from CalcModel */
  unitsRef?: string;
  /** Range name for getting cost from CalcModel */
  costRef?: string;
}

export interface DecisionItem {
  /** Unique identifier for this decision */
  id: string;
  /** Title/title key for this decision */
  title: string;
  /** Tooltip key for this decision */
  tooltipKey: string;
  /** CalcModel range name for storing the selected value */
  refName: string;
  /** Available options for this decision */
  options: readonly DecisionOption[];
  /** Whether this decision is disabled */
  disabled?: boolean;
}

export interface DecisionTemplateProps {
  /** Array of decision items to render */
  decisions: readonly DecisionItem[];
  /** Custom CSS class name */
  className?: string;
  /** Whether the entire template is disabled */
  disabled?: boolean;
  /** Callback when any decision changes */
  onChange?: (decisionId: string, value: string) => void;
}

export const DecisionTemplate: React.FC<DecisionTemplateProps> = ({
  decisions,
  className = '',
  disabled = false,
  onChange
}) => {
  const { getValue, setValue, calcService } = useCalc();
  
  // State for tracking selected values
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  
  // State for tracking option data (units, costs)
  const [optionData, setOptionData] = useState<Record<string, Record<string, { units?: number; cost?: number }>>>({});

  // Convert display value to numeric value for CalcModel
  const convertToNumericValue = useCallback((value: string): string => {
    switch (value) {
      case 'low': return '1';
      case 'medium': return '2';
      case 'high': return '3';
      default: return value; // Return as-is if not a standard level
    }
  }, []);

  // Convert numeric value to display value
  const convertToDisplayValue = useCallback((value: string): string => {
    switch (value) {
      case '1': return 'low';
      case '2': return 'medium';
      case '3': return 'high';
      default: return value; // Return as-is if not a standard numeric value
    }
  }, []);

  // Load initial values from CalcModel
  const loadInitialValues = useCallback(() => {
    const initialValues: Record<string, string> = {};
    const initialOptionData: Record<string, Record<string, { units?: number; cost?: number }>> = {};

    (decisions as readonly DecisionItem[]).forEach(decision => {
      try {
        // Get selected value from CalcModel
        const selectedValue = getValue(decision.refName, true);
        if (selectedValue !== null && selectedValue !== undefined) {
          // Convert numeric value from CalcModel to display value
          const displayValue = convertToDisplayValue(String(selectedValue));
          initialValues[decision.id] = displayValue;
        }

        // Get option data (units, costs) from CalcModel
        const decisionOptionData: Record<string, { units?: number; cost?: number }> = {};
        
        decision.options.forEach(option => {
          const optionData: { units?: number; cost?: number } = {};
          
          if (option.unitsRef) {
            try {
              const units = getValue(option.unitsRef, true);
              optionData.units = units ? Number(units) : undefined;
            } catch (error) {
              console.error(`Error getting units for ${option.unitsRef}:`, error);
            }
          }
          
          if (option.costRef) {
            try {
              const cost = getValue(option.costRef, true);
              optionData.cost = cost ? Number(cost) : undefined;
            } catch (error) {
              console.error(`Error getting cost for ${option.costRef}:`, error);
            }
          }
          
          decisionOptionData[option.value] = optionData;
        });
        
        initialOptionData[decision.id] = decisionOptionData;
      } catch (error) {
        console.error(`Error loading initial values for decision ${decision.id}:`, error);
      }
    });

    setSelectedValues(initialValues);
    setOptionData(initialOptionData);
  }, [decisions, getValue, convertToDisplayValue]);

  // Handle decision change
  const handleDecisionChange = useCallback(async (decisionId: string, value: string) => {
    if (disabled) return;

    // Convert display value to numeric value for storage
    const numericValue = convertToNumericValue(value);

    // Update local state with display value
    setSelectedValues(prev => ({
      ...prev,
      [decisionId]: value
    }));

    // Find the decision to get its refName
    const decision = (decisions as readonly DecisionItem[]).find(d => d.id === decisionId);
    if (!decision) {
      console.error(`Decision not found: ${decisionId}`);
      return;
    }

    try {
      // Hide all arrows before setting new value
      hideAllArrows(calcService);
      
      // Save numeric value to CalcModel
      await setValue(decision.refName, numericValue, 'DecisionTemplate');
      console.log(`Saved decision ${decisionId} to calc model:`, { refName: decision.refName, displayValue: value, numericValue });

      // Call onChange callback if provided (with display value)
      if (onChange) {
        onChange(decisionId, value);
      }
    } catch (error) {
      console.error(`Error saving decision ${decisionId} to calc model:`, error);
    }
  }, [decisions, disabled, setValue, onChange, convertToNumericValue, calcService]);

  // Load initial values on mount and when decisions change
  useEffect(() => {
    loadInitialValues();
  }, [loadInitialValues]);

  // Listen for model changes (you might want to implement a more sophisticated subscription system)
  useEffect(() => {
    const interval = setInterval(() => {
      loadInitialValues();
    }, 1000); // Check for changes every second

    return () => clearInterval(interval);
  }, [loadInitialValues]);

  return (
    <div className={cn("grid gap-6", className)}>
      {decisions.map((decision) => {
        const isDecisionDisabled = disabled || decision.disabled;
        const selectedValue = selectedValues[decision.id];
        const decisionOptionData = optionData[decision.id] || {};

        return (
          <Card 
            key={decision.id} 
            className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 hover:shadow-accent-1/30 transition-all duration-300"
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <InfoTooltip 
                  content={decision.tooltipKey}
                  position="bottom"
                />
                {decision.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup
                  value={selectedValue || ''}
                  onValueChange={(value) => handleDecisionChange(decision.id, value)}
                  disabled={isDecisionDisabled}
                  className="flex justify-between gap-4"
                >
                  {decision.options.map((option, index) => {
                    const optionData = decisionOptionData[option.value] || {};
                    const isOptionDisabled = isDecisionDisabled;
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`${decision.id}-${option.value}`}
                            disabled={isOptionDisabled}
                          />
                          <Label 
                            htmlFor={`${decision.id}-${option.value}`} 
                            className={cn(
                              "text-sm font-medium cursor-pointer",
                              isOptionDisabled && "cursor-not-allowed opacity-50"
                            )}
                          >
                            {option.label}
                          </Label>
                        </div>
                        
                        {/* Display units if available */}
                        {optionData.units !== undefined && (
                          <span className="text-xs text-muted-foreground/70">
                            {optionData.units} Capacity
                          </span>
                        )}
                        
                        {/* Display cost if available */}
                        {optionData.cost !== undefined && (
                          <span className="text-xs text-muted-foreground/70">
                            ${(optionData.cost / 1000000).toFixed(1)}M
                          </span>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DecisionTemplate;
