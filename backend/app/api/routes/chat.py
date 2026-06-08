from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

load_dotenv()
router = APIRouter()

# Initialize the Tutor LLM (Slightly higher temperature for better conversational flow)
llm = ChatGroq(
    temperature=0.3, 
    model_name="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY")
)

class ChatRequest(BaseModel):
    topic: str
    description: str
    question: str

@router.post("/ask")
async def ask_tutor(req: ChatRequest):
    """Tutor Agent: Provides context-aware answers based on the current node."""
    prompt = PromptTemplate(
        input_variables=["topic", "description", "question"],
        template="""
        You are an elite AI Tutor specializing in Computer Science and Engineering. 
        The student is currently studying the module: "{topic}".
        Module Context: "{description}"
        
        The student has asked the following question: "{question}"
        
        Provide a concise, highly technical, and accurate answer. Keep it under 4 paragraphs. 
        Use bullet points if explaining steps. Do NOT output markdown code blocks formatting the whole response, just use standard text.
        """
    )
    try:
        response = (prompt | llm).invoke(req.model_dump())
        return {"answer": response.content.strip()}
    except Exception as e:
        print(f"\n❌ BACKEND CRASH ERROR (TUTOR): {str(e)}\n")
        raise HTTPException(status_code=500, detail="Tutor Agent offline.")