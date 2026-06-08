from pydantic import BaseModel
from typing import Dict

class QuizSubmission(BaseModel):
    user_id: int
    topic_id: int
    answers: Dict[str, str]

class QuizResult(BaseModel):
    score: float
    action: str
    topic_id: int
    message: str