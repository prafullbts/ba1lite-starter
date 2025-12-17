import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { CalcValue, CalcValueProps } from './CalcValue';
import { useCalc } from '@/contexts/CalcContext';

interface ChangeState {
  type: 'increase' | 'decrease';
  visible: boolean;
}

const HIDE_ARROWS_EVENT = 'HIDE_ARROWS';
const ARROW_VISIBILITY_DURATION = 3000; // 3 seconds

export interface CalcValueChangesProps extends CalcValueProps {
  /** Optional className for the arrow container */
  arrowClassName?: string;
  /** 
   * When true, reverses the color logic: up arrow = red (bad), down arrow = blue (good).
   * Use this for metrics where negative values are good and positive values are bad.
   * @default false
   */
  reversed?: boolean;
}

/**
 * CalcValueChanges component that displays a CalcValue with change indicators (up/down arrows).
 * Tracks changes automatically and shows arrows when values increase or decrease.
 * Arrows automatically hide after 3 seconds or when HIDE_ARROWS event is triggered.
 */
export const CalcValueChanges = ({
  refName,
  arrowClassName = '',
  reversed = false,
  ...calcValueProps
}: CalcValueChangesProps) => {
  const { getValue, calcService, isInitialized } = useCalc();
  const [change, setChange] = useState<ChangeState | null>(null);
  const previousValueRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout helper
  const clearHideTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Hide arrow helper
  const hideArrow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setChange(prev => prev ? { ...prev, visible: false } : null);
  }, []);

  // Show arrow helper
  const showArrow = useCallback((type: 'increase' | 'decrease') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setChange({ type, visible: true });
    
    // Auto-hide after duration
    timeoutRef.current = setTimeout(() => {
      setChange(prev => prev ? { ...prev, visible: false } : null);
    }, ARROW_VISIBILITY_DURATION);
  }, []);

  // Listen for calculation completion to detect changes
  useEffect(() => {
    if (!isInitialized || !calcService) return;

    const communicator = calcService.getObservable();
    if (!communicator) return;

    const handleCalcComplete = () => {
      const value = getValue(refName, true); // Get raw value
      const currentValue = parseFloat(value) || 0;
      const previousValue = previousValueRef.current;

      // Only show arrow if we have a previous value and it changed
      if (previousValue !== undefined && currentValue !== previousValue) {
        const changeType = currentValue > previousValue ? 'increase' : 'decrease';
        showArrow(changeType);
      }

      // Update previous value for next comparison
      previousValueRef.current = currentValue;
    };

    communicator.on('MODEL_CALC_COMPLETE', handleCalcComplete);

    // Initialize previous value on mount
    const initialValue = getValue(refName, true);
    previousValueRef.current = parseFloat(initialValue) || 0;

    return () => {
      communicator.off('MODEL_CALC_COMPLETE', handleCalcComplete);
    };
  }, [isInitialized, calcService, refName, getValue, showArrow]);

  // Listen for HIDE_ARROWS event to hide arrows on demand
  useEffect(() => {
    if (!isInitialized || !calcService) return;

    const communicator = calcService.getObservable();
    if (!communicator) return;

    const handleHideArrows = () => {
      hideArrow();
    };

    communicator.on(HIDE_ARROWS_EVENT, handleHideArrows);

    return () => {
      communicator.off(HIDE_ARROWS_EVENT, handleHideArrows);
    };
  }, [isInitialized, calcService, hideArrow]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 min-w-0">
      {/* Spacer to maintain layout when arrow is hidden */}
      <div className="w-4 h-4 opacity-0" aria-hidden="true" />
      
      <CalcValue refName={refName} {...calcValueProps} />
      
      {/* Arrow indicator */}
      <div className={`w-4 h-4 transition-opacity duration-200 shrink-0 ${arrowClassName} ${
        change?.visible ? 'opacity-100' : 'opacity-0'
      } ${
        // When reversed: increase (up) = red (bad), decrease (down) = blue (good)
        // When normal: increase (up) = blue (good), decrease (down) = red (bad)
        reversed
          ? (change?.type === 'increase' ? 'text-[#E70865]' : 'text-[#008AD8]')
          : (change?.type === 'increase' ? 'text-[#008AD8]' : 'text-[#E70865]')
      }`}>
        {change?.type === 'increase' ? (
          <ChevronUp className="w-4 h-4" strokeWidth={3} />
        ) : (
          <ChevronDown className="w-4 h-4" strokeWidth={3} />
        )}
      </div>
    </div>
  );
};

/**
 * Utility function to trigger HIDE_ARROWS event from anywhere in the app.
 * This allows coordinated hiding of all arrow indicators.
 * 
 * @param calcService - The CalcService instance from useCalc hook
 * @example
 * const { calcService } = useCalc();
 * hideAllArrows(calcService);
 */
export const hideAllArrows = (calcService: any) => {
  if (!calcService) return;
  
  const communicator = calcService.getObservable();
  if (communicator) {
    communicator.trigger(HIDE_ARROWS_EVENT);
  }
};

