from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    difficulty = Column(String)

class TopicEdge(Base):
    __tablename__ = "topic_edges"
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("topics.id"))
    child_id = Column(Integer, ForeignKey("topics.id"))