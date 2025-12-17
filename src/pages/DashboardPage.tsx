import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCalc } from '@/contexts/CalcContext';
import { DECISIONS, PAGE_CONTENT } from '@/Sim/Content';
import { useCalcValue } from '@/hooks/useCalcValue';
import { INVESTMENT_RANGE_NAMES_R1, INVESTMENT_RANGE_NAMES_R2, DASH_CUM_RANGE_NAMES_R1, DASH_CUM_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';
import operationsImage from '@/assets/operations-decision.jpg';
import productImage from '@/assets/product-decision.jpg';
import technologyImage from '@/assets/technology-decision.png';

export default function DashboardPage() {
  const { getValue } = useCalc();
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate range objects based on current round
  const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;
  const cumRanges = currentRound === 2 ? DASH_CUM_RANGE_NAMES_R2 : DASH_CUM_RANGE_NAMES_R1;

  // Decision ID to Range Name mapping - using round-specific ranges
  const decisionRangeMap = {
    // Product decisions
    'decision-4': investmentRanges.PROD_PATNOTIF,
    'decision-5': investmentRanges.PROD_PHARMFUNC,
    'decision-6': investmentRanges.PROD_PROVFUNC,
    'decision-7': investmentRanges.PROD_FORMAUTO,
    
    // Technology decisions
    'decision-8': investmentRanges.TECH_PREDINT,
    'decision-9': investmentRanges.TECH_PLATUNIF,
    'decision-10': investmentRanges.TECH_PERFREL,
    'decision-11': investmentRanges.TECH_DEVPROD,
    
    // Operations decisions
    'decision-12': investmentRanges.OPS_NWKOPS,
    'decision-13': investmentRanges.OPS_DATAANALY,
  };

  // Cumulative capability range mapping for decisions - using round-specific ranges
  const cumulativeRangeMap = currentRound === 2 ? {
    // Product
    'decision-4': DASH_CUM_RANGE_NAMES_R2.PROD_PATNOTIF_CUM_R2,
    'decision-5': DASH_CUM_RANGE_NAMES_R2.PROD_PHARMFUNC_CUM_R2,
    'decision-6': DASH_CUM_RANGE_NAMES_R2.PROD_PROVFUNC_CUM_R2,
    'decision-7': DASH_CUM_RANGE_NAMES_R2.PROD_FORMAUTO_CUM_R2,
    // Technology
    'decision-8': DASH_CUM_RANGE_NAMES_R2.TECH_PREDINT_CUM_R2,
    'decision-9': DASH_CUM_RANGE_NAMES_R2.TECH_PLATUNIF_CUM_R2,
    'decision-10': DASH_CUM_RANGE_NAMES_R2.TECH_PERFREL_CUM_R2,
    'decision-11': DASH_CUM_RANGE_NAMES_R2.TECH_DEVPROD_CUM_R2,
    // Operations
    'decision-12': DASH_CUM_RANGE_NAMES_R2.OPS_NWKOPS_CUM_R2,
    'decision-13': DASH_CUM_RANGE_NAMES_R2.OPS_DATAANALY_CUM_R2,
  } : {
    // Product
    'decision-4': DASH_CUM_RANGE_NAMES_R1.PROD_PATNOTIF_CUM_R1,
    'decision-5': DASH_CUM_RANGE_NAMES_R1.PROD_PHARMFUNC_CUM_R1,
    'decision-6': DASH_CUM_RANGE_NAMES_R1.PROD_PROVFUNC_CUM_R1,
    'decision-7': DASH_CUM_RANGE_NAMES_R1.PROD_FORMAUTO_CUM_R1,
    // Technology
    'decision-8': DASH_CUM_RANGE_NAMES_R1.TECH_PREDINT_CUM_R1,
    'decision-9': DASH_CUM_RANGE_NAMES_R1.TECH_PLATUNIF_CUM_R1,
    'decision-10': DASH_CUM_RANGE_NAMES_R1.TECH_PERFREL_CUM_R1,
    'decision-11': DASH_CUM_RANGE_NAMES_R1.TECH_DEVPROD_CUM_R1,
    // Operations
    'decision-12': DASH_CUM_RANGE_NAMES_R1.OPS_NWKOPS_CUM_R1,
    'decision-13': DASH_CUM_RANGE_NAMES_R1.OPS_DATAANALY_CUM_R1,
  };

  // Product decisions with data
  const productDecisions = [
    { id: 'decision-4', title: DECISIONS.LABELS.DECISION_4 },
    { id: 'decision-5', title: DECISIONS.LABELS.DECISION_5 },
    { id: 'decision-6', title: DECISIONS.LABELS.DECISION_6 },
  ];

  // Technology decisions with data
  const technologyDecisions = [
    { id: 'decision-8', title: DECISIONS.LABELS.DECISION_8 },
    { id: 'decision-9', title: DECISIONS.LABELS.DECISION_9 },
    { id: 'decision-10', title: DECISIONS.LABELS.DECISION_10 },
    { id: 'decision-11', title: DECISIONS.LABELS.DECISION_11 },
  ];

  // Operations decisions with data
  const operationsDecisions = [
    { id: 'decision-12', title: DECISIONS.LABELS.DECISION_12 },
    { id: 'decision-13', title: DECISIONS.LABELS.DECISION_13 },
  ];

  // Helper function to convert numeric value to display text
  const getInvestmentLevelText = (value: number | null | undefined) => {
    if (value === 1) return 'Low';
    if (value === 2) return 'Medium';
    if (value === 3) return 'High';
    return '-';
  };

  // Helper function to safely convert string to number and handle NaN
  const safeNumberConversion = (value: string | null | undefined): number | null => {
    if (!value || value === '' || value === '0') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  // Preload decision page images to eliminate lag when navigating
  React.useEffect(() => {
    const imagesToPreload = [
      operationsImage,
      productImage,
      technologyImage,
    ];
    
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted relative overflow-hidden h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-background/30"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--secondary) / 0.15) 0%, transparent 50%), 
                         radial-gradient(circle at 80% 20%, hsl(var(--accent-1) / 0.15) 0%, transparent 50%),
                         radial-gradient(circle at 40% 40%, hsl(var(--accent-4) / 0.1) 0%, transparent 50%)`
      }}></div>
      
      <div className="relative z-10 pb-20 h-full overflow-y-auto">
        <div className="w-full max-w-[1440px] mx-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6">
          {/* Main Content - Single row with 3 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1 - Operations (Business Unit 1) */}
            <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden min-w-0">
              <CardHeader className="bg-gradient-accent-4 text-primary-foreground p-4 lg:p-5">
                <CardTitle className="text-xl lg:text-2xl font-semibold text-center truncate">{PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold"></TableHead>
                      <TableHead className="font-semibold text-center">Decision</TableHead>
                      <TableHead className="font-semibold text-center">Cumulative Capability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operationsDecisions.map((decision) => {
                      const rawValue = useCalcValue(decisionRangeMap[decision.id as keyof typeof decisionRangeMap], true);
                      const numValue = safeNumberConversion(rawValue);
                      const investmentLevel = getInvestmentLevelText(numValue);
                      
                      const cumRangeName = cumulativeRangeMap[decision.id as keyof typeof cumulativeRangeMap];
                      const cumRawValue = useCalcValue(cumRangeName, true);
                      const cumNumValue = safeNumberConversion(cumRawValue);
                      const cumulativeCapability = cumNumValue ? cumNumValue.toFixed(0) : '-';
                      
                      return (
                        <TableRow key={decision.id} className="hover:bg-transparent">
                          <TableCell className="font-medium">{decision.title}</TableCell>
                          <TableCell className="text-center">{investmentLevel}</TableCell>
                          <TableCell className="text-center">{cumulativeCapability}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Card 2 - Product (Business Unit 2) */}
            <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden min-w-0">
              <CardHeader className="bg-gradient-accent-2 text-primary-foreground p-4 lg:p-5">
                <CardTitle className="text-xl lg:text-2xl font-semibold text-center truncate">{PAGE_CONTENT.DECISION_SCREENS.PRODUCT.TITLE}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold"></TableHead>
                      <TableHead className="font-semibold text-center">Decision</TableHead>
                      <TableHead className="font-semibold text-center">Cumulative Capability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productDecisions.map((decision) => {
                      const rawValue = useCalcValue(decisionRangeMap[decision.id as keyof typeof decisionRangeMap], true);
                      const numValue = safeNumberConversion(rawValue);
                      const investmentLevel = getInvestmentLevelText(numValue);
                      
                      const cumRangeName = cumulativeRangeMap[decision.id as keyof typeof cumulativeRangeMap];
                      const cumRawValue = useCalcValue(cumRangeName, true);
                      const cumNumValue = safeNumberConversion(cumRawValue);
                      const cumulativeCapability = cumNumValue ? cumNumValue.toFixed(0) : '-';
                      
                      return (
                        <TableRow key={decision.id} className="hover:bg-transparent">
                          <TableCell className="font-medium">{decision.title}</TableCell>
                          <TableCell className="text-center">{investmentLevel}</TableCell>
                          <TableCell className="text-center">{cumulativeCapability}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Card 3 - Technology (Corporate) */}
            <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden min-w-0">
              <CardHeader className="bg-gradient-cmm-orange text-primary-foreground p-4 lg:p-5">
                <CardTitle className="text-xl lg:text-2xl font-semibold text-center truncate">{PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY.TITLE}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold"></TableHead>
                      <TableHead className="font-semibold text-center">Decision</TableHead>
                      <TableHead className="font-semibold text-center">Cumulative Capability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technologyDecisions.map((decision) => {
                      const rawValue = useCalcValue(decisionRangeMap[decision.id as keyof typeof decisionRangeMap], true);
                      const numValue = safeNumberConversion(rawValue);
                      const investmentLevel = getInvestmentLevelText(numValue);
                      
                      const cumRangeName = cumulativeRangeMap[decision.id as keyof typeof cumulativeRangeMap];
                      const cumRawValue = useCalcValue(cumRangeName, true);
                      const cumNumValue = safeNumberConversion(cumRawValue);
                      const cumulativeCapability = cumNumValue ? cumNumValue.toFixed(0) : '-';
                      
                      return (
                        <TableRow key={decision.id} className="hover:bg-transparent">
                          <TableCell className="font-medium">{decision.title}</TableCell>
                          <TableCell className="text-center">{investmentLevel}</TableCell>
                          <TableCell className="text-center">{cumulativeCapability}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
