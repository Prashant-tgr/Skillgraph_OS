from sqlalchemy.orm import Session
from app.services.adaptive_service import AdaptiveService

class QuizService:
    def __init__(self, db: Session):
        self.db = db
        self.adaptive_engine = AdaptiveService(db)

    def evaluate_quiz(self, user_id: int, topic_id: int, answers: dict):
        """
        Evaluates the submitted answers, calculates a score, and passes
        the result to the Adaptive Engine to update the learning path.
        """
        # In a real implementation, you would compare 'answers' against the correct answers in the DB.
        # For this MVP, we will simulate a grading logic based on the number of answers provided.
        
        total_questions = len(answers)
        if total_questions == 0:
            score = 0.0
        else:
            # MOCK LOGIC: Assuming 80% correct for demonstration purposes.
            # Replace this with actual DB answer validation.
            score = 0.80 

        # Trigger Adaptive Engine
        action = self.adaptive_engine.process_quiz_result(user_id, topic_id, score)
        
        message_map = {
            "REVISE_CURRENT": "Score too low. Redirecting to prerequisite or revision materials.",
            "MOVE_NEXT": "Good job! Moving to the next topic.",
            "ACCELERATE": "Excellent! Fast-tracking you through this module."
        }

        return {
            "score": score,
            "action": action,
            "topic_id": topic_id,
            "message": message_map.get(action, "Path updated.")
        }