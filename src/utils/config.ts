export interface AppConfig {
  apiBaseUrl: string;
  connectToPulse?: boolean;
  eventTitle?: string;
  questionToSend?: string[];
}

let cachedConfig: AppConfig | null = null;

export const loadConfig = async (): Promise<AppConfig> => {
  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    
    const config: AppConfig = await response.json();
    
    // Cache the config
    cachedConfig = config;
    
    return config;
  } catch (error) {
    console.error('Failed to load config, using defaults:', error);
    
    // Fallback to default config
    const defaultConfig: AppConfig = {
      apiBaseUrl: 'https://isomerstage.btspulse.com/Wizer/Cloudfront',
      connectToPulse: false,
      eventTitle: '',
      questionToSend: ['model_state']
    };
    
    cachedConfig = defaultConfig;
    return defaultConfig;
  }
};

// Helper to get just the API base URL
export const getApiBaseUrl = async (): Promise<string> => {
  const config = await loadConfig();
  return config.apiBaseUrl;
};

// Helper to get questionToSend from config
export const getQuestionToSend = async (): Promise<string[]> => {
  const config = await loadConfig();
  return config.questionToSend || ['model_state'];
};

// Reset cache (useful for testing or config updates)
export const resetConfigCache = (): void => {
  cachedConfig = null;
};
