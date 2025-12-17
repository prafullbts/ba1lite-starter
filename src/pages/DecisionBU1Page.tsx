import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NavigationControls } from '@/components/layout/NavigationControls';
import { useNavigate } from 'react-router-dom';
import { PAGE_CONTENT, markScreenAsVisited, DECISIONS } from '@/Sim/Content';
import { DecisionPageImage } from '@/components/ui/DecisionPageImage';
import networkEngagementImage from '@/assets/network-engagement-decision.jpg';
import { DecisionTemplateNoExpense, type DecisionItem } from '@/components/templates';
import { INVESTMENT_RANGE_NAMES_R1, INVESTMENT_RANGE_NAMES_R2, OPERATIONS_OPTION_DATA_RANGE_NAMES, OPERATIONS_OPTION_DATA_RANGE_NAMES_R2, DASH_CUM_RANGE_NAMES_R1, DASH_CUM_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';
import { useCalc } from '@/contexts/CalcContext';


export default function DecisionBU1Page() {
  const navigate = useNavigate();
  const { setValue, getValue } = useCalc();

  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate range object based on current round
  const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;
  const optionDataRanges = currentRound === 2 ? OPERATIONS_OPTION_DATA_RANGE_NAMES_R2 : OPERATIONS_OPTION_DATA_RANGE_NAMES;

  // Operations Decision Configuration - using round-specific ranges
  const operationsDecisionsConfig = {
    decisions: [
      {
        id: 'decision-12',
        title: DECISIONS.LABELS.DECISION_12,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_12,
        refName: investmentRanges.OPS_NWKOPS,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.OPS_NWKOPS_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.OPS_NWKOPS_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.NWKOPS_LOW_UNITS,
            costRef: optionDataRanges.NWKOPS_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.NWKOPS_MED_UNITS,
            costRef: optionDataRanges.NWKOPS_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.NWKOPS_HIGH_UNITS,
            costRef: optionDataRanges.NWKOPS_HIGH_COST,
          },
        ],
      },
      {
        id: 'decision-13',
        title: DECISIONS.LABELS.DECISION_13,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_13,
        refName: investmentRanges.OPS_DATAANALY,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.OPS_DATAANALY_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.OPS_DATAANALY_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.DATAANALY_LOW_UNITS,
            costRef: optionDataRanges.DATAANALY_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.DATAANALY_MED_UNITS,
            costRef: optionDataRanges.DATAANALY_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.DATAANALY_HIGH_UNITS,
            costRef: optionDataRanges.DATAANALY_HIGH_COST,
          },
        ],
      },
    ],
  } as const;

  const handleNavigateNext = () => {
    navigate('/bu2');
  };

  const handleNavigateBack = () => {
    navigate('/corporate');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE}
          </h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.DESCRIPTION}
          </p>
        </div>

        {/* Decision Template */}
        <DecisionTemplateNoExpense 
          decisions={operationsDecisionsConfig.decisions as readonly DecisionItem[]}
          className="grid grid-cols-2 gap-6 mb-8"
        />

        {/* Capacity Bar Chart */}
        <DecisionPageImage 
          imageSrc={networkEngagementImage} 
          alt="Operations Strategy" 
          className="mt-8 max-h-[400px]" 
        />

        <NavigationControls 
          centerDashboard={true} 
        />
      </div>
    </AppLayout>
  );
}