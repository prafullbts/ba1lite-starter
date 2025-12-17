/**
 * StateThrottler Service
 * 
 * Manages queueing and throttling of state save operations.
 * Prevents race conditions when multiple saves happen quickly.
 * Similar to Angular's ConnectThrottlerService pattern.
 */

import { saveState } from './stateService';
import { readValuesFromCalc } from './calcConnector';

const STORAGE_CONFIG = {
  MAIN_KEY: 'appStorage'
} as const;

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

interface StateThrottlerOptions {
  calcService?: any;
  questionsToSend: string[];
  appStorage: Record<string, any>;
  returnUrl: string;
  modelState?: string;
  lastSavedValues: Record<string, string>;
}

/**
 * Queue and manage state save operations
 * Only sends changed values to reduce backend load
 */
export class StateThrottler {
  private activeRequest: Promise<void> | null = null;
  private waitingToSync: StateThrottlerOptions | null = null;
  
  /**
   * Queue an upload/save operation
   * If a request is in progress, queues the next one
   */
  async queueUpload(options: StateThrottlerOptions): Promise<void> {
    // If there's an active request, queue this one
    if (this.activeRequest) {
      this.waitingToSync = options;
      return;
    }
    
    // Start the save operation
    this.activeRequest = this.performSave(options);
    
    // Handle completion and process queue
    try {
      await this.activeRequest;
    } finally {
      this.activeRequest = null;
      
      // Process queued request if any
      if (this.waitingToSync) {
        const nextOptions = this.waitingToSync;
        this.waitingToSync = null;
        this.queueUpload(nextOptions);
      }
    }
  }
  
  /**
   * Perform the actual save operation with change detection
   */
  private async performSave(options: StateThrottlerOptions): Promise<void> {
    try {
      // Read current values from CalcService using CalcConnector
      const currentValues = await readValuesFromCalc(
        options.calcService,
        options.questionsToSend,
        options.appStorage,
        options.modelState
      );
      
      // Check if any questionToSend values have changed
      const changedQuestions = options.questionsToSend.filter(q => {
        return hasValueChanged(currentValues[q], options.lastSavedValues[q]);
      });
      
      const hasChanges = changedQuestions.length > 0;
      
      if (!hasChanges && Object.keys(options.lastSavedValues).length > 0) {
        console.log('📋 No changes to questionToSend values, skipping save');
        return;
      }
      
      // Update appStorage in localStorage
      const updatedAppStorage = { ...options.appStorage };
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
      
      localStorage.setItem(
        STORAGE_CONFIG.MAIN_KEY,
        JSON.stringify(updatedAppStorage)
      );
      
      console.log('💾 Updated appStorage with calc model values:', {
        tlInputKeys: Object.keys(currentValues).filter(k => k.startsWith('tlInput')).length,
        tlOutputKeys: Object.keys(currentValues).filter(k => k.startsWith('tlOutput')).length,
        totalKeys: Object.keys(updatedAppStorage).length
      });
      
      console.log('🌐 Saving state to backend:', {
        model_state_length: currentValues.model_state?.length || 0,
        tlInputCount: Object.keys(currentValues).filter(k => k.startsWith('tlInput') && currentValues[k]).length,
        tlOutputCount: Object.keys(currentValues).filter(k => k.startsWith('tlOutput') && currentValues[k]).length,
        changedQuestions: changedQuestions.slice(0, 10),
        totalChanged: changedQuestions.length
      });
      
      // Save to backend
      await saveState(currentValues);
      console.log('✅ State saved to backend successfully');
      
      // Update lastSavedValues for next comparison
      // Use Object.assign to update the reference passed in
      Object.keys(currentValues).forEach(key => {
        options.lastSavedValues[key] = currentValues[key];
      });
      
    } catch (error) {
      console.warn('⚠️ Failed to save state to backend (continuing with local storage):', error);
      throw error; // Re-throw so caller can handle if needed
    }
  }
  
  /**
   * Check if a save operation is in progress
   */
  isBusy(): boolean {
    return this.activeRequest !== null;
  }
  
  /**
   * Cancel any pending operations (useful for cleanup)
   */
  cancel(): void {
    this.waitingToSync = null;
    // Note: We don't cancel activeRequest as it should complete
    // The queue will just stop processing after current request
  }
}

