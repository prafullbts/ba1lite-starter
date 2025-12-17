/**
 * TEMPORARY FORMATTING UTILITIES
 * 
 * These functions are temporary stopgaps until all values are connected 
 * to the calc engine via tlOutput references. Once connected, these should
 * be replaced with the CalcValue component.
 * 
 * @deprecated Use CalcValue component once tlOutput references are available
 */

/**
 * Format a number as smart currency (B/M/K notation)
 * This mirrors the 'currency-smart' format from CalcValue.tsx
 * 
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted currency string with B/M/K suffix
 */
export const formatSmartCurrency = (value: number, decimals: number = 1): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
