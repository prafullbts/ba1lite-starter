import React, { useState, useEffect, useCallback } from 'react';
import { Textarea } from '../ui/textarea';
import { useCalc } from '../../contexts/CalcContext';

export interface CalcTextAreaProps {
  /** The range name in the calc model */
  refName: string;
  /** Placeholder text to display when empty */
  placeholder?: string;
  /** Number of rows for the textarea */
  rows?: number;
  /** Maximum character length */
  maxLength?: number;
  /** Whether the textarea is read-only */
  readOnly?: boolean;
  /** Whether to allow Enter key presses */
  allowEnter?: boolean;
  /** Whether to trim whitespace from the value */
  trimText?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Label text to display above the textarea */
  label?: string;
  /** Whether to replace initial value with placeholder */
  replaceInitialValueWithPlaceholder?: boolean;
  /** Callback when Enter key is pressed */
  onEnterPress?: () => void;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when value is saved to model */
  onSave?: (value: string) => void;
}

export const CalcTextArea = ({
  refName,
  placeholder = 'Enter Text',
  rows = 3,
  maxLength,
  readOnly = false,
  allowEnter = true,
  trimText = false,
  className = '',
  ariaLabel,
  label,
  replaceInitialValueWithPlaceholder = false,
  onEnterPress,
  onChange,
  onSave,
}: CalcTextAreaProps) => {
  const { getValue, setValue } = useCalc();
  const [text, setText] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState<string>('');

  // Helper function to check if a value is a placeholder
  const isPlaceholderValue = useCallback((value: string): boolean => {
    return value === '0' || 
           value === '' || 
           value.toLowerCase() === 'enter text';
  }, []);

  // Load initial value from calc model
  useEffect(() => {
    const loadInitialValue = () => {
      try {
        const value = getValue(refName, true);
        const stringValue = value ? String(value) : '';
        
        setInitialValue(stringValue);
        
        // Handle different value scenarios
        if (isPlaceholderValue(stringValue)) {
          // Show empty text for placeholder values
          console.log(`CalcTextArea ${refName}: Treating "${stringValue}" as placeholder, showing empty text`);
          setText('');
        } else if (replaceInitialValueWithPlaceholder && stringValue === initialValue) {
          // If replaceInitialValueWithPlaceholder is true and current value equals initial value, show empty
          console.log(`CalcTextArea ${refName}: ReplaceInitialValueWithPlaceholder enabled, showing empty text`);
          setText('');
        } else {
          // Show the actual value
          console.log(`CalcTextArea ${refName}: Showing actual value: "${stringValue}"`);
          setText(stringValue);
        }
      } catch (error) {
        console.error(`Error loading initial value for ${refName}:`, error);
        setText('');
      }
    };

    loadInitialValue();
  }, [refName, getValue, replaceInitialValueWithPlaceholder, initialValue]);

  // Handle text changes
  const handleTextChange = useCallback((value: string) => {
    setText(value);
    setIsDirty(true);
    onChange?.(value);
  }, [onChange]);

  // Save data to calc model
  const saveDataToModel = useCallback(() => {
    if (readOnly) return;

    let valueToSave = text;
    
    // Handle empty text - save the initial value (which might be "Enter text", "Enter Text", or "0")
    if (!text || text.trim() === '') {
      // If initial value is a placeholder, keep it as is, otherwise use '0'
      valueToSave = isPlaceholderValue(initialValue) ? initialValue : '0';
      console.log(`CalcTextArea ${refName}: Empty text, saving initial value: "${valueToSave}"`);
    } else {
      valueToSave = text;
      console.log(`CalcTextArea ${refName}: Saving user text: "${valueToSave}"`);
    }

    // Add backtick for values starting with numbers or minus sign
    if (isDirty && (valueToSave.match(/^\d/) || valueToSave[0] === '-')) {
      valueToSave = '`' + valueToSave;
    }

    // Trim text if requested
    if (trimText) {
      valueToSave = valueToSave.trim();
    }

    // Save to calc model
    try {
      setValue(refName, valueToSave, 'CalcTextArea');
      setIsDirty(false);
      onSave?.(valueToSave);
    } catch (error) {
      console.error(`Error saving value for ${refName}:`, error);
    }
  }, [text, initialValue, isDirty, trimText, readOnly, refName, setValue, onSave]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!allowEnter && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onEnterPress?.();
    }
  }, [allowEnter, onEnterPress]);

  // Handle blur event to save data
  const handleBlur = useCallback(() => {
    saveDataToModel();
  }, [saveDataToModel]);

  // Get placeholder text - show "Enter Text" if no value, otherwise show the model value
  const getPlaceholderText = useCallback((): string => {
    if (readOnly) return '';
    return text ? text : placeholder;
  }, [readOnly, text, placeholder]);

  return (
    <div className="calc-textarea-container">
      {label && (
        <label 
          htmlFor={`text-area-${refName}`} 
          className="text-sm font-medium text-foreground mb-2 block"
        >
          {label}
        </label>
      )}
      <div className="calc-textarea-control">
        <Textarea
          id={`text-area-${refName}`}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholderText()}
          rows={rows}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={readOnly}
          aria-label={ariaLabel}
          className={`calc-textarea w-full min-h-[7rem] resize-none ${className} ${readOnly ? 'disabled' : ''}`}
        />
        {maxLength && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {text ? maxLength - text.length : maxLength} characters remaining
          </div>
        )}
      </div>
    </div>
  );
};
