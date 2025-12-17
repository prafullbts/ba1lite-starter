/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    // Clear previous timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Creates a debounced function that returns a promise
 * Useful for async operations like API calls
 * 
 * @param func The async function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function that returns a promise
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingResolve: ((value: ReturnType<T>) => void) | null = null;
  let pendingReject: ((error: any) => void) | null = null;

  return function debouncedAsync(...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      // Cancel previous timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // Silently resolve previous promise if it exists (cancellation is expected behavior)
      // This prevents uncaught promise rejections in the console
      if (pendingResolve) {
        // Resolve with undefined to indicate cancellation, but don't throw error
        // The caller can ignore this if they want
        pendingResolve(undefined as ReturnType<T>);
      }
      
      pendingResolve = resolve;
      pendingReject = reject;

      // Set new timeout
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          if (pendingResolve) {
            pendingResolve(result);
          }
        } catch (error) {
          if (pendingReject) {
            pendingReject(error);
          }
        } finally {
          timeoutId = null;
          pendingResolve = null;
          pendingReject = null;
        }
      }, wait);
    });
  };
}

