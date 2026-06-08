import re
from datetime import datetime

def clean_text(text: str) -> str:
    """
    Removes special characters and lowercases text. Useful for standardizing 
    search inputs or topic names before processing.
    """
    if not text:
        return ""
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip().lower()

def format_timestamp(dt: datetime) -> str:
    """
    Formats a datetime object into a standard string representation.
    """
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def calculate_completion_percentage(completed: int, total: int) -> float:
    """
    Safely calculates progress percentage.
    """
    if total <= 0:
        return 0.0
    return round((completed / total) * 100, 2)