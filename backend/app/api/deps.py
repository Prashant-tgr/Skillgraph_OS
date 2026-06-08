from typing import Generator
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

def get_db() -> Generator:
    """
    Creates a fresh database session for each request and closes it after.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()