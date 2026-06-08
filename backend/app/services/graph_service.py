import networkx as nx
from sqlalchemy.orm import Session
from app.models.topic import TopicEdge

class GraphService:
    def __init__(self, db: Session):
        self.db = db
        self.G = self._build_graph()

    def _build_graph(self):
        """Fetches all edges from DB and constructs a NetworkX DiGraph."""
        G = nx.DiGraph()
        edges = self.db.query(TopicEdge).all()
        for edge in edges:
            G.add_edge(edge.parent_id, edge.child_id)
        return G

    def validate_dag(self):
        """Ensures there are no cyclic dependencies in the knowledge graph."""
        return nx.is_directed_acyclic_graph(self.G)

    def get_optimized_path(self, goal_topic_id: int, completed_topic_ids: list):
        """
        Returns a topologically sorted list of required topic IDs.
        """
        # Get all ancestors (prerequisites) plus the goal itself
        all_required = nx.ancestors(self.G, goal_topic_id) | {goal_topic_id}
        
        # Filter out what the user already knows
        remaining = [t for t in all_required if t not in completed_topic_ids]
        
        # Create a subgraph and sort it
        subgraph = self.G.subgraph(remaining)
        if not nx.is_directed_acyclic_graph(subgraph):
            raise Exception("Cycle detected in Knowledge Graph! Cannot generate a valid path.")
            
        return list(nx.topological_sort(subgraph))