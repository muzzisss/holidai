from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import chat_with_ai, plan_trip
from app.models.schemas import AIChatRequest, TripPlanRequest

router = APIRouter()


@router.post("/chat")
async def chat(request: AIChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    response = await chat_with_ai(messages, request.context)
    return {"response": response}


@router.post("/plan-trip")
async def plan(request: TripPlanRequest):
    params = request.model_dump()
    result = await plan_trip(params)
    return {"plan": result}
