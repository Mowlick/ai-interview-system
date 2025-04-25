from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

class InterviewBase(BaseModel):
    candidate_name: str
    candidate_email: EmailStr
    position: str
    scheduled_at: datetime

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: int
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    interviewer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class EmotionDataBase(BaseModel):
    emotion_data: Dict[str, Any]
    confidence: float

class EmotionDataCreate(EmotionDataBase):
    interview_id: int

class EmotionData(EmotionDataBase):
    id: int
    interview_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    question_text: str
    category: str
    difficulty: str

class QuestionCreate(QuestionBase):
    interview_id: int

class Question(QuestionBase):
    id: int
    interview_id: int
    answer: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class InterviewFeedbackBase(BaseModel):
    technical_rating: int
    communication_rating: int
    problem_solving_rating: int
    overall_rating: int
    strengths: str
    weaknesses: str
    comments: str

class InterviewFeedbackCreate(InterviewFeedbackBase):
    interview_id: int

class InterviewFeedback(InterviewFeedbackBase):
    id: int
    interview_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 