import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NavigationControls } from '@/components/layout/NavigationControls';
import { useNavigate } from 'react-router-dom';
import { PAGE_CONTENT, markScreenAsVisited, DECISIONS } from '@/Sim/Content';
import { useCalc } from '@/contexts/CalcContext';
import { DecisionPageImage } from '@/components/ui/DecisionPageImage';
import networkEngagementImage from '@/assets/network-engagement-decision.jpg';
import { DecisionTemplateNoExpense, type DecisionItem } from '@/components/templates';
import { INVESTMENT_RANGE_NAMES_R1, INVESTMENT_RANGE_NAMES_R2, TECHNOLOGY_OPTION_DATA_RANGE_NAMES, TECHNOLOGY_OPTION_DATA_RANGE_NAMES_R2, DASH_CUM_RANGE_NAMES_R1, DASH_CUM_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';


export default function DecisionCorporatePage() {
  const navigate = useNavigate();
  const { setValue, getValue } = useCalc();

  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate range object based on current round
  const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;
  const optionDataRanges = currentRound === 2 ? TECHNOLOGY_OPTION_DATA_RANGE_NAMES_R2 : TECHNOLOGY_OPTION_DATA_RANGE_NAMES;
  const cumRanges = currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2 : DASH_CUM_RANGE_NAMES_R1;

  // Technology Decision Configuration - using round-specific ranges
  const technologyDecisionsConfig = {
    decisions: [
      {
        id: 'decision-8',
        title: DECISIONS.LABELS.DECISION_8,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_8,
        refName: investmentRanges.TECH_PREDINT,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.TECH_PREDINT_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.TECH_PREDINT_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.PREDINT_LOW_UNITS,
            costRef: optionDataRanges.PREDINT_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.PREDINT_MED_UNITS,
            costRef: optionDataRanges.PREDINT_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.PREDINT_HIGH_UNITS,
            costRef: optionDataRanges.PREDINT_HIGH_COST,
          },
        ],
      },
      {
        id: 'decision-9',
        title: DECISIONS.LABELS.DECISION_9,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_9,
        refName: investmentRanges.TECH_PLATUNIF,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.TECH_PLATUNIF_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.TECH_PLATUNIF_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.PLATUNIF_LOW_UNITS,
            costRef: optionDataRanges.PLATUNIF_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.PLATUNIF_MED_UNITS,
            costRef: optionDataRanges.PLATUNIF_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.PLATUNIF_HIGH_UNITS,
            costRef: optionDataRanges.PLATUNIF_HIGH_COST,
          },
        ],
      },
      {
        id: 'decision-10',
        title: DECISIONS.LABELS.DECISION_10,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_10,
        refName: investmentRanges.TECH_PERFREL,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.TECH_PERFREL_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.TECH_PERFREL_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.PERFREL_LOW_UNITS,
            costRef: optionDataRanges.PERFREL_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.PERFREL_MED_UNITS,
            costRef: optionDataRanges.PERFREL_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.PERFREL_HIGH_UNITS,
            costRef: optionDataRanges.PERFREL_HIGH_COST,
          },
        ],
      },
      {
        id: 'decision-11',
        title: DECISIONS.LABELS.DECISION_11,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_11,
        refName: investmentRanges.TECH_DEVPROD,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.TECH_DEVPROD_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.TECH_DEVPROD_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.DEVPROD_LOW_UNITS,
            costRef: optionDataRanges.DEVPROD_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.DEVPROD_MED_UNITS,
            costRef: optionDataRanges.DEVPROD_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.DEVPROD_HIGH_UNITS,
            costRef: optionDataRanges.DEVPROD_HIGH_COST,
          },
        ],
      },
    ],
  } as const;

  const handleNavigateNext = () => {
    // Mark screen 8 as visited when finalizing investments (completing all decisions)
    markScreenAsVisited('SCREEN_8', setValue, getValue);
    navigate('/bu1');
  };

  const handleNavigateBack = () => {
    navigate('/bu2');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY?.TITLE || 'Technology Decisions'}
          </h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY?.DESCRIPTION || 'Make investment decisions for your technology initiatives.'}
          </p>
        </div>

        {/* Decision Template */}
        <DecisionTemplateNoExpense 
          decisions={technologyDecisionsConfig.decisions as readonly DecisionItem[]}
          className="grid grid-cols-2 gap-6 mb-8"
        />

        {/* Capacity Bar Chart */}
        <DecisionPageImage 
          imageSrc={networkEngagementImage} 
          alt="Technology Strategy" 
          className="mt-8 max-h-[200px]" 
          objectPosition="center top"
        />

        <NavigationControls 
          centerDashboard={true} 
        />
      </div>
    </AppLayout>
  );
}