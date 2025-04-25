import axios from 'axios';
import {
  User,
  Interview,
  EmotionData,
  Question,
  InterviewFeedback,
  Report,
} from '../types';

// Define interfaces for API responses
interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface ErrorResponse {
  detail: string;
}

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = (error.response.data as ErrorResponse).detail || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  }
);

// Auth API
const auth = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/signup', {
        name,
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },
};

// Interview endpoints
export const interviews = {
  getAll: async () => {
    const response = await api.get<Interview[]>('/api/interviews');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Interview>(`/api/interviews/${id}`);
    return response.data;
  },
  create: async (interview: Omit<Interview, 'id'>) => {
    const response = await api.post<Interview>('/api/interviews', interview);
    return response.data;
  },
  update: async (id: string, interview: Partial<Interview>) => {
    const response = await api.put<Interview>(`/api/interviews/${id}`, interview);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/api/interviews/${id}`);
  },
};

// Emotion analysis endpoints
export const emotionAnalysis = {
  getEmotions: async (interviewId: string) => {
    const response = await api.get<EmotionData[]>(`/api/emotions/${interviewId}`);
    return response.data;
  },
  getRealTimeEmotions: async (interviewId: string) => {
    const response = await api.get<EmotionData>(`/api/emotions/${interviewId}/realtime`);
    return response.data;
  },
};

// Questions endpoints
export const questions = {
  getAll: async () => {
    const response = await api.get<Question[]>('/api/questions');
    return response.data;
  },
  generateQuestions: async (candidateProfile: any, emotionalState: any) => {
    const response = await api.post<Question[]>('/api/questions/generate', {
      candidateProfile,
      emotionalState,
    });
    return response.data;
  },
};

// Feedback endpoints
export const feedback = {
  submit: async (feedback: Omit<InterviewFeedback, 'id'>) => {
    const response = await api.post<InterviewFeedback>('/api/feedback', feedback);
    return response.data;
  },
  getByInterview: async (interviewId: string) => {
    const response = await api.get<InterviewFeedback>(`/api/feedback/${interviewId}`);
    return response.data;
  },
};

// Reports endpoints
export const reports = {
  getAll: async () => {
    const response = await api.get<Report[]>('/api/reports');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Report>(`/api/reports/${id}`);
    return response.data;
  },
  generate: async (interviewId: string) => {
    const response = await api.post<Report>(`/api/reports/generate/${interviewId}`);
    return response.data;
  },
  export: async (id: string, format: 'pdf' | 'csv') => {
    const response = await api.get(`/api/reports/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Export the API instance and auth methods
export { api, auth };
export type { User, AuthResponse, ErrorResponse }; 