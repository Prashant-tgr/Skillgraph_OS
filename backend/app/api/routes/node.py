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

# Initialize the Librarian Agent LLM
llm = ChatGroq(
    temperature=0.2, 
    model_name="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

class NodeDetailRequest(BaseModel):
    topic: str
    learning_style: str

# This maps to /api/node/details when linked in main.py
@router.post("/details")
async def get_node_details(req: NodeDetailRequest):
    """Librarian Agent: Generates overview and personalized resources"""
    prompt = PromptTemplate(
        input_variables=["topic", "learning_style"],
        template="""
        Act as an AI Librarian. Provide a learning module for the topic '{topic}'.
        The user's learning style is '{learning_style}'. Tailor the resources strictly to this style (e.g., if visual, suggest videos; if theoretical, suggest papers/books).
        
        Return STRICT JSON:
        {{
            "overview": "A 3-sentence summary of what this topic is and why it matters.",
            "resources": [
                {{"title": "Resource Name", "type": "Video/Paper/Doc", "link": "https://example.com/mock-link"}}
            ]
        }}
        """
    )
    try:
        response = (prompt | llm).invoke(req.model_dump())
        raw_text = response.content.strip()
        
        # Bulletproof JSON extraction
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        match = re.search(r'\{[\s\S]*\}', raw_text)
        if not match:
            raise ValueError("No JSON found")
            
        clean_json = match.group(0)
        return json.loads(clean_json)
        
    except Exception as e:
        print(f"\n❌ BACKEND CRASH ERROR (DETAILS): {str(e)}\n")
        raise HTTPException(status_code=500, detail=str(e))