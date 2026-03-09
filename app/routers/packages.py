from fastapi import APIRouter, Query
from app.services.package_service import generate_packages, get_package_deals

router = APIRouter()


@router.get("/search")
async def search(
    destination: str | None = Query(None),
    origin: str = Query("London"),
):
    results = generate_packages(destination, origin)
    return {"packages": results, "count": len(results)}


@router.get("/deals")
async def deals():
    results = get_package_deals()
    return {"deals": results, "count": len(results)}
