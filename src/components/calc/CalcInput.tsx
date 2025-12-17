import { useState, useEffect, useCallback } from 'react';
import { useCalc } from '@/contexts/CalcContext';
import { Input } from '@/components/ui/input';

export interface CalcInputProps {
  refName: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  ariaLabel?: string;
  label?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
}

export const CalcInput = ({
  refName,
  placeholder = '',
  readOnly = false,
  className = '',
  ariaLabel,
  label,
  onChange,
  onSave,
}: CalcInputProps) => {
  const { getValue, setValue } = useCalc();
  const [text, setText] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [initialValue, setInitialValue] = useState<string>('');

  // Helper to detect placeholder values
  const isPlaceholderValue = useCallback((value: string): boolean => {
    return value === '0' || 
           value === '' || 
           value.toLowerCase() === 'enter text' ||
           value.toLowerCase() === 'enter team name';
  }, []);

  // Load initial value from CalcModel
  useEffect(() => {
    const loadInitialValue = () => {
      const value = getValue(refName);
      // Convert to string, handling null/undefined
      const valueStr = value != null ? String(value) : '';
      setInitialValue(valueStr);
      
      // If the value is a placeholder, show empty text
      if (isPlaceholderValue(valueStr)) {
        setText('');
      } else {
        setText(valueStr);
      }
      setIsDirty(false);
    };

    loadInitialValue();
  }, [refName, getValue, isPlaceholderValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    setIsDirty(true);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const saveDataToModel = () => {
    if (!isDirty) return;

    let valueToSave = text;
    
    // If text is empty, save the initial placeholder value
    if (!text || text.trim() === '') {
      valueToSave = isPlaceholderValue(initialValue) ? initialValue : '';
    }

    setValue(refName, valueToSave);
    setIsDirty(false);

    if (onSave) {
      onSave(valueToSave);
    }
  };

  const handleBlur = () => {
    saveDataToModel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveDataToModel();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <Input
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={readOnly}
        className={`bg-gray-100 border-gray-300 text-gray-900 font-mono text-sm ${className}`}
        aria-label={ariaLabel || label || refName}
      />
    </div>
  );
};
