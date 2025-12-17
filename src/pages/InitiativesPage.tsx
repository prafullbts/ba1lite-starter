import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { useCalc } from '@/contexts/CalcContext';
import { useNavigate } from 'react-router-dom';
import { INITIATIVES, PAGE_CONTENT, UI_TEXT, getInitiativesForRound, UI_CONSTRAINTS, markScreenAsVisited } from '@/Sim/Content';
import { DECISION_RANGE_NAMES, ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';

export default function InitiativesPage() {
  const { setValue, getValue } = useCalc();
  const navigate = useNavigate();
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [viewedInitiative, setViewedInitiative] = useState<string | null>(null);

  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');

  // Get initiatives for current round (limited to 10)
  const roundInitiatives = getInitiativesForRound(currentRound);
  const categories = ['All', ...INITIATIVES.CATEGORIES];
  const filteredInitiatives = (filterCategory === 'All' 
    ? roundInitiatives 
    : roundInitiatives.filter(i => i.category === filterCategory)).slice(0, 10);

  // Get available initiative range names for the current round
  const getAvailableRangeNames = (round: number) => {
    if (round === 1) {
      return [DECISION_RANGE_NAMES.INITIATIVE_1_ROUND_1, DECISION_RANGE_NAMES.INITIATIVE_2_ROUND_1];
    } else if (round === 2) {
      return [DECISION_RANGE_NAMES.INITIATIVE_1_ROUND_2, DECISION_RANGE_NAMES.INITIATIVE_2_ROUND_2];
    }
    return [];
  };

  // Find which range slot contains a specific ModelValue
  const findRangeForModelValue = (modelValue: string, round: number) => {
    const rangeNames = getAvailableRangeNames(round);
    for (const rangeName of rangeNames) {
      const value = getValue(rangeName, true);
      if (value === modelValue) {
        return rangeName;
      }
    }
    return null;
  };

  // Find the next available range slot
  const findNextAvailableRange = (round: number) => {
    const rangeNames = getAvailableRangeNames(round);
    for (const rangeName of rangeNames) {
      const value = getValue(rangeName, true);
      if (!value || value === '0' || value === '') {
        return rangeName;
      }
    }
    return null; // No available slots
  };

  // Load current selections from calc model on mount
  useEffect(() => {
    const currentSelections: string[] = [];
    const initiatives = getInitiativesForRound(currentRound);
    
    initiatives.forEach((initiative) => {
      // Check if this initiative's ModelValue is stored in any range slot
      const rangeName = findRangeForModelValue(initiative.modelValue, currentRound);
      if (rangeName) {
        currentSelections.push(initiative.id);
      }
    });
    
    setSelectedInitiatives(currentSelections);
  }, [currentRound]);

  // Category color mapping
  const categoryColors: { [key: string]: { bg: string; text: string; border: string } } = {
    'Network Engagement': { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500' },
    'Product & Technology': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500' },
    'People & Operations': { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500' },
  };

  const handleInitiativeToggle = (initiativeId: string) => {
    if (selectedInitiatives.includes(initiativeId)) {
      // Always allow deselection
      const newSelection = selectedInitiatives.filter(id => id !== initiativeId);
      setSelectedInitiatives(newSelection);
      // If deselecting the viewed initiative, switch to another one
      if (viewedInitiative === initiativeId) {
        setViewedInitiative(newSelection.length > 0 ? newSelection[0] : null);
      }
    } else if (selectedInitiatives.length < UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS) {
      // Only allow selection if under the limit
      const newSelection = [...selectedInitiatives, initiativeId];
      setSelectedInitiatives(newSelection);
      // Set the newly selected initiative as viewed
      setViewedInitiative(initiativeId);
    }
    // CalcModel is NOT updated here - only on submit
  };

  const handleSubmit = () => {
    // Update calc model with final selections using ModelValue
    // Clear all initiative ranges first
    const rangeNames = getAvailableRangeNames(currentRound);
    rangeNames.forEach(rangeName => {
      setValue(rangeName, '');
    });
    
    // Set selected initiatives in calc model using sequential slots
    selectedInitiatives.forEach((initiativeId, index) => {
      const initiative = roundInitiatives.find(i => i.id === initiativeId);
      if (initiative && rangeNames[index]) {
        setValue(rangeNames[index], initiative.modelValue);
      }
    });
    
    // Mark screen 3 as visited after submitting initiatives
    markScreenAsVisited('SCREEN_3', setValue, getValue);
    // Navigate to next page
    navigate('/initiative-impacts');
  };

  

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.INITIATIVES.PAGE_TITLE} - Round {currentRound}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {PAGE_CONTENT.INITIATIVES.PAGE_DESCRIPTION}
            </p>
            <div className="text-base text-muted-foreground">
              Selected: {selectedInitiatives.length} of {UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((category) => {
            const colors = categoryColors[category];
            const isActive = filterCategory === category;
            
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
                className={`transition-all ${
                  isActive && category !== 'All' && colors
                    ? `${colors.bg} ${colors.text} ${colors.border} border-2 hover:opacity-80`
                    : ''
                }`}
              >
                {category}
              </Button>
            );
          })}
        </div>

        {/* Two-column layout: 3/5 initiatives list + 2/5 detail pane */}
        <div className="grid grid-cols-[3fr_2fr] gap-6 mb-8">
          {/* Left column: Initiatives list */}
          <div className="space-y-3">
            {filteredInitiatives.map((initiative) => {
              const isSelected = selectedInitiatives.includes(initiative.id);
              const isDisabled = !isSelected && selectedInitiatives.length >= UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS;
              const colors = categoryColors[initiative.category];
              
              return (
                <Card 
                  key={initiative.id} 
                  className={`transition-all duration-300 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 cursor-pointer' 
                      : isDisabled
                        ? 'opacity-50 grayscale cursor-not-allowed border-muted/30 bg-muted/10'
                        : 'hover:shadow-md cursor-pointer border-border bg-card'
                  }`}
                  onClick={() => {
                    // Only show details, don't select
                    setViewedInitiative(initiative.id);
                  }}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (!isDisabled) {
                            handleInitiativeToggle(initiative.id);
                          }
                        }}
                        disabled={isDisabled}
                        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
                      />
                      <div className="flex-1 flex items-center justify-between gap-3">
                        <span className={`text-base font-semibold ${isDisabled ? 'text-muted-foreground/70' : ''}`}>
                          {initiative.title}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            isDisabled 
                              ? 'bg-muted/50 text-muted-foreground/50' 
                              : colors 
                                ? `${colors.bg} ${colors.text}` 
                                : 'bg-primary/10 text-primary'
                          }`}>
                            {initiative.category}
                          </div>
                          {initiative.capacity > 0 && (
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              isDisabled 
                                ? 'bg-muted/50 text-muted-foreground/50' 
                                : 'bg-foreground text-background'
                            }`}>
                              {initiative.capacity} Capacity
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Right column: Detail pane showing one initiative */}
          <div className="sticky top-6 h-fit">
            <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl">
              <CardContent className="space-y-4 pt-6">
                {viewedInitiative ? (
                  (() => {
                    const initiative = filteredInitiatives.find(i => i.id === viewedInitiative) || 
                                     roundInitiatives.find(i => i.id === viewedInitiative);
                    if (!initiative) return null;
                    const colors = categoryColors[initiative.category];
                    const impacts = initiative.impact || [];
                    
                    return (
                      <div>
                        <h3 className="font-bold text-xl mb-3">{initiative.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{initiative.description}</p>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            colors ? `${colors.bg} ${colors.text}` : 'bg-primary/10 text-primary'
                          }`}>
                            {initiative.category}
                          </div>
                          {initiative.capacity > 0 && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-foreground text-background">
                              {initiative.capacity} Capacity
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select an initiative to view details
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit button */}
            <div className="mt-6 space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={
                  selectedInitiatives.length !== UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS ||
                  !viewedInitiative ||
                  !selectedInitiatives.includes(viewedInitiative)
                }
                variant="secondary-gradient"
                className="w-full px-6 py-4 rounded-full text-lg font-semibold"
              >
                {selectedInitiatives.length === UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS 
                  ? UI_TEXT.BUTTONS.SUBMIT_SELECTED_INITIATIVES 
                  : `Select ${UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS - selectedInitiatives.length} More Initiative${UI_CONSTRAINTS.MAX_INITIATIVE_SELECTIONS - selectedInitiatives.length !== 1 ? 's' : ''}`
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}