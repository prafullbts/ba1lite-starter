import axios from 'axios';
import { getApiBaseUrl } from '@/utils/config';
import { isProduction } from '@/utils/env';

// Create axios instance - baseURL will be set dynamically
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This handles cookies automatically
});

// Initialize the API client with config
let isInitialized = false;

const initializeApiClient = async () => {
  if (!isInitialized) {
    try {
      const baseURL = await getApiBaseUrl();
      apiClient.defaults.baseURL = baseURL;
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize API client with config:', error);
      // Continue with default behavior if config fails
    }
  }
};

// Connection status tracking
type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';
let connectionStatus: ConnectionStatus = 'unknown';
let connectionStatusListeners: Set<(status: ConnectionStatus) => void> = new Set();

export const getConnectionStatus = (): ConnectionStatus => connectionStatus;

export const subscribeToConnectionStatus = (callback: (status: ConnectionStatus) => void) => {
  connectionStatusListeners.add(callback);
  return () => {
    connectionStatusListeners.delete(callback);
  };
};

const setConnectionStatus = (status: ConnectionStatus) => {
  connectionStatus = status;
  connectionStatusListeners.forEach(callback => callback(status));
};

export const saveState = async (flattenedData: Record<string, string>) => {
  try {
    // Ensure API client is initialized with config
    await initializeApiClient();
    
    const jsonString = JSON.stringify(flattenedData);
    
    const response = await apiClient.post('/RetainState', {
      jsonString: jsonString
    });

    if (isProduction()) {
      setConnectionStatus('connected');
    }
    return response.data;
  } catch (error) {
    console.error('Error saving state:', error);
    if (isProduction()) {
      setConnectionStatus('disconnected');
    }
    throw error;
  }
};

export const loadState = async (questions: string[]) => {
  try {
    // Ensure API client is initialized with config
    await initializeApiClient();
    
    const response = await apiClient.post('/LoadState', {
      questions: questions
    });

    if (isProduction()) {
      setConnectionStatus('connected');
    }
    return response.data;
  } catch (error) {
    console.error('Error loading state:', error);
    if (isProduction()) {
      setConnectionStatus('disconnected');
    }
    throw error;
  }
};

// Check if backend is available (lightweight check)
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    await initializeApiClient();
    
    // Use HEAD request for lightweight availability check
    const response = await fetch(apiClient.defaults.baseURL || '', {
      method: 'HEAD',
      credentials: 'include',
    });
    
    const isAvailable = response.ok;
    if (isProduction()) {
      setConnectionStatus(isAvailable ? 'connected' : 'disconnected');
    }
    return isAvailable;
  } catch (error) {
    console.error('Backend availability check failed:', error);
    if (isProduction()) {
      setConnectionStatus('disconnected');
    }
    return false;
  }
};
