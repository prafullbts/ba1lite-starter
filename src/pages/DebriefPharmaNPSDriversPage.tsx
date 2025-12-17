import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { ChartContainer } from "@/components/ui/chart";
import { YAxis, XAxis, Bar, ComposedChart, Scatter, Tooltip, ReferenceLine } from "recharts";
import { PAGE_CONTENT, markScreenAsVisited, getInitiativeTitleByModelValue, getEventOptionTitle, getEventByRoundAndNumber } from "@/Sim/Content";
import { useCalcValues } from "@/hooks/useCalcValue";
import { DEBRIEF_RANGE_NAMES, DEBRIEF_RANGE_NAMES_R2, STRATEGIC_INITIATIVE_RANGE_NAMES, EVENT_RANGE_NAMES, ROUND_MANAGEMENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
import { TriangleMarker } from "@/components/charts/TriangleMarker";
import { calculateNiceTicks } from "@/utils/chartUtils";
import { useCalc } from "@/contexts/CalcContext";
import { useEffect, useRef, useState } from "react";
import { Maximize2, ArrowUp, ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DebriefPharmaNPSDriversPage() {
  const { setValue, getValue } = useCalc();
  const hasMarkedVisited = useRef(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Select the appropriate debrief range object based on current round
  // Select the appropriate debrief range object based on current round
  const debriefRanges = currentRound === 2 ? DEBRIEF_RANGE_NAMES_R2 : DEBRIEF_RANGE_NAMES;

  // Mark screen as visited (SCREEN_13 in R2, SCREEN_15 in R1)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      const screenKey = currentRound === 2 ? 'SCREEN_13' : 'SCREEN_15';
      markScreenAsVisited(screenKey, setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue, getValue, currentRound]);

  // Fetch all Pharma NPS Drivers data from CalcModel (6 drivers)
  const calcValues = useCalcValues([
    // Labels
    debriefRanges.PHARMA_NPS_DRIVERS_LABEL1,
    debriefRanges.PHARMA_NPS_DRIVERS_LABEL2,
    debriefRanges.PHARMA_NPS_DRIVERS_LABEL3,
    debriefRanges.PHARMA_NPS_DRIVERS_LABEL4,
    debriefRanges.PHARMA_NPS_DRIVERS_LABEL5,
    debriefRanges.PHARMA_NPS_DRIVERS_LABEL6,
    // Values
    debriefRanges.PHARMA_NPS_DRIVERS_VALUE1,
    debriefRanges.PHARMA_NPS_DRIVERS_VALUE2,
    debriefRanges.PHARMA_NPS_DRIVERS_VALUE3,
    debriefRanges.PHARMA_NPS_DRIVERS_VALUE4,
    debriefRanges.PHARMA_NPS_DRIVERS_VALUE5,
    debriefRanges.PHARMA_NPS_DRIVERS_VALUE6,
    // Cumulative
    debriefRanges.PHARMA_NPS_DRIVERS_CUM1,
    debriefRanges.PHARMA_NPS_DRIVERS_CUM2,
    debriefRanges.PHARMA_NPS_DRIVERS_CUM3,
    debriefRanges.PHARMA_NPS_DRIVERS_CUM4,
    debriefRanges.PHARMA_NPS_DRIVERS_CUM5,
    debriefRanges.PHARMA_NPS_DRIVERS_CUM6,
    // MinImpact
    debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT1,
    debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT2,
    debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT3,
    debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT4,
    debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT5,
    debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT6,
    // MaxImpact
    debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT1,
    debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT2,
    debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT3,
    debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT4,
    debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT5,
    debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT6,
    // ActualImpact
    debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT1,
    debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT2,
    debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT3,
    debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT4,
    debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT5,
    debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT6,
    // Summary
    debriefRanges.PHARMA_NPS_LABEL,
    debriefRanges.PHARMA_NPS,
    // Revenue Per Interaction (non-round-aware label, R1 for current)
    DEBRIEF_RANGE_NAMES.PBREV_REV_P_TRANS_LABEL,
    DEBRIEF_RANGE_NAMES.PBREV_REV_P_TRANS_R1,
    // SI2 Initiative Data
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2,
    // SI16 Initiative Data (Round 2)
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2,
    // Round 2 Event Data (impacts Pharma NPS)
    EVENT_RANGE_NAMES.EVENT_2_ROUND_2,
    EVENT_RANGE_NAMES.EVENT_3_ROUND_2,
    EVENT_RANGE_NAMES.EVENT_4_ROUND_2,
    // Event 4 Data (impacts Pharma NPS)
    EVENT_RANGE_NAMES.EVENT_4_ROUND_1,
  ]);

  // Format large numbers with suffixes (B, M, K) - no dollar signs
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

  // Custom X-axis tick component for horizontal wrapping labels
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const text = payload.value;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    // Split text into lines (max 20 chars per line)
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

  // Check which pharma initiatives were selected (using same pattern as DebriefRetPharmVolDrivers)
  const si2Selected = [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2],
  ].includes("SI2");

  const si8Selected = [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2],
  ].includes("SI8");

  // Check SI16 selection (Round 2 only - Patient Engagement)
  const si16Selected = currentRound === 2 && [
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1],
    calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2],
  ].includes("SI16");

  // Check Round 2 Event selections (only relevant when currentRound === 2)
  // Event 3 - Ransomware (Option A = negative impact)
  const event3OptionA = currentRound === 2 && calcValues[EVENT_RANGE_NAMES.EVENT_3_ROUND_2] === "A";

  // Event 4 - Escalate opportunities (Option B = positive impact)
  const event4OptionB = currentRound === 2 && calcValues[EVENT_RANGE_NAMES.EVENT_4_ROUND_2] === "B";

  // Check Round 1 Event 4 selections (relevant when currentRound === 2)
  const event4OptionA_R1 = currentRound === 2 && calcValues[EVENT_RANGE_NAMES.EVENT_4_ROUND_1] === "A";
  
  // Check Event 4 Option A selection in Round 1 (when currently in Round 1)
  const event4OptionA_R1_Current = currentRound === 1 && calcValues[EVENT_RANGE_NAMES.EVENT_4_ROUND_1] === "A";

  // Build array with ALL possible items that impact Pharma NPS
  const pharmaNPSImpactingItems = [
    // Initiatives
    {
      id: 'SI2',
      name: currentRound === 2 ? `(R1) ${getInitiativeTitleByModelValue('SI2')}` : getInitiativeTitleByModelValue('SI2'),
      type: 'Initiative',
      impact: '+',
      selected: si2Selected,
      fromPreviousRound: true,
    },
    {
      id: 'SI8',
      name: currentRound === 2 ? `(R1) ${getInitiativeTitleByModelValue('SI8')}` : getInitiativeTitleByModelValue('SI8'),
      type: 'Initiative',
      impact: '+',
      selected: si8Selected,
      fromPreviousRound: true,
    },
    // Add SI16 conditionally for Round 2
    ...(currentRound === 2 ? [{
      id: 'SI16',
      name: getInitiativeTitleByModelValue('SI16'),
      type: 'Initiative',
      impact: '+',
      selected: si16Selected,
      fromPreviousRound: false,
    }] : []),
    // Add Event 4 Option A conditionally for Round 1
    ...(currentRound === 1 ? [{
      id: 'E4A',
      name: getEventOptionTitle(1, 4, 'A'),
      type: 'Event',
      impact: '-',
      selected: event4OptionA_R1_Current,
      fromPreviousRound: false,
    }] : []),
    // Add Round 2 Events conditionally
    ...(currentRound === 2 ? [
      // Round 1 Event 4 Option A (continuing impact)
      {
        id: 'E4A_R1',
        name: `(R1) ${getEventOptionTitle(1, 4, 'A')}`,
        type: 'Event',
        impact: '-',
        selected: event4OptionA_R1,
        fromPreviousRound: true,
        round: 1,
      },
      // Event 3 - Ransomware Option A (negative impact)
      {
        id: 'E3A',
        name: getEventOptionTitle(2, 3, 'A'),
        type: 'Event',
        impact: '-',
        selected: event3OptionA,
        fromPreviousRound: false,
      },
      // Event 4 - Escalate opportunities Option B
      {
        id: 'E4B',
        name: getEventOptionTitle(2, 4, 'B'),
        type: 'Event',
        impact: '+',
        selected: event4OptionB,
        fromPreviousRound: false,
      },
    ] : []),
  ];

  /**
   * Calculate intelligent selected count based on constraints:
   * - Max 2 initiatives can be selected per round
   * - Max 1 option can be selected per event
   */
  const calculateSmartCounts = (items: typeof pharmaNPSImpactingItems) => {
    // Separate initiatives and events
    const initiatives = items.filter(item => item.type === 'Initiative');
    const events = items.filter(item => item.type === 'Event');
    
    // Group events by UNIQUE round + event number combination
    const eventGroups = new Map<string, typeof items>();
    events.forEach(item => {
      // Create unique key: round + event number
      // E4A_R1 -> 'R1_E4', E3A -> 'R2_E3', E4B -> 'R2_E4'
      const round = item.fromPreviousRound ? 'R1' : 'R2';
      const eventNum = item.id.substring(0, 2); // 'E4'
      const uniqueKey = `${round}_${eventNum}`;
      
      if (!eventGroups.has(uniqueKey)) {
        eventGroups.set(uniqueKey, []);
      }
      eventGroups.get(uniqueKey)!.push(item);
    });
    
    // Calculate maximum selectable
    const maxInitiatives = Math.min(initiatives.length, 3); // Show up to 3 initiatives (2 from R1 + 1 from R2)
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
  const { selected: selectedCount, maxSelectable } = calculateSmartCounts(pharmaNPSImpactingItems);

  /**
   * Transform flat items list into hierarchical structure for display
   * Groups: Initiatives (flat) → Events (grouped with headers)
   */
  const createHierarchicalDisplay = (items: typeof pharmaNPSImpactingItems) => {
    const currentRoundInitiatives = items.filter(item => item.type === 'Initiative' && !item.fromPreviousRound);
    const previousRoundInitiatives = items.filter(item => item.type === 'Initiative' && item.fromPreviousRound);
    const currentRoundEvents = items.filter(item => item.type === 'Event' && !item.fromPreviousRound);
    const previousRoundEvents = items.filter(item => item.type === 'Event' && item.fromPreviousRound);
    
    // Group current round events by event number
    const eventGroupsMap = new Map<string, {
      eventNum: string,
      eventTitle: string,
      options: typeof items,
      round: number
    }>();
    
    currentRoundEvents.forEach(item => {
      const eventNum = item.id.substring(0, 2); // 'E4'
      const eventNumber = parseInt(eventNum.substring(1)); // 4
      
      if (!eventGroupsMap.has(eventNum)) {
        // Get event title from Content.ts
        const event = getEventByRoundAndNumber(currentRound, eventNumber);
        eventGroupsMap.set(eventNum, {
          eventNum,
          eventTitle: event?.title || `Event ${eventNumber}`,
          options: [],
          round: currentRound
        });
      }
      eventGroupsMap.get(eventNum)!.options.push(item);
    });
    
    // Group previous round events by event number
    const previousEventGroupsMap = new Map<string, {
      eventNum: string,
      eventTitle: string,
      options: typeof items,
      round: number
    }>();
    
    if (currentRound === 2 && previousRoundEvents.length > 0) {
      previousRoundEvents.forEach(item => {
        // Extract event number from id (e.g., 'E4A_R1' -> 'E4')
        const eventNum = item.id.includes('_R1') ? item.id.split('_')[0].substring(0, 2) : item.id.substring(0, 2);
        const eventNumber = parseInt(eventNum.substring(1));
        
        if (!previousEventGroupsMap.has(eventNum)) {
          const event = getEventByRoundAndNumber(1, eventNumber);
          previousEventGroupsMap.set(eventNum, {
            eventNum,
            eventTitle: `(R1) ${event?.title || `Event ${eventNumber}`}`,
            options: [],
            round: 1
          });
        }
        previousEventGroupsMap.get(eventNum)!.options.push(item);
      });
    }
    
    return {
      currentRoundInitiatives,
      previousRoundInitiatives,
      eventGroups: Array.from(eventGroupsMap.values()),
      previousRoundEventGroups: Array.from(previousEventGroupsMap.values())
    };
  };

  /**
   * Strip "(R1)" and "Event X - " prefixes from event option names for cleaner display
   * Example: "(R1) Event 4 - Bid on the RFP" → "Bid on the RFP"
   */
  const stripEventPrefix = (name: string): string => {
    return name.replace(/^\(R1\) /, '').replace(/^Event \d+ - /, '');
  };

  // Build drivers array dynamically from CalcModel (6 drivers)
  const drivers = [
    {
      name: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_LABEL1] || "",
      decision: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_VALUE1] || "0",
      cumulativeInvestment: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_CUM1] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT1]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT1]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT1]) || 0,
    },
    {
      name: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_LABEL2] || "",
      decision: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_VALUE2] || "0",
      cumulativeInvestment: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_CUM2] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT2]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT2]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT2]) || 0,
    },
    {
      name: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_LABEL3] || "",
      decision: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_VALUE3] || "0",
      cumulativeInvestment: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_CUM3] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT3]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT3]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT3]) || 0,
    },
    {
      name: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_LABEL4] || "",
      decision: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_VALUE4] || "0",
      cumulativeInvestment: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_CUM4] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT4]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT4]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT4]) || 0,
    },
    {
      name: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_LABEL5] || "",
      decision: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_VALUE5] || "0",
      cumulativeInvestment: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_CUM5] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT5]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT5]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT5]) || 0,
    },
    {
      name: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_LABEL6] || "",
      decision: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_VALUE6] || "0",
      cumulativeInvestment: calcValues[debriefRanges.PHARMA_NPS_DRIVERS_CUM6] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MINIMPACT6]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_MAXIMPACT6]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.PHARMA_NPS_DRIVERS_ACTUALIMPACT6]) || 0,
    },
  ];

  // Transform to chart data with stacked bar logic
  const chartData = drivers.map((driver, index) => ({
    name: driver.name,
    index: index,
    rangeMin: driver.rangeMin,
    range: driver.rangeMax - driver.rangeMin, // For stacked bar
    rangeMax: driver.rangeMax,
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
          <h1 className="text-2xl font-bold text-foreground mb-4">{PAGE_CONTENT.DEBRIEF.PHARMA_NPS.TITLE}</h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DEBRIEF.PHARMA_NPS.DESCRIPTION}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Table */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">{PAGE_CONTENT.DEBRIEF.PHARMA_NPS.TABLE_HEADER}</h2>
              
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
                    
                    {index === 5 ? (
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
                <div className="grid grid-cols-3 gap-4 items-center mb-3">
                  <span className="text-lg font-semibold text-foreground">{calcValues[debriefRanges.PHARMA_NPS_LABEL] || "Pharma NPS"}</span>
                  <span></span>
                  <span className="text-xl font-bold text-foreground text-center">
                    {parseFloat(calcValues[debriefRanges.PHARMA_NPS] || "0").toFixed(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center pt-4 mt-4 border-t-2 border-primary/30">
                  <span className="text-lg font-semibold text-foreground">{calcValues[DEBRIEF_RANGE_NAMES.PBREV_REV_P_TRANS_LABEL] || "Revenue Per Interaction"}</span>
                  <span></span>
                  <span className="text-xl font-bold text-foreground text-center">
                    ${parseFloat(calcValues[DEBRIEF_RANGE_NAMES.PBREV_REV_P_TRANS_R1] || "0").toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Chart */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">{PAGE_CONTENT.DEBRIEF.PHARMA_NPS.CHART_TITLE}</h2>
              
              <ChartContainer config={chartConfig} className="h-[600px] w-full">
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
                    domain={[domainMin, domainMax]}
                    ticks={ticks}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <ReferenceLine 
                    y={0} 
                    stroke="hsl(var(--foreground))" 
                    strokeWidth={1}
                    strokeOpacity={1}
                    strokeDasharray="0"
                  />
                  <Bar dataKey="rangeMin" fill="transparent" stackId="range" />
                  <Bar 
                    dataKey="range" 
                    fill="hsl(var(--secondary))" 
                    radius={[4, 4, 4, 4]} 
                    stackId="range" 
                  />
                  <Scatter
                    dataKey="teamOutcome"
                    fill="white"
                    shape={<TriangleMarker size={6} />}
                  />
                </ComposedChart>
              </ChartContainer>
              
              {/* Legend */}
              <div className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-6">
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
            <DialogTitle className="text-xl font-bold">Initiatives & Events Impacting Pharma NPS</DialogTitle>
            <DialogDescription className="text-base">
              This table shows which initiatives and events impact Pharma NPS, the direction of the effect, and whether your team selected them.
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
                  const { currentRoundInitiatives, previousRoundInitiatives, eventGroups, previousRoundEventGroups } = createHierarchicalDisplay(pharmaNPSImpactingItems);
                  
                  return (
                    <>
                      {/* Special Initiatives Header Row */}
                      {(currentRoundInitiatives.length > 0 || previousRoundInitiatives.length > 0) && (
                        <tr className="border-b border-white/10 bg-muted/80">
                          <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                            Special Initiatives
                          </td>
                        </tr>
                      )}
                      
                      {/* Render Previous Round Initiatives (with (R1) prefix, not italicized) */}
                      {previousRoundInitiatives.map((item, index) => (
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
                      
                      {/* Render Current Round Initiatives (indented, not italicized) */}
                      {currentRoundInitiatives.map((item, index) => (
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
                      
                      {/* Render Previous Round Event Groups (with (R1) prefix, not italicized) */}
                      {previousRoundEventGroups.map((eventGroup) => (
                        <React.Fragment key={`prev-event-group-${eventGroup.eventNum}`}>
                          {/* Event Header Row with (R1) prefix */}
                          <tr className="border-b border-white/10 bg-muted/80">
                            <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                              {eventGroup.eventTitle}
                            </td>
                          </tr>
                          
                          {/* Event Options (indented, not italicized) */}
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
                        </React.Fragment>
                      ))}
                      
                      {/* Render Current Round Event Groups (hierarchical, not italicized) */}
                      {eventGroups.map((eventGroup) => (
                        <React.Fragment key={`event-group-${eventGroup.eventNum}`}>
                          {/* Event Header Row */}
                          <tr className="border-b border-white/10 bg-muted/80">
                            <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                              {stripEventPrefix(eventGroup.eventTitle)}
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
                        </React.Fragment>
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