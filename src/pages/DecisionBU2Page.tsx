import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NavigationControls } from '@/components/layout/NavigationControls';
import { useNavigate } from 'react-router-dom';
import { PAGE_CONTENT, DECISIONS } from '@/Sim/Content';
import { DecisionPageImage } from '@/components/ui/DecisionPageImage';
import networkEngagementImage from '@/assets/network-engagement-decision.jpg';
import { DecisionTemplateNoExpense, type DecisionItem } from '@/components/templates';
import { INVESTMENT_RANGE_NAMES_R1, INVESTMENT_RANGE_NAMES_R2, PRODUCT_OPTION_DATA_RANGE_NAMES, PRODUCT_OPTION_DATA_RANGE_NAMES_R2, DASH_CUM_RANGE_NAMES_R1, DASH_CUM_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';
import { useCalc } from '@/contexts/CalcContext';



export default function DecisionBU2Page() {
  const navigate = useNavigate();
  const { getValue } = useCalc();

  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate range object based on current round
  const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;
  const optionDataRanges = currentRound === 2 ? PRODUCT_OPTION_DATA_RANGE_NAMES_R2 : PRODUCT_OPTION_DATA_RANGE_NAMES;

  // Product Decision Configuration - using round-specific ranges
  const productDecisionsConfig = {
    decisions: [
      {
        id: 'decision-4',
        title: DECISIONS.LABELS.DECISION_4,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_4,
        refName: investmentRanges.PROD_PATNOTIF,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.PROD_PATNOTIF_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.PROD_PATNOTIF_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.PATNOTIF_LOW_UNITS,
            costRef: optionDataRanges.PATNOTIF_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.PATNOTIF_MED_UNITS,
            costRef: optionDataRanges.PATNOTIF_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.PATNOTIF_HIGH_UNITS,
            costRef: optionDataRanges.PATNOTIF_HIGH_COST,
          },
        ],
      },
      {
        id: 'decision-5',
        title: DECISIONS.LABELS.DECISION_5,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_5,
        refName: investmentRanges.PROD_PHARMFUNC,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.PROD_PHARMFUNC_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.PROD_PHARMFUNC_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.PHARMFUNC_LOW_UNITS,
            costRef: optionDataRanges.PHARMFUNC_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.PHARMFUNC_MED_UNITS,
            costRef: optionDataRanges.PHARMFUNC_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.PHARMFUNC_HIGH_UNITS,
            costRef: optionDataRanges.PHARMFUNC_HIGH_COST,
          },
        ],
      },
      {
        id: 'decision-6',
        title: DECISIONS.LABELS.DECISION_6,
        tooltipKey: DECISIONS.TOOLTIPS.DECISION_6,
        refName: investmentRanges.PROD_PROVFUNC,
        cumCapabilityRef: currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2.PROD_PROVFUNC_CUM_R2 : DASH_CUM_RANGE_NAMES_R1.PROD_PROVFUNC_CUM_R1,
        options: [
          {
            value: 'low',
            label: 'Low',
            unitsRef: optionDataRanges.PROVFUNC_LOW_UNITS,
            costRef: optionDataRanges.PROVFUNC_LOW_COST,
          },
          {
            value: 'medium',
            label: 'Medium',
            unitsRef: optionDataRanges.PROVFUNC_MED_UNITS,
            costRef: optionDataRanges.PROVFUNC_MED_COST,
          },
          {
            value: 'high',
            label: 'High',
            unitsRef: optionDataRanges.PROVFUNC_HIGH_UNITS,
            costRef: optionDataRanges.PROVFUNC_HIGH_COST,
          },
        ],
      },
    ],
  } as const;

  const handleNavigateNext = () => {
    navigate('/corporate');
  };

  const handleNavigateBack = () => {
    navigate('/bu1');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.DECISION_SCREENS.PRODUCT?.TITLE || 'Product Decisions'}
          </h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DECISION_SCREENS.PRODUCT?.DESCRIPTION || 'Make investment decisions for your product initiatives.'}
          </p>
        </div>

        {/* Decision Template */}
        <DecisionTemplateNoExpense 
          decisions={productDecisionsConfig.decisions as readonly DecisionItem[]}
          className="grid grid-cols-3 gap-6 mb-8"
        />

        {/* Capacity Bar Chart */}
        <DecisionPageImage 
          imageSrc={networkEngagementImage} 
          alt="Product Strategy" 
          className="mt-8 max-h-[400px]" 
        />

        <NavigationControls 
          centerDashboard={true} 
        />
      </div>
    </AppLayout>
  );
}
