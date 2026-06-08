from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.db.session import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    url = Column(String)
    rating = Column(Float, default=4.0)
    topic_id = Column(Integer, ForeignKey("topics.id"))