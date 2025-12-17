import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { CalcService } from '../services/calc.service';
import { ModelLoaderService } from '../services/model-loader.service';

interface CalcContextType {
  calcService: CalcService | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  getValue: (refName: string, rawValue?: boolean) => string;
  setValue: (refName: string, value: any, componentName?: string) => Promise<void>;
  getValueForYear: (refName: string, yearRef?: string, rawValue?: boolean) => string;
  setValueForYear: (refName: string, value: any, yearRef: string, componentName?: string) => Promise<void>;
  reinitialize: () => Promise<void>;
  // Add a trigger to force re-renders
  forceUpdate: () => void;
}

const CalcContext = createContext<CalcContextType | undefined>(undefined);

interface CalcProviderProps {
  children: ReactNode;
}

export const CalcProvider: React.FC<CalcProviderProps> = ({ children }) => {
  const [calcService, setCalcService] = useState<CalcService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const initializeCalcService = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsInitialized(false);

      // Clean up existing service
      if (calcService) {
        calcService.destroy();
        setCalcService(null);
      }

      // Initialize model loader
      const modelLoader = new ModelLoaderService();
      const modelData = await modelLoader.getModel();

      // Create build options from the model data
      const buildOptions = {
        courseActions: modelData.customActions,
        model: modelData.model
      };

      // Initialize calc service
      const service = new CalcService();
      await service.getApi(buildOptions);

      setCalcService(service);
      setIsInitialized(true);
      
      // Set up event listeners for value changes
      setupValueChangeListeners(service);
    } catch (err) {
      console.error('Failed to initialize calc service:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupValueChangeListeners = (service: CalcService) => {
    // Listen for calculation complete events
    const communicator = service.getObservable();
    if (communicator) {
      communicator.on('MODEL_CALC_COMPLETE', () => {
        // Trigger re-render when calculations complete
        setUpdateTrigger(prev => prev + 1);
      });
    }
  };

  const reinitialize = async () => {
    await initializeCalcService();
  };

  useEffect(() => {
    initializeCalcService();

    // Cleanup on unmount
    return () => {
      if (calcService) {
        calcService.destroy();
      }
    };
  }, []);

  const getValue = (refName: string, rawValue?: boolean): string => {
    if (!calcService || !isInitialized) {
      return '0';
    }
    return calcService.getValue(refName, rawValue);
  };

  const setValue = async (refName: string, value: any, componentName?: string): Promise<void> => {
    if (!calcService || !isInitialized) {
      throw new Error('Calc service not initialized');
    }
    await calcService.setValue(refName, value, false, null, componentName, false);
    // Trigger re-render after setting value
    setUpdateTrigger(prev => prev + 1);
  };

  const getValueForYear = (refName: string, yearRef?: string, rawValue?: boolean): string => {
    if (!calcService || !isInitialized) {
      return '0';
    }
    return calcService.getValueForYear(refName, yearRef, rawValue);
  };

  const setValueForYear = async (refName: string, value: any, yearRef: string, componentName?: string): Promise<void> => {
    if (!calcService || !isInitialized) {
      throw new Error('Calc service not initialized');
    }
    await calcService.setValueForYear(refName, value, yearRef, componentName, false);
    // Trigger re-render after setting value
    setUpdateTrigger(prev => prev + 1);
  };

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const value: CalcContextType = {
    calcService,
    isInitialized,
    isLoading,
    error,
    getValue,
    setValue,
    getValueForYear,
    setValueForYear,
    reinitialize,
    forceUpdate,
  };

  return (
    <CalcContext.Provider value={value}>
      {children}
    </CalcContext.Provider>
  );
};

export const useCalc = (): CalcContextType => {
  const context = useContext(CalcContext);
  if (context === undefined) {
    throw new Error('useCalc must be used within a CalcProvider');
  }
  return context;
};
