/**
 * CalcConnector Service
 * 
 * Provides clean separation between CalcService and state management.
 * Handles reading values from CalcService and writing values to CalcService.
 * Similar to Angular's JsCalcConnectorService pattern.
 */

import { getQuestionToSend } from '@/utils/config';

/**
 * Read values from CalcService for all questions in questionToSend
 * 
 * @param calcService - CalcService instance
 * @param questionsToSend - Array of question names to read
 * @param appStorage - Current appStorage object for non-tlInput questions
 * @param modelState - Optional model state string
 * @returns Object with all current values indexed by question name
 */
export async function readValuesFromCalc(
  calcService: any,
  questionsToSend: string[],
  appStorage: Record<string, any>,
  modelState?: string
): Promise<Record<string, string>> {
  const currentValues: Record<string, string> = {};
  
  // Get model state string
  let modelStateStr: string;
  if (modelState) {
    modelStateStr = modelState;
  } else if (appStorage.model_state) {
    modelStateStr = typeof appStorage.model_state === 'string' 
      ? appStorage.model_state 
      : JSON.stringify(appStorage.model_state);
  } else {
    modelStateStr = '{}';
  }
  
  currentValues.model_state = modelStateStr;
  
  // Extract tlInput and tlOutput questions - read directly from CalcService
  // Both are formula-based values that need to be read from the calc model
  const tlInputQuestions = questionsToSend.filter(q => q.startsWith('tlInput'));
  const tlOutputQuestions = questionsToSend.filter(q => q.startsWith('tlOutput'));
  const calcModelQuestions = [...tlInputQuestions, ...tlOutputQuestions];
  let counteredCalcModelValues = 0;
  
  if (calcService && calcModelQuestions.length > 0) {
    // Read all tlInput and tlOutput values directly from CalcService using getValue()
    for (const question of calcModelQuestions) {
      try {
        const rawValue = calcService.getValue(question, true); // true = get as-is from model
        
        // Convert to string for comparison
        const valueStr = rawValue !== null && rawValue !== undefined ? String(rawValue) : '';
        
        // Exclude empty strings, null, undefined, and error values like #N/A, #REF!, etc.
        const isErrorValue = typeof rawValue === 'string' && (
          rawValue.startsWith('#') || // Excel error codes like #N/A, #REF!, #VALUE!, etc.
          valueStr.trim() === ''
        );
        
        if (rawValue !== null && rawValue !== undefined && valueStr !== '' && !isErrorValue) {
          currentValues[question] = valueStr;
          counteredCalcModelValues++;
          const questionType = question.startsWith('tlInput') ? 'tlInput' : 'tlOutput';
          console.log(`✅ Found ${questionType} ${question} = "${valueStr}"`);
        } else {
          // Don't include empty/null/error values
          const questionType = question.startsWith('tlInput') ? 'tlInput' : 'tlOutput';
          console.log(`⏭️ Skipping ${questionType} ${question} (value: ${rawValue}${isErrorValue ? ' - error value' : ''})`);
        }
      } catch (error) {
        // If getValue fails, the question doesn't exist or isn't accessible
        const questionType = question.startsWith('tlInput') ? 'tlInput' : 'tlOutput';
        console.warn(`❌ ${questionType} ${question} not accessible from CalcService:`, error);
      }
    }
    
    console.log(`📊 Extracted ${counteredCalcModelValues} non-empty calc model values from ${calcModelQuestions.length} total questions (${tlInputQuestions.length} tlInput, ${tlOutputQuestions.length} tlOutput) - read from CalcService`);
  } else if (calcModelQuestions.length > 0) {
    console.warn('⚠️ CalcService not available, cannot read calc model values directly');
  }
  
  // Add any other non-tlInput/tlOutput questions from questionToSend that exist in appStorage
  questionsToSend.forEach(question => {
    if (question !== 'model_state' && 
        !question.startsWith('tlInput') &&
        !question.startsWith('tlOutput') &&
        appStorage[question] !== undefined) {
      const value = appStorage[question];
      currentValues[question] = typeof value === 'string' ? value : JSON.stringify(value);
    }
  });
  
  return currentValues;
}

/**
 * Write values from backend/state to CalcService
 * Only writes values that actually changed to avoid unnecessary updates
 * 
 * @param calcService - CalcService instance
 * @param values - Object with values to write, indexed by question name
 * @param questionToSend - Array of question names that should be written
 * @returns Promise that resolves when all writes complete
 */
export async function writeValuesToCalc(
  calcService: any,
  values: Record<string, string>,
  questionToSend: string[]
): Promise<void> {
  if (!calcService) {
    console.warn('⚠️ CalcService not available, cannot write values');
    return;
  }
  
  const promises: Promise<void>[] = [];
  
  // Write model_state first (contains cell references)
  // Only write cells that have actually changed to reduce stateVariables size
  if (values.model_state) {
    try {
      const parsedState = JSON.parse(values.model_state);
      let restoredCount = 0;
      let skippedCount = 0;
      
      for (const [key, value] of Object.entries(parsedState)) {
        try {
          // Check if value is different before writing
          const existingValue = calcService.getValue(key, true); // true = get as-is from model
          const valueStr = value !== null && value !== undefined ? String(value) : '';
          const existingValueStr = existingValue !== null && existingValue !== undefined ? String(existingValue) : '';
          
          // Only write if value actually changed
          if (valueStr !== existingValueStr) {
            await calcService.setValue(key, value, true); // true = dontSaveStateToStorage
            restoredCount++;
          } else {
            skippedCount++;
          }
        } catch (error) {
          // If getValue fails (cell doesn't exist yet), write it anyway
          try {
            await calcService.setValue(key, value, true);
            restoredCount++;
          } catch (setError) {
            console.warn(`Failed to restore value ${key}:`, setError);
          }
        }
      }
      
      if (restoredCount > 0 || skippedCount > 0) {
        console.log(`✅ Model state restored: ${restoredCount} cells updated, ${skippedCount} cells skipped (unchanged)`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse or restore model_state:', error);
    }
  }
  
  // Write individual tlInput values (these override model_state if they differ)
  const tlInputQuestions = questionToSend.filter(q => q.startsWith('tlInput'));
  let restoredCount = 0;
  
  for (const question of tlInputQuestions) {
    if (values[question] !== undefined && values[question] !== null && values[question] !== '') {
      const value = values[question];
      
      // Skip error values like #N/A
      const isErrorValue = typeof value === 'string' && value.startsWith('#');
      if (!isErrorValue) {
        try {
          // Only write if value actually changed
          const existingValue = calcService.getValue(question, true);
          if (existingValue !== value) {
            promises.push(
              calcService.setValue(question, value, true).then(() => {
                restoredCount++;
                console.log(`🔄 Restored tlInput ${question} = "${value}" from backend (override)`);
              })
            );
          }
        } catch (error) {
          console.warn(`Failed to restore tlInput ${question}:`, error);
        }
      }
    }
  }
  
  await Promise.all(promises);
  
  if (restoredCount > 0) {
    console.log(`✅ Restored ${restoredCount} tlInput values from backend (these override model_state)`);
  }
}

