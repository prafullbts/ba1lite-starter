/**
 * DEPRECATED: This page has been commented out in favor of integrating
 * Revenue Per Transaction explanation into the Pharma NPS Drivers page.
 * 
 * The page is preserved here for reference purposes and may be reactivated
 * if needed in the future.
 * 
 * To reactivate:
 * 1. Uncomment the route in App.tsx (line ~146-152)
 * 2. Uncomment the import in App.tsx (line ~31)
 * 3. Uncomment the navigation item in BtsLogo.tsx (line ~281-287)
 * 4. Update navigation controls in DebriefPharmaNPSDriversPage.tsx and DebriefRetPharmVolDrivers.tsx
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { YAxis, XAxis, ResponsiveContainer, Bar, Cell, ReferenceLine, CartesianGrid, ComposedChart, Line } from "recharts";
import { DECISIONS, PAGE_CONTENT, type InvestmentLevel, markScreenAsVisited } from "@/Sim/Content";
import { useCalc } from "@/contexts/CalcContext";
import { useEffect, useRef } from "react";
import { useCalcValues } from "@/hooks/useCalcValue";
import { DEBRIEF_RANGE_NAMES, DEBRIEF_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
import { calculateNiceTicks } from "@/utils/chartUtils";

export default function DebriefPBRevPTransPage() {
  const { setValue, getValue } = useCalc();
  const hasMarkedVisited = useRef(false);
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate debrief range object based on current round
  // Using standard debrief ranges (not round-aware yet)
  const debriefRanges = DEBRIEF_RANGE_NAMES;

  // Mark screen 14 as visited when this page loads (Info Screen 4 - Revenue/Interaction)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      markScreenAsVisited('SCREEN_14', setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue]);

  // Fetch CalcModel values
  const calcValues = useCalcValues([
    debriefRanges.PBREVPTRANS_START_LABEL_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_LABEL1_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_LABEL2_R1,
    debriefRanges.PBREVPTRANS_END_LABEL_R1,
    debriefRanges.PBREVPTRANS_CHANGE_LABEL_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_VALUE1_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_VALUE2_R1,
    debriefRanges.PBREVPTRANS_END_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_START_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_ACTUALIMPACT1_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_ACTUALIMPACT2_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_END_R1,
    debriefRanges.PBREVPTRANS_DRIVERS_CHANGE_R1,
  ]);

  // Extract values from CalcModel
  const startLabel = calcValues[debriefRanges.PBREVPTRANS_START_LABEL_R1] || "Baseline";
  const driver1Label = calcValues[debriefRanges.PBREVPTRANS_DRIVERS_LABEL1_R1] || "Pharma NPS";
  const driver2Label = calcValues[debriefRanges.PBREVPTRANS_DRIVERS_LABEL2_R1] || "Initiative: Pharma GTM";
  const endLabel = calcValues[debriefRanges.PBREVPTRANS_END_LABEL_R1] || "Ending";
  const changeLabel = calcValues[debriefRanges.PBREVPTRANS_CHANGE_LABEL_R1] || "Change";
  
  const driver1Value = calcValues[debriefRanges.PBREVPTRANS_DRIVERS_VALUE1_R1] || "0";
  const driver2Value = calcValues[debriefRanges.PBREVPTRANS_DRIVERS_VALUE2_R1] || "Unselected";
  const endValue = calcValues[debriefRanges.PBREVPTRANS_END_R1] || "0";
  
  // Formatting functions
  const formatRevPerInteraction = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[,$]/g, '')) : value;
    return `$${numValue.toFixed(1)}`;
  };
  
  const formatNPS = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[,$]/g, '')) : value;
    return numValue.toFixed(1);
  };
  
  // Parse numeric values for chart
  const baselineValue = parseFloat(calcValues[debriefRanges.PBREVPTRANS_DRIVERS_START_R1]?.replace(/[,$]/g, '') || "0");
  const driver1Change = parseFloat(calcValues[debriefRanges.PBREVPTRANS_DRIVERS_ACTUALIMPACT1_R1]?.replace(/[,$]/g, '') || "0");
  const driver2Change = parseFloat(calcValues[debriefRanges.PBREVPTRANS_DRIVERS_ACTUALIMPACT2_R1]?.replace(/[,$]/g, '') || "0");
  const endingValue = parseFloat(calcValues[debriefRanges.PBREVPTRANS_DRIVERS_END_R1]?.replace(/[,$]/g, '') || "0");
  const changeValue = calcValues[debriefRanges.PBREVPTRANS_DRIVERS_CHANGE_R1] || "0";

  // Driver data for table with formatting
  const drivers = [
    {
      name: driver1Label,
      decision: formatNPS(driver1Value),
    },
    {
      name: driver2Label,
      decision: driver2Value, // Keep as text ("Selected" or "Unselected")
    },
  ];

  const waterfallData = [
    {
      name: startLabel,
      base: 0,
      change: baselineValue,
      isPositive: null,
      top: baselineValue,
    },
    {
      name: driver1Label,
      base: baselineValue,
      change: driver1Change,
      isPositive: driver1Change >= 0,
      top: baselineValue + driver1Change,
    },
    {
      name: driver2Label,
      base: baselineValue + driver1Change,
      change: driver2Change,
      isPositive: driver2Change >= 0,
      top: baselineValue + driver1Change + driver2Change,
    },
    {
      name: `${endLabel}\n${changeLabel}`,
      base: 0,
      change: endingValue,
      isPositive: null,
      top: endingValue,
    },
  ];

  // Calculate dynamic y-axis domain with padding
  const allValues = waterfallData.map((d) => d.base + d.change);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  
  // Add 20% padding to emphasize driver changes
  const range = maxValue - minValue;
  const padding = range * 0.2;
  const paddedMin = minValue - padding;
  const paddedMax = maxValue + padding;
  
  const { ticks, min: yAxisMin, max: yAxisMax } = calculateNiceTicks(paddedMin, paddedMax, 5);

  // Custom tooltip for waterfall chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    const dataIndex = waterfallData.findIndex(d => d.name === data.name);
    
    // Helper to format currency with sign
    const formatWithSign = (value: number): string => {
      const formattedValue = `$${Math.abs(value).toFixed(1)}`;
      if (value > 0) return `+${formattedValue}`;
      if (value < 0) return `-${formattedValue}`;
      return formattedValue;
    };
    
    // Determine content based on which column is hovered
    let content;
    
    if (dataIndex === 0) {
      // Start column
      content = (
        <p className="text-sm text-foreground">
          Starting Rev/Interaction: {formatRevPerInteraction(baselineValue)}
        </p>
      );
    } else if (dataIndex === 1) {
      // Driver 1 (Pharma NPS)
      content = (
        <p className="text-sm text-foreground">
          {driver1Label}: {formatWithSign(driver1Change)}
        </p>
      );
    } else if (dataIndex === 2) {
      // Driver 2 (SI)
      content = (
        <p className="text-sm text-foreground">
          {driver2Label}: {formatWithSign(driver2Change)}
        </p>
      );
    } else if (dataIndex === 3) {
      // End column
      const totalChange = parseFloat(changeValue.replace(/[,$]/g, ''));
      content = (
        <>
          <p className="text-sm text-foreground mb-1">
            Ending Revenue / Interaction: {formatRevPerInteraction(endingValue)}
          </p>
          <p className="text-sm text-foreground">
            Change from Baseline: {formatWithSign(totalChange)}
          </p>
        </>
      );
    }
    
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-lg">
        {content}
      </div>
    );
  };

  // Chart configuration for Recharts
  const chartConfig = {
    baseline: {
      label: PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.CHART_LABELS.BASELINE,
      color: "hsl(var(--chart-1))", // Neutral blue
    },
    positive: {
      label: PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.CHART_LABELS.INCREASE,
      color: "hsl(var(--chart-2))", // Green
    },
    negative: {
      label: PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.CHART_LABELS.DECREASE,
      color: "hsl(var(--chart-5))", // Red
    },
  };
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.TITLE}
          </h1>
          <p className="text-muted-foreground">{PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.DESCRIPTION}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Table */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                {PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.TABLE_HEADER}
              </h2>

              {/* Table Header */}
              <div className="bg-muted/50 text-foreground rounded-t-lg border border-white/10">
                <div className="grid grid-cols-2 gap-4 p-4 font-bold">
                  <div>{PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.COLUMN_HEADERS.DRIVER}</div>
                  <div className="text-center">Value</div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="bg-muted/30 border-l border-r border-b border-white/10 rounded-b-lg">
                {drivers.map((driver, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-2 gap-4 p-4 border-b border-white/10 last:border-b-0 ${index % 2 === 0 ? "bg-muted/30" : "bg-muted/50"}`}
                  >
                    <div className="font-medium text-foreground">{driver.name}</div>
                    <div className="text-center text-muted-foreground">{driver.decision}</div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-muted/50 rounded-lg p-4 border border-white/10 mt-4">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-lg font-semibold text-foreground">
                    {PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.TOTAL_LABEL}
                  </span>
                  <span className="text-xl font-bold text-foreground text-center">{formatRevPerInteraction(endValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Chart */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-center">{PAGE_CONTENT.DEBRIEF.REVENUE_PER_INTERACTION.CHART_TITLE}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pt-0 pb-1">
              {/* Waterfall Chart - Phase 1: Axes Setup */}
              <ChartContainer config={chartConfig} className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={waterfallData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      interval={0}
                      height={50}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[yAxisMin, yAxisMax]}
                      ticks={ticks}
                      tickFormatter={formatRevPerInteraction}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <ChartTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    
                    {/* Connector line across bar tops */}
                    <Line
                      type="stepAfter"
                      dataKey="top"
                      dot={false}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      isAnimationActive={false}
                    />
                    
                    {/* Invisible Base Bar - Lifts the change bars to correct position */}
                    <Bar dataKey="base" stackId="a" fill="transparent" />

                    {/* Visible Change Bar - Shows incremental changes */}
                    <Bar dataKey="change" stackId="a" radius={[4, 4, 0, 0]} minPointSize={2}>
                      {waterfallData.map((entry, index) => {
                        let fillColor = "transparent";
                        const isDriver = index === 1 || index === 2;
                        const isZero = Math.abs(entry.change) < 0.0001;

                        // Start column - grey matching baseline bubble
                        if (index === 0) {
                          fillColor = "hsl(0 0% 83% / 0.6)"; // Grey
                        }
                        // End column - black for final state
                        else if (index === 3) {
                          fillColor = "hsl(0 0% 20%)"; // Dark grey/black
                        }
                        // Driver columns
                        else if (isDriver) {
                          // Zero change - grey like baseline
                          if (isZero) {
                            fillColor = "hsl(0 0% 83% / 0.6)"; // Same grey as start column
                          }
                          // Positive/negative changes
                          else {
                            fillColor = entry.isPositive
                              ? "hsl(var(--color-confirmation))" // Green for positive change
                              : "hsl(var(--chart-negative))"; // Traditional red for negative change
                          }
                        }

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={fillColor}
                            stroke={isZero ? "hsl(var(--chart-1))" : undefined}
                            strokeWidth={isZero ? 2 : undefined}
                          />
                        );
                      })}
                    </Bar>

                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <NavigationControls
        backLabel="Back"
        nextLabel="Continue"
        showDashboard={false}
      />
    </AppLayout>
  );
}
