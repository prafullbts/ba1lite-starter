import { useCalcValue } from '../../hooks/useCalcValue';

export interface CalcValueProps {
  refName: string;
  format?: 'currency' | 'currency-clean' | 'currency-smart' | 'percentage' | 'number' | 'number-k' | 'number-m' | 'number-plain' | 'text';
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  fallback?: string;
}

export const CalcValue = ({
  refName,
  format = 'text',
  prefix = '',
  suffix = '',
  decimals = 2,
  className = '',
  fallback = '0'
}: CalcValueProps) => {
  const value = useCalcValue(refName);

  const formatValue = (value: string): string => {
    if (!value || value === '0' || value === '#N/A' || value === 'N/A') return fallback;

    // Convert to string and remove thousands separators (commas) before parsing
    const stringValue = String(value);
    const cleanValue = stringValue.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue)) {
      return stringValue;
    }

    switch (format) {
      case 'currency':
        return `${prefix}$${(numValue / 1000000).toFixed(decimals)}m${suffix}`;
      case 'currency-clean':
        return `${prefix}$${(numValue / 1000000).toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}M${suffix}`;
      case 'currency-smart':
        const absValue = Math.abs(numValue);
        if (absValue >= 1000000000) {
          return `${prefix}$${(numValue / 1000000000).toLocaleString(undefined, { 
            minimumFractionDigits: 1,
            maximumFractionDigits: 1 
          })}B${suffix}`;
        } else if (absValue >= 1000000) {
          return `${prefix}$${(numValue / 1000000).toLocaleString(undefined, { 
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals 
          })}M${suffix}`;
        } else if (absValue >= 1000) {
          return `${prefix}$${(numValue / 1000).toLocaleString(undefined, { 
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals 
          })}K${suffix}`;
        } else {
          return `${prefix}$${numValue.toLocaleString(undefined, { 
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals 
          })}${suffix}`;
        }
      case 'percentage':
        return `${prefix}${(numValue * 100).toFixed(decimals)}%${suffix}`;
      case 'number':
        return `${prefix}${numValue.toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}${suffix}`;
      case 'number-k':
        return `${prefix}${(numValue / 1000).toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}K${suffix}`;
      case 'number-m':
        return `${prefix}${(numValue / 1000000).toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}M${suffix}`;
      case 'number-plain':
        return `${prefix}${numValue.toLocaleString(undefined, { 
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals 
        })}${suffix}`;
      default:
        return `${prefix}${value}${suffix}`;
    }
  };

  const formattedValue = formatValue(value);

  return (
    <span className={className}>
      {formattedValue}
    </span>
  );
};
