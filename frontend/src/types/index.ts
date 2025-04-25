export interface User {
  id: string;
  email: string;
  name: string;
  role: 'interviewer' | 'candidate' | 'admin';
  avatar?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  type: 'technical' | 'behavioral' | 'mixed';
  duration: number;
  feedback?: string;
  rating?: number;
}

export interface EmotionData {
  timestamp: string;
  confidence: number;
  anxiety: number;
  nervousness: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  followUpQuestions?: string[];
}

export interface InterviewFeedback {
  interviewId: string;
  candidateId: string;
  interviewerId: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  comments: string;
  emotionAnalysis: {
    averageConfidence: number;
    averageAnxiety: number;
    averageNervousness: number;
    emotionalTrends: EmotionData[];
  };
}

export interface Report {
  id: string;
  interviewId: string;
  candidateId: string;
  interviewerId: string;
  date: string;
  type: 'technical' | 'behavioral' | 'comprehensive';
  metrics: {
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    overallScore: number;
    emotionalMetrics: {
      confidence: number;
      anxiety: number;
      nervousness: number;
    };
  };
  feedback: string;
  recommendations: string[];
} 