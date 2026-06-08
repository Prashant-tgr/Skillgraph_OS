from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    mastery_score = Column(Float, default=0.0) # Scale of 0.0 to 1.0
    status = Column(String, default="locked") # locked, in_progress, completed, needs_revision
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())