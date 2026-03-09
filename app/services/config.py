import os
from dotenv import load_dotenv

load_dotenv()

# In-memory settings store (per-session)
_settings: dict = {
    "openai_api_key": os.getenv("OPENAI_API_KEY", ""),
    "amadeus_api_key": os.getenv("AMADEUS_API_KEY", ""),
    "amadeus_api_secret": os.getenv("AMADEUS_API_SECRET", ""),
    "weather_api_key": os.getenv("WEATHER_API_KEY", ""),
    "currency_api_key": os.getenv("CURRENCY_API_KEY", ""),
    "serpapi_key": os.getenv("SERPAPI_KEY", ""),
    "home_airport": os.getenv("HOME_AIRPORT", "LHR"),
    "preferred_currency": os.getenv("PREFERRED_CURRENCY", "GBP"),
    "preferred_cabin_class": "economy",
    "travel_style": "balanced",
    "notification_deals": True,
    "dark_mode": False,
}


def get_settings() -> dict:
    return _settings.copy()


def update_settings(new_settings: dict) -> dict:
    _settings.update({k: v for k, v in new_settings.items() if v is not None})
    return _settings.copy()


def get_setting(key: str) -> str:
    return _settings.get(key, "")
