from sqlalchemy.orm import Session
from app.services.graph_service import GraphService
from app.models.topic import Topic
from app.models.progress import UserProgress

class PathService:
    def __init__(self, db: Session):
        self.db = db
        self.graph_service = GraphService(db)

    def generate_user_path(self, user_id: int, goal_id: int):
        """
        Generates the full topic objects for the user's specific learning path.
        """
        # Fetch completed topic IDs for this user
        completed_records = self.db.query(UserProgress.topic_id).filter(
            UserProgress.user_id == user_id, 
            UserProgress.status == "completed"
        ).all()
        completed_ids = [record[0] for record in completed_records]

        # Use Graph Engine to get the optimal order
        ordered_topic_ids = self.graph_service.get_optimized_path(goal_id, completed_ids)

        # Fetch the actual Topic models in the correct order
        # Using an in-memory sort to maintain the topological order returned by NetworkX
        topics = self.db.query(Topic).filter(Topic.id.in_(ordered_topic_ids)).all()
        topic_dict = {t.id: t for t in topics}
        
        ordered_topics = [topic_dict[tid] for tid in ordered_topic_ids if tid in topic_dict]
        
        return ordered_topics