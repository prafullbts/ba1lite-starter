import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer } from "@/components/ui/chart";
import { YAxis, XAxis, Bar, BarChart, Scatter, ScatterChart, ComposedChart, Tooltip, ReferenceLine } from "recharts";
import { PAGE_CONTENT, markScreenAsVisited, getInitiativeTitleByModelValue, getEventOptionTitle, getEventByRoundAndNumber } from "@/Sim/Content";
import { useCalcValues } from "@/hooks/useCalcValue";
import { DEBRIEF_RANGE_NAMES_R2, STRATEGIC_INITIATIVE_RANGE_NAMES, EVENT_RANGE_NAMES, ROUND_MANAGEMENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
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

export default function DebriefSpecNPIsDrivers() {
  const { setValue, getValue } = useCalc();
  const hasMarkedVisited = useRef(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Use R2 ranges exclusively (not round-aware)
  const debriefRanges = DEBRIEF_RANGE_NAMES_R2;

  // Mark screen as visited when this page loads (Info Screen - Active Specialist NPIs)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      markScreenAsVisited('SCREEN_16', setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue, getValue]);

  // Fetch all needed values from CalcModel (6 drivers for SpecNPIs)
  const calcValues = useCalcValues([
    ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND,
    debriefRanges.SPEC_NPIS_DRIVERS_LABEL1,
    debriefRanges.SPEC_NPIS_DRIVERS_LABEL2,
    debriefRanges.SPEC_NPIS_DRIVERS_LABEL3,
    debriefRanges.SPEC_NPIS_DRIVERS_LABEL4,
    debriefRanges.SPEC_NPIS_DRIVERS_LABEL5,
    debriefRanges.SPEC_NPIS_DRIVERS_LABEL6,
    debriefRanges.SPEC_NPIS_DRIVERS_VALUE1,
    debriefRanges.SPEC_NPIS_DRIVERS_VALUE2,
    debriefRanges.SPEC_NPIS_DRIVERS_VALUE3,
    debriefRanges.SPEC_NPIS_DRIVERS_VALUE4,
    debriefRanges.SPEC_NPIS_DRIVERS_VALUE5,
    debriefRanges.SPEC_NPIS_DRIVERS_VALUE6,
    debriefRanges.SPEC_NPIS_DRIVERS_CUM1,
    debriefRanges.SPEC_NPIS_DRIVERS_CUM2,
    debriefRanges.SPEC_NPIS_DRIVERS_CUM3,
    debriefRanges.SPEC_NPIS_DRIVERS_CUM4,
    debriefRanges.SPEC_NPIS_DRIVERS_CUM5,
    debriefRanges.SPEC_NPIS_DRIVERS_CUM6,
    debriefRanges.SPEC_NPIS_LABEL,
    debriefRanges.SPEC_NPIS,
    debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT1,
    debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT2,
    debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT3,
    debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT4,
    debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT5,
    debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT6,
    debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT1,
    debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT2,
    debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT3,
    debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT4,
    debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT5,
    debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT6,
    debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT1,
    debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT2,
    debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT3,
    debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT4,
    debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT5,
    debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT6,
    // Round 1 initiative and event selections
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2,
    EVENT_RANGE_NAMES.EVENT_2_ROUND_1,
    EVENT_RANGE_NAMES.EVENT_3_ROUND_1,
    // Round 2 initiative and event selections
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1,
    STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2,
    EVENT_RANGE_NAMES.EVENT_2_ROUND_2,
    EVENT_RANGE_NAMES.EVENT_3_ROUND_2,
  ]);

  // Get current round
  const currentRound = parseInt(calcValues[ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND] || "1");

  // Parse values from CalcModel to populate drivers array (6 drivers)
  const drivers = [
    {
      name: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL1] || "Driver 1",
      decision: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_VALUE1] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_CUM1] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT1]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT1]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT1]) || 0,
      shortName: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL1] || "Driver 1"
    },
    {
      name: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL2] || "Driver 2",
      decision: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_VALUE2] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_CUM2] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT2]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT2]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT2]) || 0,
      shortName: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL2] || "Driver 2"
    },
    {
      name: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL3] || "Driver 3",
      decision: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_VALUE3] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_CUM3] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT3]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT3]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT3]) || 0,
      shortName: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL3] || "Driver 3"
    },
    {
      name: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL4] || "Driver 4",
      decision: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_VALUE4] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_CUM4] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT4]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT4]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT4]) || 0,
      shortName: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL4] || "Driver 4"
    },
    {
      name: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL5] || "Driver 5",
      decision: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_VALUE5] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_CUM5] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT5]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT5]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT5]) || 0,
      shortName: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL5] || "Driver 5"
    },
    {
      name: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL6] || "Driver 6",
      decision: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_VALUE6] || "Not Set",
      cumulativeInvestment: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_CUM6] || "0",
      rangeMin: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MINIMPACT6]) || 0,
      rangeMax: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_MAXIMPACT6]) || 0,
      teamOutcome: parseFloat(calcValues[debriefRanges.SPEC_NPIS_DRIVERS_ACTUALIMPACT6]) || 0,
      shortName: calcValues[debriefRanges.SPEC_NPIS_DRIVERS_LABEL6] || "Driver 6"
    }
  ];

  // Build array with ALL possible items that impact Active Specialist NPIs
  // Conditionally based on current round
  const specNPIsImpactingItems = (() => {
    if (currentRound === 1) {
      // Round 1: SI3, SI5, Event 2 Options A/B, Event 3 Options A/B/C
      const si3Selected = [
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1],
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2],
      ].includes("SI3");

      const si5Selected = [
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT1],
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND1_SLOT2],
      ].includes("SI5");

      const event2Selection = calcValues[EVENT_RANGE_NAMES.EVENT_2_ROUND_1] || "";
      const event3Selection = calcValues[EVENT_RANGE_NAMES.EVENT_3_ROUND_1] || "";

      return [
        {
          id: 'SI3',
          name: getInitiativeTitleByModelValue('SI3'),
          type: 'Initiative' as const,
          impact: '+',
          selected: si3Selected,
          fromPreviousRound: false,
        },
        {
          id: 'SI5',
          name: getInitiativeTitleByModelValue('SI5'),
          type: 'Initiative' as const,
          impact: '+',
          selected: si5Selected,
          fromPreviousRound: false,
        },
        {
          id: 'E2A',
          name: `Event 2 - ${getEventOptionTitle(1, 2, 'A')}`,
          type: 'Event' as const,
          impact: '-',
          selected: event2Selection === "A",
          fromPreviousRound: false,
        },
        {
          id: 'E2B',
          name: `Event 2 - ${getEventOptionTitle(1, 2, 'B')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event2Selection === "B",
          fromPreviousRound: false,
        },
        {
          id: 'E3A',
          name: `Event 3 - ${getEventOptionTitle(1, 3, 'A')}`,
          type: 'Event' as const,
          impact: '-',
          selected: event3Selection === "A",
          fromPreviousRound: false,
        },
        {
          id: 'E3B',
          name: `Event 3 - ${getEventOptionTitle(1, 3, 'B')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event3Selection === "B",
          fromPreviousRound: false,
        },
        {
          id: 'E3C',
          name: `Event 3 - ${getEventOptionTitle(1, 3, 'C')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event3Selection === "C",
          fromPreviousRound: false,
        },
      ];
    } else {
      // Round 2: SI12, SI14, SI17 (only 2 slots, so check both slots for all 3)
      // Event 2 Options A/C, Event 3 Option A
      // PLUS continuing impacts from R1 (italicized)
      const si12Selected = [
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1],
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2],
      ].includes("SI12");

      const si14Selected = [
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1],
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2],
      ].includes("SI14");

      const si17Selected = [
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT1],
        calcValues[STRATEGIC_INITIATIVE_RANGE_NAMES.SI_ROUND2_SLOT2],
      ].includes("SI17");

      const event2R2Selection = calcValues[EVENT_RANGE_NAMES.EVENT_2_ROUND_2] || "";
      const event3R2Selection = calcValues[EVENT_RANGE_NAMES.EVENT_3_ROUND_2] || "";

      // Get R1 selections for continuing impacts
      const event2R1Selection = calcValues[EVENT_RANGE_NAMES.EVENT_2_ROUND_1] || "";
      const event3R1Selection = calcValues[EVENT_RANGE_NAMES.EVENT_3_ROUND_1] || "";

      return [
        // Current Round 2 Initiatives (not italicized)
        {
          id: 'SI12',
          name: getInitiativeTitleByModelValue('SI12'),
          type: 'Initiative' as const,
          impact: '+',
          selected: si12Selected,
          fromPreviousRound: false,
        },
        {
          id: 'SI14',
          name: getInitiativeTitleByModelValue('SI14'),
          type: 'Initiative' as const,
          impact: '+',
          selected: si14Selected,
          fromPreviousRound: false,
        },
        {
          id: 'SI17',
          name: getInitiativeTitleByModelValue('SI17'),
          type: 'Initiative' as const,
          impact: '+',
          selected: si17Selected,
          fromPreviousRound: false,
        },
        // Current Round 2 Events (not italicized)
        {
          id: 'E2A_R2',
          name: `Event 2 - ${getEventOptionTitle(2, 2, 'A')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event2R2Selection === "A",
          fromPreviousRound: false,
        },
        {
          id: 'E2B_R2',
          name: `Event 2 - ${getEventOptionTitle(2, 2, 'B')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event2R2Selection === "B",
          fromPreviousRound: false,
        },
        {
          id: 'E3A_R2',
          name: `Event 3 - ${getEventOptionTitle(2, 3, 'A')}`,
          type: 'Event' as const,
          impact: '-',
          selected: event3R2Selection === "A",
          fromPreviousRound: false,
        },
        // R1 Continuing Impacts (italicized, prefixed with "(R1)")
        {
          id: 'E2A_R1',
          name: `(R1) Event 2 - ${getEventOptionTitle(1, 2, 'A')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event2R1Selection === "A",
          fromPreviousRound: true,
        },
        {
          id: 'E2B_R1',
          name: `(R1) Event 2 - ${getEventOptionTitle(1, 2, 'B')}`,
          type: 'Event' as const,
          impact: '-',
          selected: event2R1Selection === "B",
          fromPreviousRound: true,
        },
        {
          id: 'E3A_R1',
          name: `(R1) Event 3 - ${getEventOptionTitle(1, 3, 'A')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event3R1Selection === "A",
          fromPreviousRound: true,
        },
        {
          id: 'E3B_R1',
          name: `(R1) Event 3 - ${getEventOptionTitle(1, 3, 'B')}`,
          type: 'Event' as const,
          impact: '-',
          selected: event3R1Selection === "B",
          fromPreviousRound: true,
        },
        {
          id: 'E3C_R1',
          name: `(R1) Event 3 - ${getEventOptionTitle(1, 3, 'C')}`,
          type: 'Event' as const,
          impact: '+',
          selected: event3R1Selection === "C",
          fromPreviousRound: true,
        },
      ];
    }
  })();

  /**
   * Calculate intelligent selected count based on constraints:
   * - Max 2 initiatives for R1, max 3 initiatives for R2
   * - Max 1 option can be selected per event
   * - R1 continuing impacts are not counted toward current round limits
   */
  const calculateSmartCounts = (items: typeof specNPIsImpactingItems) => {
    // Separate current round items from previous round items
    const currentRoundItems = items.filter(item => !item.fromPreviousRound);
    const previousRoundItems = items.filter(item => item.fromPreviousRound);
    
    // Separate initiatives and events for current round
    const initiatives = currentRoundItems.filter(item => item.type === 'Initiative');
    const events = currentRoundItems.filter(item => item.type === 'Event');
    
    // Group current round events by event number
    const eventGroups = new Map<string, typeof items>();
    events.forEach(item => {
      // Extract event number from id (E2A_R2 -> E2, E3A_R2 -> E3)
      const eventNum = item.id.substring(0, 2);
      if (!eventGroups.has(eventNum)) {
        eventGroups.set(eventNum, []);
      }
      eventGroups.get(eventNum)!.push(item);
    });
    
    // Calculate maximum selectable (current round only)
    const maxInitiatives = currentRound === 1 ? Math.min(initiatives.length, 2) : Math.min(initiatives.length, 3);
    const maxEvents = eventGroups.size; // 1 per unique event
    const maxSelectable = maxInitiatives + maxEvents;
    
    // Calculate actual selected (current round + previous round)
    const initiativesSelected = initiatives.filter(item => item.selected).length;
    const eventsSelected = Array.from(eventGroups.values())
      .filter(group => group.some(item => item.selected))
      .length;
    const previousRoundSelected = previousRoundItems.filter(item => item.selected).length;
    const actualSelected = initiativesSelected + eventsSelected + previousRoundSelected;
    
    return {
      selected: actualSelected,
      maxSelectable: maxSelectable,
    };
  };

  // Calculate selected count intelligently
  const { selected: selectedCount } = calculateSmartCounts(specNPIsImpactingItems);
  
  // For Active Specialist NPIs: 2 initiatives + 4 events = 6 possible impacts
  const maxSelectable = 6;

  /**
   * Transform flat items list into hierarchical structure for display
   * Groups: Initiatives (flat) → Events (grouped with headers) → R1 Continuing Impacts
   */
  const createHierarchicalDisplay = (items: typeof specNPIsImpactingItems) => {
    const currentRoundInitiatives = items.filter(item => item.type === 'Initiative' && !item.fromPreviousRound);
    const currentRoundEvents = items.filter(item => item.type === 'Event' && !item.fromPreviousRound);
    const previousRoundEvents = items.filter(item => item.type === 'Event' && item.fromPreviousRound);
    
    // Group current round events by event number
    const currentEventGroupsMap = new Map<string, {
      eventNum: string,
      eventTitle: string,
      options: typeof items,
      round: number
    }>();
    
    currentRoundEvents.forEach(item => {
      const eventNum = item.id.substring(0, 2); // 'E2' or 'E3'
      const eventNumber = parseInt(eventNum.substring(1)); // 2 or 3
      
      if (!currentEventGroupsMap.has(eventNum)) {
        const event = getEventByRoundAndNumber(currentRound, eventNumber);
        currentEventGroupsMap.set(eventNum, {
          eventNum,
          eventTitle: event?.title || `Event ${eventNumber}`,
          options: [],
          round: currentRound
        });
      }
      currentEventGroupsMap.get(eventNum)!.options.push(item);
    });
    
    // Group previous round events by event number (if in Round 2)
    const previousEventGroupsMap = new Map<string, {
      eventNum: string,
      eventTitle: string,
      options: typeof items,
      round: number
    }>();
    
    if (currentRound === 2 && previousRoundEvents.length > 0) {
      previousRoundEvents.forEach(item => {
        const eventNum = item.id.substring(0, 2); // 'E2' or 'E3'
        const eventNumber = parseInt(eventNum.substring(1)); // 2 or 3
        
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
      initiatives: currentRoundInitiatives,
      eventGroups: Array.from(currentEventGroupsMap.values()),
      previousRoundEventGroups: Array.from(previousEventGroupsMap.values())
    };
  };

  /**
   * Strip "(R1)" and "Event X - " prefixes from event option names for cleaner display
   * Example: "(R1) Event 2 - Don't Delay" → "Don't Delay"
   */
  const stripEventPrefix = (name: string): string => {
    return name.replace(/^\(R1\) /, '').replace(/^Event \d+ - /, '');
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
  const chartData = drivers.map((driver) => ({
    name: driver.shortName,
    rangeMin: driver.rangeMin,
    range: driver.rangeMax - driver.rangeMin,
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
          <h1 className="text-2xl font-bold text-foreground mb-4">{PAGE_CONTENT.DEBRIEF.SPEC_NPIS.TITLE}</h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.DEBRIEF.SPEC_NPIS.DESCRIPTION}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Table */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Active Specialist NPI Drivers</h2>
              
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
                        {/* Row 6: Special handling for Initiatives & Events */}
                    {/* Decision column: Show count as plain text */}
                    <div className="text-center text-muted-foreground">
                      {selectedCount} of {maxSelectable} selected
                    </div>
                    
                    {/* Cumulative Capability column: Show expand icon */}
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
                        {/* Standard rows: Decision and Cumulative Capability */}
                        <div className="text-center text-muted-foreground">{driver.decision}</div>
                        <div className="text-center text-muted-foreground">{driver.cumulativeInvestment}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Bottom Total Row */}
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border border-white/10 rounded-lg items-center">
                  <span className="text-lg font-semibold text-foreground">
                    {calcValues[debriefRanges.SPEC_NPIS_LABEL] || "Active Specialist NPIs"}
                  </span>
                  <span></span>
                  <span className="text-xl font-bold text-foreground text-center">
                    {formatNumber(parseFloat(calcValues[debriefRanges.SPEC_NPIS] || "0"))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Chart */}
          <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">{PAGE_CONTENT.DEBRIEF.SPEC_NPIS.CHART_TITLE}</h2>
              
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
                  <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={0} 
                  stroke="hsl(var(--foreground))" 
                  strokeWidth={1}
                  strokeOpacity={1}
                  strokeDasharray="0"
                />
                  
                  {/* Transparent bar for rangeMin (can be negative) */}
                  <Bar 
                    dataKey="rangeMin" 
                    stackId="a" 
                    fill="transparent"
                  />
                  
                  {/* Visible bar for range (rangeMax - rangeMin) */}
                  <Bar 
                    dataKey="range" 
                    stackId="a" 
                    fill="hsl(var(--secondary))"
                    radius={[8, 8, 8, 8]}
                  />
                  
                  {/* Triangle markers for actual team outcomes */}
                  <Scatter
                    dataKey="teamOutcome"
                    shape={<TriangleMarker size={6} fill="white" />}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Details Dialog for Initiatives & Events */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl px-6 py-4">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-bold">Initiatives & Events Impacting Active Specialist NPIs</DialogTitle>
              <DialogDescription className="text-base">
                This table shows which initiatives and events impact Active Specialist NPIs, the direction of the effect, and whether your team selected them.
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
                    const { initiatives, eventGroups, previousRoundEventGroups } = createHierarchicalDisplay(specNPIsImpactingItems);
                    
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
                        
                        {/* Render Previous Round Event Groups (hierarchical, italicized) - R1 events */}
                        {previousRoundEventGroups.length > 0 && previousRoundEventGroups.map((eventGroup) => (
                          <>
                            {/* Event Header Row */}
                            <tr key={`header-${eventGroup.eventNum}-r1`} className="border-b border-white/10 bg-muted/80">
                              <td className="py-4 px-3 font-bold text-lg" colSpan={3}>
                                {eventGroup.eventTitle}
                              </td>
                            </tr>
                            
                            {/* Event Options (indented, italicized) */}
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
                        
                        {/* Render Current Round Event Groups (hierarchical) - R2 events */}
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

        {/* Navigation */}
        <NavigationControls backLabel="Back" nextLabel="Continue" showDashboard={false} />
      </div>
    </AppLayout>;
}
