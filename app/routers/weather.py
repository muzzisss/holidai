from fastapi import APIRouter, Query
from app.services.weather_service import get_weather

router = APIRouter()


@router.get("/forecast")
async def forecast(destination: str = Query(..., description="City name")):
    result = await get_weather(destination)
    return result
