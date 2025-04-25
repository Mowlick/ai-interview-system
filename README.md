# AI Interview System

An AI-driven Facial Expression-Based Interview Tracking system that analyzes candidates' facial expressions during interviews to assess their emotional state.

## Features

- Real-time facial expression analysis
- AI-powered interview question generation
- Multi-role authentication system
- Interactive dashboard with emotional insights
- Interview scheduling and notifications
- Comprehensive reporting system

## Tech Stack

### Frontend
- React.js
- TypeScript
- Material-UI
- Chart.js for visualizations
- WebRTC for video streaming

### Backend
- Python FastAPI
- OpenCV for facial expression analysis
- TensorFlow for emotion detection
- OpenAI API for question generation
- PostgreSQL database
- JWT authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- PostgreSQL
- OpenAI API key

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_interview
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

## License
MIT License 