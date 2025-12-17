import React, { useState, useEffect, useCallback } from 'react';
import { useCalc } from '@/contexts/CalcContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface CalcRadioProps {
  /** CalcModel range name for this radio group */
  refName: string;
  /** Array of display text for radio options */
  items?: string[];
  /** Array of model values corresponding to each item (defaults to items if not provided) */
  modelValues?: any[];
  /** Array of disabled states for each option */
  disabledItems?: boolean[];
  /** Reference to a CalcModel range that contains the list of items */
  listRef?: string;
  /** Reference to a CalcModel range that contains the model values */
  modelValuesRef?: string;
  /** Whether the entire radio group is disabled */
  disabled?: boolean;
  /** Custom name for the radio group (defaults to refName) */
  radioName?: string;
  /** Custom CSS class name */
  className?: string;
  /** Year reference for year-specific values */
  yearRef?: string;
  /** Scene ID for text service (if needed) */
  sceneId?: string;
  /** Callback when selection changes */
  onChange?: (value: any) => void;
}

export const CalcRadio: React.FC<CalcRadioProps> = ({
  refName,
  items = [],
  modelValues = [],
  disabledItems = [],
  listRef,
  modelValuesRef,
  disabled = false,
  radioName,
  className = '',
  yearRef,
  sceneId,
  onChange
}) => {
  const { getValue, setValue } = useCalc();
  
  // State for processed items and model values
  const [_items, setItems] = useState<string[]>([]);
  const [_modelValues, setModelValues] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDisabled, setIsDisabled] = useState(disabled);

  // Process items from various sources
  const processItems = useCallback(() => {
    let processedItems: string[] = [];
    let processedModelValues: any[] = [];

    // Get items from listRef if provided
    if (listRef) {
      try {
        const optionsFromModel = getValue(listRef, true);
        if (optionsFromModel && Array.isArray(optionsFromModel)) {
          optionsFromModel.forEach((element: any) => {
            if (Array.isArray(element) && element.length > 0) {
              processedItems.push(String(element[0]));
            } else {
              processedItems.push(String(element));
            }
          });
        }
      } catch (error) {
        console.error(`Error getting items from listRef ${listRef}:`, error);
      }
    } else if (items && items.length > 0) {
      // Use provided items
      items.forEach((val: string) => {
        let itemName: string = '';
        
        // Check if it's a CalcModel reference
        if (val.indexOf('tlInput') !== -1 || val.indexOf('tlOutput') !== -1) {
          try {
            itemName = String(getValue(val, true) || val);
          } catch (error) {
            console.error(`Error getting value for ${val}:`, error);
            itemName = val;
          }
        } else {
          // Use as direct text (in a real implementation, you might want to use a text service)
          itemName = val;
        }
        
        if (itemName) {
          processedItems.push(itemName);
          if (modelValues.length === 0) {
            processedModelValues.push(itemName);
          }
        }
      });
    }

    // Get model values from modelValuesRef if provided
    if (modelValuesRef) {
      try {
        const valuesFromModel = getValue(modelValuesRef, true);
        if (valuesFromModel && Array.isArray(valuesFromModel)) {
          valuesFromModel.forEach((element: any) => {
            if (Array.isArray(element) && element.length > 0) {
              processedModelValues.push(element[0]);
            } else {
              processedModelValues.push(element);
            }
          });
        }
      } catch (error) {
        console.error(`Error getting model values from modelValuesRef ${modelValuesRef}:`, error);
      }
    }

    // Use provided modelValues if available
    if (modelValues && modelValues.length > 0) {
      if (modelValues.length !== processedItems.length) {
        console.error('modelValues length should be equal to items length');
      } else {
        processedModelValues = [...modelValues];
      }
    }

    setItems(processedItems);
    setModelValues(processedModelValues);
  }, [items, modelValues, listRef, modelValuesRef, getValue]);

  // Update selected item from CalcModel
  const onModelUpdate = useCallback(() => {
    try {
      let modelVal: any;
      
      if (yearRef) {
        // For year-specific values, we'd need a getValueForYear method
        // For now, just use regular getValue
        modelVal = getValue(refName, true);
      } else {
        modelVal = getValue(refName, true);
      }
      
      setSelectedItem(modelVal);
    } catch (error) {
      console.error(`Error getting value for ${refName}:`, error);
      setSelectedItem(null);
    }
  }, [refName, yearRef, getValue]);

  // Handle selection change
  const selectionChanged = useCallback(async (value: any) => {
    if (isDisabled) return;
    
    setSelectedItem(value);
    
    try {
      if (yearRef) {
        // For year-specific values, we'd need a setValueForYear method
        // For now, just use regular setValue
        await setValue(refName, value, 'CalcRadio');
      } else {
        await setValue(refName, value, 'CalcRadio');
      }
      
      // Call onChange callback if provided
      if (onChange) {
        onChange(value);
      }
      
      console.log(`CalcRadio ${refName}: Selection changed to:`, value);
    } catch (error) {
      console.error(`Error setting value for ${refName}:`, error);
    }
  }, [refName, yearRef, setValue, isDisabled, onChange]);

  // Initialize component
  useEffect(() => {
    setIsDisabled(disabled);
    processItems();
    onModelUpdate();
  }, [disabled, processItems, onModelUpdate]);

  // Listen for model changes (you might want to implement a more sophisticated subscription system)
  useEffect(() => {
    const interval = setInterval(() => {
      onModelUpdate();
    }, 1000); // Check for changes every second

    return () => clearInterval(interval);
  }, [onModelUpdate]);

  // Generate unique radio group name
  const radioGroupName = radioName || refName;

  return (
    <RadioGroup
      value={selectedItem}
      onValueChange={(value) => selectionChanged(value)}
      className={cn("flex flex-wrap gap-4", className)}
      disabled={isDisabled}
    >
      {_items.map((item, index) => {
        const isItemDisabled = isDisabled || (disabledItems[index] === true);
        const modelValue = _modelValues[index];
        const optionId = `${refName}_option_${index}`;
        
        return (
          <div
            key={index}
            className={cn(
              "flex items-center space-x-2",
              isItemDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <RadioGroupItem
              value={modelValue}
              id={optionId}
              disabled={isItemDisabled}
              className={cn(
                "h-4 w-4",
                isItemDisabled && "cursor-not-allowed"
              )}
            />
            <Label
              htmlFor={optionId}
              className={cn(
                "text-sm font-medium cursor-pointer",
                isItemDisabled && "cursor-not-allowed"
              )}
            >
              {item}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default CalcRadio;
