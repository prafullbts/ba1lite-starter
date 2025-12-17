/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MODEL STORAGE MANAGEMENT SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This file manages model state persistence between CalcService, localStorage, and backend.
 * All business logic and decision management is handled by the CalcModel.
 * 
 * STORAGE ARCHITECTURE:
 * - Single 'appStorage' object in localStorage
 * - Contains: model_state (CalcModel), tlInput values, custom keys
 * - CalcModel data stored as 'model_state' key
 * - Supports additional custom keys for app-specific data
 * 
 * CORE RESPONSIBILITIES:
 * 1. Model state persistence (CalcService ↔ localStorage ↔ backend)
 * 2. Automatic sync on CalcModel changes (debounced)
 * 3. Initial state restoration from backend
 * 
 * ARCHITECTURE PATTERN:
 * - React Context Provider for model state management
 * - Automatic backend sync on MODEL_CALC_COMPLETE events (debounced)
 * - Error recovery and data integrity protection
 * 
 * USAGE:
 * import { ModelStorageProvider } from '@/contexts/ModelStorageContext';
 * Wrap your app with <ModelStorageProvider>
 */

import React, { ReactNode, useEffect, useRef, createContext, useContext } from 'react';
import { loadState, saveState } from '@/services/stateService';
import { useCalc } from '@/contexts/CalcContext';
import { getQuestionToSend } from '@/utils/config';
import { debounce } from '@/utils/debounce';
import { readValuesFromCalc, writeValuesToCalc } from '@/services/calcConnector';



// ═════════════════════════════════════════════════════════════════════════════
// ████████╗ TYPE DEFINITIONS & INTERFACES
// ╚══██╔══╝ Comprehensive type system for simulation state
//    ██║    
//    ██║    
//    ╚═╝    
// ═════════════════════════════════════════════════════════════════════════════

// Storage-only file - step management is calculated directly from screen tracking flags in FlowNavigation

// ═════════════════════════════════════════════════════════════════════════════
// ████████╗ LOCAL STORAGE UTILITIES
// ╚══██╔══╝ Key-value pair management with automatic synchronization
//    ██║    
//    ██║    
//    ╚═╝    
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PSEUDOCODE: Define local storage configuration
 * Purpose: Unified app storage with multiple keys
 * Pattern: Single appStorage object contains all app data
 */
const STORAGE_CONFIG = {
  MAIN_KEY: 'appStorage',
  LAST_SAVED_STATE_KEY: 'lastSavedState'
} as const;

// Note: We no longer save currentStep to localStorage since it's calculated from screen tracking flags
// Screen tracking flags in CalcModel are the single source of truth

/**
 * Improved change detection: handles null, undefined, empty strings, and type coercion
 */
function hasValueChanged(current: string | undefined, last: string | undefined): boolean {
  // Normalize empty values (null, undefined, empty string all treated as empty)
  const currentNormalized = current !== null && current !== undefined && current !== '' ? String(current) : '';
  const lastNormalized = last !== null && last !== undefined && last !== '' ? String(last) : '';
  
  // If both are empty, no change
  if (currentNormalized === '' && lastNormalized === '') {
    return false;
  }
  
  // If one exists and the other doesn't, it's a change
  if ((currentNormalized !== '') !== (lastNormalized !== '')) {
    return true;
  }
  
  // Both exist, compare normalized string values
  return currentNormalized !== lastNormalized;
}

/**
 * Load last saved state from localStorage
 */
function loadLastSavedState(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_CONFIG.LAST_SAVED_STATE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn('⚠️ Failed to load last saved state:', error);
    return {};
  }
}

/**
 * Save last saved state to localStorage
 */
function saveLastSavedState(state: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_CONFIG.LAST_SAVED_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('⚠️ Failed to save last saved state:', error);
  }
}

/**
 * Save state to backend - only sends changed values to reduce payload size
 * Debouncing is handled by the caller
 * 
 * Note: We no longer send return_url to backend - routing is handled by IntelligentLanding
 * based on screen tracking flags in CalcModel
 */
async function saveStateToBackend(modelState?: string, calcService?: any): Promise<void> {
  try {
    const appStorage = loadAppStorage();
    const questionsToSend = await getQuestionToSend();
    const lastSavedState = loadLastSavedState();
    
    // Read current values from CalcService
    const currentValues = await readValuesFromCalc(
      calcService,
      questionsToSend,
      appStorage,
      modelState
    );
    
    // Detect changed values - only send what has changed
    const changedValues: Record<string, string> = {};
    let hasAnyChanges = false;
    
    // Always include model_state if it exists (it's a complex object that may have internal changes)
    if (currentValues.model_state) {
      const modelStateChanged = hasValueChanged(
        currentValues.model_state,
        lastSavedState.model_state
      );
      if (modelStateChanged) {
        changedValues.model_state = currentValues.model_state;
        hasAnyChanges = true;
      }
    }
    
    // Check each question for changes
    for (const key of Object.keys(currentValues)) {
      if (key === 'model_state') {
        continue; // Already handled above
      }
      
      const currentValue = currentValues[key];
      const lastValue = lastSavedState[key];
      
      if (hasValueChanged(currentValue, lastValue)) {
        changedValues[key] = currentValue;
        hasAnyChanges = true;
      }
    }
    
    // Update localStorage with all current values (for local consistency)
    const updatedAppStorage = { ...appStorage };
    if (currentValues.model_state) {
      updatedAppStorage.model_state = currentValues.model_state;
    }
    Object.keys(currentValues).forEach(key => {
      // Save both tlInput and tlOutput values to localStorage for consistency
      // Note: tlOutput values are calculated formulas, but we save them for debugging/reference
      if (key.startsWith('tlInput') || key.startsWith('tlOutput')) {
        updatedAppStorage[key] = currentValues[key];
      }
    });
    localStorage.setItem(STORAGE_CONFIG.MAIN_KEY, JSON.stringify(updatedAppStorage));
    
    // Only save to backend if there are changes
    if (hasAnyChanges) {
      console.log(`📤 Sending ${Object.keys(changedValues).length} changed values to backend (out of ${Object.keys(currentValues).length} total)`);
      await saveState(changedValues);
      
      // Update last saved state with all current values (not just changed ones)
      // This ensures we track the full state for next comparison
      saveLastSavedState(currentValues);
      console.log('✅ Changed state saved to backend');
    } else {
      console.log('📋 No changes detected, skipping backend save');
    }
  } catch (error) {
    console.warn('⚠️ Failed to save state to backend (continuing with local storage):', error);
    // Don't throw - we want the app to continue working even if backend is unavailable
  }
}

/**
 * PSEUDOCODE: Load appStorage object from localStorage
 * Algorithm:
 * 1. Retrieve appStorage from localStorage
 * 2. Parse JSON with error handling
 * 3. Return parsed object or empty object if missing/corrupted
 * 
 * @returns AppStorage object or empty object
 */
function loadAppStorage(): Record<string, any> {
  try {
    const stored = localStorage.getItem(STORAGE_CONFIG.MAIN_KEY);
    if (!stored) {
      console.log('📝 No appStorage found, using empty object');
      return {};
    }
    
    const parsed = JSON.parse(stored);
    console.log('✅ AppStorage loaded:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Failed to load appStorage:', error);
    return {};
  }
}

// Removed loadStateFromLocalStorage() - screen tracking flags in CalcModel are the single source of truth
// The step is calculated from tracking flags, not loaded from localStorage

/**
 * Load model state and tlInput values from backend API
 * Note: We don't load return_url from backend - routing is handled by IntelligentLanding
 * based on screen tracking flags in CalcModel
 * 
 * @returns Object with model_state and tlInput values, or null if unavailable
 */
async function loadModelDataFromBackend(): Promise<Record<string, any> | null> {
  try {
    // Get questions to load from config
    const questions = await getQuestionToSend();
    
    console.log('🌐 Loading model data from backend:', questions);
    const backendData = await loadState(questions);
    console.log('✅ Model data loaded from backend:', backendData);
    
    // Update localStorage with backend data (model_state, tlInput values, etc.)
    const existingStorage = loadAppStorage();
    const updatedStorage = {
      ...existingStorage,
      ...backendData
    };
    
    // Extract and store tlInput values separately in appStorage
    // These come from the backend response as separate keys (not in model_state)
    const questionsToSend = await getQuestionToSend();
    const tlInputQuestions = questionsToSend.filter(q => q.startsWith('tlInput'));
    tlInputQuestions.forEach(question => {
      if (backendData[question] !== undefined && backendData[question] !== null && backendData[question] !== '') {
        const value = backendData[question];
        // Skip error values like #N/A
        const isErrorValue = typeof value === 'string' && value.startsWith('#');
        if (!isErrorValue) {
          updatedStorage[question] = value;
          console.log(`📥 Extracted tlInput ${question} = "${value}" from backend LoadState`);
        }
      }
    });
    
    localStorage.setItem(
      STORAGE_CONFIG.MAIN_KEY, 
      JSON.stringify(updatedStorage)
    );
    
    return updatedStorage;
  } catch (error) {
    console.warn('⚠️ Failed to load model data from backend:', error);
    return null;
  }
}

/**
 * PSEUDOCODE: Load model state from backend and restore to CalcService
 * Algorithm:
 * 1. Load state from backend
 * 2. Extract model_state from backend data
 * 3. Restore model state to CalcService if available
 * 
 * @returns Model state string or null if unavailable
 */
async function loadModelStateFromBackend(): Promise<string | null> {
  try {
    const questions = ['model_state'];
    console.log('🌐 Loading model state from backend');
    const backendData = await loadState(questions);
    
    if (backendData.model_state) {
      console.log('✅ Model state loaded from backend');
      return backendData.model_state;
    }
    
    return null;
  } catch (error) {
    console.warn('⚠️ Failed to load model state from backend:', error);
    return null;
  }
}


// ═════════════════════════════════════════════════════════════════════════════
// ████████╗ MODEL STORAGE CONTEXT
// ╚══██╔══╝ Context for accessing sync functionality
//    ██║    
//    ██║    
//    ╚═╝    
// ═════════════════════════════════════════════════════════════════════════════

interface ModelStorageContextType {
  syncToBackend: () => Promise<void>;
}

const ModelStorageContext = createContext<ModelStorageContextType | undefined>(undefined);

export const useModelStorage = (): ModelStorageContextType => {
  const context = useContext(ModelStorageContext);
  if (context === undefined) {
    throw new Error('useModelStorage must be used within a ModelStorageProvider');
  }
  return context;
};

// ═════════════════════════════════════════════════════════════════════════════
// ████████╗ MODEL STATE MANAGER
// ╚══██╔══╝ Handles model state persistence between CalcService and backend
//    ██║    
//    ██║    
//    ╚═╝    
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PSEUDOCODE: Simulation Provider with localStorage Integration
 * Algorithm:
 * 1. Initialize state from localStorage or use defaults
 * 2. Set up useReducer with automatic persistence
 * 3. Sync state to localStorage on every update
 * 4. Provide context to child components
 * 
 * @param children - React components to wrap with context
 */
/**
 * Model State Manager Component
 * Purpose: Handles model state persistence between CalcService and backend
 * Algorithm:
 * 1. Access CalcService from CalcContext
 * 2. Save model state to backend when CalcService changes
 * 3. Load model state from backend when CalcService initializes
 */
function ModelStateManager() {
  const { calcService, isInitialized } = useCalc();
  const hasSyncedInitialValues = useRef(false);
  
  // Save model state to backend when CalcService changes
  useEffect(() => {
    if (!calcService || !isInitialized) return;
    
    const saveModelState = async () => {
      try {
        // Get current model state from CalcService
        const modelState = calcService.getModelState();
        if (modelState && modelState !== '{}') {
          console.log('💾 Saving model state to backend:', modelState);
          await saveStateToBackend(modelState, calcService);
        }
      } catch (error) {
        console.warn('⚠️ Failed to save model state to backend:', error);
      }
    };
    
    // Save model state when CalcService is ready
    saveModelState();
  }, [calcService, isInitialized]);
  
  // Load model state from backend when CalcService initializes
  // After applying values, wait for recalculation, then sync all initial values
  useEffect(() => {
    if (!calcService || !isInitialized) return;
    
    const communicator: any = calcService.getObservable?.();
    if (!communicator?.on || !communicator?.off) return;
    
    // Skip if we've already synced initial values
    if (hasSyncedInitialValues.current) return;
    
    let hasAppliedValues = false;
    
    const loadModelState = async () => {
      try {
        // Read from appStorage instead of making redundant LoadState call
        // appStorage was already populated by loadStateFromBackend() in SimulationProvider
        const appStorage = loadAppStorage();
        const questionToSend = await getQuestionToSend();
        
        // Prepare values object for CalcConnector.writeValuesToCalc
        // Only include values for questions that are in questionToSend
        const valuesToWrite: Record<string, string> = {};
        
        // Add model_state if available (always restore model_state)
        if (appStorage.model_state && typeof appStorage.model_state === 'string') {
          valuesToWrite.model_state = appStorage.model_state;
        }
        
        // Add tlInput values from appStorage that are in questionToSend
        // These will override model_state values
        const tlInputQuestions = questionToSend.filter(q => q.startsWith('tlInput'));
        tlInputQuestions.forEach(question => {
          if (appStorage[question] !== undefined && appStorage[question] !== null && appStorage[question] !== '') {
            const value = appStorage[question];
            const isErrorValue = typeof value === 'string' && value.startsWith('#');
            if (!isErrorValue) {
              valuesToWrite[question] = typeof value === 'string' ? value : String(value);
              console.log(`📝 Prepared ${question} = "${value}" for restoration`);
            }
          }
        });
        
        // Use CalcConnector to write values to CalcService
        // This handles model_state restoration and tlInput overrides
        // After this, CalcService will recalculate and trigger MODEL_CALC_COMPLETE
        if (Object.keys(valuesToWrite).length > 0) {
          console.log(`🔄 Restoring ${Object.keys(valuesToWrite).length} values to CalcService (${tlInputQuestions.length} tlInput questions)`);
          await writeValuesToCalc(calcService, valuesToWrite, questionToSend);
          hasAppliedValues = true;
        } else {
          // Even if no values to restore, we still want to sync initial values after first calc
          hasAppliedValues = true;
        }
      } catch (error) {
        console.warn('⚠️ Failed to load model state from backend:', error);
      }
    };
    
    // Sync all initial values from CalcService to backend
    // This should happen AFTER recalculation completes (MODEL_CALC_COMPLETE)
    const syncInitialValues = async () => {
      if (hasSyncedInitialValues.current) return; // Only sync once
      hasSyncedInitialValues.current = true;
      
      try {
        console.log('🔄 Syncing all initial values from CalcService to backend (after recalculation)...');
        const appStorage = loadAppStorage();
        const questionToSend = await getQuestionToSend();
        const initialValues: Record<string, string> = {};
        
        // Add model_state
        const modelState = calcService.getModelState();
        initialValues.model_state = modelState || '{}';
        
        // Read each question from CalcService using getValue() to get actual calculated/default values
        // This happens AFTER recalculation, so we get the correct calculated values
        for (const question of questionToSend) {
          if (question === 'model_state') {
            continue; // Already added above
          }
          
          try {
            const rawValue = calcService.getValue(question, true); // true = get as-is from model
            
            // Skip Excel error values like #N/A
            const isErrorValue = typeof rawValue === 'string' && rawValue.startsWith('#');
            
            if (!isErrorValue) {
              // Include all values (even empty strings, 0, false, null, undefined)
              // Convert to string representation for consistency
              // This captures all default/calculated values from calcModel after recalculation
              if (rawValue === null || rawValue === undefined) {
                initialValues[question] = ''; // Empty string for null/undefined
              } else {
                initialValues[question] = String(rawValue);
              }
              console.log(`📥 Initial value for ${question} = "${initialValues[question]}"`);
            }
          } catch (error) {
            // Question might not exist or not accessible - skip it
            console.warn(`⚠️ Could not read initial value for ${question}:`, error);
          }
        }
        
        // Update localStorage with initial values
        const updatedAppStorage = { ...appStorage };
        if (initialValues.model_state) {
          updatedAppStorage.model_state = initialValues.model_state;
        }
        Object.keys(initialValues).forEach(key => {
          // Save both tlInput and tlOutput values to localStorage for consistency
          // Note: tlOutput values are calculated formulas, but we save them for debugging/reference
          if (key.startsWith('tlInput') || key.startsWith('tlOutput')) {
            updatedAppStorage[key] = initialValues[key];
          }
        });
        localStorage.setItem(STORAGE_CONFIG.MAIN_KEY, JSON.stringify(updatedAppStorage));
        
        // Save all initial values to backend (initial sync sends everything to ensure backend has complete state)
        await saveState(initialValues);
        
        // Update last saved state so future saves can use change detection
        saveLastSavedState(initialValues);
        
        console.log(`✅ Synced ${Object.keys(initialValues).length} initial values to backend (after recalculation)`);
      } catch (syncError) {
        console.warn('⚠️ Failed to sync initial values to backend:', syncError);
      }
    };
    
    // Listen for MODEL_CALC_COMPLETE to sync initial values after recalculation
    const onCalcComplete = () => {
      if (hasAppliedValues) {
        // Wait a bit for all calculations to settle
        setTimeout(() => {
          syncInitialValues();
        }, 100);
      }
    };
    
    // Load model state first
    loadModelState();
    
    // Listen for recalculation to complete
    communicator.on('MODEL_CALC_COMPLETE', onCalcComplete);
    
    return () => {
      communicator.off('MODEL_CALC_COMPLETE', onCalcComplete);
    };
  }, [calcService, isInitialized]);

  // Subscribe to calc model changes and persist to backend
  // Uses debouncing (500ms) similar to Angular pattern to reduce API calls
  useEffect(() => {
    if (!calcService || !isInitialized) return;

    const communicator: any = calcService.getObservable?.();
    if (!communicator?.on || !communicator?.off) return;

    // Create debounced save function (500ms delay like Angular)
    // Using regular debounce since we're not awaiting the result
    const debouncedSave = debounce(() => {
      // Async work is handled inside, but we don't need to await it
      (async () => {
        try {
          const modelState = calcService.getModelState();
          if (modelState) {
            await saveStateToBackend(modelState, calcService);
          }
        } catch (err) {
          console.warn('⚠️ Failed to persist model changes to backend:', err);
        }
      })();
    }, 500);

    const onCalcComplete = () => {
      // Debounce saves to avoid flooding backend during rapid changes
      debouncedSave();
    };

    communicator.on('MODEL_CALC_COMPLETE', onCalcComplete);
    return () => {
      communicator.off('MODEL_CALC_COMPLETE', onCalcComplete);
      // Cleanup: debounce utility handles timeout cleanup automatically
    };
  }, [calcService, isInitialized]);
  
  return null; // This component doesn't render anything
}

/**
 * ModelStorageProvider
 * 
 * Provides model state persistence between CalcService, localStorage, and backend.
 * Handles automatic syncing on CalcModel changes (debounced).
 */
export function ModelStorageProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { calcService, isInitialized: calcInitialized } = useCalc();
  
  // Load model data from backend on app initialization
  useEffect(() => {
    const initializeModelData = async () => {
      try {
        // Load model_state and tlInput values from backend
        await loadModelDataFromBackend();
        console.log('🔄 Model data loaded from backend (if available)');
      } catch (error) {
        console.warn('⚠️ Failed to load model data from backend (continuing):', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeModelData();
  }, []);

  // Sync function that can be called manually
  const syncToBackend = async () => {
    if (!calcService || !calcInitialized) {
      console.warn('⚠️ Cannot sync: CalcService not initialized');
      return;
    }
    
    try {
      const modelState = calcService.getModelState();
      if (modelState) {
        await saveStateToBackend(modelState, calcService);
      }
    } catch (error) {
      console.error('⚠️ Failed to sync to backend:', error);
      throw error;
    }
  };

  const contextValue: ModelStorageContextType = {
    syncToBackend,
  };

  return (
    <ModelStorageContext.Provider value={contextValue}>
      <ModelStateManager />
      {children}
    </ModelStorageContext.Provider>
  );
}

// Backward compatibility exports (for migration period)
// Note: Step management is now calculated directly from screen tracking flags
export const SimulationProvider = ModelStorageProvider;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EXPORT SUMMARY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This module exports:
 * 1. ModelStorageProvider - Context provider for model state persistence
 * 2. SimulationProvider - Backward compatibility alias for ModelStorageProvider
 * 
 * INTEGRATION PATTERN:
 * 1. Wrap your app with <ModelStorageProvider> (inside CalcProvider)
 * 2. Model state is automatically synced between CalcService, localStorage, and backend
 * 
 * STORAGE FEATURES:
 * - Single 'appStorage' object in localStorage
 * - CalcModel data stored as 'model_state' key
 * - Supports custom keys for additional app data (tlInput values, etc.)
 * - Automatic backend sync on MODEL_CALC_COMPLETE events (debounced)
 * - Error recovery and data integrity protection
 * 
 * STORAGE STRUCTURE:
 * appStorage: {
 *   model_state: {...},               // CalcModel data
 *   tlInputTeamRound: "1",           // Example tlInput value
 *   // ... any other custom keys
 * }
 * 
 * NOTE: 
 * - All business logic and decision management is handled by CalcModel
 * - Step management is calculated directly from screen tracking flags in FlowNavigation
 * - Routing is handled by IntelligentLanding based on screen tracking flags
 * - We no longer store or send return_url to backend
 */

