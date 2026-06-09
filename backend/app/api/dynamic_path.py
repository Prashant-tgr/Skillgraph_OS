from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
import re
import traceback

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

router = APIRouter()

print("GROQ KEY FOUND:", bool(os.getenv("GROQ_API_KEY")))

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
    try:
        prompt = PromptTemplate(
            input_variables=["goal", "learning_style", "time_constraint"],
            template="""
You are an expert AI curriculum designer.

Create a personalized learning path for:

Goal: {goal}
Learning Style: {learning_style}
Time Available: {time_constraint}

Return ONLY valid JSON.

{
  "nodes": [
    {
      "id": "1",
      "title": "Concept Name",
      "description": "Description",
      "difficulty": "Beginner"
    }
  ],
  "edges": [
    {
      "source": "1",
      "target": "2"
    }
  ]
}
"""
        )

        chain = prompt | llm

        response = chain.invoke({
            "goal": req.goal,
            "learning_style": req.learning_style,
            "time_constraint": req.time_constraint
        })

        raw_text = response.content.strip()

        print("\n===== RAW LLM RESPONSE =====")
        print(raw_text)
        print("============================\n")

        # Remove markdown code fences if present
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        # Extract first JSON object found
        match = re.search(r"\{[\s\S]*\}", raw_text)

        if not match:
            raise ValueError(
                f"No JSON object found in model response:\n{raw_text}"
            )

        clean_json = match.group(0)

        graph_data = json.loads(clean_json)

        return graph_data

    except Exception as e:
        print("\n========== PATH ROUTE ERROR ==========")
        traceback.print_exc()
        print("ERROR:", str(e))
        print("======================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )