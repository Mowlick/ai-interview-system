import openai
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class QuestionGenerator:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.system_prompt = """You are an expert interviewer. Generate relevant interview questions based on:
        1. The candidate's profile and experience
        2. The current emotional state of the candidate
        3. Previous questions and answers
        
        Focus on creating questions that:
        - Are specific to the candidate's background
        - Help assess technical and soft skills
        - Are appropriate for the candidate's current emotional state
        - Build upon previous responses
        """
        
    def generate_questions(
        self,
        candidate_profile: Dict,
        emotional_state: Dict,
        previous_qa: Optional[List[Dict]] = None,
        num_questions: int = 3
    ) -> List[Dict]:
        """Generate interview questions based on candidate profile and emotional state."""
        
        # Prepare the context for the AI
        context = f"""
        Candidate Profile:
        - Experience: {candidate_profile.get('experience', 'Not provided')}
        - Skills: {', '.join(candidate_profile.get('skills', []))}
        - Role: {candidate_profile.get('role', 'Not specified')}
        
        Current Emotional State:
        - Confidence: {emotional_state.get('confidence', 'neutral')}
        - Anxiety: {emotional_state.get('anxiety', 'low')}
        - Nervousness: {emotional_state.get('nervousness', 'low')}
        """
        
        if previous_qa:
            context += "\nPrevious Q&A:\n"
            for qa in previous_qa:
                context += f"Q: {qa['question']}\nA: {qa['answer']}\n"
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": f"{context}\n\nGenerate {num_questions} interview questions."}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            # Parse the response and format questions
            questions = self._parse_questions(response.choices[0].message.content)
            return questions
            
        except Exception as e:
            print(f"Error generating questions: {str(e)}")
            return self._get_fallback_questions(candidate_profile)
    
    def _parse_questions(self, response: str) -> List[Dict]:
        """Parse the AI response into structured question objects."""
        questions = []
        current_question = None
        
        for line in response.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            if line.startswith(('Q:', 'Question:', '1.', '2.', '3.')):
                if current_question:
                    questions.append(current_question)
                current_question = {
                    'question': line.split(':', 1)[1].strip() if ':' in line else line[2:].strip(),
                    'follow_up_questions': [],
                    'context': ''
                }
            elif line.startswith(('Context:', 'Note:')):
                if current_question:
                    current_question['context'] = line.split(':', 1)[1].strip()
            elif line.startswith(('Follow-up:', 'Follow up:')):
                if current_question:
                    current_question['follow_up_questions'].append(line.split(':', 1)[1].strip())
        
        if current_question:
            questions.append(current_question)
            
        return questions
    
    def _get_fallback_questions(self, candidate_profile: Dict) -> List[Dict]:
        """Generate fallback questions when AI generation fails."""
        role = candidate_profile.get('role', '').lower()
        experience = candidate_profile.get('experience', '')
        
        if 'software' in role or 'developer' in role:
            return [
                {
                    'question': 'Can you walk me through a challenging technical problem you solved recently?',
                    'follow_up_questions': [
                        'What was your approach to solving this problem?',
                        'What technologies did you use?'
                    ],
                    'context': 'Technical problem-solving assessment'
                },
                {
                    'question': 'How do you stay updated with the latest technologies?',
                    'follow_up_questions': [
                        'What resources do you use for learning?',
                        'Can you give an example of a new technology you learned recently?'
                    ],
                    'context': 'Learning and adaptability assessment'
                }
            ]
        else:
            return [
                {
                    'question': 'Tell me about a significant achievement in your career.',
                    'follow_up_questions': [
                        'What was your role in this achievement?',
                        'What challenges did you face?'
                    ],
                    'context': 'Career achievement assessment'
                },
                {
                    'question': 'How do you handle tight deadlines and pressure?',
                    'follow_up_questions': [
                        'Can you give a specific example?',
                        'What strategies do you use to manage stress?'
                    ],
                    'context': 'Stress management assessment'
                }
            ] 