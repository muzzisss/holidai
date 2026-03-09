from fastapi import APIRouter, Query
from app.services.destination_service import get_popular_destinations, get_destination_info, search_destinations

router = APIRouter()


@router.get("/popular")
async def popular(limit: int = Query(12, ge=1, le=50)):
    results = get_popular_destinations(limit)
    return {"destinations": results, "count": len(results)}


@router.get("/info")
async def info(name: str = Query(...)):
    result = get_destination_info(name)
    if not result:
        return {"error": "Destination not found", "destination": name}
    return result


@router.get("/search")
async def search(
    query: str = Query(""),
    continent: str = Query(""),
    max_daily_cost: float = Query(0),
):
    results = search_destinations(query, continent, max_daily_cost)
    return {"destinations": results, "count": len(results)}
