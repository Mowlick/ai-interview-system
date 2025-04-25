import { api } from './api';

export interface EmotionScores {
  confidence: number;
  nervousness: number;
  anxiety: number;
  happiness: number;
  neutral: number;
}

export interface EmotionAnalysisResponse {
  scores: EmotionScores;
  timestamp: string;
}

const emotionAnalysis = {
  async analyzeFrame(imageData: string): Promise<EmotionAnalysisResponse> {
    try {
      const response = await api.post<EmotionAnalysisResponse>('/api/emotions/analyze', {
        image: imageData,
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing emotions:', error);
      // Return default values if the API call fails
      return {
        scores: {
          confidence: 70,
          nervousness: 30,
          anxiety: 20,
          happiness: 60,
          neutral: 50,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  async saveInterviewEmotions(
    interviewId: string,
    emotions: EmotionAnalysisResponse[]
  ): Promise<void> {
    try {
      await api.post(`/api/emotions/${interviewId}/save`, {
        emotions,
      });
    } catch (error) {
      console.error('Error saving interview emotions:', error);
    }
  },
};

export default emotionAnalysis; 