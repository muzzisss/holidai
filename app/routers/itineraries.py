from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.itinerary_service import (
    create_itinerary, get_itinerary, list_itineraries,
    update_itinerary, delete_itinerary, add_item_to_day, remove_item_from_day,
)
from app.models.schemas import ItineraryCreateRequest

router = APIRouter()


@router.get("/")
async def list_all():
    results = list_itineraries()
    return {"itineraries": results, "count": len(results)}


@router.post("/")
async def create(request: ItineraryCreateRequest):
    result = create_itinerary(request.model_dump())
    return result


@router.get("/{itinerary_id}")
async def get(itinerary_id: str):
    result = get_itinerary(itinerary_id)
    if not result:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return result


@router.put("/{itinerary_id}")
async def update(itinerary_id: str, data: dict):
    result = update_itinerary(itinerary_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return result


@router.delete("/{itinerary_id}")
async def delete(itinerary_id: str):
    success = delete_itinerary(itinerary_id)
    if not success:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return {"message": "Itinerary deleted"}


class AddItemRequest(BaseModel):
    time: str
    title: str
    description: str = ""
    category: str = "activity"
    location: str | None = None
    cost: float | None = None
    currency: str = "GBP"
    booking_url: str | None = None
    notes: str | None = None


@router.post("/{itinerary_id}/days/{day_number}/items")
async def add_item(itinerary_id: str, day_number: int, item: AddItemRequest):
    result = add_item_to_day(itinerary_id, day_number, item.model_dump())
    if not result:
        raise HTTPException(status_code=404, detail="Itinerary or day not found")
    return result


@router.delete("/{itinerary_id}/days/{day_number}/items/{item_id}")
async def remove_item(itinerary_id: str, day_number: int, item_id: str):
    result = remove_item_from_day(itinerary_id, day_number, item_id)
    if not result:
        raise HTTPException(status_code=404, detail="Itinerary, day, or item not found")
    return result
