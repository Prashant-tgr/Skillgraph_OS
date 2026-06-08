from sqlalchemy.orm import Session
from app.models.progress import UserProgress
from app.utils.constants import (
    MASTERY_REVISION_THRESHOLD, 
    MASTERY_ACCELERATION_THRESHOLD,
    STATUS_COMPLETED,
    STATUS_NEEDS_REVISION
)

class AdaptiveService:
    def __init__(self, db: Session):
        self.db = db

    def process_quiz_result(self, user_id: int, topic_id: int, score: float):
        """
        Updates user mastery based on quiz score and determines path adjustments.
        Formula uses Exponential Moving Average style logic: 70% current quiz, 30% history.
        """
        progress = self.db.query(UserProgress).filter(
            UserProgress.user_id == user_id, 
            UserProgress.topic_id == topic_id
        ).first()

        if not progress:
            # Initialize progress if taking quiz for the first time
            progress = UserProgress(user_id=user_id, topic_id=topic_id, mastery_score=0.0)
            self.db.add(progress)

        # Calculate new mastery
        new_mastery = (score * 0.7) + (progress.mastery_score * 0.3)
        progress.mastery_score = new_mastery

        # Determine routing action based on thresholds
        action = "MOVE_NEXT"
        if new_mastery < MASTERY_REVISION_THRESHOLD:
            progress.status = STATUS_NEEDS_REVISION
            action = "REVISE_CURRENT"
        elif new_mastery > MASTERY_ACCELERATION_THRESHOLD:
            progress.status = STATUS_COMPLETED
            action = "ACCELERATE"
        else:
            progress.status = STATUS_COMPLETED

        self.db.commit()
        return action