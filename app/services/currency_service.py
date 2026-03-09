import httpx
from datetime import datetime
from app.services.config import get_setting

# Fallback exchange rates (approximate GBP-based)
FALLBACK_RATES = {
    "GBP": 1.0, "USD": 1.27, "EUR": 1.16, "JPY": 190.5, "AUD": 1.94,
    "CAD": 1.72, "CHF": 1.12, "CNY": 9.15, "INR": 105.8, "MXN": 21.8,
    "BRL": 6.3, "ZAR": 23.5, "THB": 44.8, "TRY": 40.5, "AED": 4.67,
    "SGD": 1.71, "HKD": 9.93, "NZD": 2.12, "SEK": 13.2, "NOK": 13.5,
    "DKK": 8.65, "PLN": 5.12, "CZK": 29.5, "HUF": 460.0, "RON": 5.78,
    "HRK": 8.75, "ISK": 175.0, "BGN": 2.27, "MAD": 12.8, "EGP": 62.0,
    "KES": 164.0, "LKR": 380.0, "VND": 32000.0, "IDR": 20000.0,
    "PHP": 71.0, "MYR": 5.95, "KRW": 1680.0, "TWD": 41.0, "SAR": 4.76,
    "QAR": 4.63, "OMR": 0.49, "BHD": 0.48, "KWD": 0.39, "JOD": 0.90,
    "COP": 5200.0, "PEN": 4.75, "CLP": 1200.0, "ARS": 1100.0,
}


async def get_live_rates(base: str = "GBP") -> dict[str, float] | None:
    """Try to get live exchange rates."""
    api_key = get_setting("currency_api_key")
    if not api_key:
        return None

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base}"
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("conversion_rates", {})
    except Exception:
        pass
    return None


async def convert_currency(from_currency: str, to_currency: str, amount: float) -> dict:
    """Convert between currencies."""
    from_currency = from_currency.upper()
    to_currency = to_currency.upper()

    # Try live rates first
    rates = await get_live_rates(from_currency)
    if rates and to_currency in rates:
        rate = rates[to_currency]
        return {
            "from_currency": from_currency,
            "to_currency": to_currency,
            "amount": amount,
            "converted_amount": round(amount * rate, 2),
            "rate": round(rate, 6),
            "last_updated": datetime.now().isoformat(),
        }

    # Fallback to stored rates
    from_rate = FALLBACK_RATES.get(from_currency, 1.0)
    to_rate = FALLBACK_RATES.get(to_currency, 1.0)

    # Convert via GBP
    gbp_amount = amount / from_rate
    converted = gbp_amount * to_rate
    rate = to_rate / from_rate

    return {
        "from_currency": from_currency,
        "to_currency": to_currency,
        "amount": amount,
        "converted_amount": round(converted, 2),
        "rate": round(rate, 6),
        "last_updated": datetime.now().isoformat(),
    }


async def get_rates(base: str = "GBP") -> dict:
    """Get all exchange rates for a base currency."""
    base = base.upper()

    rates = await get_live_rates(base)
    if rates:
        return {
            "base": base,
            "rates": rates,
            "last_updated": datetime.now().isoformat(),
            "source": "live",
        }

    # Fallback
    base_rate = FALLBACK_RATES.get(base, 1.0)
    computed = {}
    for currency, rate in FALLBACK_RATES.items():
        computed[currency] = round(rate / base_rate, 6)

    return {
        "base": base,
        "rates": computed,
        "last_updated": datetime.now().isoformat(),
        "source": "cached",
    }
