import cv2
import numpy as np
import tensorflow as tf
from typing import Dict, List, Tuple
import os

class EmotionAnalyzer:
    def __init__(self):
        # Load the pre-trained model
        self.model = self._load_model()
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        
    def _load_model(self):
        # TODO: Load your trained emotion detection model
        # For now, we'll use a placeholder
        return None

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess the image for emotion detection."""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )
        
        if len(faces) == 0:
            return None
            
        # Get the first face
        (x, y, w, h) = faces[0]
        face = gray[y:y+h, x:x+w]
        
        # Resize to 48x48
        face = cv2.resize(face, (48, 48))
        
        # Normalize
        face = face.astype('float32') / 255.0
        
        # Reshape for model input
        face = np.expand_dims(face, axis=[0, -1])
        
        return face

    def analyze_emotion(self, frame: np.ndarray) -> Dict[str, float]:
        """Analyze emotions in the given frame."""
        processed_image = self.preprocess_image(frame)
        
        if processed_image is None:
            return {
                'error': 'No face detected',
                'confidence': 0.0
            }
            
        # TODO: Replace with actual model prediction
        # For now, return dummy predictions
        predictions = np.random.rand(7)
        predictions = predictions / np.sum(predictions)
        
        return {
            emotion: float(score)
            for emotion, score in zip(self.emotions, predictions)
        }

    def get_emotional_insights(self, emotions: Dict[str, float]) -> Dict[str, str]:
        """Generate insights based on emotional analysis."""
        insights = {
            'confidence': 'neutral',
            'anxiety': 'low',
            'nervousness': 'low'
        }
        
        # Calculate confidence based on 'happy' and 'neutral' emotions
        confidence_score = emotions.get('happy', 0) + emotions.get('neutral', 0)
        if confidence_score > 0.7:
            insights['confidence'] = 'high'
        elif confidence_score > 0.4:
            insights['confidence'] = 'medium'
            
        # Calculate anxiety based on 'fear' and 'sad' emotions
        anxiety_score = emotions.get('fear', 0) + emotions.get('sad', 0)
        if anxiety_score > 0.6:
            insights['anxiety'] = 'high'
        elif anxiety_score > 0.3:
            insights['anxiety'] = 'medium'
            
        # Calculate nervousness based on 'surprise' and 'fear' emotions
        nervousness_score = emotions.get('surprise', 0) + emotions.get('fear', 0)
        if nervousness_score > 0.6:
            insights['nervousness'] = 'high'
        elif nervousness_score > 0.3:
            insights['nervousness'] = 'medium'
            
        return insights

    def analyze_video_stream(self, video_source: int = 0) -> Tuple[Dict[str, float], Dict[str, str]]:
        """Analyze emotions from a video stream."""
        cap = cv2.VideoCapture(video_source)
        
        if not cap.isOpened():
            raise ValueError("Could not open video source")
            
        try:
            ret, frame = cap.read()
            if not ret:
                raise ValueError("Could not read frame")
                
            emotions = self.analyze_emotion(frame)
            insights = self.get_emotional_insights(emotions)
            
            return emotions, insights
            
        finally:
            cap.release() 