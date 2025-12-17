/**
 * RANGE NAME MAP - CALC MODEL REFERENCE NAMES
 *
 * ⚠️  WARNING: This file contains critical range name constants for the calc model.
 *
 * This file centralizes all range names used throughout the application.
 * These names must match exactly with the named ranges defined in the calc model.
 *
 * Changes to these constants may affect:
 * - KPI displays and calculations
 * - Component data binding
 * - Model calculations and updates
 *
 * Please ensure range names match the calc model before making changes.
 */

// ============================================
// MIGRATION MODE CONFIGURATION
// ============================================
// Set to true when swapping calc models to prevent cascading errors
// All range names will be prefixed with __INACTIVE__ causing:
// - getValue: Returns #N/A → CalcValue shows fallback
// - setValue: Silently skipped by guard in calc.service.ts
// ============================================
const MIGRATION_MODE = false;

// Helper function to wrap range names
const range = (activeRangeName: string): string => 
  MIGRATION_MODE ? `__INACTIVE__${activeRangeName}` : activeRangeName;

/**
 * KPI Range Names
 * These correspond to the main KPI metrics displayed in the application
 */
export const KPI_RANGE_NAMES_R1 = {
  // Financial KPIs
  REVENUE: range("tlOutput_Dash_Metric1_R1"),
  GROSS_PROFIT: range("tlOutput_Debrief_PNL_Total_GP_R1"),
  AOP: range("tlOutput_Dash_Metric2_R1"),

  // Pharmacy KPIs
  ACTIVE_GEN_NPIS: range("tlOutput_Dash_Metric3_R1"),
  ACTIVE_SPEC_NPIS: range("tlOutput_Dash_Metric4_R1"),
  RET_PHARMACY: range("tlOutput_Dash_Metric5_R1"),
  SPEC_PHARMACY: range("tlOutput_Dash_Metric6_R1"),
  PHARMA_NPS: range("tlOutput_Dash_Metric7_R1"),

  // Operations KPIs
  CAPACITY_REMAINING: range("tlOutput_Dash_Metric8_R1"),
} as const;

export const KPI_RANGE_NAMES_R2 = {
  // Financial KPIs
  REVENUE: range("tlOutput_Dash_Metric1_R2"),
  GROSS_PROFIT: range("tlOutput_Debrief_PNL_Total_GP_R2"),
  AOP: range("tlOutput_Dash_Metric2_R2"),

  // Pharmacy KPIs
  ACTIVE_GEN_NPIS: range("tlOutput_Dash_Metric3_R2"),
  ACTIVE_SPEC_NPIS: range("tlOutput_Dash_Metric4_R2"),
  RET_PHARMACY: range("tlOutput_Dash_Metric5_R2"),
  SPEC_PHARMACY: range("tlOutput_Dash_Metric6_R2"),
  PHARMA_NPS: range("tlOutput_Dash_Metric7_R2"),

  // Operations KPIs
  CAPACITY_REMAINING: range("tlOutput_Dash_Metric8_R2"),
} as const;

/**
 * Round Management Range Names
 * These correspond to simulation round tracking and configuration
 */
export const ROUND_MANAGEMENT_RANGE_NAMES = {
  // Current round tracking
  CURRENT_ROUND: range("tlInputTeamRound"),
  
  // Team number
  TEAM_NUMBER: range("tlInputTeamNumber"),
  
  // Total rounds configuration
  TOTAL_ROUNDS: range("ConvertedBoard_Rounds"),
} as const;

/**
 * Screen Tracking Range Names
 * These correspond to tracking which screens have been visited (0 = not visited, 1 = visited)
 */
export const SCREEN_TRACKING_RANGE_NAMES_R1 = {
  // Welcome Screen
  SCREEN_1: range("tlInputScreen1_R1"),
  
  // Strategy Planning
  SCREEN_2: range("tlInputScreen2_R1"),
  
  // Key Initiatives
  SCREEN_3: range("tlInputScreen3_R1"),
  
  // Initiatives Impacts
  SCREEN_4: range("tlInputScreen4_R1"),
  
  // Event 1
  SCREEN_5: range("tlInputScreen5_R1"),
  
  // Event 2
  SCREEN_6: range("tlInputScreen6_R1"),
  
  // Decisions
  SCREEN_7: range("tlInputScreen7_R1"),
  
  // Finalize Investments
  SCREEN_8: range("tlInputScreen8_R1"),
  
  // Event 3
  SCREEN_9: range("tlInputScreen9_R1"),
  
  // Event 4
  SCREEN_10: range("tlInputScreen10_R1"),
  
  // Info Screen 1 - Pharmacy Benefits Network Health
  SCREEN_11: range("tlInputScreen11_R1"),
  
  // Info Screen 2 - Active Generalist NPIs
  SCREEN_12: range("tlInputScreen12_R1"),
  
  // Info Screen 3 - Retail Pharmacy Scripts
  SCREEN_13: range("tlInputScreen13_R1"),
  
  // Info Screen 4 - Revenue/Interaction
  SCREEN_14: range("tlInputScreen14_R1"),
  
  // Info Screen 5 - Pharma NPS
  SCREEN_15: range("tlInputScreen15_R1"),
  
  // Info Screen 6 - Pharmacy Benefits Rev
  SCREEN_16: range("tlInputScreen16_R1"),
  
  // Info Screen 7 - Costs Table
  SCREEN_17: range("tlInputScreen17_R1"),
  
  // Info Screen 8 - Income Statement
  SCREEN_18: range("tlInputScreen18_R1"),
} as const;

export const SCREEN_TRACKING_RANGE_NAMES_R2 = {
  // Welcome Screen
  SCREEN_1: range("tlInputScreen1_R2"),
  
  // Strategy Planning
  SCREEN_2: range("tlInputScreen2_R2"),
  
  // Key Initiatives
  SCREEN_3: range("tlInputScreen3_R2"),
  
  // Initiatives Impacts
  SCREEN_4: range("tlInputScreen4_R2"),
  
  // Event 1
  SCREEN_5: range("tlInputScreen5_R2"),
  
  // Event 2
  SCREEN_6: range("tlInputScreen6_R2"),
  
  // Decisions
  SCREEN_7: range("tlInputScreen7_R2"),
  
  // Finalize Investments
  SCREEN_8: range("tlInputScreen8_R2"),
  
  // Event 3
  SCREEN_9: range("tlInputScreen9_R2"),
  
  // Event 4
  SCREEN_10: range("tlInputScreen10_R2"),
  
  // Info Screen 1 - Pharmacy Benefits Network Health
  SCREEN_11: range("tlInputScreen11_R2"),
  
  // Info Screen 2 - Active Generalist NPIs
  SCREEN_12: range("tlInputScreen12_R2"),
  
  // Info Screen 3 - Retail Pharmacy Scripts
  SCREEN_13: range("tlInputScreen13_R2"),
  
  // Info Screen 4 - Revenue/Interaction
  SCREEN_14: range("tlInputScreen14_R2"),
  
  // Info Screen 5 - Pharma NPS
  SCREEN_15: range("tlInputScreen15_R2"),
  
  // Info Screen 6 - Pharmacy Benefits Rev
  SCREEN_16: range("tlInputScreen16_R2"),
  
  // Info Screen 7 - Costs Table
  SCREEN_17: range("tlInputScreen17_R2"),
  
  // Info Screen 8 - Income Statement
  SCREEN_18: range("tlInputScreen18_R2"),
} as const;

/**
 * Round Submission Range Names
 * Tracks when rounds are submitted
 */
export const ROUND_SUBMISSION_RANGE_NAMES = {
  ROUND_1_SUBMITTED: range("tlInputSubmitted_R1"),
  ROUND_2_SUBMITTED: range("tlInputSubmitted_R2"),
} as const;

/**
 * Investment Range Names
 * These correspond to investment-related calculations
 */
export const INVESTMENT_RANGE_NAMES_R1 = {
  // ⚠️ GTM DECISIONS (BUSINESS UNIT 1) - REMOVED FROM UI
  // These decisions have been disabled and will use CalcModel defaults.
  // Kept here for reference and to avoid renumbering risk.
  GTM_PROV: range("tlInput_GTM_Prov_R1"),
  GTM_PHARM: range("tlInput_GTM_Pharm_R1"),
  GTM_PAY: range("tlInput_GTM_Pay_R1"),

  // Product Investments (Decision Screen 2 - Product)
  PROD_PATNOTIF: range("tlInput_Prod_PatNotif_R1"),
  PROD_PHARMFUNC: range("tlInput_Prod_PharmFunc_R1"),
  PROD_PROVFUNC: range("tlInput_Prod_ProvFunc_R1"),
  // ⚠️ DECISION 7 (FORM AUTOMATION) - REMOVED FROM UI
  // This range still exists in CalcModel but is no longer displayed in the application.
  // The decision has been disabled and will not impact simulation results.
  // Kept here for reference and to avoid renumbering risk.
  PROD_FORMAUTO: range("tlInput_Prod_FormAuto_R1"),

  // Technology Investments (Decision Screen 2 - Technology)
  TECH_PREDINT: range("tlInput_Tech_PredInt_R1"),
  TECH_PLATUNIF: range("tlInput_Tech_PlatUnif_R1"),
  TECH_PERFREL: range("tlInput_Tech_PerfRel_R1"),
  TECH_DEVPROD: range("tlInput_Tech_DevProd_R1"),

  // Operations Investments (Decision Screen 3)
  OPS_NWKOPS: range("tlInput_Ops_NwkOps_R1"),
  OPS_DATAANALY: range("tlInput_Ops_DataAnaly_R1"),
} as const;

export const INVESTMENT_RANGE_NAMES_R2 = {
  // ⚠️ GTM DECISIONS (BUSINESS UNIT 1) - REMOVED FROM UI
  // These decisions have been disabled and will use CalcModel defaults.
  // Kept here for reference and to avoid renumbering risk.
  GTM_PROV: range("tlInput_GTM_Prov_R2"),
  GTM_PHARM: range("tlInput_GTM_Pharm_R2"),
  GTM_PAY: range("tlInput_GTM_Pay_R2"),

  // Product Investments (Decision Screen 2 - Product)
  PROD_PATNOTIF: range("tlInput_Prod_PatNotif_R2"),
  PROD_PHARMFUNC: range("tlInput_Prod_PharmFunc_R2"),
  PROD_PROVFUNC: range("tlInput_Prod_ProvFunc_R2"),
  // ⚠️ DECISION 7 (FORM AUTOMATION) - REMOVED FROM UI (same warning applies to R2 ranges)
  PROD_FORMAUTO: range("tlInput_Prod_FormAuto_R2"),

  // Technology Investments (Decision Screen 2 - Technology)
  TECH_PREDINT: range("tlInput_Tech_PredInt_R2"),
  TECH_PLATUNIF: range("tlInput_Tech_PlatUnif_R2"),
  TECH_PERFREL: range("tlInput_Tech_PerfRel_R2"),
  TECH_DEVPROD: range("tlInput_Tech_DevProd_R2"),

  // Operations Investments (Decision Screen 3)
  OPS_NWKOPS: range("tlInput_Ops_NwkOps_R2"),
  OPS_DATAANALY: range("tlInput_Ops_DataAnaly_R2"),
} as const;

/**
 * Dashboard Expense Range Names
 * These correspond to calculated expense outputs displayed on the dashboard
 */
export const DASH_EXPENSE_RANGE_NAMES_R1 = {
  GTM_PROV_EXP_R1: range("tlOutput_Expense_Dec1_R1"),
  GTM_PHARM_EXP_R1: range("tlOutput_Expense_Dec2_R1"),
  GTM_PAY_EXP_R1: range("tlOutput_Expense_Dec3_R1"),
} as const;

export const DASH_EXPENSE_RANGE_NAMES_R2 = {
  GTM_PROV_EXP_R2: range("tlOutput_Expense_Dec1_R2"),
  GTM_PHARM_EXP_R2: range("tlOutput_Expense_Dec2_R2"),
  GTM_PAY_EXP_R2: range("tlOutput_Expense_Dec3_R2"),
} as const;

/**
 * Dashboard Cumulative Capability Range Names
 * These correspond to calculated cumulative capability outputs displayed on the dashboard
 * Note: Dec4-Dec13 in CalcModel correspond to decision-5 through decision-14 in the app
 * (decision-1 through decision-4 are GTM decisions which don't show cumulative capability)
 */
export const DASH_CUM_RANGE_NAMES_R1 = {
  // Product Cumulative Capabilities (decision-5 to decision-8)
  PROD_PATNOTIF_CUM_R1: range("tlOutput_Cum_Dec4_R1"),
  PROD_PHARMFUNC_CUM_R1: range("tlOutput_Cum_Dec5_R1"),
  PROD_PROVFUNC_CUM_R1: range("tlOutput_Cum_Dec6_R1"),
  PROD_FORMAUTO_CUM_R1: range("tlOutput_Cum_Dec7_R1"),
  
  // Technology Cumulative Capabilities (decision-9 to decision-12)
  TECH_PREDINT_CUM_R1: range("tlOutput_Cum_Dec8_R1"),
  TECH_PLATUNIF_CUM_R1: range("tlOutput_Cum_Dec9_R1"),
  TECH_PERFREL_CUM_R1: range("tlOutput_Cum_Dec10_R1"),
  TECH_DEVPROD_CUM_R1: range("tlOutput_Cum_Dec11_R1"),
  
  // Operations Cumulative Capabilities (decision-13 to decision-14)
  OPS_NWKOPS_CUM_R1: range("tlOutput_Cum_Dec12_R1"),
  OPS_DATAANALY_CUM_R1: range("tlOutput_Cum_Dec13_R1"),
} as const;

export const DASH_CUM_RANGE_NAMES_R2 = {
  // Product Cumulative Capabilities (decision-5 to decision-8)
  PROD_PATNOTIF_CUM_R2: range("tlOutput_Cum_Dec4_R2"),
  PROD_PHARMFUNC_CUM_R2: range("tlOutput_Cum_Dec5_R2"),
  PROD_PROVFUNC_CUM_R2: range("tlOutput_Cum_Dec6_R2"),
  PROD_FORMAUTO_CUM_R2: range("tlOutput_Cum_Dec7_R2"),
  
  // Technology Cumulative Capabilities (decision-9 to decision-12)
  TECH_PREDINT_CUM_R2: range("tlOutput_Cum_Dec8_R2"),
  TECH_PLATUNIF_CUM_R2: range("tlOutput_Cum_Dec9_R2"),
  TECH_PERFREL_CUM_R2: range("tlOutput_Cum_Dec10_R2"),
  TECH_DEVPROD_CUM_R2: range("tlOutput_Cum_Dec11_R2"),
  
  // Operations Cumulative Capabilities (decision-13 to decision-14)
  OPS_NWKOPS_CUM_R2: range("tlOutput_Cum_Dec12_R2"),
  OPS_DATAANALY_CUM_R2: range("tlOutput_Cum_Dec13_R2"),
} as const;

/**
 * Decision Range Names
 * These correspond to decision screen calculations
 */
export const DECISION_RANGE_NAMES = {
  // Initiative Selection Ranges
  INITIATIVE_1_ROUND_1: range("tlInputSI1_R1"),
  INITIATIVE_2_ROUND_1: range("tlInputSI2_R1"),
  INITIATIVE_1_ROUND_2: range("tlInputSI1_R2"),
  INITIATIVE_2_ROUND_2: range("tlInputSI2_R2"),
} as const;

/**
 * Event Range Names
 * These correspond to event outcome calculations
 */
export const EVENT_RANGE_NAMES = {
  // Round 1 Event Range Names
  EVENT_1_ROUND_1: range("tlInputEvent1_R1"),
  EVENT_2_ROUND_1: range("tlInputEvent2_R1"),
  EVENT_3_ROUND_1: range("tlInputEvent3_R1"),
  EVENT_4_ROUND_1: range("tlInputEvent4_R1"),

  // Round 2 Event Range Names
  EVENT_1_ROUND_2: range("tlInputEvent1_R2"),
  EVENT_2_ROUND_2: range("tlInputEvent2_R2"),
  EVENT_3_ROUND_2: range("tlInputEvent3_R2"),
  EVENT_4_ROUND_2: range("tlInputEvent4_R2"),
} as const;

/**
 * Verity Score Range Names
 * These correspond to Verity bot score inputs for each round
 */
export const VERITY_SCORE_RANGE_NAMES = {
  // Round 1 Verity Score
  VERITY_SCORE_ROUND_1: range("tlInputVerityScore_R1"),
  
  // Round 2 Verity Score
  VERITY_SCORE_ROUND_2: range("tlInputVerityScore_R2"),
} as const;

/**
 * Strategy Planning Range Names
 * These correspond to strategy planning calculations
 * Team Name + SWOT Analysis
 */
export const STRATEGY_PLANNING_RANGE_NAMES = {
  TEAM_NAME: range("tlInputTeamName"),
  // SWOT Analysis
  STRENGTHS: range("tlInputPlanning1"),
  WEAKNESSES: range("tlInputPlanning2"),
  OPPORTUNITIES: range("tlInputPlanning3"),
  THREATS: range("tlInputPlanning4"),
  // Strategic Priorities
  SHORT_TERM_PRIORITIES: range("tlInputPlanning5"),
  LONG_TERM_PRIORITIES: range("tlInputPlanning6"),
} as const;

/**
 * Strategic Initiative Selection Range Names
 * These track which initiatives were selected in each round
 */
export const STRATEGIC_INITIATIVE_RANGE_NAMES = {
  SI_ROUND1_SLOT1: range("calc_SI1R1"),
  SI_ROUND1_SLOT2: range("calc_SI2R1"),
  SI_ROUND2_SLOT1: range("calc_SI1R2"),
  SI_ROUND2_SLOT2: range("calc_SI2R2"),
} as const;

/**
 * GTM Decision Option Data Range Names
 * These correspond to option-specific data (units, costs) for GTM decisions
 */
export const GTM_OPTION_DATA_RANGE_NAMES = {
  // Provider Engagement Option Data
  PROV_LOW_UNITS: range("tlOutput_FTEs_Dec1_Lvl1_R1"),
  PROV_LOW_COST: range("tlOutput_Expense_Dec1_Lvl1_R1"),
  PROV_MED_UNITS: range("tlOutput_FTEs_Dec1_Lvl2_R1"),
  PROV_MED_COST: range("tlOutput_Expense_Dec1_Lvl2_R1"),
  PROV_HIGH_UNITS: range("tlOutput_FTEs_Dec1_Lvl3_R1"),
  PROV_HIGH_COST: range("tlOutput_Expense_Dec1_Lvl3_R1"),

  // Pharmacy Engagement Option Data
  PHARM_LOW_UNITS: range("tlOutput_FTEs_Dec2_Lvl1_R1"),
  PHARM_LOW_COST: range("tlOutput_Expense_Dec2_Lvl1_R1"),
  PHARM_MED_UNITS: range("tlOutput_FTEs_Dec2_Lvl2_R1"),
  PHARM_MED_COST: range("tlOutput_Expense_Dec2_Lvl2_R1"),
  PHARM_HIGH_UNITS: range("tlOutput_FTEs_Dec2_Lvl3_R1"),
  PHARM_HIGH_COST: range("tlOutput_Expense_Dec2_Lvl3_R1"),

  // Payer Engagement Option Data
  PAY_LOW_UNITS: range("tlOutput_FTEs_Dec3_Lvl1_R1"),
  PAY_LOW_COST: range("tlOutput_Expense_Dec3_Lvl1_R1"),
  PAY_MED_UNITS: range("tlOutput_FTEs_Dec3_Lvl2_R1"),
  PAY_MED_COST: range("tlOutput_Expense_Dec3_Lvl2_R1"),
  PAY_HIGH_UNITS: range("tlOutput_FTEs_Dec3_Lvl3_R1"),
  PAY_HIGH_COST: range("tlOutput_Expense_Dec3_Lvl3_R1"),
} as const;

export const GTM_OPTION_DATA_RANGE_NAMES_R2 = {
  // Provider Engagement Option Data
  PROV_LOW_UNITS: range("tlOutput_FTEs_Dec1_Lvl1_R2"),
  PROV_LOW_COST: range("tlOutput_Expense_Dec1_Lvl1_R2"),
  PROV_MED_UNITS: range("tlOutput_FTEs_Dec1_Lvl2_R2"),
  PROV_MED_COST: range("tlOutput_Expense_Dec1_Lvl2_R2"),
  PROV_HIGH_UNITS: range("tlOutput_FTEs_Dec1_Lvl3_R2"),
  PROV_HIGH_COST: range("tlOutput_Expense_Dec1_Lvl3_R2"),

  // Pharmacy Engagement Option Data
  PHARM_LOW_UNITS: range("tlOutput_FTEs_Dec2_Lvl1_R2"),
  PHARM_LOW_COST: range("tlOutput_Expense_Dec2_Lvl1_R2"),
  PHARM_MED_UNITS: range("tlOutput_FTEs_Dec2_Lvl2_R2"),
  PHARM_MED_COST: range("tlOutput_Expense_Dec2_Lvl2_R2"),
  PHARM_HIGH_UNITS: range("tlOutput_FTEs_Dec2_Lvl3_R2"),
  PHARM_HIGH_COST: range("tlOutput_Expense_Dec2_Lvl3_R2"),

  // Payer Engagement Option Data
  PAY_LOW_UNITS: range("tlOutput_FTEs_Dec3_Lvl1_R2"),
  PAY_LOW_COST: range("tlOutput_Expense_Dec3_Lvl1_R2"),
  PAY_MED_UNITS: range("tlOutput_FTEs_Dec3_Lvl2_R2"),
  PAY_MED_COST: range("tlOutput_Expense_Dec3_Lvl2_R2"),
  PAY_HIGH_UNITS: range("tlOutput_FTEs_Dec3_Lvl3_R2"),
  PAY_HIGH_COST: range("tlOutput_Expense_Dec3_Lvl3_R2"),
} as const;

/**
 * Product Decision Option Data Range Names
 * These correspond to option-specific data (units, costs) for Product decisions
 */
export const PRODUCT_OPTION_DATA_RANGE_NAMES = {
  // Patient Notification Option Data
  PATNOTIF_LOW_UNITS: range("tlOutput_FTEs_Dec4_Lvl1_R1"),
  PATNOTIF_LOW_COST: range("tlOutput_Expense_Dec4_Lvl1_R1"),
  PATNOTIF_MED_UNITS: range("tlOutput_FTEs_Dec4_Lvl2_R1"),
  PATNOTIF_MED_COST: range("tlOutput_Expense_Dec4_Lvl2_R1"),
  PATNOTIF_HIGH_UNITS: range("tlOutput_FTEs_Dec4_Lvl3_R1"),
  PATNOTIF_HIGH_COST: range("tlOutput_Expense_Dec4_Lvl3_R1"),

  // Pharmacy Functionality Option Data
  PHARMFUNC_LOW_UNITS: range("tlOutput_FTEs_Dec5_Lvl1_R1"),
  PHARMFUNC_LOW_COST: range("tlOutput_Expense_Dec5_Lvl1_R1"),
  PHARMFUNC_MED_UNITS: range("tlOutput_FTEs_Dec5_Lvl2_R1"),
  PHARMFUNC_MED_COST: range("tlOutput_Expense_Dec5_Lvl2_R1"),
  PHARMFUNC_HIGH_UNITS: range("tlOutput_FTEs_Dec5_Lvl3_R1"),
  PHARMFUNC_HIGH_COST: range("tlOutput_Expense_Dec5_Lvl3_R1"),

  // Provider Functionality Option Data
  PROVFUNC_LOW_UNITS: range("tlOutput_FTEs_Dec6_Lvl1_R1"),
  PROVFUNC_LOW_COST: range("tlOutput_Expense_Dec6_Lvl1_R1"),
  PROVFUNC_MED_UNITS: range("tlOutput_FTEs_Dec6_Lvl2_R1"),
  PROVFUNC_MED_COST: range("tlOutput_Expense_Dec6_Lvl2_R1"),
  PROVFUNC_HIGH_UNITS: range("tlOutput_FTEs_Dec6_Lvl3_R1"),
  PROVFUNC_HIGH_COST: range("tlOutput_Expense_Dec6_Lvl3_R1"),

  // Form Automation Option Data
  FORMAUTO_LOW_UNITS: range("tlOutput_FTEs_Dec7_Lvl1_R1"),
  FORMAUTO_LOW_COST: range("tlOutput_Expense_Dec7_Lvl1_R1"),
  FORMAUTO_MED_UNITS: range("tlOutput_FTEs_Dec7_Lvl2_R1"),
  FORMAUTO_MED_COST: range("tlOutput_Expense_Dec7_Lvl2_R1"),
  FORMAUTO_HIGH_UNITS: range("tlOutput_FTEs_Dec7_Lvl3_R1"),
  FORMAUTO_HIGH_COST: range("tlOutput_Expense_Dec7_Lvl3_R1"),
} as const;

export const PRODUCT_OPTION_DATA_RANGE_NAMES_R2 = {
  // Patient Notification Option Data
  PATNOTIF_LOW_UNITS: range("tlOutput_FTEs_Dec4_Lvl1_R2"),
  PATNOTIF_LOW_COST: range("tlOutput_Expense_Dec4_Lvl1_R2"),
  PATNOTIF_MED_UNITS: range("tlOutput_FTEs_Dec4_Lvl2_R2"),
  PATNOTIF_MED_COST: range("tlOutput_Expense_Dec4_Lvl2_R2"),
  PATNOTIF_HIGH_UNITS: range("tlOutput_FTEs_Dec4_Lvl3_R2"),
  PATNOTIF_HIGH_COST: range("tlOutput_Expense_Dec4_Lvl3_R2"),

  // Pharmacy Functionality Option Data
  PHARMFUNC_LOW_UNITS: range("tlOutput_FTEs_Dec5_Lvl1_R2"),
  PHARMFUNC_LOW_COST: range("tlOutput_Expense_Dec5_Lvl1_R2"),
  PHARMFUNC_MED_UNITS: range("tlOutput_FTEs_Dec5_Lvl2_R2"),
  PHARMFUNC_MED_COST: range("tlOutput_Expense_Dec5_Lvl2_R2"),
  PHARMFUNC_HIGH_UNITS: range("tlOutput_FTEs_Dec5_Lvl3_R2"),
  PHARMFUNC_HIGH_COST: range("tlOutput_Expense_Dec5_Lvl3_R2"),

  // Provider Functionality Option Data
  PROVFUNC_LOW_UNITS: range("tlOutput_FTEs_Dec6_Lvl1_R2"),
  PROVFUNC_LOW_COST: range("tlOutput_Expense_Dec6_Lvl1_R2"),
  PROVFUNC_MED_UNITS: range("tlOutput_FTEs_Dec6_Lvl2_R2"),
  PROVFUNC_MED_COST: range("tlOutput_Expense_Dec6_Lvl2_R2"),
  PROVFUNC_HIGH_UNITS: range("tlOutput_FTEs_Dec6_Lvl3_R2"),
  PROVFUNC_HIGH_COST: range("tlOutput_Expense_Dec6_Lvl3_R2"),

  // Form Automation Option Data
  FORMAUTO_LOW_UNITS: range("tlOutput_FTEs_Dec7_Lvl1_R2"),
  FORMAUTO_LOW_COST: range("tlOutput_Expense_Dec7_Lvl1_R2"),
  FORMAUTO_MED_UNITS: range("tlOutput_FTEs_Dec7_Lvl2_R2"),
  FORMAUTO_MED_COST: range("tlOutput_Expense_Dec7_Lvl2_R2"),
  FORMAUTO_HIGH_UNITS: range("tlOutput_FTEs_Dec7_Lvl3_R2"),
  FORMAUTO_HIGH_COST: range("tlOutput_Expense_Dec7_Lvl3_R2"),
} as const;

/**
 * Technology Decision Option Data Range Names
 * These correspond to option-specific data (units, costs) for Technology decisions
 */
export const TECHNOLOGY_OPTION_DATA_RANGE_NAMES = {
  // Predictive Intelligence Option Data
  PREDINT_LOW_UNITS: range("tlOutput_FTEs_Dec8_Lvl1_R1"),
  PREDINT_LOW_COST: range("tlOutput_Expense_Dec8_Lvl1_R1"),
  PREDINT_MED_UNITS: range("tlOutput_FTEs_Dec8_Lvl2_R1"),
  PREDINT_MED_COST: range("tlOutput_Expense_Dec8_Lvl2_R1"),
  PREDINT_HIGH_UNITS: range("tlOutput_FTEs_Dec8_Lvl3_R1"),
  PREDINT_HIGH_COST: range("tlOutput_Expense_Dec8_Lvl3_R1"),

  // Platform Unification Option Data
  PLATUNIF_LOW_UNITS: range("tlOutput_FTEs_Dec9_Lvl1_R1"),
  PLATUNIF_LOW_COST: range("tlOutput_Expense_Dec9_Lvl1_R1"),
  PLATUNIF_MED_UNITS: range("tlOutput_FTEs_Dec9_Lvl2_R1"),
  PLATUNIF_MED_COST: range("tlOutput_Expense_Dec9_Lvl2_R1"),
  PLATUNIF_HIGH_UNITS: range("tlOutput_FTEs_Dec9_Lvl3_R1"),
  PLATUNIF_HIGH_COST: range("tlOutput_Expense_Dec9_Lvl3_R1"),

  // Performance Reliability Option Data
  PERFREL_LOW_UNITS: range("tlOutput_FTEs_Dec10_Lvl1_R1"),
  PERFREL_LOW_COST: range("tlOutput_Expense_Dec10_Lvl1_R1"),
  PERFREL_MED_UNITS: range("tlOutput_FTEs_Dec10_Lvl2_R1"),
  PERFREL_MED_COST: range("tlOutput_Expense_Dec10_Lvl2_R1"),
  PERFREL_HIGH_UNITS: range("tlOutput_FTEs_Dec10_Lvl3_R1"),
  PERFREL_HIGH_COST: range("tlOutput_Expense_Dec10_Lvl3_R1"),

  // Development Productivity Option Data
  DEVPROD_LOW_UNITS: range("tlOutput_FTEs_Dec11_Lvl1_R1"),
  DEVPROD_LOW_COST: range("tlOutput_Expense_Dec11_Lvl1_R1"),
  DEVPROD_MED_UNITS: range("tlOutput_FTEs_Dec11_Lvl2_R1"),
  DEVPROD_MED_COST: range("tlOutput_Expense_Dec11_Lvl2_R1"),
  DEVPROD_HIGH_UNITS: range("tlOutput_FTEs_Dec11_Lvl3_R1"),
  DEVPROD_HIGH_COST: range("tlOutput_Expense_Dec11_Lvl3_R1"),
} as const;

export const TECHNOLOGY_OPTION_DATA_RANGE_NAMES_R2 = {
  // Predictive Intelligence Option Data
  PREDINT_LOW_UNITS: range("tlOutput_FTEs_Dec8_Lvl1_R2"),
  PREDINT_LOW_COST: range("tlOutput_Expense_Dec8_Lvl1_R2"),
  PREDINT_MED_UNITS: range("tlOutput_FTEs_Dec8_Lvl2_R2"),
  PREDINT_MED_COST: range("tlOutput_Expense_Dec8_Lvl2_R2"),
  PREDINT_HIGH_UNITS: range("tlOutput_FTEs_Dec8_Lvl3_R2"),
  PREDINT_HIGH_COST: range("tlOutput_Expense_Dec8_Lvl3_R2"),

  // Platform Unification Option Data
  PLATUNIF_LOW_UNITS: range("tlOutput_FTEs_Dec9_Lvl1_R2"),
  PLATUNIF_LOW_COST: range("tlOutput_Expense_Dec9_Lvl1_R2"),
  PLATUNIF_MED_UNITS: range("tlOutput_FTEs_Dec9_Lvl2_R2"),
  PLATUNIF_MED_COST: range("tlOutput_Expense_Dec9_Lvl2_R2"),
  PLATUNIF_HIGH_UNITS: range("tlOutput_FTEs_Dec9_Lvl3_R2"),
  PLATUNIF_HIGH_COST: range("tlOutput_Expense_Dec9_Lvl3_R2"),

  // Performance Reliability Option Data
  PERFREL_LOW_UNITS: range("tlOutput_FTEs_Dec10_Lvl1_R2"),
  PERFREL_LOW_COST: range("tlOutput_Expense_Dec10_Lvl1_R2"),
  PERFREL_MED_UNITS: range("tlOutput_FTEs_Dec10_Lvl2_R2"),
  PERFREL_MED_COST: range("tlOutput_Expense_Dec10_Lvl2_R2"),
  PERFREL_HIGH_UNITS: range("tlOutput_FTEs_Dec10_Lvl3_R2"),
  PERFREL_HIGH_COST: range("tlOutput_Expense_Dec10_Lvl3_R2"),

  // Development Productivity Option Data
  DEVPROD_LOW_UNITS: range("tlOutput_FTEs_Dec11_Lvl1_R2"),
  DEVPROD_LOW_COST: range("tlOutput_Expense_Dec11_Lvl1_R2"),
  DEVPROD_MED_UNITS: range("tlOutput_FTEs_Dec11_Lvl2_R2"),
  DEVPROD_MED_COST: range("tlOutput_Expense_Dec11_Lvl2_R2"),
  DEVPROD_HIGH_UNITS: range("tlOutput_FTEs_Dec11_Lvl3_R2"),
  DEVPROD_HIGH_COST: range("tlOutput_Expense_Dec11_Lvl3_R2"),
} as const;

/**
 * Operations Decision Option Data Range Names
 * These correspond to option-specific data (units, costs) for Operations decisions
 */
export const OPERATIONS_OPTION_DATA_RANGE_NAMES = {
  // Network Operations Option Data
  NWKOPS_LOW_UNITS: range("tlOutput_FTEs_Dec12_Lvl1_R1"),
  NWKOPS_LOW_COST: range("tlOutput_Expense_Dec12_Lvl1_R1"),
  NWKOPS_MED_UNITS: range("tlOutput_FTEs_Dec12_Lvl2_R1"),
  NWKOPS_MED_COST: range("tlOutput_Expense_Dec12_Lvl2_R1"),
  NWKOPS_HIGH_UNITS: range("tlOutput_FTEs_Dec12_Lvl3_R1"),
  NWKOPS_HIGH_COST: range("tlOutput_Expense_Dec12_Lvl3_R1"),

  // Data Analytics Option Data
  DATAANALY_LOW_UNITS: range("tlOutput_FTEs_Dec13_Lvl1_R1"),
  DATAANALY_LOW_COST: range("tlOutput_Expense_Dec13_Lvl1_R1"),
  DATAANALY_MED_UNITS: range("tlOutput_FTEs_Dec13_Lvl2_R1"),
  DATAANALY_MED_COST: range("tlOutput_Expense_Dec13_Lvl2_R1"),
  DATAANALY_HIGH_UNITS: range("tlOutput_FTEs_Dec13_Lvl3_R1"),
  DATAANALY_HIGH_COST: range("tlOutput_Expense_Dec13_Lvl3_R1"),
} as const;

export const OPERATIONS_OPTION_DATA_RANGE_NAMES_R2 = {
  // Network Operations Option Data
  NWKOPS_LOW_UNITS: range("tlOutput_FTEs_Dec12_Lvl1_R2"),
  NWKOPS_LOW_COST: range("tlOutput_Expense_Dec12_Lvl1_R2"),
  NWKOPS_MED_UNITS: range("tlOutput_FTEs_Dec12_Lvl2_R2"),
  NWKOPS_MED_COST: range("tlOutput_Expense_Dec12_Lvl2_R2"),
  NWKOPS_HIGH_UNITS: range("tlOutput_FTEs_Dec12_Lvl3_R2"),
  NWKOPS_HIGH_COST: range("tlOutput_Expense_Dec12_Lvl3_R2"),

  // Data Analytics Option Data
  DATAANALY_LOW_UNITS: range("tlOutput_FTEs_Dec13_Lvl1_R2"),
  DATAANALY_LOW_COST: range("tlOutput_Expense_Dec13_Lvl1_R2"),
  DATAANALY_MED_UNITS: range("tlOutput_FTEs_Dec13_Lvl2_R2"),
  DATAANALY_MED_COST: range("tlOutput_Expense_Dec13_Lvl2_R2"),
  DATAANALY_HIGH_UNITS: range("tlOutput_FTEs_Dec13_Lvl3_R2"),
  DATAANALY_HIGH_COST: range("tlOutput_Expense_Dec13_Lvl3_R2"),
} as const;

/**
 * Debrief Range Names
 * These correspond to debrief screen output data
 */
export const DEBRIEF_RANGE_NAMES = {
  // Pharmacy Benefits Network Health (PBNH)
  PBNH_GEN_NPIS_LABEL: range("tlOutput_Debrief_PBNH_GenNPIs_Label"),
  PBNH_GEN_NPIS_R0: range("tlOutput_Debrief_PBNH_GenNPIs_R0"),
  PBNH_GEN_NPIS_R1: range("tlOutput_Debrief_PBNH_GenNPIs_R1"),
  
  PBNH_RET_PHARM_VOL_LABEL: range("tlOutput_Debrief_PBNH_RetPharmVol_Label"),
  PBNH_RET_PHARM_VOL_R0: range("tlOutput_Debrief_PBNH_RetPharmVol_R0"),
  PBNH_RET_PHARM_VOL_R1: range("tlOutput_Debrief_PBNH_RetPharmVol_R1"),
  
  PBNH_VOL_TRANS_LABEL: range("tlOutput_Debrief_PBNH_VolTrans_Label"),
  PBNH_VOL_TRANS_R0: range("tlOutput_Debrief_PBNH_VolTrans_R0"),
  PBNH_VOL_TRANS_R1: range("tlOutput_Debrief_PBNH_VolTrans_R1"),
  PBNH_VOL_TRANS_R2: range("tlOutput_Debrief_PBNH_VolTrans_R2"),
  
  PBNH_GEN_NPIS_R2: range("tlOutput_Debrief_PBNH_GenNPIs_R2"),
  PBNH_RET_PHARM_VOL_R2: range("tlOutput_Debrief_PBNH_RetPharmVol_R2"),
  
  // Medical Benefits Network Health (MBNH)
  MBNH_SPEC_NPIS_LABEL: range("tlOutput_Debrief_MBNH_SpecNPIs_Label"),
  MBNH_SPEC_NPIS_R0: range("tlOutput_Debrief_MBNH_SpecNPIs_R0"),
  MBNH_SPEC_NPIS_R1: range("tlOutput_Debrief_MBNH_SpecNPIs_R1"),
  MBNH_SPEC_NPIS_R2: range("tlOutput_Debrief_MBNH_SpecNPIs_R2"),
  
  MBNH_SPEC_PHARM_VOL_LABEL: range("tlOutput_Debrief_MBNH_SpecPharmVol_Label"),
  MBNH_SPEC_PHARM_VOL_R0: range("tlOutput_Debrief_MBNH_SpecPharmVol_R0"),
  MBNH_SPEC_PHARM_VOL_R1: range("tlOutput_Debrief_MBNH_SpecPharmVol_R1"),
  MBNH_SPEC_PHARM_VOL_R2: range("tlOutput_Debrief_MBNH_SpecPharmVol_R2"),
  
  MBNH_VOL_TRANS_LABEL: range("tlOutput_Debrief_MBNH_VolTrans_Label"),
  MBNH_VOL_TRANS_R0: range("tlOutput_Debrief_MBNH_VolTrans_R0"),
  MBNH_VOL_TRANS_R1: range("tlOutput_Debrief_MBNH_VolTrans_R1"),
  MBNH_VOL_TRANS_R2: range("tlOutput_Debrief_MBNH_VolTrans_R2"),
  
  // Generalist NPI Drivers - Round 1
  GEN_NPIS_DRIVERS_LABEL1: range("tlOutput_Debrief_GenNPIsDrivers_Label1_R1"),
  GEN_NPIS_DRIVERS_LABEL2: range("tlOutput_Debrief_GenNPIsDrivers_Label2_R1"),
  GEN_NPIS_DRIVERS_LABEL3: range("tlOutput_Debrief_GenNPIsDrivers_Label3_R1"),
  GEN_NPIS_DRIVERS_LABEL4: range("tlOutput_Debrief_GenNPIsDrivers_Label4_R1"),
  GEN_NPIS_DRIVERS_LABEL5: range("tlOutput_Debrief_GenNPIsDrivers_Label5_R1"),
  
  GEN_NPIS_DRIVERS_VALUE1: range("tlOutput_Debrief_GenNPIsDrivers_Value1_R1"),
  GEN_NPIS_DRIVERS_VALUE2: range("tlOutput_Debrief_GenNPIsDrivers_Value2_R1"),
  GEN_NPIS_DRIVERS_VALUE3: range("tlOutput_Debrief_GenNPIsDrivers_Value3_R1"),
  GEN_NPIS_DRIVERS_VALUE4: range("tlOutput_Debrief_GenNPIsDrivers_Value4_R1"),
  GEN_NPIS_DRIVERS_VALUE5: range("tlOutput_Debrief_GenNPIsDrivers_Value5_R1"),
  
  GEN_NPIS_DRIVERS_CUM1: range("tlOutput_Debrief_GenNPIsDrivers_Cum1_R1"),
  GEN_NPIS_DRIVERS_CUM2: range("tlOutput_Debrief_GenNPIsDrivers_Cum2_R1"),
  GEN_NPIS_DRIVERS_CUM3: range("tlOutput_Debrief_GenNPIsDrivers_Cum3_R1"),
  GEN_NPIS_DRIVERS_CUM4: range("tlOutput_Debrief_GenNPIsDrivers_Cum4_R1"),
  GEN_NPIS_DRIVERS_CUM5: range("tlOutput_Debrief_GenNPIsDrivers_Cum5_R1"),
  
  // Generalist NPIs Summary - Round 1
  GEN_NPIS_LABEL: range("tlOutput_Debrief_GenNPIs_Label_R1"),
  GEN_NPIS: range("tlOutput_Debrief_GenNPIs_R1"),
  
  // Generalist NPI Drivers Chart Data - Round 1
  GEN_NPIS_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact1_R1"),
  GEN_NPIS_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact2_R1"),
  GEN_NPIS_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact3_R1"),
  GEN_NPIS_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact4_R1"),
  GEN_NPIS_DRIVERS_MINIMPACT5: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact5_R1"),
  
  GEN_NPIS_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact1_R1"),
  GEN_NPIS_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact2_R1"),
  GEN_NPIS_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact3_R1"),
  GEN_NPIS_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact4_R1"),
  GEN_NPIS_DRIVERS_MAXIMPACT5: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact5_R1"),
  
  GEN_NPIS_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact1_R1"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact2_R1"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact3_R1"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact4_R1"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT5: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact5_R1"),
  
  // Retail Pharmacy Volume Drivers - Round 1
  RET_PHARM_VOL_DRIVERS_LABEL1: range("tlOutput_Debrief_RetPharmVolDrivers_Label1_R1"),
  RET_PHARM_VOL_DRIVERS_LABEL2: range("tlOutput_Debrief_RetPharmVolDrivers_Label2_R1"),
  RET_PHARM_VOL_DRIVERS_LABEL3: range("tlOutput_Debrief_RetPharmVolDrivers_Label3_R1"),
  
  RET_PHARM_VOL_DRIVERS_VALUE1: range("tlOutput_Debrief_RetPharmVolDrivers_Value1_R1"),
  RET_PHARM_VOL_DRIVERS_VALUE2: range("tlOutput_Debrief_RetPharmVolDrivers_Value2_R1"),
  RET_PHARM_VOL_DRIVERS_VALUE3: range("tlOutput_Debrief_RetPharmVolDrivers_Value3_R1"),
  
  RET_PHARM_VOL_DRIVERS_CUM1: range("tlOutput_Debrief_RetPharmVolDrivers_Cum1_R1"),
  RET_PHARM_VOL_DRIVERS_CUM2: range("tlOutput_Debrief_RetPharmVolDrivers_Cum2_R1"),
  RET_PHARM_VOL_DRIVERS_CUM3: range("tlOutput_Debrief_RetPharmVolDrivers_Cum3_R1"),
  
  RET_PHARM_VOL_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact1_R1"),
  RET_PHARM_VOL_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact2_R1"),
  RET_PHARM_VOL_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact3_R1"),
  
  RET_PHARM_VOL_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact1_R1"),
  RET_PHARM_VOL_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact2_R1"),
  RET_PHARM_VOL_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact3_R1"),
  
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact1_R1"),
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact2_R1"),
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact3_R1"),
  
  // Driver 4 (Initiatives & Events - shifted from Driver 3)
  RET_PHARM_VOL_DRIVERS_LABEL4: range("tlOutput_Debrief_RetPharmVolDrivers_Label4_R1"),
  RET_PHARM_VOL_DRIVERS_VALUE4: range("tlOutput_Debrief_RetPharmVolDrivers_Value4_R1"),
  RET_PHARM_VOL_DRIVERS_CUM4: range("tlOutput_Debrief_RetPharmVolDrivers_Cum4_R1"),
  RET_PHARM_VOL_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact4_R1"),
  RET_PHARM_VOL_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact4_R1"),
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact4_R1"),
  
  // Retail Pharmacy Volume Summary - Round 1
  RET_PHARM_VOL_LABEL: range("tlOutput_Debrief_RetPharmVol_Label_R1"),
  RET_PHARM_VOL: range("tlOutput_Debrief_RetPharmVol_R1"),
  
  // Pharma NPS Drivers - Round 1 (6 drivers)
  PHARMA_NPS_DRIVERS_LABEL1: range("tlOutput_Debrief_PharmaNPSDrivers_Label1_R1"),
  PHARMA_NPS_DRIVERS_LABEL2: range("tlOutput_Debrief_PharmaNPSDrivers_Label2_R1"),
  PHARMA_NPS_DRIVERS_LABEL3: range("tlOutput_Debrief_PharmaNPSDrivers_Label3_R1"),
  PHARMA_NPS_DRIVERS_LABEL4: range("tlOutput_Debrief_PharmaNPSDrivers_Label4_R1"),
  PHARMA_NPS_DRIVERS_LABEL5: range("tlOutput_Debrief_PharmaNPSDrivers_Label5_R1"),
  PHARMA_NPS_DRIVERS_LABEL6: range("tlOutput_Debrief_PharmaNPSDrivers_Label6_R1"),
  
  PHARMA_NPS_DRIVERS_VALUE1: range("tlOutput_Debrief_PharmaNPSDrivers_Value1_R1"),
  PHARMA_NPS_DRIVERS_VALUE2: range("tlOutput_Debrief_PharmaNPSDrivers_Value2_R1"),
  PHARMA_NPS_DRIVERS_VALUE3: range("tlOutput_Debrief_PharmaNPSDrivers_Value3_R1"),
  PHARMA_NPS_DRIVERS_VALUE4: range("tlOutput_Debrief_PharmaNPSDrivers_Value4_R1"),
  PHARMA_NPS_DRIVERS_VALUE5: range("tlOutput_Debrief_PharmaNPSDrivers_Value5_R1"),
  PHARMA_NPS_DRIVERS_VALUE6: range("tlOutput_Debrief_PharmaNPSDrivers_Value6_R1"),
  
  PHARMA_NPS_DRIVERS_CUM1: range("tlOutput_Debrief_PharmaNPSDrivers_Cum1_R1"),
  PHARMA_NPS_DRIVERS_CUM2: range("tlOutput_Debrief_PharmaNPSDrivers_Cum2_R1"),
  PHARMA_NPS_DRIVERS_CUM3: range("tlOutput_Debrief_PharmaNPSDrivers_Cum3_R1"),
  PHARMA_NPS_DRIVERS_CUM4: range("tlOutput_Debrief_PharmaNPSDrivers_Cum4_R1"),
  PHARMA_NPS_DRIVERS_CUM5: range("tlOutput_Debrief_PharmaNPSDrivers_Cum5_R1"),
  PHARMA_NPS_DRIVERS_CUM6: range("tlOutput_Debrief_PharmaNPSDrivers_Cum6_R1"),
  
  PHARMA_NPS_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact1_R1"),
  PHARMA_NPS_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact2_R1"),
  PHARMA_NPS_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact3_R1"),
  PHARMA_NPS_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact4_R1"),
  PHARMA_NPS_DRIVERS_MINIMPACT5: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact5_R1"),
  PHARMA_NPS_DRIVERS_MINIMPACT6: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact6_R1"),
  
  PHARMA_NPS_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact1_R1"),
  PHARMA_NPS_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact2_R1"),
  PHARMA_NPS_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact3_R1"),
  PHARMA_NPS_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact4_R1"),
  PHARMA_NPS_DRIVERS_MAXIMPACT5: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact5_R1"),
  PHARMA_NPS_DRIVERS_MAXIMPACT6: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact6_R1"),
  
  PHARMA_NPS_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact1_R1"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact2_R1"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact3_R1"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact4_R1"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT5: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact5_R1"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT6: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact6_R1"),
  
  // Pharma NPS Summary - Round 1
  PHARMA_NPS_LABEL: range("tlOutput_Debrief_PharmaNPS_Label_R1"),
  PHARMA_NPS: range("tlOutput_Debrief_PharmaNPS_R1"),
  
  // PB Revenue (Pharmacy Benefits Revenue)
  PBREV_VOL_TRANS_LABEL: range("tlOutput_Debrief_PBRev_VolTrans_Label"),
  PBREV_VOL_TRANS_R0: range("tlOutput_Debrief_PBRev_VolTrans_R0"),
  PBREV_VOL_TRANS_R1: range("tlOutput_Debrief_PBRev_VolTrans_R1"),
  
  PBREV_REV_P_TRANS_LABEL: range("tlOutput_Debrief_PBRev_RevPTrans_Label"),
  PBREV_REV_P_TRANS_R0: range("tlOutput_Debrief_PBRev_RevPTrans_R0"),
  PBREV_REV_P_TRANS_R1: range("tlOutput_Debrief_PBRev_RevPTrans_R1"),
  
  PBREV_REV_LABEL: range("tlOutput_Debrief_PBRev_Rev_Label"),
  PBREV_REV_R0: range("tlOutput_Debrief_PBRev_Rev_R0"),
  PBREV_REV_R1: range("tlOutput_Debrief_PBRev_Rev_R1"),
  PBREV_REV_R2: range("tlOutput_Debrief_PBRev_Rev_R2"),
  
  PBREV_VOL_TRANS_R2: range("tlOutput_Debrief_PBRev_VolTrans_R2"),
  PBREV_REV_P_TRANS_R2: range("tlOutput_Debrief_PBRev_RevPTrans_R2"),
  
  // Medical Benefits Revenue (MBREV)
  MBREV_VOL_TRANS_LABEL: range("tlOutput_Debrief_MBRev_VolTrans_Label"),
  MBREV_VOL_TRANS_R0: range("tlOutput_Debrief_MBRev_VolTrans_R0"),
  MBREV_VOL_TRANS_R1: range("tlOutput_Debrief_MBRev_VolTrans_R1"),
  MBREV_VOL_TRANS_R2: range("tlOutput_Debrief_MBRev_VolTrans_R2"),
  
  MBREV_REV_P_TRANS_LABEL: range("tlOutput_Debrief_MBRev_RevPTrans_Label"),
  MBREV_REV_P_TRANS_R0: range("tlOutput_Debrief_MBRev_RevPTrans_R0"),
  MBREV_REV_P_TRANS_R1: range("tlOutput_Debrief_MBRev_RevPTrans_R1"),
  MBREV_REV_P_TRANS_R2: range("tlOutput_Debrief_MBRev_RevPTrans_R2"),
  
  MBREV_REV_LABEL: range("tlOutput_Debrief_MBRev_Rev_Label"),
  MBREV_REV_R0: range("tlOutput_Debrief_MBRev_Rev_R0"),
  MBREV_REV_R1: range("tlOutput_Debrief_MBRev_Rev_R1"),
  MBREV_REV_R2: range("tlOutput_Debrief_MBRev_Rev_R2"),
  
  // PB Revenue Per Transaction Drivers - Round 1
  PBREVPTRANS_START_LABEL_R1: range("tlOutput_Debrief_PBRevPTrans_Start_Label_R1"),
  PBREVPTRANS_DRIVERS_LABEL1_R1: range("tlOutput_Debrief_PBRevPTransDrivers_Label1_R1"),
  PBREVPTRANS_DRIVERS_LABEL2_R1: range("tlOutput_Debrief_PBRevPTransDrivers_Label2_R1"),
  PBREVPTRANS_END_LABEL_R1: range("tlOutput_Debrief_PBRevPTrans_End_Label_R1"),
  PBREVPTRANS_CHANGE_LABEL_R1: range("tlOutput_Debrief_PBRevPTrans_Change_Label_R1"),
  
  PBREVPTRANS_DRIVERS_VALUE1_R1: range("tlOutput_Debrief_PBRevPTransDrivers_Value1_R1"),
  PBREVPTRANS_DRIVERS_VALUE2_R1: range("tlOutput_Debrief_PBRevPTransDrivers_Value2_R1"),
  PBREVPTRANS_END_R1: range("tlOutput_Debrief_PBRevPTrans_End_R1"),
  
  PBREVPTRANS_DRIVERS_START_R1: range("tlOutput_Debrief_PBRevPTransDrivers_Start_R1"),
  PBREVPTRANS_DRIVERS_ACTUALIMPACT1_R1: range("tlOutput_Debrief_PBRevPTransDrivers_ActualImpact1_R1"),
  PBREVPTRANS_DRIVERS_ACTUALIMPACT2_R1: range("tlOutput_Debrief_PBRevPTransDrivers_ActualImpact2_R1"),
  PBREVPTRANS_DRIVERS_END_R1: range("tlOutput_Debrief_PBRevPTransDrivers_End_R1"),
  PBREVPTRANS_DRIVERS_CHANGE_R1: range("tlOutput_Debrief_PBRevPTransDrivers_Change_R1"),
  
  // Financial Statement (P&L) - Business Unit 1 (Pharmacy Benefits)
  PNL_BU1_REV_R0: range("tlOutput_Debrief_PNL_BU1_Rev_R0"),
  PNL_BU1_COS_R0: range("tlOutput_Debrief_PNL_BU1_COS_R0"),
  PNL_BU1_GP_R0: range("tlOutput_Debrief_PNL_BU1_GP_R0"),
  PNL_BU1_GM_R0: range("tlOutput_Debrief_PNL_BU1_GM_R0"),
  PNL_BU1_REV_R1: range("tlOutput_Debrief_PNL_BU1_Rev_R1"),
  PNL_BU1_COS_R1: range("tlOutput_Debrief_PNL_BU1_COS_R1"),
  PNL_BU1_GP_R1: range("tlOutput_Debrief_PNL_BU1_GP_R1"),
  PNL_BU1_GM_R1: range("tlOutput_Debrief_PNL_BU1_GM_R1"),
  
  // Financial Statement (P&L) - Business Unit 2 (Medical Benefits)
  PNL_BU2_REV_R0: range("tlOutput_Debrief_PNL_BU2_Rev_R0"),
  PNL_BU2_COS_R0: range("tlOutput_Debrief_PNL_BU2_COS_R0"),
  PNL_BU2_GP_R0: range("tlOutput_Debrief_PNL_BU2_GP_R0"),
  PNL_BU2_GM_R0: range("tlOutput_Debrief_PNL_BU2_GM_R0"),
  PNL_BU2_REV_R1: range("tlOutput_Debrief_PNL_BU2_Rev_R1"),
  PNL_BU2_COS_R1: range("tlOutput_Debrief_PNL_BU2_COS_R1"),
  PNL_BU2_GP_R1: range("tlOutput_Debrief_PNL_BU2_GP_R1"),
  PNL_BU2_GM_R1: range("tlOutput_Debrief_PNL_BU2_GM_R1"),
  
  // Financial Statement (P&L) - Business Unit 3 (Non-Network)
  PNL_BU3_REV_R0: range("tlOutput_Debrief_PNL_BU3_Rev_R0"),
  PNL_BU3_COS_R0: range("tlOutput_Debrief_PNL_BU3_COS_R0"),
  PNL_BU3_GP_R0: range("tlOutput_Debrief_PNL_BU3_GP_R0"),
  PNL_BU3_GM_R0: range("tlOutput_Debrief_PNL_BU3_GM_R0"),
  PNL_BU3_REV_R1: range("tlOutput_Debrief_PNL_BU3_Rev_R1"),
  PNL_BU3_COS_R1: range("tlOutput_Debrief_PNL_BU3_COS_R1"),
  PNL_BU3_GP_R1: range("tlOutput_Debrief_PNL_BU3_GP_R1"),
  PNL_BU3_GM_R1: range("tlOutput_Debrief_PNL_BU3_GM_R1"),
  
  // Financial Statement (P&L) - Total/CMM Consolidated
  PNL_TOTAL_REV_R0: range("tlOutput_Debrief_PNL_Total_Rev_R0"),
  PNL_TOTAL_COS_R0: range("tlOutput_Debrief_PNL_Total_COS_R0"),
  PNL_TOTAL_GP_R0: range("tlOutput_Debrief_PNL_Total_GP_R0"),
  PNL_TOTAL_GM_R0: range("tlOutput_Debrief_PNL_Total_GM_R0"),
  PNL_TOTAL_OPEX_R0: range("tlOutput_Debrief_PNL_Total_OpEx_R0"),
  PNL_TOTAL_OPINC_R0: range("tlOutput_Debrief_PNL_Total_OpInc_R0"),
  PNL_TOTAL_OM_R0: range("tlOutput_Debrief_PNL_Total_OM_R0"),
  
  PNL_TOTAL_REV_R1: range("tlOutput_Debrief_PNL_Total_Rev_R1"),
  PNL_TOTAL_COS_R1: range("tlOutput_Debrief_PNL_Total_COS_R1"),
  PNL_TOTAL_GP_R1: range("tlOutput_Debrief_PNL_Total_GP_R1"),
  PNL_TOTAL_GM_R1: range("tlOutput_Debrief_PNL_Total_GM_R1"),
  PNL_TOTAL_OPEX_R1: range("tlOutput_Debrief_PNL_Total_OpEx_R1"),
  PNL_TOTAL_OPINC_R1: range("tlOutput_Debrief_PNL_Total_OpInc_R1"),
  PNL_TOTAL_OM_R1: range("tlOutput_Debrief_PNL_Total_OM_R1"),
  
  // Financial Statement (P&L) - Business Unit 1 (Pharmacy Benefits) - Round 2
  PNL_BU1_REV_R2: range("tlOutput_Debrief_PNL_BU1_Rev_R2"),
  PNL_BU1_COS_R2: range("tlOutput_Debrief_PNL_BU1_COS_R2"),
  PNL_BU1_GP_R2: range("tlOutput_Debrief_PNL_BU1_GP_R2"),
  PNL_BU1_GM_R2: range("tlOutput_Debrief_PNL_BU1_GM_R2"),
  
  // Financial Statement (P&L) - Business Unit 2 (Medical Benefits) - Round 2
  PNL_BU2_REV_R2: range("tlOutput_Debrief_PNL_BU2_Rev_R2"),
  PNL_BU2_COS_R2: range("tlOutput_Debrief_PNL_BU2_COS_R2"),
  PNL_BU2_GP_R2: range("tlOutput_Debrief_PNL_BU2_GP_R2"),
  PNL_BU2_GM_R2: range("tlOutput_Debrief_PNL_BU2_GM_R2"),
  
  // Financial Statement (P&L) - Business Unit 3 (Non-Network) - Round 2
  PNL_BU3_REV_R2: range("tlOutput_Debrief_PNL_BU3_Rev_R2"),
  PNL_BU3_COS_R2: range("tlOutput_Debrief_PNL_BU3_COS_R2"),
  PNL_BU3_GP_R2: range("tlOutput_Debrief_PNL_BU3_GP_R2"),
  PNL_BU3_GM_R2: range("tlOutput_Debrief_PNL_BU3_GM_R2"),
  
  // Financial Statement (P&L) - Total/CMM Consolidated - Round 2
  PNL_TOTAL_REV_R2: range("tlOutput_Debrief_PNL_Total_Rev_R2"),
  PNL_TOTAL_COS_R2: range("tlOutput_Debrief_PNL_Total_COS_R2"),
  PNL_TOTAL_GP_R2: range("tlOutput_Debrief_PNL_Total_GP_R2"),
  PNL_TOTAL_GM_R2: range("tlOutput_Debrief_PNL_Total_GM_R2"),
  PNL_TOTAL_OPEX_R2: range("tlOutput_Debrief_PNL_Total_OpEx_R2"),
  PNL_TOTAL_OPINC_R2: range("tlOutput_Debrief_PNL_Total_OpInc_R2"),
  PNL_TOTAL_OM_R2: range("tlOutput_Debrief_PNL_Total_OM_R2"),
} as const;

export const DEBRIEF_RANGE_NAMES_R2 = {
  // Generalist NPI Drivers - Round 2
  GEN_NPIS_DRIVERS_LABEL1: range("tlOutput_Debrief_GenNPIsDrivers_Label1_R2"),
  GEN_NPIS_DRIVERS_LABEL2: range("tlOutput_Debrief_GenNPIsDrivers_Label2_R2"),
  GEN_NPIS_DRIVERS_LABEL3: range("tlOutput_Debrief_GenNPIsDrivers_Label3_R2"),
  GEN_NPIS_DRIVERS_LABEL4: range("tlOutput_Debrief_GenNPIsDrivers_Label4_R2"),
  GEN_NPIS_DRIVERS_LABEL5: range("tlOutput_Debrief_GenNPIsDrivers_Label5_R2"),
  
  GEN_NPIS_DRIVERS_VALUE1: range("tlOutput_Debrief_GenNPIsDrivers_Value1_R2"),
  GEN_NPIS_DRIVERS_VALUE2: range("tlOutput_Debrief_GenNPIsDrivers_Value2_R2"),
  GEN_NPIS_DRIVERS_VALUE3: range("tlOutput_Debrief_GenNPIsDrivers_Value3_R2"),
  GEN_NPIS_DRIVERS_VALUE4: range("tlOutput_Debrief_GenNPIsDrivers_Value4_R2"),
  GEN_NPIS_DRIVERS_VALUE5: range("tlOutput_Debrief_GenNPIsDrivers_Value5_R2"),
  
  GEN_NPIS_DRIVERS_CUM1: range("tlOutput_Debrief_GenNPIsDrivers_Cum1_R2"),
  GEN_NPIS_DRIVERS_CUM2: range("tlOutput_Debrief_GenNPIsDrivers_Cum2_R2"),
  GEN_NPIS_DRIVERS_CUM3: range("tlOutput_Debrief_GenNPIsDrivers_Cum3_R2"),
  GEN_NPIS_DRIVERS_CUM4: range("tlOutput_Debrief_GenNPIsDrivers_Cum4_R2"),
  GEN_NPIS_DRIVERS_CUM5: range("tlOutput_Debrief_GenNPIsDrivers_Cum5_R2"),
  
  // Generalist NPIs Summary - Round 2
  GEN_NPIS_LABEL: range("tlOutput_Debrief_GenNPIs_Label_R2"),
  GEN_NPIS: range("tlOutput_Debrief_GenNPIs_R2"),
  
  // Generalist NPI Drivers Chart Data - Round 2
  GEN_NPIS_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact1_R2"),
  GEN_NPIS_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact2_R2"),
  GEN_NPIS_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact3_R2"),
  GEN_NPIS_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact4_R2"),
  GEN_NPIS_DRIVERS_MINIMPACT5: range("tlOutput_Debrief_GenNPIsDrivers_MinImpact5_R2"),
  
  GEN_NPIS_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact1_R2"),
  GEN_NPIS_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact2_R2"),
  GEN_NPIS_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact3_R2"),
  GEN_NPIS_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact4_R2"),
  GEN_NPIS_DRIVERS_MAXIMPACT5: range("tlOutput_Debrief_GenNPIsDrivers_MaxImpact5_R2"),
  
  GEN_NPIS_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact1_R2"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact2_R2"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact3_R2"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact4_R2"),
  GEN_NPIS_DRIVERS_ACTUALIMPACT5: range("tlOutput_Debrief_GenNPIsDrivers_ActualImpact5_R2"),
  
  // Specialist NPIs Drivers - Round 2 (6 drivers)
  SPEC_NPIS_DRIVERS_LABEL1: range("tlOutput_Debrief_SpecNPIsDrivers_Label1_R2"),
  SPEC_NPIS_DRIVERS_LABEL2: range("tlOutput_Debrief_SpecNPIsDrivers_Label2_R2"),
  SPEC_NPIS_DRIVERS_LABEL3: range("tlOutput_Debrief_SpecNPIsDrivers_Label3_R2"),
  SPEC_NPIS_DRIVERS_LABEL4: range("tlOutput_Debrief_SpecNPIsDrivers_Label4_R2"),
  SPEC_NPIS_DRIVERS_LABEL5: range("tlOutput_Debrief_SpecNPIsDrivers_Label5_R2"),
  SPEC_NPIS_DRIVERS_LABEL6: range("tlOutput_Debrief_SpecNPIsDrivers_Label6_R2"),
  
  SPEC_NPIS_LABEL: range("tlOutput_Debrief_SpecNPIs_Label_R2"),
  
  SPEC_NPIS_DRIVERS_VALUE1: range("tlOutput_Debrief_SpecNPIsDrivers_Value1_R2"),
  SPEC_NPIS_DRIVERS_VALUE2: range("tlOutput_Debrief_SpecNPIsDrivers_Value2_R2"),
  SPEC_NPIS_DRIVERS_VALUE3: range("tlOutput_Debrief_SpecNPIsDrivers_Value3_R2"),
  SPEC_NPIS_DRIVERS_VALUE4: range("tlOutput_Debrief_SpecNPIsDrivers_Value4_R2"),
  SPEC_NPIS_DRIVERS_VALUE5: range("tlOutput_Debrief_SpecNPIsDrivers_Value5_R2"),
  SPEC_NPIS_DRIVERS_VALUE6: range("tlOutput_Debrief_SpecNPIsDrivers_Value6_R2"),
  
  SPEC_NPIS: range("tlOutput_Debrief_SpecNPIs_R2"),
  
  SPEC_NPIS_DRIVERS_CUM1: range("tlOutput_Debrief_SpecNPIsDrivers_Cum1_R2"),
  SPEC_NPIS_DRIVERS_CUM2: range("tlOutput_Debrief_SpecNPIsDrivers_Cum2_R2"),
  SPEC_NPIS_DRIVERS_CUM3: range("tlOutput_Debrief_SpecNPIsDrivers_Cum3_R2"),
  SPEC_NPIS_DRIVERS_CUM4: range("tlOutput_Debrief_SpecNPIsDrivers_Cum4_R2"),
  SPEC_NPIS_DRIVERS_CUM5: range("tlOutput_Debrief_SpecNPIsDrivers_Cum5_R2"),
  SPEC_NPIS_DRIVERS_CUM6: range("tlOutput_Debrief_SpecNPIsDrivers_Cum6_R2"),
  
  SPEC_NPIS_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_SpecNPIsDrivers_MinImpact1_R2"),
  SPEC_NPIS_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_SpecNPIsDrivers_MinImpact2_R2"),
  SPEC_NPIS_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_SpecNPIsDrivers_MinImpact3_R2"),
  SPEC_NPIS_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_SpecNPIsDrivers_MinImpact4_R2"),
  SPEC_NPIS_DRIVERS_MINIMPACT5: range("tlOutput_Debrief_SpecNPIsDrivers_MinImpact5_R2"),
  SPEC_NPIS_DRIVERS_MINIMPACT6: range("tlOutput_Debrief_SpecNPIsDrivers_MinImpact6_R2"),
  
  SPEC_NPIS_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_SpecNPIsDrivers_MaxImpact1_R2"),
  SPEC_NPIS_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_SpecNPIsDrivers_MaxImpact2_R2"),
  SPEC_NPIS_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_SpecNPIsDrivers_MaxImpact3_R2"),
  SPEC_NPIS_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_SpecNPIsDrivers_MaxImpact4_R2"),
  SPEC_NPIS_DRIVERS_MAXIMPACT5: range("tlOutput_Debrief_SpecNPIsDrivers_MaxImpact5_R2"),
  SPEC_NPIS_DRIVERS_MAXIMPACT6: range("tlOutput_Debrief_SpecNPIsDrivers_MaxImpact6_R2"),
  
  SPEC_NPIS_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_SpecNPIsDrivers_ActualImpact1_R2"),
  SPEC_NPIS_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_SpecNPIsDrivers_ActualImpact2_R2"),
  SPEC_NPIS_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_SpecNPIsDrivers_ActualImpact3_R2"),
  SPEC_NPIS_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_SpecNPIsDrivers_ActualImpact4_R2"),
  SPEC_NPIS_DRIVERS_ACTUALIMPACT5: range("tlOutput_Debrief_SpecNPIsDrivers_ActualImpact5_R2"),
  SPEC_NPIS_DRIVERS_ACTUALIMPACT6: range("tlOutput_Debrief_SpecNPIsDrivers_ActualImpact6_R2"),
  
  // Retail Pharmacy Volume Drivers - Round 2
  RET_PHARM_VOL_DRIVERS_LABEL1: range("tlOutput_Debrief_RetPharmVolDrivers_Label1_R2"),
  RET_PHARM_VOL_DRIVERS_LABEL2: range("tlOutput_Debrief_RetPharmVolDrivers_Label2_R2"),
  RET_PHARM_VOL_DRIVERS_LABEL3: range("tlOutput_Debrief_RetPharmVolDrivers_Label3_R2"),
  
  RET_PHARM_VOL_DRIVERS_VALUE1: range("tlOutput_Debrief_RetPharmVolDrivers_Value1_R2"),
  RET_PHARM_VOL_DRIVERS_VALUE2: range("tlOutput_Debrief_RetPharmVolDrivers_Value2_R2"),
  RET_PHARM_VOL_DRIVERS_VALUE3: range("tlOutput_Debrief_RetPharmVolDrivers_Value3_R2"),
  
  RET_PHARM_VOL_DRIVERS_CUM1: range("tlOutput_Debrief_RetPharmVolDrivers_Cum1_R2"),
  RET_PHARM_VOL_DRIVERS_CUM2: range("tlOutput_Debrief_RetPharmVolDrivers_Cum2_R2"),
  RET_PHARM_VOL_DRIVERS_CUM3: range("tlOutput_Debrief_RetPharmVolDrivers_Cum3_R2"),
  
  RET_PHARM_VOL_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact1_R2"),
  RET_PHARM_VOL_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact2_R2"),
  RET_PHARM_VOL_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact3_R2"),
  
  RET_PHARM_VOL_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact1_R2"),
  RET_PHARM_VOL_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact2_R2"),
  RET_PHARM_VOL_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact3_R2"),
  
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact1_R2"),
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact2_R2"),
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact3_R2"),
  
  // Driver 4 (Initiatives & Events - shifted from Driver 3)
  RET_PHARM_VOL_DRIVERS_LABEL4: range("tlOutput_Debrief_RetPharmVolDrivers_Label4_R2"),
  RET_PHARM_VOL_DRIVERS_VALUE4: range("tlOutput_Debrief_RetPharmVolDrivers_Value4_R2"),
  RET_PHARM_VOL_DRIVERS_CUM4: range("tlOutput_Debrief_RetPharmVolDrivers_Cum4_R2"),
  RET_PHARM_VOL_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_RetPharmVolDrivers_MinImpact4_R2"),
  RET_PHARM_VOL_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_RetPharmVolDrivers_MaxImpact4_R2"),
  RET_PHARM_VOL_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_RetPharmVolDrivers_ActualImpact4_R2"),
  
  // Retail Pharmacy Volume Summary - Round 2
  RET_PHARM_VOL_LABEL: range("tlOutput_Debrief_RetPharmVol_Label_R2"),
  RET_PHARM_VOL: range("tlOutput_Debrief_RetPharmVol_R2"),
  
  // Specialty Pharmacy Volume Drivers - Round 2
  SPEC_PHARM_VOL_DRIVERS_LABEL1: range("tlOutput_Debrief_SpecPharmVolDrivers_Label1_R2"),
  SPEC_PHARM_VOL_DRIVERS_LABEL2: range("tlOutput_Debrief_SpecPharmVolDrivers_Label2_R2"),
  SPEC_PHARM_VOL_DRIVERS_LABEL3: range("tlOutput_Debrief_SpecPharmVolDrivers_Label3_R2"),
  SPEC_PHARM_VOL_DRIVERS_LABEL4: range("tlOutput_Debrief_SpecPharmVolDrivers_Label4_R2"),
  
  SPEC_PHARM_VOL_DRIVERS_VALUE1: range("tlOutput_Debrief_SpecPharmVolDrivers_Value1_R2"),
  SPEC_PHARM_VOL_DRIVERS_VALUE2: range("tlOutput_Debrief_SpecPharmVolDrivers_Value2_R2"),
  SPEC_PHARM_VOL_DRIVERS_VALUE3: range("tlOutput_Debrief_SpecPharmVolDrivers_Value3_R2"),
  SPEC_PHARM_VOL_DRIVERS_VALUE4: range("tlOutput_Debrief_SpecPharmVolDrivers_Value4_R2"),
  
  SPEC_PHARM_VOL_DRIVERS_CUM1: range("tlOutput_Debrief_SpecPharmVolDrivers_Cum1_R2"),
  SPEC_PHARM_VOL_DRIVERS_CUM2: range("tlOutput_Debrief_SpecPharmVolDrivers_Cum2_R2"),
  SPEC_PHARM_VOL_DRIVERS_CUM3: range("tlOutput_Debrief_SpecPharmVolDrivers_Cum3_R2"),
  SPEC_PHARM_VOL_DRIVERS_CUM4: range("tlOutput_Debrief_SpecPharmVolDrivers_Cum4_R2"),
  
  SPEC_PHARM_VOL_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_SpecPharmVolDrivers_MinImpact1_R2"),
  SPEC_PHARM_VOL_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_SpecPharmVolDrivers_MinImpact2_R2"),
  SPEC_PHARM_VOL_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_SpecPharmVolDrivers_MinImpact3_R2"),
  SPEC_PHARM_VOL_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_SpecPharmVolDrivers_MinImpact4_R2"),
  
  SPEC_PHARM_VOL_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_SpecPharmVolDrivers_MaxImpact1_R2"),
  SPEC_PHARM_VOL_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_SpecPharmVolDrivers_MaxImpact2_R2"),
  SPEC_PHARM_VOL_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_SpecPharmVolDrivers_MaxImpact3_R2"),
  SPEC_PHARM_VOL_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_SpecPharmVolDrivers_MaxImpact4_R2"),
  
  SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_SpecPharmVolDrivers_ActualImpact1_R2"),
  SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_SpecPharmVolDrivers_ActualImpact2_R2"),
  SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_SpecPharmVolDrivers_ActualImpact3_R2"),
  SPEC_PHARM_VOL_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_SpecPharmVolDrivers_ActualImpact4_R2"),
  
  // Specialty Pharmacy Volume Summary - Round 2
  SPEC_PHARM_VOL_LABEL: range("tlOutput_Debrief_SpecPharmVol_Label_R2"),
  SPEC_PHARM_VOL: range("tlOutput_Debrief_SpecPharmVol_R2"),
  
  // Pharma NPS Drivers - Round 2 (6 drivers)
  PHARMA_NPS_DRIVERS_LABEL1: range("tlOutput_Debrief_PharmaNPSDrivers_Label1_R2"),
  PHARMA_NPS_DRIVERS_LABEL2: range("tlOutput_Debrief_PharmaNPSDrivers_Label2_R2"),
  PHARMA_NPS_DRIVERS_LABEL3: range("tlOutput_Debrief_PharmaNPSDrivers_Label3_R2"),
  PHARMA_NPS_DRIVERS_LABEL4: range("tlOutput_Debrief_PharmaNPSDrivers_Label4_R2"),
  PHARMA_NPS_DRIVERS_LABEL5: range("tlOutput_Debrief_PharmaNPSDrivers_Label5_R2"),
  PHARMA_NPS_DRIVERS_LABEL6: range("tlOutput_Debrief_PharmaNPSDrivers_Label6_R2"),
  
  
  PHARMA_NPS_DRIVERS_VALUE1: range("tlOutput_Debrief_PharmaNPSDrivers_Value1_R2"),
  PHARMA_NPS_DRIVERS_VALUE2: range("tlOutput_Debrief_PharmaNPSDrivers_Value2_R2"),
  PHARMA_NPS_DRIVERS_VALUE3: range("tlOutput_Debrief_PharmaNPSDrivers_Value3_R2"),
  PHARMA_NPS_DRIVERS_VALUE4: range("tlOutput_Debrief_PharmaNPSDrivers_Value4_R2"),
  PHARMA_NPS_DRIVERS_VALUE5: range("tlOutput_Debrief_PharmaNPSDrivers_Value5_R2"),
  PHARMA_NPS_DRIVERS_VALUE6: range("tlOutput_Debrief_PharmaNPSDrivers_Value6_R2"),
  
  
  PHARMA_NPS_DRIVERS_CUM1: range("tlOutput_Debrief_PharmaNPSDrivers_Cum1_R2"),
  PHARMA_NPS_DRIVERS_CUM2: range("tlOutput_Debrief_PharmaNPSDrivers_Cum2_R2"),
  PHARMA_NPS_DRIVERS_CUM3: range("tlOutput_Debrief_PharmaNPSDrivers_Cum3_R2"),
  PHARMA_NPS_DRIVERS_CUM4: range("tlOutput_Debrief_PharmaNPSDrivers_Cum4_R2"),
  PHARMA_NPS_DRIVERS_CUM5: range("tlOutput_Debrief_PharmaNPSDrivers_Cum5_R2"),
  PHARMA_NPS_DRIVERS_CUM6: range("tlOutput_Debrief_PharmaNPSDrivers_Cum6_R2"),
  
  
  PHARMA_NPS_DRIVERS_MINIMPACT1: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact1_R2"),
  PHARMA_NPS_DRIVERS_MINIMPACT2: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact2_R2"),
  PHARMA_NPS_DRIVERS_MINIMPACT3: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact3_R2"),
  PHARMA_NPS_DRIVERS_MINIMPACT4: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact4_R2"),
  PHARMA_NPS_DRIVERS_MINIMPACT5: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact5_R2"),
  PHARMA_NPS_DRIVERS_MINIMPACT6: range("tlOutput_Debrief_PharmaNPSDrivers_MinImpact6_R2"),
  
  
  PHARMA_NPS_DRIVERS_MAXIMPACT1: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact1_R2"),
  PHARMA_NPS_DRIVERS_MAXIMPACT2: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact2_R2"),
  PHARMA_NPS_DRIVERS_MAXIMPACT3: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact3_R2"),
  PHARMA_NPS_DRIVERS_MAXIMPACT4: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact4_R2"),
  PHARMA_NPS_DRIVERS_MAXIMPACT5: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact5_R2"),
  PHARMA_NPS_DRIVERS_MAXIMPACT6: range("tlOutput_Debrief_PharmaNPSDrivers_MaxImpact6_R2"),
  
  
  PHARMA_NPS_DRIVERS_ACTUALIMPACT1: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact1_R2"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT2: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact2_R2"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT3: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact3_R2"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT4: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact4_R2"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT5: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact5_R2"),
  PHARMA_NPS_DRIVERS_ACTUALIMPACT6: range("tlOutput_Debrief_PharmaNPSDrivers_ActualImpact6_R2"),
  
  
  // Pharma NPS Summary - Round 2
  PHARMA_NPS_LABEL: range("tlOutput_Debrief_PharmaNPS_Label_R2"),
  PHARMA_NPS: range("tlOutput_Debrief_PharmaNPS_R2"),
} as const;

/**
 * Combined Range Names Object
 * For easy access to all range names
 */
export const RANGE_NAMES = {
  ...KPI_RANGE_NAMES_R1,
  ...KPI_RANGE_NAMES_R2,
  ...ROUND_MANAGEMENT_RANGE_NAMES,
  ...SCREEN_TRACKING_RANGE_NAMES_R1,
  ...SCREEN_TRACKING_RANGE_NAMES_R2,
  ...ROUND_SUBMISSION_RANGE_NAMES,
  ...INVESTMENT_RANGE_NAMES_R1,
  ...INVESTMENT_RANGE_NAMES_R2,
  ...DASH_EXPENSE_RANGE_NAMES_R1,
  ...DASH_EXPENSE_RANGE_NAMES_R2,
  ...DASH_CUM_RANGE_NAMES_R1,
  ...DASH_CUM_RANGE_NAMES_R2,
  ...DECISION_RANGE_NAMES,
  ...EVENT_RANGE_NAMES,
  ...STRATEGY_PLANNING_RANGE_NAMES,
  ...STRATEGIC_INITIATIVE_RANGE_NAMES,
  ...GTM_OPTION_DATA_RANGE_NAMES,
  ...GTM_OPTION_DATA_RANGE_NAMES_R2,
  ...PRODUCT_OPTION_DATA_RANGE_NAMES,
  ...PRODUCT_OPTION_DATA_RANGE_NAMES_R2,
  ...TECHNOLOGY_OPTION_DATA_RANGE_NAMES,
  ...TECHNOLOGY_OPTION_DATA_RANGE_NAMES_R2,
  ...OPERATIONS_OPTION_DATA_RANGE_NAMES,
  ...OPERATIONS_OPTION_DATA_RANGE_NAMES_R2,
  ...DEBRIEF_RANGE_NAMES,
  ...DEBRIEF_RANGE_NAMES_R2,
  ...VERITY_SCORE_RANGE_NAMES,
} as const;

/**
 * Type definitions for type safety
 */
export type KPIRangeNameR1 = keyof typeof KPI_RANGE_NAMES_R1;
export type KPIRangeNameR2 = keyof typeof KPI_RANGE_NAMES_R2;
export type RoundManagementRangeName = keyof typeof ROUND_MANAGEMENT_RANGE_NAMES;
export type ScreenTrackingRangeNameR1 = keyof typeof SCREEN_TRACKING_RANGE_NAMES_R1;
export type ScreenTrackingRangeNameR2 = keyof typeof SCREEN_TRACKING_RANGE_NAMES_R2;
export type RoundSubmissionRangeName = keyof typeof ROUND_SUBMISSION_RANGE_NAMES;
export type InvestmentRangeNameR1 = keyof typeof INVESTMENT_RANGE_NAMES_R1;
export type InvestmentRangeNameR2 = keyof typeof INVESTMENT_RANGE_NAMES_R2;
export type DashExpenseRangeNameR1 = keyof typeof DASH_EXPENSE_RANGE_NAMES_R1;
export type DashExpenseRangeNameR2 = keyof typeof DASH_EXPENSE_RANGE_NAMES_R2;
export type DashCumRangeNameR1 = keyof typeof DASH_CUM_RANGE_NAMES_R1;
export type DashCumRangeNameR2 = keyof typeof DASH_CUM_RANGE_NAMES_R2;
export type DecisionRangeName = keyof typeof DECISION_RANGE_NAMES;
export type EventRangeName = keyof typeof EVENT_RANGE_NAMES;
export type StrategyPlanningRangeName = keyof typeof STRATEGY_PLANNING_RANGE_NAMES;
export type StrategicInitiativeRangeName = keyof typeof STRATEGIC_INITIATIVE_RANGE_NAMES;
export type GTMOptionDataRangeName = keyof typeof GTM_OPTION_DATA_RANGE_NAMES;
export type GTMOptionDataRangeNameR2 = keyof typeof GTM_OPTION_DATA_RANGE_NAMES_R2;
export type ProductOptionDataRangeName = keyof typeof PRODUCT_OPTION_DATA_RANGE_NAMES;
export type ProductOptionDataRangeNameR2 = keyof typeof PRODUCT_OPTION_DATA_RANGE_NAMES_R2;
export type TechnologyOptionDataRangeName = keyof typeof TECHNOLOGY_OPTION_DATA_RANGE_NAMES;
export type TechnologyOptionDataRangeNameR2 = keyof typeof TECHNOLOGY_OPTION_DATA_RANGE_NAMES_R2;
export type OperationsOptionDataRangeName = keyof typeof OPERATIONS_OPTION_DATA_RANGE_NAMES;
export type OperationsOptionDataRangeNameR2 = keyof typeof OPERATIONS_OPTION_DATA_RANGE_NAMES_R2;
export type DebriefRangeName = keyof typeof DEBRIEF_RANGE_NAMES;
export type DebriefRangeNameR2 = keyof typeof DEBRIEF_RANGE_NAMES_R2;
export type VerityScoreRangeName = keyof typeof VERITY_SCORE_RANGE_NAMES;
export type RangeName = keyof typeof RANGE_NAMES;
