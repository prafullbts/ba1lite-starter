/**
 * Check if the app is running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD || import.meta.env.MODE === 'production';
};

