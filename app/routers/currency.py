from fastapi import APIRouter, Query
from app.services.currency_service import convert_currency, get_rates

router = APIRouter()


@router.get("/convert")
async def convert(
    from_currency: str = Query("GBP"),
    to_currency: str = Query("EUR"),
    amount: float = Query(100),
):
    result = await convert_currency(from_currency, to_currency, amount)
    return result


@router.get("/rates")
async def rates(base: str = Query("GBP")):
    result = await get_rates(base)
    return result
