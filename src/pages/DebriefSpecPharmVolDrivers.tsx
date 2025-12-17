import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { ChartContainer } from "@/components/ui/chart";
import { ComposedChart, YAxis, XAxis, Bar, Scatter, Tooltip, ReferenceLine } from "recharts";
import { PAGE_CONTENT, markScreenAsVisited, getInitiativeTitleByModelValue, getEventByRoundAndNumber, getEventOptionTitle } from "@/Sim/Content";
import { useCalcValues } from "@/hooks/useCalcValue";
import { DEBRIEF_RANGE_NAMES_R2, STRATEGIC_INITIATIVE_RANGE_NAMES, EVENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
import { TriangleMarker } from "@/components/charts/TriangleMarker";
import { useCalc } from "@/contexts/CalcContext";
import { useEffect, useRef, useState } from "react";
import { Maximize2, ArrowUp, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateNiceTicks } from "@/utils/chartUtils";

export default function DebriefSpecPharmVolDrivers() {
  const { setValue, getValue } = useCalc();
  const hasMarkedVisited = useRef(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Use R2-only ranges
  const debriefRanges = DEBRIEF_RANGE_NAMES_R2;

  // Mark screen 17 as visited when this page loads (R2 only)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      markScreenAsVisited("SCREEN_17", setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue, getValue]);

  // Fetch all data from CalcModel
  const calcValues = useCalcValues([
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL1,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL2,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL3,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL4,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE1,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE2,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE3,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE4,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM1,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM2,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM3,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM4,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT1,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT2,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT3,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT4,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT1,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT2,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT3,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT4,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT1,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT2,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT3,
    debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT4,
    debriefRanges.SPEC_PHARM_VOL_LABEL,
    debriefRanges.SPEC_PHARM_VOL,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2,
    EVENT_RANGE_NAMES.EVENT_3_ROUND_2,
  ]);

  // Format large numbers with suffixes (B, M, K)
  const formatSmartNumber = (value: number, decimals: number = 1): string => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (absValue >= 1000000000) {
      return sign + (absValue / 1000000000).toFixed(decimals) + "B";
    } else if (absValue >= 1000000) {
      return sign + (absValue / 1000000).toFixed(decimals) + "M";
    } else if (absValue >= 1000) {
      return sign + (absValue / 1000).toFixed(decimals) + "K";
    }
    return value.toFixed(decimals);
  };

  // Format whole numbers with commas, no decimals
  const formatNumber = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Parse driver data from CalcModel
  const drivers = [
    {
      name: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL1] || "",
      decision: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE1] || "0",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM1] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT1]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT1]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT1]) || 0,
    },
    {
      name: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL2] || "",
      decision: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE2] || "0",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM2] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT2]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT2]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT2]) || 0,
    },
    {
      name: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL3] || "",
      decision: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE3] || "0",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM3] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT3]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT3]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT3]) || 0,
    },
    {
      name: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_LABEL4] || "",
      decision: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_VALUE4] || "0",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_CUM4] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MINIMPACT4]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_MAXIMPACT4]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT4]) || 0,
    },
  ];

  // Check which specialty pharmacy initiatives were selected (SI11 and SI15)
  const si11Selected = [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2],
  ].includes("SI11");

  const si15Selected = [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2],
  ].includes("SI15");

  // Check if Event 3 Option A (Ransomware - threshold not met) was selected
  const event3R2 = calcValues[EVENT_RANGE_NAMES.EVENT_3_ROUND_2];
  const event3OptionASelected = event3R2 === 'A';
  
  // Get event title from Content.ts
  const event3OptionATitle = getEventOptionTitle(2, 3, 'A');

  // Build list of initiatives impacting specialty pharmacy scripts
  const specialtyPharmacyImpactingItems = [
    {
      id: 'SI11',
      name: getInitiativeTitleByModelValue('SI11'),
      type: 'Initiative',
      impact: '+',
      selected: si11Selected,
      fromPreviousRound: false,
    },
    {
      id: 'SI15',
      name: getInitiativeTitleByModelValue('SI15'),
      type: 'Initiative',
      impact: '+',
      selected: si15Selected,
      fromPreviousRound: false,
    },
    {
      id: 'E3A',
      name: event3OptionATitle || 'Ransomware Attack (If threshold not met)',
      type: 'Event',
      impact: '-',
      selected: event3OptionASelected,
      fromPreviousRound: false,
    },
  ];

  /**
   * Calculate intelligent selected count based on constraints:
   * - Max 2 initiatives can be selected per round
   * - Events are auto-selected based on gameplay
   */
  const calculateSmartCounts = (items: typeof specialtyPharmacyImpactingItems) => {
    // Separate initiatives and events
    const initiatives = items.filter(item => item.type === 'Initiative');
    const events = items.filter(item => item.type === 'Event');
    
    // Calculate maximum selectable
    const maxInitiatives = Math.min(initiatives.length, 2); // Max 2 initiatives per round
    const maxEvents = events.length; // Events are auto-selected based on gameplay
    const maxSelectable = maxInitiatives + maxEvents;
    
    // Calculate actual selected
    const initiativesSelected = initiatives.filter(item => item.selected).length;
    const eventsSelected = events.filter(item => item.selected).length;
    const actualSelected = initiativesSelected + eventsSelected;
    
    return {
      selected: actualSelected,
      maxSelectable: maxSelectable,
    };
  };

  const { selected: selectedCount, maxSelectable } = calculateSmartCounts(specialtyPharmacyImpactingItems);

  // Total values
  const totalLabel = calcValues[debriefRanges.SPEC_PHARM_VOL_LABEL] || "";
  const totalValue = calcValues[debriefRanges.SPEC_PHARM_VOL] || "0";

  // Prepare chart data
  const chartData = drivers.map((driver, index) => ({
    name: driver.name,
    index: index,
    rangeMin: driver.rangeMin,
    range: driver.rangeMax - driver.rangeMin,
    rangeMax: driver.rangeMax,
    teamOutcome: driver.teamOutcome,
  }));

  // Calculate domain with nice ticks using utility function
  const allMinValues = drivers.map((d) => d.rangeMin);
  const allMaxValues = drivers.map((d) => d.rangeMax);
  const allOutcomes = drivers.map((d) => d.teamOutcome);

  const dataMin = Math.min(...allMinValues, ...allOutcomes);
  const dataMax = Math.max(...allMaxValues, ...allOutcomes);

  // Use calculateNiceTicks to get proper domain and ticks
  const { ticks, min: domainMin, max: domainMax } = calculateNiceTicks(dataMin, dataMax, 5);

  // Custom X-axis tick component for horizontal wrapping labels
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const text = payload.value;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    // Split text into lines (max 14 chars per line for zoom tolerance)
    words.forEach((word: string) => {
      if ((currentLine + word).length <= 14) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    return (
      <text x={x} y={y} textAnchor="middle" fill="hsl(var(--muted-foreground))">
        {lines.map((line, index) => (
          <tspan x={x} dy={index === 0 ? "0.71em" : "1.2em"} key={index} fontSize={14}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  // Custom tooltip for impact range chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{data.name}</p>
        <p className="text-sm text-muted-foreground">Actual: {formatSmartNumber(data.teamOutcome, 1)}</p>
        <p className="text-sm text-muted-foreground">Max (Potential): {formatSmartNumber(data.rangeMax, 1)}</p>
        <p className="text-sm text-muted-foreground">Min (Potential): {formatSmartNumber(data.rangeMin, 1)}</p>
      </div>
    );
  };

  // Chart configuration
  const chartConfig = {
    impact: {
      label: "Impact (M)",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.DEBRIEF.SPECIALTY_PHARMACY_SCRIPTS.TITLE}
          </h1>
          <p className="text-muted-foreground">{PAGE_CONTENT.DEBRIEF.SPECIALTY_PHARMACY_SCRIPTS.DESCRIPTION}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Table */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                {PAGE_CONTENT.DEBRIEF.SPECIALTY_PHARMACY_SCRIPTS.TABLE_HEADER}
              </h2>

              {/* Table Header */}
              <div className="bg-muted/50 text-foreground rounded-t-lg border border-white/10">
                <div className="grid grid-cols-3 gap-4 p-4 font-bold">
                  <div>Driver</div>
                  <div className="text-center">Decision</div>
                  <div className="text-center">Cumulative Capability</div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="bg-muted/30 border-l border-r border-b border-white/10 rounded-b-lg">
                {drivers.map((driver, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 gap-4 p-4 border-b border-white/10 last:border-b-0 ${index % 2 === 0 ? "bg-muted/30" : "bg-muted/50"}`}
                  >
                    <div className="font-medium text-foreground">
                      {driver.name}
                    </div>
                    
                    {index === 3 ? (
                      <>
                        {/* Decision column: Show count as plain text */}
                        <div className="text-center text-muted-foreground">
                          {selectedCount} of {maxSelectable} selected
                        </div>
                        
                        {/* Cumulative Capability column: Show Plus icon */}
                        <div className="text-center flex items-center justify-center">
                          <button
                            onClick={() => setDetailsDialogOpen(true)}
                            className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Expand to view initiative details"
                          >
                            <Maximize2 size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center text-muted-foreground">{driver.decision}</div>
                        <div className="text-center text-muted-foreground">{driver.cumulativeInvestment}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-muted/50 rounded-lg p-4 border border-white/10 mt-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-lg font-semibold text-foreground">{totalLabel}</span>
                  <span></span>
                  <span className="text-xl font-bold text-foreground text-center">
                    {formatNumber(parseFloat(totalValue || "0"))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Chart */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
                {PAGE_CONTENT.DEBRIEF.SPECIALTY_PHARMACY_SCRIPTS.CHART_TITLE}
              </h2>

              <ChartContainer config={chartConfig} className="h-[500px] w-full">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 5 }}>
                    <XAxis
                      dataKey="name"
                      textAnchor="middle"
                      height={140}
                      interval={0}
                      tick={<CustomXAxisTick />}
                    />
                    <YAxis
                      tickFormatter={(value) => formatSmartNumber(value)}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      domain={[domainMin, domainMax]}
                      ticks={ticks}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                    <ReferenceLine 
                      y={0} 
                      stroke="hsl(var(--foreground))" 
                      strokeWidth={1}
                      strokeOpacity={1}
                      strokeDasharray="0"
                    />
                    <Bar dataKey="rangeMin" fill="transparent" stackId="range" />
                    <Bar dataKey="range" fill="hsl(var(--secondary))" radius={[4, 4, 4, 4]} stackId="range" />
                    <Scatter
                      dataKey="teamOutcome"
                      fill="white"
                      shape={(props: any) => {
                        const { cx, cy } = props;
                        return <TriangleMarker cx={cx} cy={cy} size={6} fill="white" />;
                      }}
                    />
                  </ComposedChart>
              </ChartContainer>

              {/* Legend */}
              <div className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary rounded"></div>
                  <span>Range of Outcomes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-muted-foreground"></div>
                  <span>Your Team's Outcome</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NavigationControls
        backLabel="Back"
        nextLabel="Continue"
        showDashboard={false}
      />

      {/* Initiatives & Events Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl px-6 py-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">Initiatives & Events Impacting Specialty Pharmacy Scripts</DialogTitle>
            <DialogDescription className="text-base">
              This table shows which initiatives and events impact specialty pharmacy scripts, the direction of the effect, and whether your team selected them.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-[600px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-muted/50">
                  <th className="text-left py-4 px-3 text-base font-bold">Item</th>
                  <th className="text-center py-4 px-3 text-base font-bold">Impact</th>
                  <th className="text-center py-4 px-3 text-base font-bold">Selected</th>
                </tr>
              </thead>
              <tbody>
                {/* Special Initiatives Header Row */}
                <tr className="border-b border-white/10 bg-muted/80">
                  <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                    Special Initiatives
                  </td>
                </tr>
                
                {/* Render Initiatives (indented) */}
                {specialtyPharmacyImpactingItems
                  .filter(item => item.type === 'Initiative')
                  .map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-muted/50'}`}
                    >
                      <td className="p-3 pl-8">{item.name}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          {item.impact === '+' ? (
                            <ArrowUp className="text-green-400" size={20} strokeWidth={2.5} />
                          ) : (
                            <ArrowDown className="text-red-400" size={20} strokeWidth={2.5} />
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={item.selected}
                            disabled
                            className={item.selected
                            ? "h-5 w-5 border-2 border-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400" 
                            : "h-5 w-5 border-2 border-gray-500 bg-transparent"
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Events Header Row (only show if events exist) */}
                {specialtyPharmacyImpactingItems.filter(item => item.type === 'Event').length > 0 && (
                  <>
                    <tr className="border-b border-white/10 bg-muted/80">
                      <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                        {getEventByRoundAndNumber(2, 3)?.title || 'Events'}
                      </td>
                    </tr>
                    
                    {/* Render Events (indented) */}
                    {specialtyPharmacyImpactingItems
                      .filter(item => item.type === 'Event')
                      .map((item, index) => (
                        <tr 
                          key={item.id} 
                          className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-muted/50'}`}
                        >
                          <td className="p-3 pl-8">{item.name}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center">
                              {item.impact === '+' ? (
                                <ArrowUp className="text-green-400" size={20} strokeWidth={2.5} />
                              ) : (
                                <ArrowDown className="text-red-400" size={20} strokeWidth={2.5} />
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={item.selected}
                                disabled
                                className={item.selected
                                  ? "h-5 w-5 border-2 border-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400" 
                                  : "h-5 w-5 border-2 border-gray-500 bg-transparent"
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
