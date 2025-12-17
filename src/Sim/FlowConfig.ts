/**
 * FLOW CONFIG - CENTRALIZED SCREEN FLOW MANAGEMENT
 * 
 * This file centralizes all screen flow logic, navigation, and tracking for the simulation.
 * It defines the complete flow for Round 1 and Round 2, including screen order, routes,
 * tracking keys, and navigation relationships.
 * 
 * This is the single source of truth for screen flow. Junior developers can modify this
 * file to change navigation without touching API integration or CalcService logic.
 */

import { SCREEN_TRACKING_RANGE_NAMES_R1, SCREEN_TRACKING_RANGE_NAMES_R2, ROUND_SUBMISSION_RANGE_NAMES } from './RangeNameMap';
import { PAGE_CONTENT } from './Content';

/**
 * Screen type categories for UI logic
 */
export type ScreenType = 
  | 'welcome'
  | 'strategy'
  | 'initiative'
  | 'event'
  | 'event-outcome'
  | 'decision'
  | 'decision-dashboard'
  | 'debrief'
  | 'financial'
  | 'round-complete';

/**
 * Simulation steps for backend state synchronization
 * This is the single source of truth for SimulationStep type
 * Used by Dec_and_State for state management and FlowConfig for screen mapping
 */
export type SimulationStep = 
  | 'dashboard'
  | 'initiatives'
  | 'initiative-impacts'
  | 'event-1' | 'event-1-impacts'
  | 'event-2' | 'event-2-impacts'
  | 'investments'
  | 'event-3' | 'event-3-impacts'
  | 'event-4' | 'event-4-impacts'
  | 'results'
  | 'final-results';

/**
 * Complete screen configuration
 */
export interface ScreenConfig {
  id: string;                    // Unique identifier (e.g., 'welcome', 'strategy-planning')
  route: string;                 // React Router path
  title: string;                 // Display name
  screenTrackingKey: keyof typeof SCREEN_TRACKING_RANGE_NAMES_R1 | keyof typeof SCREEN_TRACKING_RANGE_NAMES_R2; // CalcModel tracking
  simulationStep?: SimulationStep; // Optional: maps to Dec_and_State.currentStep for backend sync
  nextScreen?: string;           // ID of next screen (undefined for last screen)
  previousScreen?: string;       // ID of previous screen (undefined for first screen)
  dashboardRoute?: string;       // Where dashboard button goes (default: '/dashboard')
  type: ScreenType;              // Category for UI logic
  isSkipScreen?: boolean;        // True for screens that are tracked but auto-skipped in navigation
}

/**
 * ROUND 1 FLOW CONFIGURATION
 */
export const ROUND_1_FLOW: Record<string, ScreenConfig> = {
  'welcome': {
    id: 'welcome',
    route: '/',
    title: 'Welcome Screen',
    screenTrackingKey: 'SCREEN_1',
    nextScreen: 'strategy-planning',
    type: 'welcome'
  },
  'strategy-planning': {
    id: 'strategy-planning',
    route: '/strategy-planning',
    title: 'Strategy Planning',
    screenTrackingKey: 'SCREEN_2',
    simulationStep: 'dashboard',
    nextScreen: 'key-initiatives',
    previousScreen: 'welcome',
    type: 'strategy'
  },
  'key-initiatives': {
    id: 'key-initiatives',
    route: '/initiatives',
    title: 'Key Initiatives',
    screenTrackingKey: 'SCREEN_3',
    simulationStep: 'initiatives',
    nextScreen: 'initiative-impacts',
    previousScreen: 'strategy-planning',
    dashboardRoute: '/dashboard',
    type: 'initiative'
  },
  'initiative-impacts': {
    id: 'initiative-impacts',
    route: '/initiative-impacts',
    title: 'Initiative Impacts',
    screenTrackingKey: 'SCREEN_4',
    simulationStep: 'initiative-impacts',
    nextScreen: 'event-1',
    previousScreen: 'key-initiatives',
    dashboardRoute: '/dashboard',
    type: 'initiative'
  },
  'event-1': {
    id: 'event-1',
    route: '/events/1/1',
    title: 'Event 1',
    screenTrackingKey: 'SCREEN_5',
    simulationStep: 'event-1',
    nextScreen: 'event-1-impacts',
    previousScreen: 'initiative-impacts',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-1-impacts': {
    id: 'event-1-impacts',
    route: '/event-outcomes/1/1',
    title: 'Event 1 Outcome',
    screenTrackingKey: 'SCREEN_5',
    simulationStep: 'event-1-impacts',
    nextScreen: 'event-2',
    previousScreen: 'event-1',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  'event-2': {
    id: 'event-2',
    route: '/events/1/2',
    title: 'Event 2',
    screenTrackingKey: 'SCREEN_6',
    simulationStep: 'event-2',
    nextScreen: 'event-2-impacts',
    previousScreen: 'event-1-impacts',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-2-impacts': {
    id: 'event-2-impacts',
    route: '/event-outcomes/1/2',
    title: 'Event 2 Outcome',
    screenTrackingKey: 'SCREEN_6',
    simulationStep: 'event-2-impacts',
    nextScreen: 'dashboard-decisions',
    previousScreen: 'event-2',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  'dashboard-decisions': {
    id: 'dashboard-decisions',
    route: '/dashboard',
    title: 'Investment Decisions Dashboard',
    screenTrackingKey: 'SCREEN_7',
    simulationStep: 'investments',
    nextScreen: 'bu1',
    previousScreen: 'event-2-impacts',
    type: 'decision-dashboard'
  },
  // Decision screens: BU1, BU2, Corporate
  'bu1': {
    id: 'bu1',
    route: '/bu1',
    title: 'Business Unit 1',
    screenTrackingKey: 'SCREEN_7',
    nextScreen: 'bu2',
    previousScreen: 'corporate',
    dashboardRoute: '/dashboard',
    type: 'decision'
  },
  'bu2': {
    id: 'bu2',
    route: '/bu2',
    title: 'Business Unit 2',
    screenTrackingKey: 'SCREEN_7',
    nextScreen: 'corporate',
    previousScreen: 'bu1',
    dashboardRoute: '/dashboard',
    type: 'decision'
  },
  'corporate': {
    id: 'corporate',
    route: '/corporate',
    title: 'Corporate',
    screenTrackingKey: 'SCREEN_8',
    nextScreen: 'bu1',
    previousScreen: 'bu2',
    dashboardRoute: '/dashboard',
    type: 'decision'
  },
  'event-3': {
    id: 'event-3',
    route: '/events/1/3',
    title: 'Event 3',
    screenTrackingKey: 'SCREEN_9',
    simulationStep: 'event-3',
    nextScreen: 'event-3-impacts',
    previousScreen: 'corporate',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-3-impacts': {
    id: 'event-3-impacts',
    route: '/event-outcomes/1/3',
    title: 'Event 3 Outcome',
    screenTrackingKey: 'SCREEN_9',
    simulationStep: 'event-3-impacts',
    nextScreen: 'event-4',
    previousScreen: 'event-3',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  'event-4': {
    id: 'event-4',
    route: '/events/1/4',
    title: 'Event 4',
    screenTrackingKey: 'SCREEN_10',
    simulationStep: 'event-4',
    nextScreen: 'event-4-impacts',
    previousScreen: 'event-3-impacts',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-4-impacts': {
    id: 'event-4-impacts',
    route: '/event-outcomes/1/4',
    title: 'Event 4 Outcome',
    screenTrackingKey: 'SCREEN_10',
    simulationStep: 'event-4-impacts',
    nextScreen: 'debrief-pbnh',
    previousScreen: 'event-4',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  // DEBRIEF SCREENS - Round 1 sequence
  'debrief-pbnh': {
    id: 'debrief-pbnh',
    route: '/debrief-pbnh',
    title: 'Pharmacy Benefits Network Health',
    screenTrackingKey: 'SCREEN_11',
    simulationStep: 'final-results',
    nextScreen: 'debrief-gennpis',
    previousScreen: 'dashboard-decisions',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-gennpis': {
    id: 'debrief-gennpis',
    route: '/debrief-gennpis',
    title: 'Active Generalist NPIs',
    screenTrackingKey: 'SCREEN_12',
    nextScreen: 'debrief-retpharmvol',
    previousScreen: 'debrief-pbnh',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-retpharmvol': {
    id: 'debrief-retpharmvol',
    route: '/debrief-retpharmvol',
    title: 'Retail Pharmacy Scripts',
    screenTrackingKey: 'SCREEN_13',
    nextScreen: 'skip-screen-14',
    previousScreen: 'debrief-gennpis',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'skip-screen-14': {
    id: 'skip-screen-14',
    route: '/debrief-retpharmvol', // Same route as previous - doesn't render
    title: 'Skip Screen 14',
    screenTrackingKey: 'SCREEN_14',
    nextScreen: 'debrief-pharmanps',
    previousScreen: 'debrief-retpharmvol',
    isSkipScreen: true,
    type: 'debrief'
  },
  'debrief-pharmanps': {
    id: 'debrief-pharmanps',
    route: '/debrief-pharmanps',
    title: 'Pharma NPS',
    screenTrackingKey: 'SCREEN_15',
    nextScreen: 'debrief-pbrev',
    previousScreen: 'debrief-retpharmvol',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-pbrev': {
    id: 'debrief-pbrev',
    route: '/debrief-pbrevenue',
    title: 'Pharmacy Benefits Revenue',
    screenTrackingKey: 'SCREEN_16',
    nextScreen: 'skip-screen-17',
    previousScreen: 'debrief-pharmanps',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'skip-screen-17': {
    id: 'skip-screen-17',
    route: '/debrief-pbrevenue', // Same route as previous - doesn't render
    title: 'Skip Screen 17',
    screenTrackingKey: 'SCREEN_17',
    nextScreen: 'financial-statement',
    previousScreen: 'debrief-pbrev',
    isSkipScreen: true,
    type: 'debrief'
  },
  'financial-statement': {
    id: 'financial-statement',
    route: '/financial-statement',
    title: 'Income Statement',
    screenTrackingKey: 'SCREEN_18',
    nextScreen: 'round-completed',
    previousScreen: 'debrief-pbrev',
    dashboardRoute: '/dashboard',
    type: 'financial'
  },
  'round-completed': {
    id: 'round-completed',
    route: '/round-completed',
    title: 'Round Completed',
    screenTrackingKey: 'SCREEN_18', // Same tracking as financial
    previousScreen: 'financial-statement',
    type: 'round-complete'
  }
};

/**
 * ROUND 2 FLOW CONFIGURATION
 */
export const ROUND_2_FLOW: Record<string, ScreenConfig> = {
  // Same welcome, strategy, initiatives, events 1-2, and decisions as R1
  'welcome': {
    id: 'welcome',
    route: '/',
    title: 'Welcome Screen',
    screenTrackingKey: 'SCREEN_1',
    nextScreen: 'strategy-planning',
    type: 'welcome'
  },
  'strategy-planning': {
    id: 'strategy-planning',
    route: '/strategy-planning',
    title: 'Strategy Planning',
    screenTrackingKey: 'SCREEN_2',
    simulationStep: 'dashboard',
    nextScreen: 'key-initiatives',
    previousScreen: 'welcome',
    type: 'strategy'
  },
  'key-initiatives': {
    id: 'key-initiatives',
    route: '/initiatives',
    title: 'Key Initiatives',
    screenTrackingKey: 'SCREEN_3',
    simulationStep: 'initiatives',
    nextScreen: 'initiative-impacts',
    previousScreen: 'strategy-planning',
    dashboardRoute: '/dashboard',
    type: 'initiative'
  },
  'initiative-impacts': {
    id: 'initiative-impacts',
    route: '/initiative-impacts',
    title: 'Initiative Impacts',
    screenTrackingKey: 'SCREEN_4',
    simulationStep: 'initiative-impacts',
    nextScreen: 'event-1',
    previousScreen: 'key-initiatives',
    dashboardRoute: '/dashboard',
    type: 'initiative'
  },
  'event-1': {
    id: 'event-1',
    route: '/events/2/1',
    title: 'Event 1',
    screenTrackingKey: 'SCREEN_5',
    simulationStep: 'event-1',
    nextScreen: 'event-1-impacts',
    previousScreen: 'initiative-impacts',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-1-impacts': {
    id: 'event-1-impacts',
    route: '/event-outcomes/2/1',
    title: 'Event 1 Outcome',
    screenTrackingKey: 'SCREEN_5',
    simulationStep: 'event-1-impacts',
    nextScreen: 'event-2',
    previousScreen: 'event-1',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  'event-2': {
    id: 'event-2',
    route: '/events/2/2',
    title: 'Event 2',
    screenTrackingKey: 'SCREEN_6',
    simulationStep: 'event-2',
    nextScreen: 'event-2-impacts',
    previousScreen: 'event-1-impacts',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-2-impacts': {
    id: 'event-2-impacts',
    route: '/event-outcomes/2/2',
    title: 'Event 2 Outcome',
    screenTrackingKey: 'SCREEN_6',
    simulationStep: 'event-2-impacts',
    nextScreen: 'dashboard-decisions',
    previousScreen: 'event-2',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  'dashboard-decisions': {
    id: 'dashboard-decisions',
    route: '/dashboard',
    title: 'Investment Decisions Dashboard',
    screenTrackingKey: 'SCREEN_7',
    simulationStep: 'investments',
    nextScreen: 'bu1',
    previousScreen: 'event-2-impacts',
    type: 'decision-dashboard'
  },
  // Decision screens: BU1, BU2, Corporate
  'bu1': {
    id: 'bu1',
    route: '/bu1',
    title: 'Business Unit 1',
    screenTrackingKey: 'SCREEN_7',
    nextScreen: 'bu2',
    previousScreen: 'corporate',
    dashboardRoute: '/dashboard',
    type: 'decision'
  },
  'bu2': {
    id: 'bu2',
    route: '/bu2',
    title: 'Business Unit 2',
    screenTrackingKey: 'SCREEN_7',
    nextScreen: 'corporate',
    previousScreen: 'bu1',
    dashboardRoute: '/dashboard',
    type: 'decision'
  },
  'corporate': {
    id: 'corporate',
    route: '/corporate',
    title: 'Corporate',
    screenTrackingKey: 'SCREEN_8',
    nextScreen: 'bu1',
    previousScreen: 'bu2',
    dashboardRoute: '/dashboard',
    type: 'decision'
  },
  'event-3': {
    id: 'event-3',
    route: '/events/2/3',
    title: 'Event 3',
    screenTrackingKey: 'SCREEN_9',
    simulationStep: 'event-3',
    nextScreen: 'event-3-impacts',
    previousScreen: 'corporate',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-3-impacts': {
    id: 'event-3-impacts',
    route: '/event-outcomes/2/3',
    title: 'Event 3 Outcome',
    screenTrackingKey: 'SCREEN_9',
    simulationStep: 'event-3-impacts',
    nextScreen: 'event-4',
    previousScreen: 'event-3',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-4': {
    id: 'event-4',
    route: '/events/2/4',
    title: 'Event 4',
    screenTrackingKey: 'SCREEN_10',
    simulationStep: 'event-4',
    nextScreen: 'event-4-impacts',
    previousScreen: 'event-3-impacts',
    dashboardRoute: '/dashboard',
    type: 'event'
  },
  'event-4-impacts': {
    id: 'event-4-impacts',
    route: '/event-outcomes/2/4',
    title: 'Event 4 Outcome',
    screenTrackingKey: 'SCREEN_10',
    simulationStep: 'event-4-impacts',
    nextScreen: 'debrief-pbnh',
    previousScreen: 'event-4',
    dashboardRoute: '/dashboard',
    type: 'event-outcome'
  },
  // DEBRIEF SCREENS - Round 2 sequence (different order and new screens)
  'debrief-pbnh': {
    id: 'debrief-pbnh',
    route: '/debrief-pbnh',
    title: 'Pharmacy Benefits Network Health',
    screenTrackingKey: 'SCREEN_11',
    simulationStep: 'final-results',
    nextScreen: 'debrief-pbrev',
    previousScreen: 'dashboard-decisions',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-pbrev': {
    id: 'debrief-pbrev',
    route: '/debrief-pbrevenue',
    title: 'Pharmacy Benefits Revenue',
    screenTrackingKey: 'SCREEN_12', // NEW position in R2
    nextScreen: 'debrief-pharmanps',
    previousScreen: 'debrief-pbnh',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-pharmanps': {
    id: 'debrief-pharmanps',
    route: '/debrief-pharmanps',
    title: 'Pharma NPS',
    screenTrackingKey: 'SCREEN_13', // NEW position in R2
    nextScreen: 'debrief-mbrev',
    previousScreen: 'debrief-pbrev',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-mbrev': {
    id: 'debrief-mbrev',
    route: '/debrief-mbrevenue',
    title: 'Medical Benefits Revenue',
    screenTrackingKey: 'SCREEN_14', // NEW in R2
    nextScreen: 'debrief-mbnh',
    previousScreen: 'debrief-pharmanps',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-mbnh': {
    id: 'debrief-mbnh',
    route: '/debrief-mbnh',
    title: 'Medical Benefits Network Health',
    screenTrackingKey: 'SCREEN_15', // Changed from SCREEN_14
    nextScreen: 'debrief-specnpis',
    previousScreen: 'debrief-mbrev',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-specnpis': {
    id: 'debrief-specnpis',
    route: '/debrief-specnpis',
    title: 'Active Specialist NPIs',
    screenTrackingKey: 'SCREEN_16', // Changed from SCREEN_15
    nextScreen: 'debrief-specpharmvol',
    previousScreen: 'debrief-mbnh',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'debrief-specpharmvol': {
    id: 'debrief-specpharmvol',
    route: '/debrief-specpharmvol',
    title: 'Specialty Pharmacy Scripts',
    screenTrackingKey: 'SCREEN_17', // Changed from SCREEN_16
    nextScreen: 'financial-statement',
    previousScreen: 'debrief-specnpis',
    dashboardRoute: '/dashboard',
    type: 'debrief'
  },
  'financial-statement': {
    id: 'financial-statement',
    route: '/financial-statement',
    title: 'Income Statement',
    screenTrackingKey: 'SCREEN_18',
    nextScreen: 'round-completed',
    previousScreen: 'debrief-specpharmvol',
    dashboardRoute: '/dashboard',
    type: 'financial'
  },
  'round-completed': {
    id: 'round-completed',
    route: '/round-completed',
    title: 'Round Completed',
    screenTrackingKey: 'SCREEN_18', // Same tracking as financial
    previousScreen: 'financial-statement',
    type: 'round-complete'
  }
};

/**
 * HELPER FUNCTIONS
 */

/**
 * Get current round from CalcModel
 */
export function getCurrentRound(getValue: (key: string) => string): number {
  return parseInt(getValue('tlInputTeamRound') || '1');
}

/**
 * Get flow config for specific round
 */
export function getFlowForRound(round: number): Record<string, ScreenConfig> {
  return round === 2 ? ROUND_2_FLOW : ROUND_1_FLOW;
}

/**
 * Get screen config by route
 */
export function getScreenByRoute(route: string, round: number): ScreenConfig | null {
  const flow = getFlowForRound(round);
  return Object.values(flow).find(screen => screen.route === route) || null;
}

/**
 * Get screen config by ID
 */
export function getScreenById(id: string, round: number): ScreenConfig | null {
  const flow = getFlowForRound(round);
  return flow[id] || null;
}

/**
 * Get next screen config (automatically skips isSkipScreen entries)
 */
export function getNextScreen(currentRoute: string, round: number): ScreenConfig | null {
  const currentScreen = getScreenByRoute(currentRoute, round);
  if (!currentScreen?.nextScreen) return null;
  
  let nextScreen = getScreenById(currentScreen.nextScreen, round);
  
  // Skip over skip-screens automatically
  while (nextScreen?.isSkipScreen && nextScreen.nextScreen) {
    nextScreen = getScreenById(nextScreen.nextScreen, round);
  }
  
  return nextScreen;
}

/**
 * Get previous screen config (automatically skips isSkipScreen entries)
 */
export function getPreviousScreen(currentRoute: string, round: number): ScreenConfig | null {
  const currentScreen = getScreenByRoute(currentRoute, round);
  if (!currentScreen?.previousScreen) return null;
  
  let prevScreen = getScreenById(currentScreen.previousScreen, round);
  
  // Skip over skip-screens automatically
  while (prevScreen?.isSkipScreen && prevScreen.previousScreen) {
    prevScreen = getScreenById(prevScreen.previousScreen, round);
  }
  
  return prevScreen;
}

/**
 * Get dashboard route for current screen
 */
export function getDashboardRoute(currentRoute: string, round: number): string {
  const currentScreen = getScreenByRoute(currentRoute, round);
  return currentScreen?.dashboardRoute || '/dashboard';
}

/**
 * Get all screens in order for a round
 */
export function getOrderedScreens(round: number): ScreenConfig[] {
  const flow = getFlowForRound(round);
  const screens: ScreenConfig[] = [];
  let currentId = 'welcome';
  
  while (currentId) {
    const screen = flow[currentId];
    if (!screen) break;
    screens.push(screen);
    currentId = screen.nextScreen || '';
  }
  
  return screens;
}

/**
 * Get decision screen cycling info (for decision pages circular navigation)
 */
export function getDecisionScreenInfo(currentRoute: string): { screen: number; route: string; label: string } | null {
  const decisionScreens = [
    { screen: 1, route: '/bu1', label: PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE },
    { screen: 2, route: '/bu2', label: PAGE_CONTENT.DECISION_SCREENS.PRODUCT.TITLE },
    { screen: 3, route: '/corporate', label: PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY.TITLE }
  ];
  
  return decisionScreens.find(ds => ds.route === currentRoute) || null;
}

/**
 * Get next decision screen in cycle (Business Unit 1 → Business Unit 2 → Corporate → Business Unit 1)
 */
export function getNextDecisionScreen(currentRoute: string): { screen: number; route: string; label: string } | null {
  const current = getDecisionScreenInfo(currentRoute);
  if (!current) return null;
  
  const decisionScreens = [
    { screen: 1, route: '/bu1', label: PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE },
    { screen: 2, route: '/bu2', label: PAGE_CONTENT.DECISION_SCREENS.PRODUCT.TITLE },
    { screen: 3, route: '/corporate', label: PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY.TITLE }
  ];
  
  const nextScreen = current.screen === 3 ? 1 : current.screen + 1;
  return decisionScreens[nextScreen - 1];
}

/**
 * Get previous decision screen in cycle (with wraparound)
 */
export function getPreviousDecisionScreen(currentRoute: string): { screen: number; route: string; label: string } | null {
  const current = getDecisionScreenInfo(currentRoute);
  if (!current) return null;
  
  const decisionScreens = [
    { screen: 1, route: '/bu1', label: PAGE_CONTENT.DECISION_SCREENS.SCREEN_3.TITLE },
    { screen: 2, route: '/bu2', label: PAGE_CONTENT.DECISION_SCREENS.PRODUCT.TITLE },
    { screen: 3, route: '/corporate', label: PAGE_CONTENT.DECISION_SCREENS.TECHNOLOGY.TITLE }
  ];
  
  const prevScreen = current.screen === 1 ? 3 : current.screen - 1;
  return decisionScreens[prevScreen - 1];
}

/**
 * Calculate current simulation step from screen tracking flags
 * This is the single source of truth for determining simulation progress.
 * Screen tracking flags in CalcModel are the authoritative source.
 */
export function calculateCurrentStepFromTracking(
  getValue: (key: string) => string,
  round: number
): SimulationStep {
  // Get screen tracking keys for current round
  const trackingKeys = round === 2 ? SCREEN_TRACKING_RANGE_NAMES_R2 : SCREEN_TRACKING_RANGE_NAMES_R1;
  
  // Check which screens have been visited
  const screen3Visited = getValue(trackingKeys.SCREEN_3) === '1'; // Key Initiatives submitted
  const screen4Visited = getValue(trackingKeys.SCREEN_4) === '1'; // Initiative Impacts viewed
  const screen5Visited = getValue(trackingKeys.SCREEN_5) === '1'; // Event 1 completed
  const screen6Visited = getValue(trackingKeys.SCREEN_6) === '1'; // Event 2 completed
  const screen7Visited = getValue(trackingKeys.SCREEN_7) === '1'; // Decisions screen visited
  const screen8Visited = getValue(trackingKeys.SCREEN_8) === '1'; // Decisions submitted
  const screen9Visited = getValue(trackingKeys.SCREEN_9) === '1'; // Event 3 completed
  const screen10Visited = getValue(trackingKeys.SCREEN_10) === '1'; // Event 4 completed
  
  // Determine correct step based on what user has completed
  if (!screen3Visited) {
    // User hasn't submitted key initiatives yet
    return 'dashboard';
  } else if (!screen4Visited) {
    // Initiatives submitted, need to view impacts
    return 'initiatives';
  } else if (!screen5Visited) {
    // Impacts viewed, ready for Event 1
    return 'initiative-impacts';
  } else if (!screen6Visited) {
    // Event 1 done, ready for Event 2
    return 'event-1-impacts';
  } else if (!screen7Visited) {
    // Event 2 done, ready for investment decisions
    return 'event-2-impacts';
  } else if (!screen8Visited) {
    // Decisions screen visited but not submitted yet
    return 'investments';
  } else if (!screen9Visited) {
    // Decisions submitted, ready for Event 3
    return 'results';
  } else if (!screen10Visited) {
    // Event 3 done, ready for Event 4
    return 'event-3-impacts';
  } else {
    // Event 4 done, show debrief screens
    return 'event-4-impacts';
  }
}

/**
 * Get initial route based on simulation progress
 * Intelligently routes users to the appropriate starting point:
 * - No progress: Team name entry page (/)
 * - Team name entered but strategy not complete: Strategy planning (/strategy-planning)
 * - Strategy planning complete: Dashboard (/dashboard)
 */
export function getInitialRoute(getValue: (key: string) => string): string {
  const round = getCurrentRound(getValue);
  
  // Get screen tracking keys for current round
  const trackingKeys = round === 2 ? SCREEN_TRACKING_RANGE_NAMES_R2 : SCREEN_TRACKING_RANGE_NAMES_R1;
  
  // Check which screens have been visited
  const screen1Visited = getValue(trackingKeys.SCREEN_1) === '1'; // Team name entry
  const screen2Visited = getValue(trackingKeys.SCREEN_2) === '1'; // Strategy planning
  
  // Routing logic based on progress
  if (!screen1Visited) {
    return '/team-entry'; // Team name entry (Index page)
  }
  
  if (!screen2Visited) {
    return '/strategy-planning'; // Strategy planning not completed
  }
  
  // Check if round has been submitted but user hasn't advanced to next round yet
  // This handles page refreshes after clicking "Submit Round" but before "Continue to Next Round"
  if (round === 1) {
    const round1Submitted = getValue(ROUND_SUBMISSION_RANGE_NAMES.ROUND_1_SUBMITTED) === '1';
    if (round1Submitted) {
      return '/round-completed';
    }
  } else if (round === 2) {
    const round2Submitted = getValue(ROUND_SUBMISSION_RANGE_NAMES.ROUND_2_SUBMITTED) === '1';
    if (round2Submitted) {
      return '/round-completed';
    }
  }
  
  return '/dashboard'; // Strategy planning completed - go to dashboard hub
}
