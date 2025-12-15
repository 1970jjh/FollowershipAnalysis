export interface Question {
  id: number;
  text: string;
  type: 'A' | 'B';
}

export interface UserInfo {
  name: string;
  company: string;
}

export interface FollowershipType {
  name: string;
  english: string;
  description?: string;
  color?: string;
}

export interface AnalysisResult {
  type: FollowershipType;
  scoreA: number;
  scoreB: number;
  reportHTML: string;
  answersA: number[];
  answersB: number[];
}

export interface GeminiResponse {
  success: boolean;
  report?: string;
  error?: string;
}