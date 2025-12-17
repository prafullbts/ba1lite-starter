/**
 * JS REQUIRE CONFIG - ENVIRONMENT CONFIGURATION
 * 
 * ⚠️  WARNING: This file contains critical environment configuration constants.
 * 
 * This file is intended to be modified by developers to configure the application
 * for different environments or when model files change. However, it should NOT
 * be modified during normal development unless you understand the implications.
 * 
 * Changes to these constants may affect:
 * - Model loading and parsing
 * - File paths and resource locations
 * - Environment-specific configurations
 * 
 * Please ensure you understand the impact before making changes.
 */

/**
 * Model Configuration Constants
 */
export const MODEL_CONFIG = {
  /**
   * The name of the main model file to be loaded
   * This file should be located in the public directory
   */
  MODEL_FILE_NAME: 'CMM_BA1Lite_Tool-require.js',
  
  /**
   * The base name of the model (without file extension)
   * Used for model identification and logging
   */
  MODEL_NAME: 'CMM_BA1Lite_Tool-require'
} as const;

/**
 * Environment Configuration
 * Add other environment-specific constants here as needed
 */
export const ENVIRONMENT_CONFIG = {
  // Add other environment constants here
} as const;
