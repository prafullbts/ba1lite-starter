import React, { useEffect } from 'react';
import { initializeColorTheme } from '../Sim/colors';

/**
 * ColorThemeInitializer - Injects dynamic color variables into CSS
 * This component should be rendered once at the app level to initialize the color system
 */
export function ColorThemeInitializer() {
  useEffect(() => {
    initializeColorTheme();
  }, []);

  // This component doesn't render anything visible
  return null;
}