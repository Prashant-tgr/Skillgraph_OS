from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
import re

from dotenv import load_dotenv
load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

router = APIRouter()

llm = ChatGroq(
    temperature=0.2, 
    model_name="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

class QuizRequest(BaseModel):
    topic: str
    difficulty: str

@router.post("/generate")
async def generate_adaptive_quiz(req: QuizRequest):
    """Generates a 10-question assessment using Groq"""
    prompt = PromptTemplate(
        input_variables=["topic", "difficulty"],
        template="""
        Create a 10-question adaptive quiz for the topic '{topic}' at a '{difficulty}' level.
        The questions should test deep understanding, not just memorization.
        Return STRICT JSON:
        {{
            "questions": [
                {{
                    "question": "The question text?",
                    "options": ["A", "B", "C", "D"],
                    "correct_index": 0
                }}
            ]
        }}
        No markdown formatting. Exactly 10 questions.
        """
    )
    try:
        response = (prompt | llm).invoke(req.model_dump())
        raw_text = response.content.strip()
        
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        match = re.search(r'\{[\s\S]*\}', raw_text)
        if not match:
            raise ValueError("No JSON found")
            
        return json.loads(match.group(0))
        
    except Exception as e:
        print(f"\n❌ BACKEND CRASH ERROR (QUIZ): {str(e)}\n")
        return {"questions": []}