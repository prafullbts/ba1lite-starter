/**
 * Chart Utility Functions
 * 
 * Functions for calculating nice tick values and formatting chart axes.
 */

/**
 * Find a "nice" number approximately equal to the input value.
 * Nice numbers are 1, 2, or 5 multiplied by a power of 10.
 * 
 * @param value - The raw value to round
 * @param round - Whether to round up (true) or down (false)
 * @returns A "nice" number close to the input value
 * 
 * @example
 * getNiceNumber(1234, true) // returns 2000
 * getNiceNumber(6789, true) // returns 10000
 * getNiceNumber(0.042, true) // returns 0.05
 */
export const getNiceNumber = (value: number, round: boolean): number => {
  // Handle edge case of zero
  if (value === 0) return 0;
  
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const fraction = Math.abs(value) / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    // Round up to nearest nice fraction
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    // Round down to nearest nice fraction
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent) * (value < 0 ? -1 : 1);
};

/**
 * Calculate evenly-spaced "nice" tick values for a chart axis.
 * 
 * @param min - Minimum data value
 * @param max - Maximum data value
 * @param maxTicks - Target number of ticks (default: 5)
 * @returns Object containing ticks array, min, max, and interval
 * 
 * @example
 * calculateNiceTicks(1234, 8765, 5)
 * // returns { ticks: [0, 2000, 4000, 6000, 8000, 10000], min: 0, max: 10000, interval: 2000 }
 */
export const calculateNiceTicks = (
  min: number,
  max: number,
  maxTicks: number = 5
): {
  ticks: number[];
  min: number;
  max: number;
  interval: number;
} => {
  // Handle edge case where min equals max
  if (min === max) {
    const padding = Math.abs(max) * 0.1 || 1;
    min = max - padding;
    max = max + padding;
  }

  const range = max - min;
  const roughInterval = range / (maxTicks - 1);
  const niceInterval = getNiceNumber(roughInterval, true);
  
  const niceMin = Math.floor(min / niceInterval) * niceInterval;
  const niceMax = Math.ceil(max / niceInterval) * niceInterval;
  
  const ticks: number[] = [];
  for (let tick = niceMin; tick <= niceMax + niceInterval * 0.001; tick += niceInterval) {
    // Round to avoid floating point errors
    const roundedTick = Math.round(tick / niceInterval) * niceInterval;
    ticks.push(roundedTick);
  }
  
  return {
    ticks,
    min: niceMin,
    max: niceMax,
    interval: niceInterval
  };
};
