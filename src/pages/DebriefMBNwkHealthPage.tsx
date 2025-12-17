import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { PAGE_CONTENT, markScreenAsVisited, formatNumberM } from "@/Sim/Content";
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { useNavigate } from "react-router-dom";
import { formatSmartCurrency } from "@/utils/tempFormatting";
import { useCalcValues } from "@/hooks/useCalcValue";
import { DEBRIEF_RANGE_NAMES, DEBRIEF_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
import { calculateNiceTicks } from "@/utils/chartUtils";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NetworkHealthBubble } from "@/components/charts/NetworkHealthBubble";
import { useCalc } from "@/contexts/CalcContext";
import { useEffect, useRef } from "react";

export default function DebriefMBNwkHealthPage() {
  const { setValue, getValue } = useCalc();
  const navigate = useNavigate();
  const hasMarkedVisited = useRef(false);
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate debrief range object based on current round
  // Using standard debrief ranges (labels non-round-specific, R0/R1 for baseline/current)
  const debriefRanges = DEBRIEF_RANGE_NAMES;

  // Mark screen 15 as visited when this page loads (R2 only)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      markScreenAsVisited("SCREEN_15", setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue, getValue]);

  // Fetch all needed values from CalcModel
  const calcValues = useCalcValues([
    debriefRanges.MBNH_SPEC_NPIS_LABEL,
    debriefRanges.MBNH_SPEC_NPIS_R0,
    debriefRanges.MBNH_SPEC_NPIS_R1,
    ...(currentRound >= 2 ? [debriefRanges.MBNH_SPEC_NPIS_R2] : []),
    debriefRanges.MBNH_SPEC_PHARM_VOL_LABEL,
    debriefRanges.MBNH_SPEC_PHARM_VOL_R0,
    debriefRanges.MBNH_SPEC_PHARM_VOL_R1,
    ...(currentRound >= 2 ? [debriefRanges.MBNH_SPEC_PHARM_VOL_R2] : []),
    debriefRanges.MBNH_VOL_TRANS_LABEL,
    debriefRanges.MBNH_VOL_TRANS_R0,
    debriefRanges.MBNH_VOL_TRANS_R1,
    ...(currentRound >= 2 ? [debriefRanges.MBNH_VOL_TRANS_R2] : []),
  ], true); // rawValue = true to get numeric values

  // Parse values from CalcModel
  const drivers = [
    {
      name: calcValues[debriefRanges.MBNH_SPEC_NPIS_LABEL] || PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.DRIVERS.SPECIALIST_NPIS,
      baseline: parseFloat(calcValues[debriefRanges.MBNH_SPEC_NPIS_R0]) || 0,
      current: parseFloat(calcValues[debriefRanges.MBNH_SPEC_NPIS_R1]) || 0,
      round2: currentRound >= 2 ? (parseFloat(calcValues[debriefRanges.MBNH_SPEC_NPIS_R2]) || 0) : undefined,
    },
    {
      name: calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_LABEL] || PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.DRIVERS.SPECIALIST_PHARMACY_SCRIPTS,
      baseline: parseFloat(calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_R0]) || 0,
      current: parseFloat(calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_R1]) || 0,
      round2: currentRound >= 2 ? (parseFloat(calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_R2]) || 0) : undefined,
    },
  ];

  // Network Health (Total) - from Volume Transformation driver
  const baselineNetworkHealth = parseFloat(calcValues[debriefRanges.MBNH_VOL_TRANS_R0]) || 0;
  const currentNetworkHealth = parseFloat(calcValues[debriefRanges.MBNH_VOL_TRANS_R1]) || 0;
  const round2NetworkHealth = currentRound >= 2 ? (parseFloat(calcValues[debriefRanges.MBNH_VOL_TRANS_R2]) || 0) : undefined;

  // Format numbers for display
  const formatNumber = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Format numbers with K/M/B suffix for chart axes
  const formatSmartNumber = (value: number, decimals: number = 1): string => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1000000000) {
      return sign + (absValue / 1000000000).toFixed(decimals) + 'B';
    } else if (absValue >= 1000000) {
      return sign + (absValue / 1000000).toFixed(decimals) + 'M';
    } else if (absValue >= 1000) {
      return sign + (absValue / 1000).toFixed(decimals) + 'K';
    }
    return value.toFixed(0);
  };

  // Chart data for Recharts - baseline, current, and conditionally Round 2
  const chartData = [
    {
      name: "Round 0",
      x: drivers[0].baseline,
      y: drivers[1].baseline,
      z: baselineNetworkHealth,
      networkHealth: baselineNetworkHealth,
      label: "Round 0"
    },
    {
      name: "Round 1",
      x: drivers[0].current,
      y: drivers[1].current,
      z: currentNetworkHealth,
      networkHealth: currentNetworkHealth,
      label: "Round 1"
    },
    ...(currentRound >= 2 && drivers[0].round2 !== undefined ? [{
      name: "Round 2",
      x: drivers[0].round2,
      y: drivers[1].round2!,
      z: round2NetworkHealth!,
      networkHealth: round2NetworkHealth!,
      label: "Round 2"
    }] : [])
  ];

  // Calculate min and max z-values for dynamic bubble scaling
  const allZValues = chartData.map(d => d.z);
  const minZ = Math.min(...allZValues);
  const maxZ = Math.max(...allZValues);

  // Add scaling parameters to each data point for the bubble component
  const chartDataWithScale = chartData.map((item, index) => ({
    ...item,
    minZ,
    maxZ,
    isLatestRound: index === chartData.length - 1 // Mark the last round as latest
  }));

  // Calculate axis domains and nice ticks
  const xValues = chartData.map(d => d.x);
  const yValues = chartData.map(d => d.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Add 20% padding
  const xPadding = (xMax - xMin) * 0.2 || 1;
  const yPadding = (yMax - yMin) * 0.2 || 1;

  // Calculate nice ticks for both axes
  const xAxisConfig = calculateNiceTicks(xMin - xPadding, xMax + xPadding, 5);
  const yAxisConfig = calculateNiceTicks(yMin - yPadding, yMax + yPadding, 5);

  // Custom tooltip matching user's specified format
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {calcValues[debriefRanges.MBNH_SPEC_NPIS_LABEL] || drivers[0].name}: {formatSmartNumber(data.x, 1)}
        </p>
        <p className="text-sm text-muted-foreground">
          {calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_LABEL] || drivers[1].name}: {formatSmartNumber(data.y, 2)}
        </p>
        <p className="text-sm text-muted-foreground">
          {calcValues[debriefRanges.MBNH_VOL_TRANS_LABEL] || PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TOTAL_LABEL}: {formatNumberM(data.networkHealth, 2)}
        </p>
      </div>
    );
  };

  return <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TITLE}</h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.DESCRIPTION}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Table */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TABLE_HEADER}</h2>
              
              {/* Table Header */}
              <div className="bg-muted/50 text-foreground rounded-t-lg border border-white/10">
                <div className={`grid ${currentRound >= 2 ? 'grid-cols-4' : 'grid-cols-3'} gap-4 p-4 font-bold`}>
                  <div>{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TABLE_COLUMNS.DRIVER}</div>
                  <div className="text-center">{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TABLE_COLUMNS.BASELINE}</div>
                  <div className="text-center">{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TABLE_COLUMNS.CURRENT}</div>
                  {currentRound >= 2 && (
                    <div className="text-center">{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TABLE_COLUMNS.ROUND_2}</div>
                  )}
                </div>
              </div>
              
              {/* Table Rows */}
              <div className="bg-muted/30 border-l border-r border-b border-white/10 rounded-b-lg">
                {drivers.map((driver, index) => (
                  <div key={index} className={`grid ${currentRound >= 2 ? 'grid-cols-4' : 'grid-cols-3'} gap-4 p-4 border-b border-white/10 last:border-b-0 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-muted/50'}`}>
                    <div className="font-medium text-foreground">{driver.name}</div>
                    <div className="text-center text-muted-foreground">
                      {formatSmartNumber(driver.baseline, index === 1 ? 2 : 1)}
                    </div>
                    <div className="text-center text-muted-foreground">
                      {formatSmartNumber(driver.current, index === 1 ? 2 : 1)}
                    </div>
                    {currentRound >= 2 && (
                      <div className="text-center text-muted-foreground">
                        {driver.round2 !== undefined ? formatSmartNumber(driver.round2, index === 1 ? 2 : 1) : '-'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="bg-muted/50 rounded-lg p-4 border border-white/10 mt-4">
                <div className={`grid ${currentRound >= 2 ? 'grid-cols-4' : 'grid-cols-3'} gap-4 items-center`}>
                  <span className="text-lg font-semibold text-foreground">
                    {calcValues[debriefRanges.MBNH_VOL_TRANS_LABEL] || PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.TOTAL_LABEL}
                  </span>
                  <span className="text-center text-xl font-bold text-foreground">
                    {formatNumberM(baselineNetworkHealth, 1)}
                  </span>
                  <span className="text-center text-xl font-bold text-foreground">
                    {formatNumberM(currentNetworkHealth, 1)}
                  </span>
                  {currentRound >= 2 && (
                    <span className="text-center text-xl font-bold text-foreground">
                      {round2NetworkHealth !== undefined ? formatNumberM(round2NetworkHealth, 1) : '-'}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Bubble Chart */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">{PAGE_CONTENT.DEBRIEF.MEDICAL_BENEFITS_NETWORK_HEALTH.CHART_TITLE}</h2>
              
              {/* Bubble Chart */}
              <div className="h-80 w-full rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={[xAxisConfig.min, xAxisConfig.max]}
                      ticks={xAxisConfig.ticks}
                      name={calcValues[debriefRanges.MBNH_SPEC_NPIS_LABEL] || drivers[0].name}
                      label={{
                        value: calcValues[debriefRanges.MBNH_SPEC_NPIS_LABEL] || drivers[0].name,
                        position: 'bottom',
                        offset: 40,
                        style: { fill: 'hsl(var(--muted-foreground))', fontSize: '14px', fontWeight: 500, textAnchor: 'middle' }
                      }}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => formatSmartNumber(value, 1)}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      domain={[yAxisConfig.min, yAxisConfig.max]}
                      ticks={yAxisConfig.ticks}
                      name={calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_LABEL] || drivers[1].name}
              label={{
                value: calcValues[debriefRanges.MBNH_SPEC_PHARM_VOL_LABEL] || drivers[1].name,
                angle: -90,
                position: 'left',
                offset: 40,
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: '14px', fontWeight: 500, textAnchor: 'middle' }
              }}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => formatSmartNumber(value, 1)}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter
                      data={chartDataWithScale}
                      shape={<NetworkHealthBubble />}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300/60 border-2 border-gray-400 flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground">B</span>
                  </div>
                  <span>Round 0 (Baseline)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center" 
                    style={{ 
                      backgroundColor: currentRound >= 2 ? 'rgba(248, 165, 194, 0.7)' : 'rgba(231, 8, 101, 0.8)', 
                      border: currentRound >= 2 ? '2px solid rgb(248, 165, 194)' : '2px solid rgb(231, 8, 101)' 
                    }}
                  >
                    <span className={`text-xs ${currentRound >= 2 ? 'font-semibold' : 'font-bold'} text-white`}>1</span>
                  </div>
                  <span>Round 1</span>
                </div>
                {currentRound >= 2 && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-2/80 border-2 border-accent-2 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <span>Round 2</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">●</div>
                  <span>Bubble size = Volume of Patient Interactions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NavigationControls backLabel="Back" nextLabel="Continue" showDashboard={false} />
    </AppLayout>;
}
