import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer } from "@/components/ui/chart";
import { YAxis, XAxis, Bar, BarChart, Scatter, ScatterChart, ComposedChart, Tooltip, ReferenceLine } from "recharts";
import { PAGE_CONTENT, markScreenAsVisited, getInitiativeTitleByModelValue, getEventOptionTitle, getEventByRoundAndNumber } from "@/Sim/Content";
import { useCalcValues } from "@/hooks/useCalcValue";
import { DEBRIEF_RANGE_NAMES, DEBRIEF_RANGE_NAMES_R2, STRATEGIC_INITIATIVE_RANGE_NAMES, EVENT_RANGE_NAMES, ROUND_MANAGEMENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
import { TriangleMarker } from "@/components/charts/TriangleMarker";
import { calculateNiceTicks } from "@/utils/chartUtils";
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

export default function DebriefGenNPIsDrivers() {
  const { setValue, getValue } = useCalc();
  const hasMarkedVisited = useRef(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate debrief range object based on current round
  // Using standard debrief ranges (not round-aware yet)
  const debriefRanges = DEBRIEF_RANGE_NAMES;

  // Mark screen 12 as visited when this page loads (Info Screen 2 - Active Generalist NPIs)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      markScreenAsVisited('SCREEN_12', setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue]);

  // Fetch all needed values from CalcModel
  const calcValues = useCalcValues([
    debriefRanges.GEN_NPIS_DRIVERS_LABEL1,
    debriefRanges.GEN_NPIS_DRIVERS_LABEL2,
    debriefRanges.GEN_NPIS_DRIVERS_LABEL3,
    debriefRanges.GEN_NPIS_DRIVERS_LABEL4,
    debriefRanges.GEN_NPIS_DRIVERS_LABEL5,
    debriefRanges.GEN_NPIS_DRIVERS_VALUE1,
    debriefRanges.GEN_NPIS_DRIVERS_VALUE2,
    debriefRanges.GEN_NPIS_DRIVERS_VALUE3,
    debriefRanges.GEN_NPIS_DRIVERS_VALUE4,
    debriefRanges.GEN_NPIS_DRIVERS_VALUE5,
    debriefRanges.GEN_NPIS_DRIVERS_CUM1,
    debriefRanges.GEN_NPIS_DRIVERS_CUM2,
    debriefRanges.GEN_NPIS_DRIVERS_CUM3,
    debriefRanges.GEN_NPIS_DRIVERS_CUM4,
    debriefRanges.GEN_NPIS_DRIVERS_CUM5,
    debriefRanges.GEN_NPIS_LABEL,
    debriefRanges.GEN_NPIS,
    debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT1,
    debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT2,
    debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT3,
    debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT4,
    debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT5,
    debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT1,
    debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT2,
    debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT3,
    debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT4,
    debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT5,
    debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT1,
    debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT2,
    debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT3,
    debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT4,
    debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT5,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2,
    EVENT_RANGE_NAMES.EVENT_2_ROUND_1,
    EVENT_RANGE_NAMES.EVENT_3_ROUND_1,
  ]);

  // Parse values from CalcModel to populate drivers array
  const drivers = [
    {
      name: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL1] || "Driver 1",
      decision: calcValues[debriefRanges.GEN_NPIS_DRIVERS_VALUE1] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.GEN_NPIS_DRIVERS_CUM1] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT1]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT1]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT1]) || 0,
      shortName: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL1] || "Driver 1"
    },
    {
      name: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL2] || "Driver 2",
      decision: calcValues[debriefRanges.GEN_NPIS_DRIVERS_VALUE2] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.GEN_NPIS_DRIVERS_CUM2] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT2]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT2]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT2]) || 0,
      shortName: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL2] || "Driver 2"
    },
    {
      name: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL3] || "Driver 3",
      decision: calcValues[debriefRanges.GEN_NPIS_DRIVERS_VALUE3] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.GEN_NPIS_DRIVERS_CUM3] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT3]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT3]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT3]) || 0,
      shortName: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL3] || "Driver 3"
    },
    {
      name: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL4] || "Driver 4",
      decision: calcValues[debriefRanges.GEN_NPIS_DRIVERS_VALUE4] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.GEN_NPIS_DRIVERS_CUM4] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT4]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT4]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT4]) || 0,
      shortName: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL4] || "Driver 4"
    },
    {
      name: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL5] || "Driver 5",
      decision: calcValues[debriefRanges.GEN_NPIS_DRIVERS_VALUE5] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.GEN_NPIS_DRIVERS_CUM5] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MINIMPACT5]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_MAXIMPACT5]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.GEN_NPIS_DRIVERS_ACTUALIMPACT5]) || 0,
      shortName: calcValues[debriefRanges.GEN_NPIS_DRIVERS_LABEL5] || "Driver 5"
    }
  ];

  // Check SI3 (Strategic Initiative 3) - check both slots
  const si3Selected = [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2],
  ].includes("SI3");

  // Check SI5 (Strategic Initiative 5) - check both slots
  const si5Selected = [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2],
  ].includes("SI5");

  // Check Event 2 selection (A or B)
  const event2Selection = calcValues[EVENT_RANGE_NAMES.EVENT_2_ROUND_1] || "";
  const event2OptionA = event2Selection === "A";
  const event2OptionB = event2Selection === "B";

  // Check Event 3 selection (A, B, or C)
  const event3Selection = calcValues[EVENT_RANGE_NAMES.EVENT_3_ROUND_1] || "";
  const event3OptionA = event3Selection === "A";
  const event3OptionB = event3Selection === "B";
  const event3OptionC = event3Selection === "C";

  // Build array with ALL possible items that impact Active Gen NPIs
  const genNPIsImpactingItems = [
    // Initiatives
    {
      id: 'SI3',
      name: getInitiativeTitleByModelValue('SI3'),
      type: 'Initiative',
      impact: '+',
      selected: si3Selected,
    },
    {
      id: 'SI5',
      name: getInitiativeTitleByModelValue('SI5'),
      type: 'Initiative',
      impact: '+',
      selected: si5Selected,
    },
    // Event 2 Options
    {
      id: 'E2A',
      name: `Event 2 - ${getEventOptionTitle(1, 2, 'A')}`,
      type: 'Event',
      impact: '-',
      selected: event2OptionA,
    },
    {
      id: 'E2B',
      name: `Event 2 - ${getEventOptionTitle(1, 2, 'B')}`,
      type: 'Event',
      impact: '+',
      selected: event2OptionB,
    },
    // Event 3 Options
    {
      id: 'E3A',
      name: `Event 3 - ${getEventOptionTitle(1, 3, 'A')}`,
      type: 'Event',
      impact: '-',
      selected: event3OptionA,
    },
    {
      id: 'E3B',
      name: `Event 3 - ${getEventOptionTitle(1, 3, 'B')}`,
      type: 'Event',
      impact: '+',
      selected: event3OptionB,
    },
    {
      id: 'E3C',
      name: `Event 3 - ${getEventOptionTitle(1, 3, 'C')}`,
      type: 'Event',
      impact: '+',
      selected: event3OptionC,
    },
  ];

  /**
   * Calculate intelligent selected count based on constraints:
   * - Max 2 initiatives can be selected per round
   * - Max 1 option can be selected per event
   */
  const calculateSmartCounts = (items: typeof genNPIsImpactingItems) => {
    // Separate initiatives and events
    const initiatives = items.filter(item => item.type === 'Initiative');
    const events = items.filter(item => item.type === 'Event');
    
    // Group events by event number (extract from id: E2A -> Event 2, E3B -> Event 3)
    const eventGroups = new Map<string, typeof items>();
    events.forEach(item => {
      const eventNum = item.id.substring(0, 2); // 'E2' or 'E3'
      if (!eventGroups.has(eventNum)) {
        eventGroups.set(eventNum, []);
      }
      eventGroups.get(eventNum)!.push(item);
    });
    
    // Calculate maximum selectable
    const maxInitiatives = Math.min(initiatives.length, 2); // Max 2 initiatives per round
    const maxEvents = eventGroups.size; // 1 per unique event
    const maxSelectable = maxInitiatives + maxEvents;
    
    // Calculate actual selected
    const initiativesSelected = initiatives.filter(item => item.selected).length;
    const eventsSelected = Array.from(eventGroups.values())
      .filter(group => group.some(item => item.selected))
      .length; // Count 1 per event group if any option is selected
    const actualSelected = initiativesSelected + eventsSelected;
    
    return {
      selected: actualSelected,
      maxSelectable: maxSelectable,
    };
  };

  // Calculate selected count intelligently
  const { selected: selectedCount, maxSelectable } = calculateSmartCounts(genNPIsImpactingItems);

  /**
   * Transform flat items list into hierarchical structure for display
   * Groups: Initiatives (flat) → Events (grouped with headers)
   */
  const createHierarchicalDisplay = (items: typeof genNPIsImpactingItems) => {
    const initiatives = items.filter(item => item.type === 'Initiative');
    const events = items.filter(item => item.type === 'Event');
    
    // Group events by event number
    const eventGroupsMap = new Map<string, {
      eventNum: string,
      eventTitle: string,
      options: typeof items
    }>();
    
    events.forEach(item => {
      const eventNum = item.id.substring(0, 2); // 'E2' or 'E3'
      const eventNumber = parseInt(eventNum.substring(1)); // 2 or 3
      
      if (!eventGroupsMap.has(eventNum)) {
        // Get event title from Content.ts
        const event = getEventByRoundAndNumber(1, eventNumber);
        eventGroupsMap.set(eventNum, {
          eventNum,
          eventTitle: event?.title || `Event ${eventNumber}`,
          options: []
        });
      }
      eventGroupsMap.get(eventNum)!.options.push(item);
    });
    
    return {
      initiatives,
      eventGroups: Array.from(eventGroupsMap.values())
    };
  };

  /**
   * Strip "Event X - " prefix from event option names for cleaner display
   * Example: "Event 2 - Don't Delay" → "Don't Delay"
   */
  const stripEventPrefix = (name: string): string => {
    return name.replace(/^Event \d+ - /, '');
  };

  // Smart number formatter that adapts to value scale
  const formatSmartNumber = (value: number, decimals: number = 1): string => {
    const absValue = Math.abs(value);
    
    if (absValue >= 1e9) {
      return `${(value / 1e9).toFixed(decimals)}B`;
    } else if (absValue >= 1e6) {
      return `${(value / 1e6).toFixed(decimals)}M`;
    } else if (absValue >= 1e3) {
      return `${(value / 1e3).toFixed(decimals)}K`;
    }
    
    return value.toFixed(decimals);
  };

  // Format whole numbers with commas, no decimals
  const formatNumber = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Transform drivers into chart data for Recharts
  // Option A: Two stacked bars - transparent (rangeMin) + colored (range)
  const chartData = drivers.map((driver) => ({
    name: driver.shortName,
    rangeMin: driver.rangeMin, // Transparent bar (can be negative)
    range: driver.rangeMax - driver.rangeMin, // Visible bar (the range)
    rangeMax: driver.rangeMax, // Keep for tooltip
    teamOutcome: driver.teamOutcome,
  }));

  // Calculate domain with nice ticks using utility function
  const allMinValues = drivers.map(d => d.rangeMin);
  const allMaxValues = drivers.map(d => d.rangeMax);
  const allOutcomes = drivers.map(d => d.teamOutcome);

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
        <p className="text-sm text-muted-foreground">
          Actual: {formatSmartNumber(data.teamOutcome, 1)}
        </p>
        <p className="text-sm text-muted-foreground">
          Max (Potential): {formatSmartNumber(data.rangeMax, 1)}
        </p>
        <p className="text-sm text-muted-foreground">
          Min (Potential): {formatSmartNumber(data.rangeMin, 1)}
        </p>
      </div>
    );
  };

  // Chart configuration
  const chartConfig = {
    range: {
      label: "Impact Range",
      color: "hsl(var(--secondary))",
    },
  };
  return <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">{PAGE_CONTENT.DEBRIEF.GEN_NPIS.TITLE}</h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DEBRIEF.GEN_NPIS.DESCRIPTION}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Table */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Active Generalist NPI Drivers</h2>
              
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
                    className={`grid grid-cols-3 gap-4 p-4 border-b border-white/10 last:border-b-0 ${
                      index % 2 === 0 ? 'bg-muted/30' : 'bg-muted/50'
                    }`}
                  >
                    <div className="font-medium text-foreground">{driver.name}</div>
                    
                    {index === 4 ? (
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
                  <span className="text-lg font-semibold text-foreground">
                    {calcValues[debriefRanges.GEN_NPIS_LABEL] || "Active Generalist NPIs"}
                  </span>
                  <span></span>
                  <span className="text-xl font-bold text-foreground text-center">
                    {formatNumber(parseFloat(calcValues[debriefRanges.GEN_NPIS] || "0"))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Chart */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">{PAGE_CONTENT.DEBRIEF.GEN_NPIS.CHART_TITLE}</h2>
              
              <ChartContainer config={chartConfig} className="h-[500px] w-full">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 5 }}
                  >
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
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <ReferenceLine 
                      y={0} 
                      stroke="hsl(var(--foreground))" 
                      strokeWidth={1}
                      strokeOpacity={1}
                      strokeDasharray="0"
                    />
                    {/* Transparent bar for rangeMin (supports negative values) */}
                    <Bar 
                      dataKey="rangeMin" 
                      fill="transparent" 
                      stackId="range"
                    />
                    
                    {/* Visible bar for the range */}
                    <Bar 
                      dataKey="range" 
                      fill="hsl(var(--secondary))" 
                      radius={[4, 4, 4, 4]}
                      stackId="range"
                    />
                    
                    {/* Scatter overlay for triangle markers */}
                    <Scatter
                      dataKey="teamOutcome"
                      fill="white"
                      shape={(props: any) => {
                        const { cx, cy } = props;
                        return (
                          <TriangleMarker
                            cx={cx}
                            cy={cy}
                            size={6}
                            fill="white"
                          />
                        );
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

      {/* Initiatives & Events Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl px-6 py-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">Initiatives & Events Impacting Active Generalist NPIs</DialogTitle>
                <DialogDescription className="text-base">
                  This table shows which initiatives and events impact Active Generalist NPIs, the direction of the effect, and whether your team selected them.
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
                {(() => {
                  const { initiatives, eventGroups } = createHierarchicalDisplay(genNPIsImpactingItems);
                  
                  return (
                    <>
                      {/* Special Initiatives Header Row */}
                      {initiatives.length > 0 && (
                        <tr className="border-b border-white/10 bg-muted/80">
                          <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                            Special Initiatives
                          </td>
                        </tr>
                      )}
                      
                      {/* Render Initiatives (indented) */}
                      {initiatives.map((item, index) => (
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
                      
                      {/* Render Event Groups (hierarchical) */}
                      {eventGroups.map((eventGroup) => (
                        <>
                          {/* Event Header Row */}
                          <tr key={`header-${eventGroup.eventNum}`} className="border-b border-white/10 bg-muted/80">
                            <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                              {eventGroup.eventTitle}
                            </td>
                          </tr>
                          
                          {/* Event Options (indented) */}
                          {eventGroup.options.map((option, optionIndex) => (
                            <tr 
                              key={option.id}
                              className={`border-b border-white/10 ${optionIndex % 2 === 0 ? 'bg-muted/30' : 'bg-muted/50'}`}
                            >
                              <td className="p-3 pl-8">{stripEventPrefix(option.name)}</td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center">
                                  {option.impact === '+' ? (
                                    <ArrowUp className="text-green-400" size={20} strokeWidth={2.5} />
                                  ) : (
                                    <ArrowDown className="text-red-400" size={20} strokeWidth={2.5} />
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={option.selected}
                                    disabled
                                    className={option.selected 
                                      ? "h-5 w-5 border-2 border-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400" 
                                      : "h-5 w-5 border-2 border-gray-500 bg-transparent"
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <NavigationControls backLabel="Back" nextLabel="Continue" showDashboard={false} />
    </AppLayout>;
}