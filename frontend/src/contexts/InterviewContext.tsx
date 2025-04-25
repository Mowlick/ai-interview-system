import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmotionScores } from '../services/emotionAnalysis';

interface InterviewData {
  currentEmotions: EmotionScores;
  emotionHistory: EmotionScores[];
  overallScore: number;
  audioAnalysis: {
    confidence: number;
    clarity: number;
    pace: number;
  };
  interviewDuration: number;
  isInterviewActive: boolean;
}

interface InterviewContextType {
  interviewData: InterviewData;
  updateEmotions: (emotions: EmotionScores) => void;
  updateAudioAnalysis: (analysis: { confidence: number; clarity: number; pace: number }) => void;
  startInterview: () => void;
  endInterview: () => void;
  resetInterviewData: () => void;
}

const defaultInterviewData: InterviewData = {
  currentEmotions: {
    confidence: 0,
    nervousness: 0,
    anxiety: 0,
    happiness: 0,
    neutral: 0,
  },
  emotionHistory: [],
  overallScore: 0,
  audioAnalysis: {
    confidence: 0,
    clarity: 0,
    pace: 0,
  },
  interviewDuration: 0,
  isInterviewActive: false,
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interviewData, setInterviewData] = useState<InterviewData>(defaultInterviewData);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (interviewData.isInterviewActive && startTime) {
      timer = setInterval(() => {
        setInterviewData(prev => ({
          ...prev,
          interviewDuration: Math.floor((Date.now() - startTime) / 1000),
        }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [interviewData.isInterviewActive, startTime]);

  const calculateOverallScore = (emotions: EmotionScores, audio: typeof defaultInterviewData.audioAnalysis) => {
    const emotionScore = (
      emotions.confidence * 0.3 +
      (100 - emotions.nervousness) * 0.2 +
      (100 - emotions.anxiety) * 0.2 +
      emotions.happiness * 0.15 +
      emotions.neutral * 0.15
    );

    const audioScore = (
      audio.confidence * 0.4 +
      audio.clarity * 0.4 +
      audio.pace * 0.2
    );

    return Math.round((emotionScore * 0.7 + audioScore * 0.3));
  };

  const updateEmotions = (emotions: EmotionScores) => {
    setInterviewData(prev => {
      const newEmotionHistory = [...prev.emotionHistory, emotions];
      const overallScore = calculateOverallScore(emotions, prev.audioAnalysis);
      
      return {
        ...prev,
        currentEmotions: emotions,
        emotionHistory: newEmotionHistory,
        overallScore,
      };
    });
  };

  const updateAudioAnalysis = (analysis: { confidence: number; clarity: number; pace: number }) => {
    setInterviewData(prev => {
      const overallScore = calculateOverallScore(prev.currentEmotions, analysis);
      
      return {
        ...prev,
        audioAnalysis: analysis,
        overallScore,
      };
    });
  };

  const startInterview = () => {
    setStartTime(Date.now());
    setInterviewData(prev => ({
      ...prev,
      isInterviewActive: true,
    }));
  };

  const endInterview = () => {
    setInterviewData(prev => ({
      ...prev,
      isInterviewActive: false,
    }));
    setStartTime(null);
  };

  const resetInterviewData = () => {
    setInterviewData(defaultInterviewData);
    setStartTime(null);
  };

  const value = {
    interviewData,
    updateEmotions,
    updateAudioAnalysis,
    startInterview,
    endInterview,
    resetInterviewData,
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

export default InterviewContext; 