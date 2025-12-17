export enum AppTab {
  CHAT = 'CHAT',
  LIVE = 'LIVE',
  IMAGE = 'IMAGE',
  STATS = 'STATS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 string
  timestamp: number;
}

export interface ImageGenerationResult {
  url: string;
  prompt: string;
}

export interface UsageMetric {
  name: string;
  tokens: number;
  requests: number;
}
