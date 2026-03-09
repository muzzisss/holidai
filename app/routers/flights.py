from fastapi import APIRouter, Query
from app.services.flight_service import search_flights, generate_flight_deals

router = APIRouter()


@router.get("/search")
async def search(
    origin: str = Query("LHR", description="Origin airport code"),
    destination: str = Query(..., description="Destination airport code"),
    departure_date: str = Query(..., description="YYYY-MM-DD"),
    return_date: str | None = Query(None),
    passengers: int = Query(1, ge=1, le=9),
    cabin_class: str = Query("economy"),
    direct_only: bool = Query(False),
    max_price: float | None = Query(None),
    currency: str = Query("GBP"),
):
    params = {
        "origin": origin,
        "destination": destination,
        "departure_date": departure_date,
        "return_date": return_date,
        "passengers": passengers,
        "cabin_class": cabin_class,
        "direct_only": direct_only,
        "max_price": max_price,
        "currency": currency,
    }
    results = await search_flights(params)
    return {"flights": results, "count": len(results), "params": params}


@router.get("/deals")
async def deals(origin: str = Query("LHR")):
    results = generate_flight_deals(origin)
    return {"deals": results, "count": len(results)}
