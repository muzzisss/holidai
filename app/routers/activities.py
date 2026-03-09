from fastapi import APIRouter, Query
from app.services.activity_service import generate_activities, get_popular_activities

router = APIRouter()


@router.get("/search")
async def search(
    destination: str = Query(..., description="City name"),
    category: str | None = Query(None, description="Activity category"),
):
    results = generate_activities(destination, category)
    return {"activities": results, "count": len(results)}


@router.get("/popular")
async def popular():
    results = get_popular_activities()
    return {"activities": results, "count": len(results)}
