/**
 * CENTRALIZED CONTENT MANAGEMENT SYSTEM - ROUND-BASED ORGANIZATION
 * =================================================================
 * 
 * This file contains all text content used throughout the simulation application.
 * It serves as a single source of truth for labels, titles, descriptions, and content.
 * 
 * USAGE PATTERN:
 * 1. Import the specific content section you need: import { DECISIONS, UI_TEXT } from '@/Sim/Content'
 * 2. Access content using dot notation: DECISIONS.LABELS.DECISION_1
 * 3. Use TypeScript interfaces for type safety and IntelliSense support
 * 
 * ORGANIZATION STRUCTURE:
 * - Content is organized by simulation rounds (Round 1, Round 2)
 * - Shared content that applies to all rounds is at the bottom
 * - Each round section contains round-specific initiatives, events, and content
 * - Consultant-friendly: Easy to find and customize round-specific content
 */

import { DECISION_RANGE_NAMES, EVENT_RANGE_NAMES, STRATEGY_PLANNING_RANGE_NAMES, INVESTMENT_RANGE_NAMES_R1, INVESTMENT_RANGE_NAMES_R2, SCREEN_TRACKING_RANGE_NAMES_R1, SCREEN_TRACKING_RANGE_NAMES_R2, ROUND_SUBMISSION_RANGE_NAMES, ROUND_MANAGEMENT_RANGE_NAMES, DASH_CUM_RANGE_NAMES_R1, DASH_CUM_RANGE_NAMES_R2 } from '@/Sim/RangeNameMap';

// =============================================
// FORMATTING UTILITIES
// =============================================
// Purpose: Smart formatting functions for currency, numbers, and percentages
// Usage: Used throughout the application for consistent data display

/**
 * Smart currency formatting with automatic abbreviations
 * Formats large values as billions (b), millions (m), or thousands (k)
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$1.2b", "$500m", "$50k")
 */
export function formatCurrencySmart(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    const formatted = billions.toFixed(billions >= 100 ? 0 : billions >= 10 ? 1 : 2);
    return `$${formatted}B`;
  }
  if (absValue >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted = millions.toFixed(millions >= 100 ? 0 : millions >= 10 ? 1 : 2);
    return `$${formatted}M`;
  }
  if (absValue >= 1_000) {
    const thousands = value / 1_000;
    const formatted = thousands.toFixed(thousands >= 100 ? 0 : thousands >= 10 ? 1 : 2);
    return `$${formatted}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format number with K suffix (thousands)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with K suffix (e.g., "369.6 K")
 */
export function formatNumberK(value: number, decimals: number = 1): string {
  return `${(value / 1000).toFixed(decimals)}K`;
}

/**
 * Format number with M suffix (millions) without dollar sign
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with M suffix (e.g., "61.20 M")
 */
export function formatNumberM(value: number, decimals: number = 2): string {
  return `${(value / 1000000).toFixed(decimals)}M`;
}

/**
 * Format plain number without abbreviations
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumberPlain(value: number, decimals: number = 0): string {
  return decimals > 0 ? value.toFixed(decimals) : value.toString();
}

// =============================================
// PASSWORD CONFIGURATION
// =============================================
// Purpose: Centralized password management for all password-protected features
// Usage: Import PASSWORD and use PASSWORD.STRATEGY_PLANNING, PASSWORD.MASTER_PASSWORD, etc.

export const PASSWORD = {
  MASTER_PASSWORD: 'bts287', // Master password that bypasses all password checks
  STRATEGY_PLANNING: 'strategy', // Password required to submit strategy planning
  ROUND_ADVANCEMENT: 'next', // Password required to advance to next round
  VERITY_EXIT_R1: 'value', // Password to exit Verity chat in Round 1
  VERITY_EXIT_R2: 'open', // Password to exit Verity chat in Round 2
} as const;


// =============================================
// VERITY EXIT DIALOG
// =============================================
// Purpose: Content for the dialog when users attempt to return to dashboard from Verity chat
// Usage: Import VERITY_EXIT_DIALOG for dialog title, description, and button text

export interface VerityExitDialogContent {
  TITLE: string;
  DESCRIPTION: {
    QUESTION: string;
    IF_YES: string;
    IF_NO: string;
  };
  PASSWORD_PROMPT: string;
  PASSWORD_PLACEHOLDER: string;
  PASSWORD_ERROR: string;
  BUTTONS: {
    BACK: string;
    PROCEED: string;
  };
}

export const VERITY_EXIT_DIALOG: VerityExitDialogContent = {
  TITLE: "Completion Check",
  DESCRIPTION: {
    QUESTION: "Have you clicked \"End Call\" and reviewed your score and transcript with your team?",
    IF_YES: "If so, enter the password provided by your facilitator and click \"Proceed\" to return to your round decisions.",
    IF_NO: "If not, click \"Back\" so that you can end your call and receive your feedback first."
  },
  PASSWORD_PROMPT: "Enter password to proceed:",
  PASSWORD_PLACEHOLDER: "Password",
  PASSWORD_ERROR: "Incorrect password. Please try again.",
  BUTTONS: {
    BACK: "Back",
    PROCEED: "Proceed"
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// ████████╗ ROUND 1 CONTENT
// ╚══██╔══╝ Round-specific initiatives, events, and customizations
//    ██║    
//    ██║    
//    ╚═╝    
// ═════════════════════════════════════════════════════════════════════════════
// Purpose: All content specific to Round 1 of the simulation
// Usage: Consultants can easily customize Round 1 content without affecting other rounds

// =============================================
// ROUND 1 INITIATIVES
// =============================================
// Purpose: Special initiatives available for selection in Round 1
// Usage: Consultants can customize these Round 1-specific initiatives

// Round 1 Initiatives: Available for selection during Round 1 (SI1-SI10)
export const ROUND_1_INITIATIVES: Initiative[] = [
  { 
    id: 'init-r1-1', 
    title: 'R1 Initiative 1', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
    category: 'Category 1', 
    capacity: 0, 
    modelValue: 'SI1',
    impact: [
      '• Impact 1 of Metric 1',
      '• Impact 2 of Metric 2'
    ]
  },
  { 
    id: 'init-r1-2', 
    title: 'R1 Initiative 2', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
    category: 'Category 1', 
    capacity: 0, 
    modelValue: 'SI2',
    impact: [
      '• Impact 1 of Metric 3'
    ]
  },
  { 
    id: 'init-r1-3', 
    title: 'R1 Initiative 3', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Category 1', 
    capacity: 0, 
    modelValue: 'SI3',
    impact: [
      '• Impact 1 of Metric 2'
    ]
  },
  { 
    id: 'init-r1-4', 
    title: 'R1 Initiative 4', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    category: 'Category 1', 
    capacity: 0, 
    modelValue: 'SI4',
    impact: [
      '• Impact 1 of Metric 4'
    ]
  },
  { 
    id: 'init-r1-5', 
    title: 'R1 Initiative 5', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI5',
    impact: [
      '• Impact 1 of Metric 2'
    ]
  },
  { 
    id: 'init-r1-6', 
    title: 'R1 Initiative 6', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI6',
    impact: [
      '• Impact 1 of Metric 4'
    ]
  },
  { 
    id: 'init-r1-7', 
    title: 'R1 Initiative 7', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI7',
    impact: [
      '• Impact 1 of Metric 5',
      '• Impact 2 of Metric 6'
    ]
  },
  { 
    id: 'init-r1-8', 
    title: 'R1 Initiative 8', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
    category: 'Category 3', 
    capacity: 0, 
    modelValue: 'SI8',
    impact: [
      '• Impact 1 of Metric 6',
      '• Impact 2 of Metric 5',
      '• Impact 3 of Metric 3'
    ]
  },
  { 
    id: 'init-r1-9', 
    title: 'R1 Initiative 9', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
    category: 'Category 3', 
    capacity: 0, 
    modelValue: 'SI9',
    impact: [
      '• Impact 1 of Metric 7',
      '• Impact 2 of Metric 8'
    ]
  },
  { 
    id: 'init-r1-10', 
    title: 'R1 Initiative 10', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
    category: 'Category 3', 
    capacity: 0, 
    modelValue: 'SI10',
    impact: [
      '• Impact 1 of Metric 6'
    ]
  },
];

// =============================================
// ROUND 1 EVENTS
// =============================================
// Purpose: Events that occur during Round 1 of the simulation
// Usage: Consultants can customize these Round 1-specific events and scenarios

// Round 1 Events: Events that participants encounter during Round 1
export const ROUND_1_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Event 1',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: 'cf70730a-dd5f-47cb-bad6-7cfcd956e521.png',
    options: [
      {
        id: 'event1-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2
• Impact 3 of Metric 3`
      },
      {
        id: 'event1-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 2
• Impact 2 of Metric 4`
      }
    ]
  },
  {
    id: 'event-2',
    title: 'Event 2',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: 'be58a6d7-2e35-4848-8acd-873525f4987b.png',
    options: [
      {
        id: 'event2-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2
• Impact 3 of Metric 3`
      },
      {
        id: 'event2-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        impact: `• Impact 1 of Metric 2
• Impact 2 of Metric 4`
      }
    ]
  },
  {
    id: 'event-3',
    title: 'Event 3',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: 'ae9184e5-d7d5-4244-b5c8-c1784a34aceb.png',
    options: [
      {
        id: 'event3-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2
• Impact 3 of Metric 3`
      },
      {
        id: 'event3-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 2
• Impact 2 of Metric 4`
      },
      {
        id: 'event3-optionC',
        title: 'Option C',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 3
• Impact 2 of Metric 5
• Impact 3 of Metric 6`
      }
    ]
  },
  {
    id: 'event-4',
    title: 'Event 4',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: '6cc56767-e134-4f04-8a16-087eb6546ac1.png',
    financials: [
      { label: "Revenue", value: "$2M" },
      { label: "Gross Profit", value: "$700k" },
      { label: "Deal Profit", value: "$400k" },
      { label: "Deal Profit %", value: "20%" }
    ],
    options: [
      {
        id: 'event4-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2
• Impact 3 of Metric 3`
      },
      {
        id: 'event4-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• None`
      }
    ]
  }
];

// ═════════════════════════════════════════════════════════════════════════════
// ████████╗ ROUND 2 CONTENT  
// ╚══██╔══╝ Round-specific initiatives, events, and customizations
//    ██║    
//    ██║    
//    ╚═╝    
// ═════════════════════════════════════════════════════════════════════════════
// Purpose: All content specific to Round 2 of the simulation
// Usage: Consultants can easily customize Round 2 content without affecting other rounds

// =============================================
// ROUND 2 INITIATIVES
// =============================================
// Purpose: Special initiatives available for selection in Round 2
// Usage: Consultants can customize these Round 2-specific initiatives

// Round 2 Initiatives: Available for selection during Round 2 (SI11-SI19)
export const ROUND_2_INITIATIVES: Initiative[] = [
  { 
    id: 'init-r2-1', 
    title: 'R2 Initiative 1', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
    category: 'Category 1', 
    capacity: 0, 
    modelValue: 'SI11',
    impact: [
      '• Impact 1 of Metric 1'
    ]
  },
  { 
    id: 'init-r2-2', 
    title: 'R2 Initiative 2', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
    category: 'Category 1', 
    capacity: 0, 
    modelValue: 'SI12',
    impact: [
      '• Impact 1 of Metric 2'
    ]
  },
  { 
    id: 'init-r2-3', 
    title: 'R2 Initiative 3', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI13',
    impact: [
      '• Impact 1 of Metric 3',
      '• Impact 2 of Metric 4'
    ]
  },
  { 
    id: 'init-r2-4', 
    title: 'R2 Initiative 4', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI14',
    impact: [
      '• Impact 1 of Metric 2'
    ]
  },
  { 
    id: 'init-r2-5', 
    title: 'R2 Initiative 5', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI15',
    impact: [
      '• Impact 1 of Metric 4'
    ]
  },
  { 
    id: 'init-r2-6', 
    title: 'R2 Initiative 6', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI16',
    impact: [
      '• Impact 1 of Metric 3'
    ]
  },
  { 
    id: 'init-r2-7', 
    title: 'R2 Initiative 7', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 
    category: 'Category 2', 
    capacity: 0, 
    modelValue: 'SI17',
    impact: [
      '• Impact 1 of Metric 2'
    ]
  },
  { 
    id: 'init-r2-8', 
    title: 'R2 Initiative 8', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
    category: 'Category 3', 
    capacity: 0, 
    modelValue: 'SI18',
    impact: [
      '• Impact 1 of Metric 5'
    ]
  },
  { 
    id: 'init-r2-9', 
    title: 'R2 Initiative 9', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
    category: 'Category 3',
    capacity: 0, 
    modelValue: 'SI19',
    impact: [
      '• Impact 1 of Metric 5'
    ]
  },
  { 
    id: 'init-r2-10', 
    title: 'Not Active', 
    description: '[Not Used]', 
    category: 'Operations', 
    capacity: 0, 
    modelValue: 'SI20',
    impact: [],
    hidden: true
  },
];

// =============================================
// ROUND 2 EVENTS
// =============================================
// Purpose: Events that occur during Round 2 of the simulation
// Usage: Consultants can customize these Round 2-specific events and scenarios

// Round 2 Events: Events that participants encounter during Round 2
export const ROUND_2_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Event 1',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim?`,
    image: 'cf70730a-dd5f-47cb-bad6-7cfcd956e521.png',
    options: [
      {
        id: 'r2event1-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2
• Impact 3 of Metric 3`
      },
      {
        id: 'r2event1-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 2
• Impact 2 of Metric 4`
      },
      {
        id: 'r2event1-optionC',
        title: 'Option C',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 3
• Impact 2 of Metric 5`
      }
    ]
  },
  {
    id: 'event-2',
    title: 'Event 2',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: 'be58a6d7-2e35-4848-8acd-873525f4987b.png',
    options: [
      {
        id: 'r2event2-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2`
      },
      {
        id: 'r2event2-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        impact: `• Impact 1 of Metric 2
• Impact 2 of Metric 3
• Impact 3 of Metric 4`
      }
    ]
  },
  {
    id: 'event-3',
    title: 'Event 3',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    image: 'ae9184e5-d7d5-4244-b5c8-c1784a34aceb.png',
    contingent: {
      thresholdRangeName: DASH_CUM_RANGE_NAMES_R2.TECH_PERFREL_CUM_R2,
      thresholdValue: 7,
      thresholdOperator: '>=',
      optionIfMet: 'B',
      optionIfNotMet: 'A',
      autoSelect: true
    },
    options: [
      {
        id: 'r2event3-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 1
• Impact 2 of Metric 2
• Impact 3 of Metric 3`
      },
      {
        id: 'r2event3-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• None`
      }
    ]
  },
  {
    id: 'event-4',
    title: 'Event 4',
    scenario: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    image: '6cc56767-e134-4f04-8a16-087eb6546ac1.png',
    options: [
      {
        id: 'r2event4-optionA',
        title: 'Option A',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• None`
      },
      {
        id: 'r2event4-optionB',
        title: 'Option B',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 1`
      },
      {
        id: 'r2event4-optionC',
        title: 'Option C',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        outcome: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        impact: `• Impact 1 of Metric 2`
      }
    ]
  }
];

// ═════════════════════════════════════════════════════════════════════════════
// ███████╗ SHARED CONTENT ACROSS ALL ROUNDS
// ██╔════╝ Content used consistently throughout all simulation rounds
// ███████╗ 
// ╚════██║ 
// ███████║ 
// ╚══════╝ 
// ═════════════════════════════════════════════════════════════════════════════
// Purpose: Content that applies consistently across all simulation rounds
// Usage: Shared interfaces, decision labels, UI elements, and utility functions

// =============================================
// SHARED INTERFACES & TYPE DEFINITIONS
// =============================================
// Purpose: TypeScript interfaces used across all rounds and components
// Usage: Import these interfaces for type safety in components

export interface Initiative {
  id: string;
  title: string;
  description: string;
  category: string;
  capacity: number; // Capacity cost of selecting this initiative
  modelValue: string; // Model value for calc integration (SI1-SI19)
  impact: string[]; // Expected impacts for this initiative
  hidden?: boolean; // Optional flag to hide initiative from UI display
}

export interface EventOption {
  id: string;
  title: string;
  description: string;
  outcome: string;
  impact: string;
}

export interface Financial {
  label: string;
  value: string;
}

export interface EventContingency {
  thresholdRangeName: string;     // CalcModel range name to check
  thresholdValue: number;          // Value to compare against
  thresholdOperator: '>=' | '>' | '<=' | '<' | '==';
  optionIfMet: string;             // Letter (A, B, C, etc.) to auto-select if met
  optionIfNotMet: string;          // Letter to auto-select if not met
  autoSelect: boolean;             // Whether to auto-select (true for ransomware)
}

export interface Event {
  id: string;
  title: string;
  scenario: string;
  image: string;
  options: EventOption[];
  financials?: Financial[]; // Optional financial projections
  contingent?: EventContingency; // Optional contingency logic for conditional events
}

// =============================================
// SHARED DECISION LABELS
// =============================================
// Purpose: Decision names used across all rounds and decision screens
// Usage: Import DECISIONS and use DECISIONS.LABELS.DECISION_1 for consistent naming

export interface DecisionLabels {
  // Go-to-Market Decisions (Decision Screen 1)
  DECISION_1: string;  // Provider Engagement
  DECISION_2: string;  // Pharmacy Engagement
  DECISION_3: string;  // Payer Engagement
  
  // Product Decisions (Decision Screen 2)
  DECISION_4: string;  // Patient Notification
  DECISION_5: string;  // Pharmacy: Functionality
  DECISION_6: string;  // Providers: Functionality
  DECISION_7: string;  // Form Automation
  
  // Technology Decisions (Decision Screen 3)
  DECISION_8: string;   // Predictive Intelligence
  DECISION_9: string;   // Platform Unification and Interoperability
  DECISION_10: string;  // Performance, Reliability & Security
  DECISION_11: string;  // Developer Productivity and Agility
  
  // Operations Decisions (Decision Screen 4)
  DECISION_12: string;  // Network Ops
  DECISION_13: string;  // Data and Analytics
}

export interface DecisionTooltips {
  DECISION_1: string;
  DECISION_2: string;
  DECISION_3: string;
  DECISION_4: string;
  DECISION_5: string;
  DECISION_6: string;
  DECISION_7: string;
  DECISION_8: string;
  DECISION_9: string;
  DECISION_10: string;
  DECISION_11: string;
  DECISION_12: string;
  DECISION_13: string;
}

export const DECISIONS: { LABELS: DecisionLabels; TOOLTIPS: DecisionTooltips } = {
  LABELS: {
    // Business Unit 1: Network Engagement (Decision Screen 1)
    DECISION_1: "BU1 Dec 1",
    DECISION_2: "BU1 Dec 2",
    DECISION_3: "BU1 Dec 3",
    
    // Business Unit 2: Product (Decision Screen 2)
    DECISION_4: "BU2 Dec 1",
    DECISION_5: "BU2 Dec 2",
    DECISION_6: "BU2 Dec 3",
    DECISION_7: "BU2 Dec 4",
    
    // Business Unit 3: Technology (Decision Screen 3)
    DECISION_8: "BU3 Dec 1",
    DECISION_9: "BU3 Dec 2",
    DECISION_10: "BU3 Dec 3",
    DECISION_11: "BU3 Dec 4",
    
    // Business Unit 4: Operations (Decision Screen 4)
    DECISION_12: "BU4 Dec 1",
    DECISION_13: "BU4 Dec 2",
  },
  TOOLTIPS: {
    // Business Unit 1 (Decision Screen 1)
    DECISION_1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    DECISION_2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    DECISION_3: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    
    // Business Unit 3 (Decision Screen 2 - Product)
    DECISION_4: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    DECISION_5: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    DECISION_6: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus.",
    DECISION_7: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam libero tempore, cum soluta nobis est eligendi optio cumque.",
    
    // Business Unit 4 (Decision Screen 3 - Technology)
    DECISION_8: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.",
    DECISION_9: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis.",
    DECISION_10: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Voluptatibus maiores alias consequatur aut perferendis doloribus asperiores.",
    DECISION_11: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Repellat asperiores repellendus voluptatum deleniti voluptas.",
    
    // Business Unit 2 (Decision Screen 4)
    DECISION_12: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et harum quidem rerum facilis est et expedita distinctio.",
    DECISION_13: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit."
  }
};

// =============================================
// SHARED PAGE HEADERS & NAVIGATION
// =============================================
// Purpose: Page titles, headers, and descriptive text used across all rounds
// Usage: Import PAGE_CONTENT and use PAGE_CONTENT.DECISION_SCREENS.SCREEN_1.TITLE

export interface PageContent {
  DECISION_SCREENS: {
    SCREEN_1: {
      TITLE: string;
      DESCRIPTION: string;
      CATEGORY: string;
    };
    PRODUCT: {
      TITLE: string;
      DESCRIPTION: string;
      CATEGORY: string;
    };
    TECHNOLOGY: {
      TITLE: string;
      DESCRIPTION: string;
      CATEGORY: string;
    };
    SCREEN_3: {
      TITLE: string;
      DESCRIPTION: string;
      CATEGORY: string;
    };
  };
  INITIATIVES: {
    PAGE_TITLE: string;
    PAGE_DESCRIPTION: string;
    IMPACTS_TITLE: string;
    IMPACTS_DESCRIPTION: string;
  };
  EVENTS: {
    PAGE_TITLE: string;
    OUTCOMES_TITLE: string;
    RESPONSE_HEADER: string;
    OUTCOMES_HEADER: string;
    CONDITIONAL_RESPONSE_HEADER: string;
    CONDITIONAL_OUTCOMES_HEADER: string;
    VERITY_TIMER: {
      PLANNING_DURATION_SECONDS: number;
      CONVERSATION_DURATION_SECONDS: number;
      PLANNING_LABEL: string;
      CONVERSATION_LABEL: string;
      WARNING_THRESHOLD_SECONDS: number;
    };
  };
  DEBRIEF: {
    GEN_NPIS: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
    };
    PHARMA_NPS: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TOTAL_LABEL: string;
    };
    RETAIL_PHARMACY_SCRIPTS: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TOTAL_LABEL: string;
    };
    SPECIALTY_PHARMACY_SCRIPTS: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TOTAL_LABEL: string;
    };
    REVENUE_PER_INTERACTION: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TOTAL_LABEL: string;
      COLUMN_HEADERS: {
        DRIVER: string;
        DECISION: string;
        CUMULATIVE_CAPABILITY: string;
      };
      DRIVER_NAMES: {
        PHARMA_NPS: string;
        INITIATIVE_PHARMA_GTM: string;
      };
      PLACEHOLDERS: {
        VARIOUS: string;
        NOT_APPLICABLE: string;
      };
      CHART_LABELS: {
        BASELINE: string;
        INCREASE: string;
        DECREASE: string;
        ENDING: string;
      };
    };
    PHARMACY_BENEFITS_REVENUE: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TABLE_COLUMNS: {
        DRIVER: string;
        BASELINE: string;
        CURRENT: string;
        ROUND_2: string;
      };
      TOTAL_LABEL: string;
      DRIVERS: {
        PATIENT_INTERACTIONS: string;
        AVG_REV_PER_INTERACTION: string;
      };
    };
    PHARMACY_BENEFITS_NETWORK_HEALTH: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TABLE_COLUMNS: {
        DRIVER: string;
        BASELINE: string;
        CURRENT: string;
        ROUND_2: string;
      };
      TOTAL_LABEL: string;
      DRIVERS: {
        GENERALIST_NPIS: string;
        RETAIL_PHARMACY_SCRIPTS: string;
      };
    };
    MEDICAL_BENEFITS_NETWORK_HEALTH: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TABLE_COLUMNS: {
        DRIVER: string;
        BASELINE: string;
        CURRENT: string;
        ROUND_2: string;
      };
      TOTAL_LABEL: string;
      DRIVERS: {
        SPECIALIST_NPIS: string;
        SPECIALIST_PHARMACY_SCRIPTS: string;
      };
    };
    MEDICAL_BENEFITS_REVENUE: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
      TABLE_HEADER: string;
      TABLE_COLUMNS: {
        DRIVER: string;
        BASELINE: string;
        CURRENT: string;
        ROUND_2: string;
      };
      TOTAL_LABEL: string;
      DRIVERS: {
        PATIENT_INTERACTIONS: string;
        AVG_REV_PER_INTERACTION: string;
      };
    };
    SPEC_NPIS: {
      TITLE: string;
      DESCRIPTION: string;
      CHART_TITLE: string;
    };
    // Future debrief pages will go here:
    // AOP: { TITLE: string; DESCRIPTION: string; CHART_TITLE: string; };
  };
  METRICS: {
    DRIVERS_TITLE: string;
    DRIVERS_DESCRIPTION: string;
  };
}

export const PAGE_CONTENT: PageContent = {
  DECISION_SCREENS: {
    // Decision Screen 1: Business Unit 1 (Network Engagement)
    SCREEN_1: {
      TITLE: "Business Unit 1",
      DESCRIPTION: "The Business Unit 1 decision categories are listed below and can be selected on a range from low to high. You must select a decision for each category to determine your Business Unit 1 strategy.",
      CATEGORY: "Business Unit 1"
    },
    
    // Product Page: Business Unit 2
    PRODUCT: {
      TITLE: "Business Unit 2",
      DESCRIPTION: "The Business Unit 2 decision categories are listed below and can be selected on a range from low to high. You must select a decision for each category to determine your Business Unit 2 strategy.",
      CATEGORY: "Business Unit 2"
    },
    
    // Technology Page: Corporate
    TECHNOLOGY: {
      TITLE: "Corporate",
      DESCRIPTION: "The Corporate decision categories are listed below and can be selected on a range from low to high. You must select a decision for each category to determine your Corporate strategy.",
      CATEGORY: "Corporate"
    },
    
    // Decision Screen 3: Business Unit 1 (Operations)
    SCREEN_3: {
      TITLE: "Business Unit 1",
      DESCRIPTION: "The Business Unit 1 decision categories are listed below and can be selected on a range from low to high. You must select a decision for each category to determine your Business Unit 1 strategy.",
      CATEGORY: "Business Unit 1"
    }
  },
  
  INITIATIVES: {
    PAGE_TITLE: "Special Initiative Selection",
    PAGE_DESCRIPTION: "Select up to 2 special initiatives that align with your team's strategy. These initiatives will impact your business performance over multiple rounds.",
    IMPACTS_TITLE: "Special Initiative Impacts",
    IMPACTS_DESCRIPTION: "Review the expected impacts of your selected special initiatives. These initiatives will affect various aspects of your business operations and performance metrics over the coming rounds."
  },
  
  EVENTS: {
    PAGE_TITLE: "",
    OUTCOMES_TITLE: "",
    RESPONSE_HEADER: "Choose Your Response",
    OUTCOMES_HEADER: "Option Outcomes",
    CONDITIONAL_RESPONSE_HEADER: "See your outcome",
    CONDITIONAL_OUTCOMES_HEADER: "Outcomes",
    VERITY_TIMER: {
      PLANNING_DURATION_SECONDS: 300,        // 5 minutes
      CONVERSATION_DURATION_SECONDS: 600,    // 10 minutes
      PLANNING_LABEL: "Recommended Planning Time Remaining:",
      CONVERSATION_LABEL: "Recommended Conversation Time Remaining:",
      WARNING_THRESHOLD_SECONDS: 60          // Orange warning at 60 seconds
    }
  },
  
  DEBRIEF: {
    GEN_NPIS: {
      TITLE: "Drivers of Active Generalist NPIs",
      DESCRIPTION: "This represents how teams grew active generalist NPIs. The table below ranks active generalist NPI drivers by impact, from highest to lowest. The graph on the right follows the same order but flows left to right, representing the potential range of impact of each investment. The triangle within each bar indicates where your team landed within the range of outcomes. The vertical axis shows the change in NPIs, where higher values indicate an increase in NPIs.",
      CHART_TITLE: "Impact on Active Generalist NPIs"
    },
    SPEC_NPIS: {
      TITLE: "Drivers of Active Specialist NPIs",
      DESCRIPTION: "This represents how teams grew active specialist NPIs. The table below ranks active specialist NPI drivers by impact, from highest to lowest. The graph on the right follows the same order but flows left to right, representing the potential range of impact of each investment. The triangle within each bar indicates where your team landed within the range of outcomes. The vertical axis shows the change in NPIs, where higher values indicate an increase in NPIs.",
      CHART_TITLE: "Impact on Active Specialist NPIs"
    },
    PHARMA_NPS: {
      TITLE: "Drivers of Pharma NPS",
      DESCRIPTION: "Pharma NPS is a measure of the value we are able to deliver to our pharma customers. Pharma customers value our ability to improve time-to-therapy and adherence for patients, reflected in the drivers of NPS below. Pharma NPS is a leading indicator of average revenue per interaction—driving greater results for pharma leads to increased monetization of interactions. The table below ranks the key NPS drivers by their impact, from highest to lowest, while the graph on the right illustrates the potential range of impact for each investment, with the triangle indicating your team's actual outcome. Higher values on the vertical axis represent greater increases in NPS.",
      CHART_TITLE: "Pharma NPS Driver Impact Analysis",
      TABLE_HEADER: "Pharma NPS Drivers",
      TOTAL_LABEL: "Pharma NPS"
    },
    RETAIL_PHARMACY_SCRIPTS: {
      TITLE: "Drivers of Retail Pharmacy Scripts",
      DESCRIPTION: "This represents how teams grew retail pharmacy scripts. The table below ranks retail pharmacy script drivers by impact, from highest to lowest. The graph on the right follows the same order but flows left to right, representing the potential range of impact of each investment. The triangle within each bar indicates where your team landed within the range of outcomes. The vertical axis shows the change in scripts, where higher values indicate an increase in scripts.",
      CHART_TITLE: "Impact on Retail Pharmacy Scripts",
      TABLE_HEADER: "Retail Pharmacy Script Drivers",
      TOTAL_LABEL: "Retail Pharmacy Script Volume"
    },
    SPECIALTY_PHARMACY_SCRIPTS: {
      TITLE: "Drivers of Specialty Pharmacy Scripts",
      DESCRIPTION: "This represents how teams grew specialty pharmacy scripts. The table below ranks specialty pharmacy script drivers by impact, from highest to lowest. The graph on the right follows the same order but flows left to right, representing the potential range of impact of each investment. The triangle within each bar indicates where your team landed within the range of outcomes. The vertical axis shows the change in scripts, where higher values indicate an increase in scripts.",
      CHART_TITLE: "Impact on Specialty Pharmacy Scripts",
      TABLE_HEADER: "Specialty Pharmacy Script Drivers",
      TOTAL_LABEL: "Specialty Pharmacy Script Volume"
    },
    REVENUE_PER_INTERACTION: {
      TITLE: "Revenue / Interaction",
      DESCRIPTION: "Placeholder Text",
      CHART_TITLE: "Revenue / Interaction Drivers",
      TABLE_HEADER: "Revenue / Interaction Drivers",
      TOTAL_LABEL: "Revenue / Interaction",
      COLUMN_HEADERS: {
        DRIVER: "Driver",
        DECISION: "Decision",
        CUMULATIVE_CAPABILITY: "Cumulative Capability"
      },
      DRIVER_NAMES: {
        PHARMA_NPS: "Pharma NPS",
        INITIATIVE_PHARMA_GTM: "Initiative: Pharma GTM"
      },
      PLACEHOLDERS: {
        VARIOUS: "Various",
        NOT_APPLICABLE: "N/A"
      },
      CHART_LABELS: {
        BASELINE: "Baseline",
        INCREASE: "Increase",
        DECREASE: "Decrease",
        ENDING: "Ending"
      }
    },
    PHARMACY_BENEFITS_REVENUE: {
      TITLE: "Pharmacy Benefits Revenue",
      DESCRIPTION: "This chart plots average revenue per patient interaction (vertical axis) against total patient interactions (horizontal axis), with bubble size representing total Pharmacy Benefits revenue (calculated as interactions × revenue per interaction). It illustrates how your company has grown from the prior-round baseline in both patient interaction volume and value per interaction.",
      CHART_TITLE: "Pharmacy Benefits Revenue",
      TABLE_HEADER: "Pharmacy Benefits Revenue",
      TABLE_COLUMNS: {
        DRIVER: "Driver",
        BASELINE: "Round 0",
        CURRENT: "Round 1",
        ROUND_2: "Round 2"
      },
      TOTAL_LABEL: "Pharmacy Benefits Revenue",
      DRIVERS: {
        PATIENT_INTERACTIONS: "Patient Interactions",
        AVG_REV_PER_INTERACTION: "Avg. Rev per Interaction"
      }
    },
    PHARMACY_BENEFITS_NETWORK_HEALTH: {
      TITLE: "Pharmacy Benefits Network Health",
      DESCRIPTION: "A healthy pharmacy benefits network requires delivering value to, and driving adoption with, both generalist NPIs (providers) and retail pharmacies. Collectively, these stakeholders drive the number of patient interactions that CMM has in the Pharmacy Benefits space. The chart below shows where your company was able to grow from its prior-round baseline in both areas, with the size of the bubble corresponding to total patient interactions.",
      CHART_TITLE: "Pharmacy Benefits Network Health",
      TABLE_HEADER: "Pharmacy Benefits Network Health",
      TABLE_COLUMNS: {
        DRIVER: "Stakeholder",
        BASELINE: "Round 0",
        CURRENT: "Round 1",
        ROUND_2: "Round 2"
      },
      TOTAL_LABEL: "Patient Interactions",
      DRIVERS: {
        GENERALIST_NPIS: "Generalist NPIs",
        RETAIL_PHARMACY_SCRIPTS: "Retail Pharmacy Scripts"
      }
    },
    MEDICAL_BENEFITS_NETWORK_HEALTH: {
      TITLE: "Medical Benefits Network Health",
      DESCRIPTION: "A healthy medical benefits network requires delivering value to, and driving adoption with, both specialist NPIs (providers) and specialty pharmacies. Collectively, these stakeholders drive the number of patient interactions that CMM has in the Medical Benefits space. The chart below shows where your company was able to grow from its prior-round baseline in both areas, with the size of the bubble corresponding to total patient interactions.",
      CHART_TITLE: "Medical Benefits Network Health",
      TABLE_HEADER: "Medical Benefits Network Health",
      TABLE_COLUMNS: {
        DRIVER: "Stakeholder",
        BASELINE: "Round 0",
        CURRENT: "Round 1",
        ROUND_2: "Round 2"
      },
      TOTAL_LABEL: "Patient Interactions",
      DRIVERS: {
        SPECIALIST_NPIS: "Specialist NPIs",
        SPECIALIST_PHARMACY_SCRIPTS: "Specialist Pharmacy Scripts"
      }
    },
    MEDICAL_BENEFITS_REVENUE: {
      TITLE: "Medical Benefits Revenue",
      DESCRIPTION: "Revenue in the medical benefits space is driven by two factors: the volume of patient interactions and the average revenue per patient interaction. The chart below shows where your company was able to grow from its prior-round baseline in both areas, with the size of the bubble corresponding to total medical benefits revenue.",
      CHART_TITLE: "Medical Benefits Revenue Drivers",
      TABLE_HEADER: "Medical Benefits Revenue Drivers",
      TABLE_COLUMNS: {
        DRIVER: "Driver",
        BASELINE: "Round 0",
        CURRENT: "Round 1",
        ROUND_2: "Round 2"
      },
      TOTAL_LABEL: "Total Medical Benefits Revenue",
      DRIVERS: {
        PATIENT_INTERACTIONS: "Patient Interactions (Medical Benefits)",
        AVG_REV_PER_INTERACTION: "Avg. Revenue per Interaction"
      }
    }
    // Future debrief pages will be added here as needed
  },
  
  METRICS: {
    DRIVERS_TITLE: "Metric Drivers Analysis",
    DRIVERS_DESCRIPTION: "Review how your decisions impact key business metrics. The chart shows the range of possible outcomes and your team's current position."
  }
};

// =============================================
// SHARED UI TEXT & INTERFACE LABELS
// =============================================
// Purpose: Button labels, form text, and UI interaction elements used across all rounds
// Usage: Import UI_TEXT and use UI_TEXT.BUTTONS.SUBMIT for consistent button labeling

export interface UIText {
  BUTTONS: {
    SUBMIT: string;
    SAVE: string;
    NEXT: string;
    BACK: string;
    CONTINUE: string;
    RETURN_TO_DASHBOARD: string;
    SELECT_INITIATIVES: string;
    SUBMIT_SELECTED_INITIATIVES: string;
  };
  INVESTMENT_LEVELS: {
    LOW: string;
    MEDIUM: string;
    HIGH: string;
  };
  CAPACITY_TEXT: {
    REMAINING: string;
    REQUIRED: string;
    TOTAL: string;
    INSUFFICIENT: string;
  };
  VALIDATION: {
    SELECT_OPTION: string;
    INSUFFICIENT_CAPACITY: string;
    MAX_SELECTIONS: string;
  };
  ATHENA: {
    WELCOME_MESSAGE: string;
    QUICK_PROMPTS: string[];
  };
}

export const UI_TEXT: UIText = {
  BUTTONS: {
    SUBMIT: "Submit",
    SAVE: "Save Decisions",
    NEXT: "Next",
    BACK: "Back", 
    CONTINUE: "Continue",
    RETURN_TO_DASHBOARD: "Return to Dashboard",
    SELECT_INITIATIVES: "Select Initiatives",
    SUBMIT_SELECTED_INITIATIVES: "Submit Selected Initiatives"
  },
  
  INVESTMENT_LEVELS: {
    LOW: "Low",
    MEDIUM: "Medium", 
    HIGH: "High"
  },
  
  CAPACITY_TEXT: {
    REMAINING: "Remaining Capacity:",
    REQUIRED: "Capacity Required:",
    TOTAL: "Total Investment:",
    INSUFFICIENT: "Insufficient capacity available"
  },
  
  VALIDATION: {
    SELECT_OPTION: "Please select an option before submitting",
    INSUFFICIENT_CAPACITY: "Cannot submit with negative capacity balance",
    MAX_SELECTIONS: "Maximum selections reached"
  },
  
  ATHENA: {
    WELCOME_MESSAGE: "Hello! I'm Minerva, your BTS simulation assistant. How can I help you today?",
    QUICK_PROMPTS: [
      // Starter questions disabled for now
      // To re-enable, simply uncomment any of the questions below:
      // "What is a MTU?",
      // "What focus areas is Taylor working on developing?",
      // "What should I know about Lumen Industries' opportunity?"
    ]
  }
};

export interface InitiativeContent {
  MAX_SELECTIONS: number;
  CATEGORIES: string[];
  ROUNDS: {
    ROUND_1: Initiative[];
    ROUND_2: Initiative[];
  };
  IMPACTS: { [key: string]: string[] }; // Initiative ID -> impact descriptions
}

export const INITIATIVES: InitiativeContent = {
  MAX_SELECTIONS: 2,
  CATEGORIES: ['Category 1', 'Category 2', 'Category 3'],
  
  ROUNDS: {
    ROUND_1: ROUND_1_INITIATIVES,
    ROUND_2: ROUND_2_INITIATIVES,
  },
  
  // Impact descriptions are now embedded in each initiative object
  IMPACTS: {}
};

export interface EventContent {
  // Events organized by round - each event is unique per round
  BY_ROUND: {
    [round: number]: Event[];
  };
}

export const EVENTS: EventContent = {
  BY_ROUND: {
    1: ROUND_1_EVENTS,
    2: ROUND_2_EVENTS,
  }
};

// =============================================
// SECTION 6: METRIC & KPI LABELS
// =============================================
// Purpose: Centralize all metric names and KPI labels used in charts and displays  
// Usage: Import METRICS and use METRICS.LABELS.REVENUE for consistent metric naming

export interface MetricLabels {
  // Primary KPIs displayed on dashboard
  REVENUE: string;
  PROFIT_MARGIN: string;
  MARKET_SHARE: string;
  CUSTOMER_SATISFACTION: string;
  EMPLOYEE_ENGAGEMENT: string;
  OPERATIONAL_EFFICIENCY: string;
  
  // Driver Analysis Labels
  METRIC_VALUE: string;
  CUMULATIVE_INVESTMENT: string;
  IMPACT_SCALE: string;
  TEAM_POSITION: string;
}

export const METRICS: { LABELS: MetricLabels } = {
  LABELS: {
    // Dashboard KPI Labels
    REVENUE: "Revenue",
    PROFIT_MARGIN: "Profit Margin", 
    MARKET_SHARE: "Market Share",
    CUSTOMER_SATISFACTION: "Customer Satisfaction",
    EMPLOYEE_ENGAGEMENT: "Employee Engagement",
    OPERATIONAL_EFFICIENCY: "Operational Efficiency",
    
    // Metric Drivers Page Labels
    METRIC_VALUE: "Metric Value",
    CUMULATIVE_INVESTMENT: "Cumulative Capability",
    IMPACT_SCALE: "Impact Scale",
    TEAM_POSITION: "Team Position"
  }
};

// =============================================
// SECTION 7: NAVIGATION & FLOW CONTROL
// =============================================
// Purpose: Centralize navigation labels and flow control text
// Usage: Import NAVIGATION and use NAVIGATION.STEPS.DASHBOARD for consistent navigation

export interface NavigationContent {
  STEPS: {
    DASHBOARD: string;
    STRATEGY: string;
    INITIATIVES: string;
    EVENTS: string;
    DECISIONS: string;
    METRICS: string;
  };
  FLOW_CONTROL: {  
    CONTINUE_TO_NEXT: string;
    RETURN_TO_PREVIOUS: string;
    SKIP_SECTION: string;
    COMPLETE_ROUND: string;
  };
}

export const NAVIGATION: NavigationContent = {
  STEPS: {
    DASHBOARD: "Dashboard",
    STRATEGY: "Strategy Planning", 
    INITIATIVES: "Special Initiatives",
    EVENTS: "Strategic Events",
    DECISIONS: "Investment Decisions", 
    METRICS: "Performance Metrics"
  },
  
  FLOW_CONTROL: {
    CONTINUE_TO_NEXT: "Continue to Next Section",
    RETURN_TO_PREVIOUS: "Return to Previous Section", 
    SKIP_SECTION: "Skip This Section",
    COMPLETE_ROUND: "Complete Current Round"
  }
};

// =========================================================================
// SECTION 8: DASHBOARD CONTENT
// =========================================================================

export interface DashboardContent {
  CARDS: {
    CARD1: {
      TITLE: string;
      ITEMS: Array<{ label: string; value: string }>;
    };
    CARD2: {
      TITLE: string;
      ITEMS: Array<{ label: string; value: string }>;
    };
    CARD3: {
      TITLE: string;
      ITEMS: Array<{ label: string; value: string }>;
    };
  };
}

export const DASHBOARD: DashboardContent = {
  CARDS: {
    CARD1: {
      TITLE: "Go-To-Market (GTM)",
      ITEMS: [
        { label: 'Item 1', value: '0' },
        { label: 'Item 2', value: '0' },
        { label: 'Item 3', value: '0' },
        { label: 'Item 4', value: '0' },
        { label: 'Item 5', value: '0' },
        { label: 'Item 6', value: '0' },
        { label: 'Item 7', value: '0' },
      ]
    },
    CARD2: {
      TITLE: "Product & Technology",
      ITEMS: [
        { label: 'Item 1', value: '0' },
        { label: 'Item 2', value: '0' },
        { label: 'Item 3', value: '0' },
        { label: 'Item 4', value: '0' },
        { label: 'Item 5', value: '0' },
        { label: 'Item 6', value: '0' },
        { label: 'Item 7', value: '0' },
      ]
    },
    CARD3: {
      TITLE: "Operations",
      ITEMS: [
        { label: 'Item 1', value: '0' },
        { label: 'Item 2', value: '0' },
        { label: 'Item 3', value: '0' },
        { label: 'Item 4', value: '0' },
        { label: 'Item 5', value: '0' },
        { label: 'Item 6', value: '0' },
        { label: 'Item 7', value: '0' },
      ]
    }
  }
};

// =========================================================================
// SECTION 9: TEAM ENTRY PAGE
// =========================================================================

export interface TeamEntryContent {
  PAGE_TITLE: string;
  TEAM_NAME_LABEL: string;
  TEAM_NAME_PLACEHOLDER: string;
  SUBMIT_BUTTON: string;
}

export const TEAM_ENTRY: TeamEntryContent = {
  PAGE_TITLE: "CoverMyMeds Simulation",
  TEAM_NAME_LABEL: "Enter Your Team Name",
  TEAM_NAME_PLACEHOLDER: "Enter team name",
  SUBMIT_BUTTON: "Enter Simulation"
};

// =========================================================================
// SECTION 10: STRATEGY PLANNING CONTENT
// =========================================================================

export interface StrategyPlanningContent {
  PAGE_TITLE: string;
  TEAM_NAME: {
    LABEL: string;
    PLACEHOLDER: string;
  };
  SWOT: {
    TITLE: string;
    DESCRIPTION: string;
    SECTIONS: {
      STRENGTHS: {
        TITLE: string;
        PLACEHOLDER: string;
      };
      WEAKNESSES: {
        TITLE: string;
        PLACEHOLDER: string;
      };
      OPPORTUNITIES: {
        TITLE: string;
        PLACEHOLDER: string;
      };
      THREATS: {
        TITLE: string;
        PLACEHOLDER: string;
      };
    };
  };
  PRIORITIES: {
    TITLE: string;
    DESCRIPTION: string;
    SECTIONS: {
      SHORT_TERM: {
        TITLE: string;
        PLACEHOLDER: string;
      };
      LONG_TERM: {
        TITLE: string;
        PLACEHOLDER: string;
      };
    };
  };
  BUTTONS: {
    SUBMIT: string;
  };
}

export const STRATEGY_PLANNING: StrategyPlanningContent = {
  PAGE_TITLE: "Strategy Planning",
  TEAM_NAME: {
    LABEL: "TEAM NAME:",
    PLACEHOLDER: "Enter team name"
  },
  SWOT: {
    TITLE: "SWOT Analysis",
    DESCRIPTION: "Use the space below to capture [CompanyX]'s strengths, weaknesses, opportunities, and threats. You'll be able to use Athena, the AI chatbot, throughout the simulation to ask questions, refine your thinking, and evolve your strategy as you go.",
    SECTIONS: {
      STRENGTHS: {
        TITLE: "Strengths",
        PLACEHOLDER: "Enter strengths..."
      },
      WEAKNESSES: {
        TITLE: "Weaknesses",
        PLACEHOLDER: "Enter weaknesses..."
      },
      OPPORTUNITIES: {
        TITLE: "Opportunities",
        PLACEHOLDER: "Enter opportunities..."
      },
      THREATS: {
        TITLE: "Threats",
        PLACEHOLDER: "Enter threats..."
      }
    }
  },
  PRIORITIES: {
    TITLE: "Strategic Priorities",
    DESCRIPTION: "Please use the space below to outline your team's short-term and long-term priorities for [CompanyX]. Short-term priorities should focus on key business areas you want to advance in the near future (Round 1), while long-term priorities should reflect the broader vision for where you want to take [CompanyX] and how you plan to get there (Round 2 and beyond). Consider the KPIs or metrics you will track to measure the success of your objectives.",
    SECTIONS: {
      SHORT_TERM: {
        TITLE: "Short-term Priorities",
        PLACEHOLDER: "Enter here"
      },
      LONG_TERM: {
        TITLE: "Long-term Priorities",
        PLACEHOLDER: "Enter here"
      }
    }
  },
  BUTTONS: {
    SUBMIT: "Submit"
  }
};

// =========================================================================
// SECTION 10: KPI CONTENT
// =========================================================================

export interface KPIContent {
  FINANCIAL_METRICS: {
    metric1: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    grossProfit: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    metric2: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    metric3: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    metric4: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    metric5: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
  };
  OPERATIONAL_METRICS: {
    capacityRemaining: { label: string; format: 'number' | 'percentage'; warningThreshold?: number };
  };
  SECONDARY_METRICS: {
    tlOutputCorp_Metric1_R1: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    tlOutputCorp_Metric2_R1: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    tlOutputCorp_Metric3_R1: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
    tlOutputCorp_Metric4_R1: { label: string; format: 'currency' | 'percentage' | 'number'; decimals?: number };
  };
  GAUGE_METRICS: {
    metric7: { label: string; max: number };
  };
  TOOLTIPS: {
    metric1: string;
    grossProfit: string;
    metric2: string;
    metric3: string;
    metric4: string;
    metric5: string;
    metric6: string;
    capacityRemaining: string;
    metric7: string;
    metric8: string;
    tlOutputCorp_Metric1_R1: string;
    tlOutputCorp_Metric2_R1: string;
    tlOutputCorp_Metric3_R1: string;
    tlOutputCorp_Metric4_R1: string;
    tlOutputCorp_Metric5_R1: string;
  };
}

export const KPI: KPIContent = {
  FINANCIAL_METRICS: {
    metric1: { label: 'Metric 1', format: 'currency', decimals: 0 },
    grossProfit: { label: 'Gross Profit', format: 'currency', decimals: 1 },
    metric2: { label: 'Metric 2', format: 'percentage', decimals: 1 },
    metric3: { label: 'Metric 3', format: 'currency', decimals: 0 },
    metric4: { label: 'Metric 4', format: 'percentage', decimals: 1 },
    metric5: { label: 'Metric 5', format: 'number', decimals: 3 },
  },
  OPERATIONAL_METRICS: {
    capacityRemaining: { label: 'Metric Constraint', format: 'number', warningThreshold: 0 },
  },
  SECONDARY_METRICS: {
    tlOutputCorp_Metric1_R1: { label: 'Metric 6', format: 'number', decimals: 1 },
    tlOutputCorp_Metric2_R1: { label: 'Metric 7', format: 'number', decimals: 1 },
    tlOutputCorp_Metric3_R1: { label: 'Metric 8', format: 'currency', decimals: 2 },
    tlOutputCorp_Metric4_R1: { label: 'Metric 9', format: 'currency', decimals: 2 },
  },
  GAUGE_METRICS: {
    metric7: { label: 'Metric 10', max: 150 },
  },
  TOOLTIPS: {
    metric1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    grossProfit: "Total Gross Profit (Revenue minus Cost of Sales) across all business units.",
    metric2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    metric3: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    metric4: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    metric5: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    metric6: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus.",
    capacityRemaining: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The total organizational capacity available to staff investments, decisions, and initiatives in the simulation.",
    metric7: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    metric8: "Legacy metric - not currently in use.",
    tlOutputCorp_Metric1_R1: "Legacy metric - not currently in use.",
    tlOutputCorp_Metric2_R1: "Legacy metric - not currently in use.",
    tlOutputCorp_Metric3_R1: "Legacy metric - not currently in use.",
    tlOutputCorp_Metric4_R1: "Legacy metric - not currently in use.",
    tlOutputCorp_Metric5_R1: "Legacy metric - not currently in use."
  }
};

// =========================================================================
// SECTION 11: INVESTMENT CARD CONTENT
// =========================================================================

export interface InvestmentCardContent {
  LABELS: {
    TOTAL_INVESTMENT: string;
    TOTAL_CAPACITY: string;
    COMPLETED: string;
  };
  BUTTONS: {
    MAKE_INVESTMENTS: string;
    REVIEW_INVESTMENTS: string;
  };
}

export const INVESTMENT_CARD: InvestmentCardContent = {
  LABELS: {
    TOTAL_INVESTMENT: "Total Investment",
    TOTAL_CAPACITY: "Total Capacity",
    COMPLETED: "✓ Completed"
  },
  BUTTONS: {
    MAKE_INVESTMENTS: "Make Investments",
    REVIEW_INVESTMENTS: "Review Investments"
  }
};

// =========================================================================
// SECTION 12: FINANCIAL STATEMENT CONTENT
// =========================================================================

export interface FinancialStatementContent {
  PAGE_TITLE: string;
  PAGE_DESCRIPTION: string;
  STATEMENT_TITLE: string;
  COLUMN_HEADERS: {
    PHARMACY_BENEFITS: string;
    MEDICAL_BENEFITS: string;
    NON_NETWORK: string;
    CMM: string;
  };
  TOOLTIPS: {
    PHARMACY_BENEFITS: string;
    MEDICAL_BENEFITS: string;
    NON_NETWORK: string;
    CMM: string;
  };
  YEAR_TOGGLE: {
    YEAR_0: string;
    YEAR_1: string;
    YEAR_2: string;
    YEAR_2_DISABLED_TOOLTIP: string;
  };
  CATEGORIES: Array<{
    name: string;
    items: Array<{ label: string; value: number }>;
  }>;
  TOTALS: {
    GROSS_PROFIT: string;
    OPERATING_INCOME: string;
    NET_INCOME: string;
  };
  RATIOS: {
    GROSS_MARGIN: string;
    OPERATING_MARGIN: string;
    NET_MARGIN: string;
  };
}

export const FINANCIAL_STATEMENT: FinancialStatementContent = {
  PAGE_TITLE: "Income Statement",
  PAGE_DESCRIPTION: "Period Financial Performance Summary",
  STATEMENT_TITLE: "Income Statement",
  COLUMN_HEADERS: {
    PHARMACY_BENEFITS: "Pharmacy Benefits",
    MEDICAL_BENEFITS: "Medical Benefits",
    NON_NETWORK: "Non-Network",
    CMM: "CMM"
  },
  TOOLTIPS: {
    PHARMACY_BENEFITS: "Prescription drugs covered under the pharmacy benefit. Includes electronic prior authorization (ePA) workflows that reduce approval times and improve patient adherence. Growth is driven by Active Generalist NPIs, Retail Pharmacy Script Volume, and Pharma NPS, reflecting strength in provider engagement and patient access. Revenue is modeled as patient interactions × revenue per interaction.",
    MEDICAL_BENEFITS: "Clinician-administered services and specialty therapies covered under the medical benefit (e.g., oncology, rare disease). CMM focuses on automating medical prior authorization to cut delays and administrative burden. Growth is driven by Active Specialist NPIs, Specialty Pharmacy Script Volume, and Pharma NPS, reflecting depth in specialty networks and prescriber relationships. Revenue is modeled as patient interactions × revenue per interaction.",
    NON_NETWORK: "All other businesses outside the payer \"network\" flows—such as 3PL and Rx Savings Solutions—plus operational improvements (e.g., call-center automation) that can expand these revenues.",
    CMM: "The consolidated performance of Pharmacy Benefits, Medical Benefits, and Non-Network combined. Network revenues (pharmacy + medical) are aggregated and added to non-network results to produce total CMM financials. Operating metrics such as AOP and Operating Margin are calculated from the full income statement, reflecting total enterprise performance."
  },
  YEAR_TOGGLE: {
    YEAR_0: "Round 0",
    YEAR_1: "Round 1",
    YEAR_2: "Round 2",
    YEAR_2_DISABLED_TOOLTIP: "Complete Round 2 to view Year 2 data"
  },
  CATEGORIES: [
    { 
      name: "Revenue", 
      items: [
        { label: "Product Sales", value: 0 },
        { label: "Service Revenue", value: 0 },
        { label: "Other Revenue", value: 0 },
      ]
    },
    { 
      name: "Cost of Goods Sold", 
      items: [
        { label: "Direct Materials", value: 0 },
        { label: "Direct Labor", value: 0 },
        { label: "Manufacturing Overhead", value: 0 },
      ]
    },
    { 
      name: "Operating Expenses", 
      items: [
        { label: "Sales & Marketing", value: 0 },
        { label: "Research & Development", value: 0 },
        { label: "General & Administrative", value: 0 },
      ]
    },
  ],
  TOTALS: {
    GROSS_PROFIT: "Gross Profit",
    OPERATING_INCOME: "Operating Income",
    NET_INCOME: "Net Income"
  },
  RATIOS: {
    GROSS_MARGIN: "Gross Margin",
    OPERATING_MARGIN: "Operating Margin",
    NET_MARGIN: "Net Margin"
  }
};

// =========================================================================
// SECTION 13: METRIC CALCULATION CONTENT
// =========================================================================

export interface MetricCalculationContent {
  PAGE_TITLE: string;
  PAGE_DESCRIPTION: string;
  SECTIONS: Array<{
    description: string;
    calculations?: Array<{
      label: string;
      value: string | number;
    }>;
  }>;
  CALCULATION_LABELS: {
    OPENING_BASE: string;
    RETENTION_RATE: string;
    BASE_RETAINED: string;
    CHURNED_BASE: string;
    BASE_EXPANSION: string;
  };
}

export const METRIC_CALCULATION: MetricCalculationContent = {
  PAGE_TITLE: "Metric Calculation",
  PAGE_DESCRIPTION: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  SECTIONS: [
    {
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui."
    },
    {
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a."
    }
  ],
  CALCULATION_LABELS: {
    OPENING_BASE: "Opening Base",
    RETENTION_RATE: "Retention Rate",
    BASE_RETAINED: "Base Retained",
    CHURNED_BASE: "Churned Base",
    BASE_EXPANSION: "Base Expansion"
  }
};

// =========================================================================
// SECTION 14: GENERAL UI CONTENT
// =========================================================================

export interface GeneralUIContent {
  APP: {
    TITLE: string;
    SUBTITLE: string;
    DESCRIPTION: string;
  };
  BUTTONS: {
    START_SIMULATION: string;
    BACK: string;
    CONTINUE: string;
    RETURN_TO_HOME: string;
  };
  ERRORS: {
    PAGE_NOT_FOUND: {
      TITLE: string;
      MESSAGE: string;
    };
  };
}

export const GENERAL_UI: GeneralUIContent = {
  APP: {
    TITLE: "Cover My Meds",
    SUBTITLE: "Strategy at Scale",
    DESCRIPTION: "Navigate strategic decisions, manage investments, and drive business performance through multiple simulation rounds."
  },
  BUTTONS: {
    START_SIMULATION: "Start Simulation",
    BACK: "Back",
    CONTINUE: "Continue",
    RETURN_TO_HOME: "Return to Home"
  },
  ERRORS: {
    PAGE_NOT_FOUND: {
      TITLE: "404",
      MESSAGE: "Oops! Page not found"
    }
  }
};

// =========================================================================
// SECTION 15: ROUND COMPLETED CONTENT
// =========================================================================

export interface RoundCompletedContent {
  TITLE: {
    ROUND_COMPLETED: string;
    SIMULATION_COMPLETE: string;
  };
  DESCRIPTION: {
    ROUND_COMPLETED: string;
    SIMULATION_COMPLETE: string;
  };
  BUTTONS: {
    CONTINUE_TO_NEXT_ROUND: string;
    RETURN_TO_HOME: string;
  };
}

export const ROUND_COMPLETED: RoundCompletedContent = {
  TITLE: {
    ROUND_COMPLETED: "Round {currentRound} Completed!",
    SIMULATION_COMPLETE: "Simulation Complete!"
  },
  DESCRIPTION: {
    ROUND_COMPLETED: "Thank you for completing Round {currentRound} of {totalRounds}. Please see your facilitator for further instructions.",
    SIMULATION_COMPLETE: "Congratulations! You have completed all {totalRounds} rounds of the simulation. Please see your facilitator for further instructions."
  },
  BUTTONS: {
    CONTINUE_TO_NEXT_ROUND: "Continue to Round {nextRound}",
    RETURN_TO_HOME: "Return to Home"
  },
};

// =========================================================================
// SECTION 16: VALIDATION MESSAGES
// =========================================================================

export interface ValidationContent {
  SUBMIT_BLOCKED: {
    TITLE: string;
    INCOMPLETE_DECISIONS: string;
    NEGATIVE_CAPACITY: string;
    BOTH_ISSUES: string;
    BUTTON: string;
  };
}

export const VALIDATION: ValidationContent = {
  SUBMIT_BLOCKED: {
    TITLE: "Cannot Submit Decisions",
    INCOMPLETE_DECISIONS: "You have not completed all required investment decisions. Please visit all decision screens and make selections for each investment area.",
    NEGATIVE_CAPACITY: "Your current decisions result in negative capacity remaining. Please adjust your investment levels to bring your capacity back to zero or positive.",
    BOTH_ISSUES: "You have two issues preventing submission:\n\n1. Not all investment decisions have been made\n2. Your capacity remaining is negative\n\nPlease complete all decisions and adjust your investment levels to achieve zero or positive capacity.",
    BUTTON: "Return to Dashboard"
  }
};

// =============================================
// UTILITY FUNCTIONS FOR CONTENT ACCESS
// =============================================
// Purpose: Provide helper functions for accessing content programmatically
// Usage: Call getDecisionLabel('decision-1') to get decision name dynamically

/**
 * Get decision label by decision ID
 * @param decisionId - The decision identifier (e.g., 'decision-1')
 * @returns The human-readable decision label
 */
export const getDecisionLabel = (decisionId: string): string => {
  const decisionMap: Record<string, string> = {
    'decision-1': DECISIONS.LABELS.DECISION_1,
    'decision-2': DECISIONS.LABELS.DECISION_2, 
    'decision-3': DECISIONS.LABELS.DECISION_3,
    'decision-4': DECISIONS.LABELS.DECISION_4,
    'decision-5': DECISIONS.LABELS.DECISION_5,
    'decision-6': DECISIONS.LABELS.DECISION_6,
    'decision-7': DECISIONS.LABELS.DECISION_7,
    'decision-8': DECISIONS.LABELS.DECISION_8,
    'decision-9': DECISIONS.LABELS.DECISION_9,
    'decision-10': DECISIONS.LABELS.DECISION_10,
    'decision-11': DECISIONS.LABELS.DECISION_11,
    'decision-12': DECISIONS.LABELS.DECISION_12,
  };
  
  return decisionMap[decisionId] || decisionId;
};

/**
 * Get initiative by ID from round-specific data
 * @param initiativeId - The initiative identifier
 * @param currentRound - Current simulation round (defaults to 1)
 * @returns The initiative object or undefined if not found
 */
export const getInitiativeById = (initiativeId: string, currentRound: number = 1): Initiative | undefined => {
  const roundKey = `ROUND_${currentRound}` as keyof typeof INITIATIVES.ROUNDS;
  const roundInitiatives = INITIATIVES.ROUNDS[roundKey];
  return roundInitiatives?.find(initiative => initiative.id === initiativeId);
};

/**
 * Get all initiatives for a specific round
 * @param currentRound - The round number (1 or 2)
 * @returns Array of initiatives for the specified round
 */
export const getInitiativesForRound = (currentRound: number): Initiative[] => {
  const roundKey = `ROUND_${currentRound}` as keyof typeof INITIATIVES.ROUNDS;
  const initiatives = INITIATIVES.ROUNDS[roundKey] || [];
  return initiatives.filter(init => !init.hidden);
};

/**
 * Get events by round
 */
export function getEventsForRound(currentRound: number): Event[] {
  return EVENTS.BY_ROUND[currentRound] || [];
}

/**
 * Get event by ID across all rounds
 */
export function getEventById(eventId: string, currentRound?: number): Event | undefined {
  if (currentRound) {
    const roundEvents = EVENTS.BY_ROUND[currentRound] || [];
    return roundEvents.find(event => event.id === eventId);
  }
  
  // Search across all rounds if no specific round provided
  for (const round in EVENTS.BY_ROUND) {
    const events = EVENTS.BY_ROUND[parseInt(round)];
    const event = events.find(e => e.id === eventId);
    if (event) return event;
  }
  
  return undefined;
}

/**
 * Get event by round and event number (round-based numbering)
 * Each round restarts event numbering: Round 1 Event 1, Round 2 Event 1, etc.
 */
export function getEventByRoundAndNumber(round: number, eventNumber: number): Event | undefined {
  const roundEvents = getEventsForRound(round);
  const eventIndex = eventNumber - 1; // Convert to 0-based index
  return roundEvents[eventIndex] || undefined;
}

/**
 * Get event by sequential number across all rounds (legacy)
 * Event 1 and 2 are in Round 1, Event 3 and 4 are in Round 2, etc.
 */
export function getEventBySequentialNumber(eventNumber: number): Event | undefined {
  // Map sequential event numbers to event IDs
  const eventMap: Record<number, string> = {
    1: 'event-1',
    2: 'event-2', 
    3: 'event-3',
    4: 'event-4'
  };
  
  const eventId = eventMap[eventNumber];
  if (!eventId) return undefined;
  
  return getEventById(eventId);
}

/**
 * Get event outcome - simplified since each event is unique per round
 */
export function getEventOutcome(eventId: string, optionId: string, currentRound: number): { outcome: string; impact: string } | null {
  const event = getEventById(eventId, currentRound);
  if (event) {
    const option = event.options.find(opt => opt.id === optionId);
    if (option) {
      return {
        outcome: option.outcome,
        impact: option.impact
      };
    }
  }
  
  return null;
}

/**
 * Get event option title by round, event number, and option letter
 * @param round - Round number (1 or 2)
 * @param eventNumber - Event number within round (1-4)
 * @param optionLetter - Option letter ("A", "B", "C", etc.)
 * @returns The option title or empty string if not found
 */
export function getEventOptionTitle(round: number, eventNumber: number, optionLetter: string): string {
  const event = getEventByRoundAndNumber(round, eventNumber);
  if (!event) return '';
  
  // Find option by matching the option letter (A=0, B=1, C=2, etc.)
  const optionIndex = optionLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  const option = event.options[optionIndex];
  
  return option?.title || '';
}

/**
 * Check if an event is Round 2, Event 3 (Ransomware - conditional display)
 * This event displays differently on both Event and EventOutcomes pages
 */
export function isConditionalOutcomeEvent(round: number, eventNumber: number): boolean {
  return round === 2 && eventNumber === 3;
}

/**
 * Get selected initiatives from calc model for a specific round
 * @param currentRound - The round number (1 or 2)
 * @param getValue - Function to get values from calc model
 * @returns Array of selected initiative objects
 */
export function getSelectedInitiativesFromCalcModel(currentRound: number, getValue: (rangeName: string, useCache?: boolean) => any): Initiative[] {
  try {
    // Get available initiative range names for the current round
    const getAvailableRangeNames = (round: number) => {
      if (round === 1) {
        return [DECISION_RANGE_NAMES.INITIATIVE_1_ROUND_1, DECISION_RANGE_NAMES.INITIATIVE_2_ROUND_1];
      } else if (round === 2) {
        return [DECISION_RANGE_NAMES.INITIATIVE_1_ROUND_2, DECISION_RANGE_NAMES.INITIATIVE_2_ROUND_2];
      }
      return [];
    };

    const rangeNames = getAvailableRangeNames(currentRound);
    const roundInitiatives = getInitiativesForRound(currentRound);
    const selectedInitiatives: Initiative[] = [];
    
    rangeNames.forEach(rangeName => {
      try {
        const modelValue = getValue(rangeName, true);
        if (modelValue && modelValue !== '0' && modelValue !== '') {
          // Find initiative by modelValue
          const initiative = roundInitiatives.find(init => init.modelValue === modelValue);
          if (initiative) {
            selectedInitiatives.push(initiative);
          }
        }
      } catch (error) {
        console.warn(`Failed to get value for range ${rangeName}:`, error);
      }
    });
    
    return selectedInitiatives;
  } catch (error) {
    console.error('Error in getSelectedInitiativesFromCalcModel:', error);
    return [];
  }
}

/**
 * Gets financial statement category data by name
 */
export function getFinancialCategoryByName(categoryName: string) {
  return FINANCIAL_STATEMENT.CATEGORIES.find(cat => cat.name === categoryName);
}

/**
 * Gets dashboard card data by number
 */
export function getDashboardCard(cardNumber: 1 | 2 | 3) {
  const cardKey = `CARD${cardNumber}` as keyof typeof DASHBOARD.CARDS;
  return DASHBOARD.CARDS[cardKey];
}

/**
 * Formats metric value based on type
 */
export function formatMetricValue(value: number, format: 'currency' | 'percentage' | 'number', decimals: number = 0): string {
  switch (format) {
    case 'currency':
      return `$${(value / 1000000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} M`;
    case 'percentage':
      return `${value.toFixed(decimals)}%`;
    case 'number':
    default:
      return decimals > 0 ? value.toFixed(decimals) : value.toString();
  }
}

// =============================================
// DEBRIEF DRIVER DATA
// =============================================
// Purpose: Driver configurations for debrief analysis pages
// Usage: Import DEBRIEF_DRIVERS to get driver data for specific debrief pages

export interface DriverData {
  name: string;
  shortName: string;
  decisionId: string; // Maps to decision ID for investment level lookup
  rangeMin: number;
  rangeMax: number;
  teamOutcome: number;
}

export interface DebriefDrivers {
  PHARMA_NPS: DriverData[];
  // Future debrief driver sets will go here
}

export const DEBRIEF_DRIVERS: DebriefDrivers = {
  PHARMA_NPS: [
    {
      name: "Form Automation",
      shortName: "Form Automation",
      decisionId: "DECISION_8", // Maps to Form Automation in DECISIONS
      rangeMin: 1.5,
      rangeMax: 3.2,
      teamOutcome: 2.8
    },
    {
      name: "Payer GTM",
      shortName: "Payer GTM",
      decisionId: "PAYER_ENGAGEMENT", // Maps to Payer Engagement
      rangeMin: 1.2,
      rangeMax: 2.9,
      teamOutcome: 2.3
    },
    {
      name: "Data & Analytics",
      shortName: "Data & Analytics",
      decisionId: "DECISION_8", // Placeholder - needs proper mapping
      rangeMin: 0.8,
      rangeMax: 2.8,
      teamOutcome: 2.5
    },
    {
      name: "Predictive Intelligence",
      shortName: "Predictive Intelligence",
      decisionId: "DECISION_8", // Placeholder - needs proper mapping
      rangeMin: 1.0,
      rangeMax: 2.5,
      teamOutcome: 1.8
    },
    {
      name: "Patient Notification",
      shortName: "Patient Notification",
      decisionId: "DECISION_5", // Maps to Patient Notification in DECISIONS
      rangeMin: 0.9,
      rangeMax: 2.3,
      teamOutcome: 1.9
    },
    {
      name: "Performance Security & Reliability",
      shortName: "Performance Security & Reliability",
      decisionId: "DECISION_11", // Maps to Performance, Reliability & Security
      rangeMin: 0.7,
      rangeMax: 2.1,
      teamOutcome: 1.6
    },
    {
      name: "Initiatives & Events",
      shortName: "Initiatives & Events",
      decisionId: "INITIATIVES_EVENTS", // Special case - not a regular decision
      rangeMin: 0.5,
      rangeMax: 1.8,
      teamOutcome: 1.2
    }
  ]
};

// ═════════════════════════════════════════════════════════════════════════════
// UI FLOW CONSTRAINTS & TYPE DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════
// These constraints control UI behavior and user flow (not calculations)

export const UI_CONSTRAINTS = {
  MAX_INITIATIVE_SELECTIONS: 2,  // Maximum special initiatives per round
  TOTAL_ROUNDS: 2,                // Total number of simulation rounds
} as const;

/**
 * Validates a password input against an expected password or master password
 * @param input - The password input from the user
 * @param expectedPassword - The expected password for this specific check
 * @returns true if input matches expected password or master password, false otherwise
 */
export function validatePassword(input: string, expectedPassword: string): boolean {
  return input === expectedPassword || input === PASSWORD.MASTER_PASSWORD;
}

// Simulation constants for baseline metric values
export const SIMULATION_CONSTANTS = {
  REVENUE: 5454000000,  // $5,454 M - Revenue value
  GROSS_MARGIN: 28.7,  // 28.7% - Gross margin percentage
  AOP: 901000000,  // $901 M - AOP value
  OPERATING_MARGIN: 16.5,  // 16.5% - Operating margin percentage
  PRODUCTIVITY: 0.975,  // 0.975 - Employee productivity value
  ACTIVE_GEN_NPIS: 369600,  // 369.6 K - Active Gen. NPIs value
  ACTIVE_SPEC_NPIS: 210700,  // 210.7 K - Active Spec. NPIs value
  RET_PHARMACY: 61200000,  // 61.20 M - Ret. Pharmacy value
  SPEC_PHARMACY: 3850000,  // 3.85 M - Spec. Pharmacy value
} as const;

// Type definitions for UI components (no calculation logic)
export type InvestmentLevel = 'low' | 'medium' | 'high';

export interface CategoryTotals {
  units: number;
  cost: number;
  capacity: number;
}

export interface InvestmentOption {
  id: string;
  title: string;
  options: {
    low: { units: number; cost: number; capacity: number };
    medium: { units: number; cost: number; capacity: number };
    high: { units: number; cost: number; capacity: number };
  };
}

/**
 * Get the range name for an event based on round and event number
 * @param round - The round number (1 or 2)
 * @param eventNumber - The event number within the round (1-4)
 * @returns The range name for the event
 */
export function getEventRangeName(round: number, eventNumber: number): string {
  const eventKey = `EVENT_${eventNumber}_ROUND_${round}` as keyof typeof EVENT_RANGE_NAMES;
  return EVENT_RANGE_NAMES[eventKey] || '';
}

/**
 * Convert numeric value to letter format (1=A, 2=B, 3=C, 4=D, etc.)
 * @param numericValue - The numeric value from calc model
 * @returns The corresponding letter (A, B, C, D, etc.) or "0" for no decision
 * @deprecated - Events now store letter values directly in calc model
 */
export function convertNumericToLetter(numericValue: any): string {
  const num = parseInt(numericValue);
  if (isNaN(num) || num <= 0) return '0';
  
  // Convert to letter: 1=A, 2=B, 3=C, 4=D, etc.
  return String.fromCharCode(64 + num); // 64 is ASCII code for '@', so 65 is 'A'
}

/**
 * Convert letter format to numeric value (A=1, B=2, C=3, D=4, etc.)
 * @param letterValue - The letter value (A, B, C, D, etc.)
 * @returns The corresponding numeric value or 0 for no decision
 * @deprecated - Events now store letter values directly in calc model
 */
export function convertLetterToNumeric(letterValue: string | null | undefined): number {
  if (!letterValue || letterValue === '0' || letterValue === '') return 0;
  
  const letter = letterValue.toUpperCase();
  const charCode = letter.charCodeAt(0);
  
  // Convert from letter to number: A=1, B=2, C=3, D=4, etc.
  const numeric = charCode - 64; // 64 is ASCII code for '@', so 'A' (65) becomes 1
  
  return numeric > 0 ? numeric : 0;
}

/**
 * Get event decision value from calc model
 * @param round - The round number (1 or 2)
 * @param eventNumber - The event number within the round (1-4)
 * @param getValue - Function to get values from calc model
 * @returns The event decision value ("A", "B", "C", "D", etc., or "0" for no decision)
 */
export function getEventDecisionFromCalcModel(
  round: number, 
  eventNumber: number, 
  getValue: (rangeName: string, useCache?: boolean) => any
): string {
  try {
    const rangeName = getEventRangeName(round, eventNumber);
    if (!rangeName) {
      console.warn(`No range name found for round ${round}, event ${eventNumber}`);
      return '0';
    }
    
    const value = getValue(rangeName);
    // Return the value directly (should be A, B, C, D, etc.)
    return value && value !== '0' ? value.toString() : '0';
  } catch (error) {
    console.error('Error getting event decision from calc model:', error);
    return '0';
  }
}

/**
 * Get strategy planning value from calc model
 * @param field - The strategy planning field (strengths, weaknesses, opportunities, threats, shortTermPriorities, longTermPriorities)
 * @param getValue - Function to get values from calc model
 * @returns The strategy planning value or empty string if not found
 */
export function getStrategyPlanningFromCalcModel(
  field: keyof typeof STRATEGY_PLANNING_RANGE_NAMES,
  getValue: (rangeName: string, useCache?: boolean) => any
): string {
  try {
    const rangeName = STRATEGY_PLANNING_RANGE_NAMES[field];
    if (!rangeName) {
      console.warn(`No range name found for strategy planning field: ${field}`);
      return '';
    }
    
    const value = getValue(rangeName);
    return value ? value.toString() : '';
  } catch (error) {
    console.error('Error getting strategy planning from calc model:', error);
    return '';
  }
}

/**
 * Get all strategy planning values from calc model
 * @param getValue - Function to get values from calc model
 * @returns Object with all strategy planning values (SWOT Analysis)
 */
export function getAllStrategyPlanningFromCalcModel(
  getValue: (rangeName: string, useCache?: boolean) => any
): {
  teamName: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
} {
  return {
    teamName: getStrategyPlanningFromCalcModel('TEAM_NAME', getValue),
    strengths: getStrategyPlanningFromCalcModel('STRENGTHS', getValue),
    weaknesses: getStrategyPlanningFromCalcModel('WEAKNESSES', getValue),
    opportunities: getStrategyPlanningFromCalcModel('OPPORTUNITIES', getValue),
    threats: getStrategyPlanningFromCalcModel('THREATS', getValue),
  };
}

/**
 * Clean up old strategy planning data from localStorage
 * This function removes the old strategyPlanning data from DecState localStorage
 * since it's now handled by CalcModel
 */
export function cleanupOldStrategyPlanningData(): void {
  try {
    const storageKey = 'simulation_state_v1';
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      
      if (parsed.data && parsed.data.strategyPlanning) {
        console.log('🧹 Cleaning up old strategy planning data from localStorage');
        delete parsed.data.strategyPlanning;
        localStorage.setItem(storageKey, JSON.stringify(parsed));
        console.log('✅ Old strategy planning data removed from localStorage');
      }
    }
  } catch (error) {
    console.error('❌ Error cleaning up old strategy planning data:', error);
  }
}

// =============================================
// SCREEN TRACKING HELPER FUNCTIONS
// =============================================

/**
 * Mark a screen as visited by setting its tracking value to 1
 * @param screenKey - The screen tracking key (e.g., 'SCREEN_1', 'SCREEN_2')
 * @param setValue - Function to set value in calc model
 * @param getValue - Function to get value from calc model (for round detection)
 */
export function markScreenAsVisited(
  screenKey: keyof typeof SCREEN_TRACKING_RANGE_NAMES_R1,
  setValue: (rangeName: string, value: string) => void,
  getValue?: (rangeName: string) => string
): void {
  try {
    // Determine current round if getValue is provided
    let currentRound = 1; // Default to Round 1
    if (getValue) {
      currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
    }
    
    // Select the appropriate screen tracking ranges based on current round
    const screenRanges = currentRound === 2 ? SCREEN_TRACKING_RANGE_NAMES_R2 : SCREEN_TRACKING_RANGE_NAMES_R1;
    const rangeName = screenRanges[screenKey];
    
    setValue(rangeName, '1');
    console.log(`📱 Screen ${screenKey} marked as visited for Round ${currentRound} (${rangeName} = 1)`);
  } catch (error) {
    console.error(`❌ Error marking screen ${screenKey} as visited:`, error);
  }
}

/**
 * Mark round as submitted in CalcModel
 * @param submissionKey - Key for the submission range name
 * @param setValue - Function to set value in calc model
 */
export function markRoundAsSubmitted(
  submissionKey: keyof typeof ROUND_SUBMISSION_RANGE_NAMES,
  setValue: (rangeName: string, value: string) => void
): void {
  try {
    const rangeName = ROUND_SUBMISSION_RANGE_NAMES[submissionKey];
    setValue(rangeName, '1');
    console.log(`🎯 Round ${submissionKey} marked as submitted (${rangeName} = 1)`);
  } catch (error) {
    console.error(`❌ Error marking round ${submissionKey} as submitted:`, error);
  }
}

/**
 * Get initiative title by model value (SI1, SI2, etc.)
 * Auto-detects round based on initiative number (SI1-SI10 = R1, SI11-SI20 = R2)
 * @param modelValue - The model value to look up (e.g., 'SI1', 'SI2', 'SI11')
 * @param round - Optional: explicitly specify round (auto-detected if not provided)
 * @returns Initiative title or modelValue if not found
 */
export function getInitiativeTitleByModelValue(modelValue: string, round?: number): string {
  // Auto-detect round from modelValue if not explicitly provided
  let targetRound = round;
  
  if (targetRound === undefined) {
    // Extract number from modelValue (e.g., "SI11" → 11)
    const match = modelValue.match(/SI(\d+)/);
    if (match) {
      const initiativeNumber = parseInt(match[1], 10);
      // SI1-SI10 are Round 1, SI11-SI20 are Round 2
      targetRound = initiativeNumber <= 10 ? 1 : 2;
    } else {
      // Fallback to Round 1 if pattern doesn't match
      targetRound = 1;
    }
  }
  
  const initiatives = targetRound === 1 ? ROUND_1_INITIATIVES : ROUND_2_INITIATIVES;
  const initiative = initiatives.find(init => init.modelValue === modelValue);
  return initiative?.title || modelValue; // Fallback to modelValue if not found
}

// =============================================
// INVESTMENT DECISION HELPER FUNCTIONS
// =============================================

/**
 * Get investment decision from calc model
 * @param decisionId - The decision ID (e.g., 'decision-1', 'decision-2')
 * @param getValue - Function to get value from calc model
 * @returns Investment level as number (0=no decision, 1=low, 2=medium, 3=high)
 */
export const getInvestmentDecisionFromCalcModel = (
  decisionId: string, 
  getValue: (rangeName: string, useCache?: boolean) => any
): number => {
  try {
    // Determine current round
    const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
    
    // Select the appropriate range object based on current round
    const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;
    
    // Map decision IDs to range names (using consistent keys without _R1/_R2 suffixes)
    const decisionToRangeMap: Record<string, keyof typeof INVESTMENT_RANGE_NAMES_R1> = {
      // Go-to-Market (Decision Screen 1)
      'decision-1': 'GTM_PROV',
      'decision-2': 'GTM_PHARM', 
      'decision-3': 'GTM_PAY',
      
      // Product (Decision Screen 2 - Product)
      'decision-6': 'PROD_PATNOTIF',
      'decision-7': 'PROD_PHARMFUNC',
      'decision-8': 'PROD_PROVFUNC',
      'decision-9': 'PROD_FORMAUTO',
      
      // Technology (Decision Screen 2 - Technology)
      'decision-10': 'TECH_PREDINT',
      'decision-11': 'TECH_PLATUNIF',
      'decision-12': 'TECH_PERFREL',
      'decision-13': 'TECH_DEVPROD',
      
      // Operations (Decision Screen 3)
      'decision-14': 'OPS_NWKOPS',
      'decision-15': 'OPS_DATAANALY',
    };
    
    const rangeKey = decisionToRangeMap[decisionId];
    if (!rangeKey) {
      console.warn(`No range mapping found for decision ID: ${decisionId}`);
      return 0;
    }
    
    const rangeName = investmentRanges[rangeKey];
    const value = getValue(rangeName, true);
    
    // Convert to number, defaulting to 0 if invalid
    const numericValue = value ? Number(value) : 0;
    return isNaN(numericValue) ? 0 : numericValue;
  } catch (error) {
    console.error(`Error getting investment decision for ${decisionId}:`, error);
    return 0;
  }
};

/**
 * Get range name for a decision ID
 * @param decisionId - The decision ID
 * @param getValue - Function to get value from calc model (for round detection)
 * @returns Range name or null if not found
 */
export const getInvestmentRangeName = (decisionId: string, getValue?: (rangeName: string) => string): string | null => {
  // Determine current round if getValue is provided
  let currentRound = 1; // Default to Round 1
  if (getValue) {
    currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  }
  
  // Select the appropriate range object based on current round
  const investmentRanges = currentRound === 2 ? INVESTMENT_RANGE_NAMES_R2 : INVESTMENT_RANGE_NAMES_R1;
  
  const decisionToRangeMap: Record<string, keyof typeof INVESTMENT_RANGE_NAMES_R1> = {
    // Go-to-Market (Decision Screen 1)
    'decision-1': 'GTM_PROV',
    'decision-2': 'GTM_PHARM', 
    'decision-3': 'GTM_PAY',
    
    // Product (Decision Screen 2 - Product)
    'decision-4': 'PROD_PATNOTIF',
    'decision-5': 'PROD_PHARMFUNC',
    'decision-6': 'PROD_PROVFUNC',
    'decision-7': 'PROD_FORMAUTO',
    
    // Technology (Decision Screen 2 - Technology)
    'decision-8': 'TECH_PREDINT',
    'decision-9': 'TECH_PLATUNIF',
    'decision-10': 'TECH_PERFREL',
    'decision-11': 'TECH_DEVPROD',
    
    // Operations (Decision Screen 3)
    'decision-12': 'OPS_NWKOPS',
    'decision-13': 'OPS_DATAANALY',
  };
  
  const rangeKey = decisionToRangeMap[decisionId];
  return rangeKey ? investmentRanges[rangeKey] : null;
};

/**
 * Convert investment level to numeric value
 * @param level - Investment level
 * @returns Numeric value (0=no decision, 1=low, 2=medium, 3=high)
 */
export const convertInvestmentLevelToValue = (level?: 'low' | 'medium' | 'high'): number => {
  if (level === 'low') return 1;
  if (level === 'medium') return 2;
  if (level === 'high') return 3;
  return 0;
};

/**
 * Convert numeric value to investment level
 * @param value - Numeric value
 * @returns Investment level
 */
export const convertValueToInvestmentLevel = (value: number): 'low' | 'medium' | 'high' | undefined => {
  if (value === 1) return 'low';
  if (value === 2) return 'medium';
  if (value === 3) return 'high';
  return undefined;
};

// =============================================
// LOGOUT DIALOG CONTENT
// =============================================
// Purpose: Content for logout confirmation dialog
// Usage: Used in LogoutButton component for consistent messaging

export const LOGOUT_DIALOG = {
  TITLE: 'Confirm Logout',
  DESCRIPTION: 'Are you sure you want to logout? Any unsaved changes will be lost.',
  BUTTONS: {
    CANCEL: 'Cancel',
    LOGOUT: 'Logout'
  }
};