from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.api.deps import get_db
from app.models.topic import Topic
from app.models.course import Course
from app.services.recommendation_service import RecommendationService

router = APIRouter()

# Schema for the output response
class CourseRecommendationResponse(BaseModel):
    title: str
    description: str
    url: str
    score: float  # The TF-IDF similarity score

    class Config:
        from_attributes = True

@router.get("/{topic_id}", response_model=List[CourseRecommendationResponse])
def get_course_recommendations(topic_id: int, db: Session = Depends(get_db)):
    """
    Fetch course recommendations based on the TF-IDF cosine similarity 
    between a specific topic's title and the descriptions of available courses.
    """
    # 1. Verify the topic exists in the database
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    # 2. Fetch the corpus of courses
    # Note: For massive databases, you would pre-filter this by category 
    # instead of pulling all courses into memory.
    courses = db.query(Course).all()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses available to recommend")
    
    # 3. Format the data for the Recommendation Service
    course_list = [
        {
            "title": c.title, 
            "description": c.description, 
            "url": c.url
        } 
        for c in courses
    ]
    
    # 4. Generate and return the ranked suggestions
    service = RecommendationService()
    try:
        suggestions = service.suggest_courses(topic.title, course_list)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")