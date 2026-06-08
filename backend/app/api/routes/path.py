from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.path import PathResponse
from app.services.path_service import PathService

router = APIRouter()

@router.get("/generate/{goal_id}", response_model=PathResponse)
def generate_learning_path(goal_id: int, user_id: int, db: Session = Depends(get_db)):
    """
    Generates a personalized, topologically sorted learning path 
    for a user based on their goal and current mastery.
    """
    service = PathService(db)
    
    try:
        # Call the Graph Service to get the optimized path
        ordered_topics = service.generate_user_path(user_id=user_id, goal_id=goal_id)
        
        return {
            "user_id": user_id,
            "goal_topic_id": goal_id,
            "ordered_path": ordered_topics
        }
    except Exception as e:
        # Catch cyclic dependency errors or missing goals
        raise HTTPException(status_code=400, detail=str(e))