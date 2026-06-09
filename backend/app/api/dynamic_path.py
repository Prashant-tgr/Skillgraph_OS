from fastapi import APIRouter
from pydantic import BaseModel
import json

from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
import os

router = APIRouter()
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2
)

class PathRequest(BaseModel):
    goal: str
    learning_style: str
    time_constraint: str

@router.post("/generate-dynamic")
async def generate_dynamic_path(req: PathRequest):
    prompt_template = """
    You are an expert AI curriculum designer. Create a highly personalized learning path for the following user:
    - Goal: {goal}
    - Learning Style: {learning_style}
    - Time Available: {time_constraint}

    You must break the goal down into a Directed Acyclic Graph (DAG) of logical learning steps.
    Adjust the number of steps and the descriptions based on their time constraint and learning style.
    
    Output strictly in this JSON format without any markdown wrappers:
    {{
      "nodes": [
        {{"id": "1", "title": "Concept Name", "description": "Tailored to their style", "difficulty": "Beginner"}}
      ],
      "edges": [
        {{"source": "1", "target": "2"}}
      ]
    }}
    """
    
    prompt = PromptTemplate(
        input_variables=["goal", "learning_style", "time_constraint"],
        template=prompt_template
    )
    
    chain = prompt | llm
    
    # Run the LLM
    response = chain.invoke({
        "goal": req.goal, 
        "learning_style": req.learning_style, 
        "time_constraint": req.time_constraint
    })
    
    # Parse the LLM output into standard JSON for React Flow
    graph_data = json.loads(response.content)
    
    return graph_data
