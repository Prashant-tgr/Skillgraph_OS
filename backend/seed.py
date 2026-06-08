from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.topic import Topic, TopicEdge
from app.models.course import Course
from app.models.user import User

def seed_database():
    print("Initializing Database...")
    # 1. Create all tables based on our SQLAlchemy models
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()

    try:
        # 2. Check if the database is already seeded to prevent duplicates
        if db.query(Topic).first():
            print("Database already seeded! You are good to go.")
            return

        print("Seeding Topics (Nodes)...")
        t1 = Topic(title="Python Basics", description="Variables, loops, functions", difficulty="Beginner")
        t2 = Topic(title="NumPy", description="Arrays and matrices", difficulty="Intermediate")
        t3 = Topic(title="Pandas", description="DataFrames and data manipulation", difficulty="Intermediate")
        t4 = Topic(title="Data Visualization", description="Matplotlib and Seaborn", difficulty="Intermediate")
        t5 = Topic(title="Machine Learning Basics", description="Scikit-Learn and modeling", difficulty="Advanced")
        
        db.add_all([t1, t2, t3, t4, t5])
        db.commit()

        print("Seeding Topic Dependencies (Edges)...")
        # Creating the Directed Acyclic Graph (DAG)
        # Python -> NumPy & Pandas. NumPy & Pandas -> Data Viz. Data Viz -> ML
        edges = [
            TopicEdge(parent_id=t1.id, child_id=t2.id),
            TopicEdge(parent_id=t1.id, child_id=t3.id),
            TopicEdge(parent_id=t2.id, child_id=t4.id),
            TopicEdge(parent_id=t3.id, child_id=t4.id),
            TopicEdge(parent_id=t4.id, child_id=t5.id),
        ]
        db.add_all(edges)
        db.commit()

        print("Seeding a Dummy User...")
        user = User(username="admin", email="admin@skillgraph.ai")
        db.add(user)
        db.commit()

        print("Seeding Courses for Recommendations...")
        c1 = Course(title="Complete Python Bootcamp", url="https://example.com/python", topic_id=t1.id, description="Learn Python from scratch. Perfect for beginners.")
        c2 = Course(title="Data Analysis with Pandas", url="https://example.com/pandas", topic_id=t3.id, description="Master data manipulation and analysis using Pandas.")
        c3 = Course(title="Machine Learning A-Z", url="https://example.com/ml", topic_id=t5.id, description="Comprehensive guide to Machine Learning algorithms and Scikit-Learn.")
        db.add_all([c1, c2, c3])
        db.commit()

        print("✅ Database Seeded Successfully!")
    
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()