from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, JSON, Float, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    interviews = relationship("Interview", back_populates="interviewer")
    feedback = relationship("InterviewFeedback", back_populates="user")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String)
    candidate_email = Column(String)
    position = Column(String)
    status = Column(String)  # scheduled, in_progress, completed
    scheduled_at = Column(DateTime)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    interviewer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    interviewer = relationship("User", back_populates="interviews")
    emotions = relationship("EmotionData", back_populates="interview")
    questions = relationship("Question", back_populates="interview")
    feedback = relationship("InterviewFeedback", back_populates="interview")

class EmotionData(Base):
    __tablename__ = "emotion_data"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    timestamp = Column(DateTime, server_default=func.now())
    emotion_data = Column(JSON)  # Store emotion analysis results
    confidence = Column(Float)

    interview = relationship("Interview", back_populates="emotions")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    question_text = Column(String)
    category = Column(String)
    difficulty = Column(String)
    answer = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    interview = relationship("Interview", back_populates="questions")

class InterviewFeedback(Base):
    __tablename__ = "interview_feedback"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    technical_rating = Column(Integer)
    communication_rating = Column(Integer)
    problem_solving_rating = Column(Integer)
    overall_rating = Column(Integer)
    strengths = Column(String)
    weaknesses = Column(String)
    comments = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    interview = relationship("Interview", back_populates="feedback")
    user = relationship("User", back_populates="feedback") 