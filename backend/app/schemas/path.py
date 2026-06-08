from pydantic import BaseModel
from typing import List

class PathRequest(BaseModel):
    user_id: int
    goal_topic_id: int

class TopicSchema(BaseModel):
    id: int
    title: str  # <--- This was the bug! Changed from 'name' to 'title'
    description: str
    difficulty: str

    class Config:
        from_attributes = True

class PathResponse(BaseModel):
    user_id: int
    goal_topic_id: int
    ordered_path: List[TopicSchema]