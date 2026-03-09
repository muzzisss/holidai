from fastapi import APIRouter, Query
from app.services.hotel_service import search_hotels, generate_hotel_deals

router = APIRouter()


@router.get("/search")
async def search(
    destination: str = Query(..., description="City name"),
    check_in: str = Query(..., description="YYYY-MM-DD"),
    check_out: str = Query(..., description="YYYY-MM-DD"),
    guests: int = Query(2, ge=1),
    rooms: int = Query(1, ge=1),
    min_rating: float | None = Query(None),
    max_price: float | None = Query(None),
    currency: str = Query("GBP"),
):
    params = {
        "destination": destination,
        "check_in": check_in,
        "check_out": check_out,
        "guests": guests,
        "rooms": rooms,
        "min_rating": min_rating,
        "max_price": max_price,
        "currency": currency,
    }
    results = await search_hotels(params)
    return {"hotels": results, "count": len(results), "params": params}


@router.get("/deals")
async def deals():
    results = generate_hotel_deals()
    return {"deals": results, "count": len(results)}
