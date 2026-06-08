from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import re

from dotenv import load_dotenv
load_dotenv()

try:
    from langchain_core.prompts import PromptTemplate
    from langchain_groq import ChatGroq
    _LLM_AVAILABLE = True
except Exception:
    PromptTemplate = None
    ChatGroq = None
    _LLM_AVAILABLE = False

# Added the chat router here
from app.api.routes import quiz, node, chat 

app = FastAPI(title="SkillGraph AI Architecture")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire up the Multi-Agent Routers
app.include_router(quiz.router, prefix="/api/quiz", tags=["Assessment Agent"])
app.include_router(node.router, prefix="/api/node", tags=["Librarian Agent"])
app.include_router(chat.router, prefix="/api/chat", tags=["Tutor Agent"]) # NEW LINE

llm = None
if _LLM_AVAILABLE:
    try:
        llm = ChatGroq(
            temperature=0.2,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
    except Exception:
        llm = None

class DynamicPathRequest(BaseModel):
    goal: str
    learning_style: str
    time_constraint: str

@app.get("/")
async def root():
    return {"message": "SkillGraph Multi-Agent Engine is Online and Ready!", "status": "Active"}

@app.post("/api/path/generate-dynamic")
async def generate_dynamic_path(req: DynamicPathRequest):
    """Generates an industry-standard DAG"""
    if llm is None or PromptTemplate is None:
        raise HTTPException(status_code=503, detail="LLM provider libraries are not installed or configured. Set up `langchain_core`/`langchain_groq` or run with Docker and provide `GROQ_API_KEY`.")
    prompt = PromptTemplate(
        input_variables=["goal", "learning_style", "time_constraint"],
        template="""
        Act as a Senior Tech Lead and AI Curriculum Architect. Create a learning Directed Acyclic Graph (DAG) for:
        Goal: {goal} | Style: {learning_style} | Time: {time_constraint}.
        
        You must output ONLY valid JSON. 
        Format EXACTLY like this:
        {{
            "nodes": [
                {{
                    "id": "1", 
                    "title": "Concept Name", 
                    "description": "Brief description of the module.", 
                    "difficulty": "Beginner",
                    "estimated_hours": "3h",
                    "real_world_project": "Build a basic CLI tool to implement this"
                }}
            ],
            "edges": [
                {{"source": "1", "target": "2"}}
            ]
        }}
        Ensure 5-7 nodes. Nodes must contain 'estimated_hours' and 'real_world_project'.
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
            raise ValueError("No JSON brackets found in output")
            
        clean_json = match.group(0)
        return json.loads(clean_json)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))