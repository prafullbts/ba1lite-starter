import { useState, useEffect, useCallback } from 'react';
import { useCalc } from '../contexts/CalcContext';

/**
 * Custom hook that returns a calc value and automatically re-renders when it changes
 * @param refName - The reference name for the value
 * @param rawValue - Whether to get raw value instead of formatted
 * @returns The current value
 */
export const useCalcValue = (refName: string, rawValue?: boolean): string => {
  const { getValue, isInitialized, calcService } = useCalc();
  const [value, setValue] = useState<string>('0');

  // Memoize the update function to prevent infinite loops
  const updateValue = useCallback(() => {
    if (isInitialized) {
      const currentValue = getValue(refName, rawValue);
      setValue(prev => {
        // Only update if value actually changed
        if (prev !== currentValue) {
          return currentValue;
        }
        return prev;
      });
    }
  }, [refName, rawValue, isInitialized, getValue]);

  // Initial value setup
  useEffect(() => {
    updateValue();
  }, [updateValue]);

  // Listen for calc service updates via event system
  useEffect(() => {
    if (!isInitialized || !calcService) return;

    const communicator = calcService.getObservable();
    if (communicator) {
      const handleUpdate = () => {
        updateValue();
      };

      communicator.on('MODEL_CALC_COMPLETE', handleUpdate);

      return () => {
        communicator.off('MODEL_CALC_COMPLETE', handleUpdate);
      };
    }
  }, [isInitialized, calcService, updateValue]);

  return value;
};

/**
 * Custom hook that returns multiple calc values and automatically re-renders when any change
 * @param refNames - Array of reference names
 * @param rawValue - Whether to get raw values instead of formatted
 * @returns Object with values keyed by refName
 */
export const useCalcValues = (refNames: string[], rawValue?: boolean): Record<string, string> => {
  const { getValue, isInitialized, calcService } = useCalc();
  const [values, setValues] = useState<Record<string, string>>({});

  // Memoize the update function to prevent infinite loops
  const updateValues = useCallback(() => {
    if (isInitialized) {
      const newValues: Record<string, string> = {};
      refNames.forEach(refName => {
        newValues[refName] = getValue(refName, rawValue);
      });
      
      setValues(prev => {
        // Only update if any value actually changed
        const hasChanges = refNames.some(refName => prev[refName] !== newValues[refName]);
        if (hasChanges) {
          return newValues;
        }
        return prev;
      });
    }
  }, [refNames, rawValue, isInitialized, getValue]);

  // Initial values setup
  useEffect(() => {
    updateValues();
  }, [updateValues]);

  // Listen for calc service updates via event system
  useEffect(() => {
    if (!isInitialized || !calcService) return;

    const communicator = calcService.getObservable();
    if (communicator) {
      const handleUpdate = () => {
        updateValues();
      };

      communicator.on('MODEL_CALC_COMPLETE', handleUpdate);

      return () => {
        communicator.off('MODEL_CALC_COMPLETE', handleUpdate);
      };
    }
  }, [isInitialized, calcService, updateValues]);

  return values;
};
