import httpx
import random
from app.services.config import get_setting

WEATHER_CONDITIONS = [
    {"desc": "Clear sky", "icon": "01d"},
    {"desc": "Few clouds", "icon": "02d"},
    {"desc": "Scattered clouds", "icon": "03d"},
    {"desc": "Partly cloudy", "icon": "04d"},
    {"desc": "Light rain", "icon": "10d"},
    {"desc": "Sunny", "icon": "01d"},
    {"desc": "Overcast", "icon": "04d"},
]

# Average temps by destination (approximate)
DESTINATION_TEMPS = {
    "barcelona": {"winter": (8, 15), "spring": (12, 20), "summer": (22, 31), "autumn": (14, 23), "best": ["May", "Jun", "Sep", "Oct"]},
    "paris": {"winter": (2, 8), "spring": (8, 17), "summer": (16, 26), "autumn": (8, 17), "best": ["May", "Jun", "Sep"]},
    "rome": {"winter": (5, 13), "spring": (10, 20), "summer": (20, 32), "autumn": (12, 22), "best": ["Apr", "May", "Sep", "Oct"]},
    "amsterdam": {"winter": (1, 6), "spring": (5, 14), "summer": (13, 22), "autumn": (7, 14), "best": ["May", "Jun", "Jul", "Aug"]},
    "lisbon": {"winter": (8, 15), "spring": (12, 21), "summer": (18, 30), "autumn": (14, 23), "best": ["May", "Jun", "Sep", "Oct"]},
    "athens": {"winter": (7, 14), "spring": (12, 22), "summer": (23, 35), "autumn": (15, 25), "best": ["Apr", "May", "Sep", "Oct"]},
    "istanbul": {"winter": (3, 10), "spring": (9, 18), "summer": (20, 30), "autumn": (12, 20), "best": ["Apr", "May", "Sep", "Oct"]},
    "dubai": {"winter": (15, 26), "spring": (20, 35), "summer": (30, 43), "autumn": (22, 35), "best": ["Nov", "Dec", "Jan", "Feb", "Mar"]},
    "bangkok": {"winter": (22, 33), "spring": (25, 36), "summer": (25, 34), "autumn": (24, 33), "best": ["Nov", "Dec", "Jan", "Feb"]},
    "new york": {"winter": (-3, 5), "spring": (7, 18), "summer": (20, 30), "autumn": (8, 19), "best": ["May", "Jun", "Sep", "Oct"]},
    "tokyo": {"winter": (2, 10), "spring": (10, 20), "summer": (22, 31), "autumn": (12, 22), "best": ["Mar", "Apr", "Oct", "Nov"]},
    "singapore": {"winter": (24, 31), "spring": (24, 32), "summer": (24, 32), "autumn": (24, 31), "best": ["Feb", "Mar", "Jul", "Aug"]},
    "bali": {"winter": (24, 31), "spring": (24, 32), "summer": (23, 30), "autumn": (24, 31), "best": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]},
    "cancun": {"winter": (20, 29), "spring": (22, 32), "summer": (25, 34), "autumn": (23, 32), "best": ["Dec", "Jan", "Feb", "Mar", "Apr"]},
    "cape town": {"winter": (7, 18), "spring": (10, 22), "summer": (16, 28), "autumn": (12, 22), "best": ["Nov", "Dec", "Jan", "Feb", "Mar"]},
    "marrakech": {"winter": (6, 19), "spring": (12, 27), "summer": (20, 38), "autumn": (14, 28), "best": ["Mar", "Apr", "May", "Oct", "Nov"]},
    "london": {"winter": (2, 8), "spring": (6, 15), "summer": (13, 23), "autumn": (7, 15), "best": ["Jun", "Jul", "Aug", "Sep"]},
    "default": {"winter": (5, 15), "spring": (10, 20), "summer": (18, 28), "autumn": (10, 20), "best": ["May", "Jun", "Sep"]},
}


def _get_season(month: int) -> str:
    if month in [12, 1, 2]:
        return "winter"
    elif month in [3, 4, 5]:
        return "spring"
    elif month in [6, 7, 8]:
        return "summer"
    return "autumn"


async def get_weather_api(destination: str) -> dict | None:
    """Try to get real weather from OpenWeatherMap."""
    api_key = get_setting("weather_api_key")
    if not api_key:
        return None

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # Current weather
            resp = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": destination, "appid": api_key, "units": "metric"},
            )
            if resp.status_code != 200:
                return None

            current = resp.json()

            # 5-day forecast
            forecast_resp = await client.get(
                "https://api.openweathermap.org/data/2.5/forecast",
                params={"q": destination, "appid": api_key, "units": "metric"},
            )

            forecasts = []
            if forecast_resp.status_code == 200:
                fdata = forecast_resp.json()
                seen_dates: set[str] = set()
                for item in fdata.get("list", []):
                    dt = item["dt_txt"][:10]
                    if dt not in seen_dates:
                        seen_dates.add(dt)
                        weather = item.get("weather", [{}])[0]
                        main = item.get("main", {})
                        forecasts.append({
                            "date": dt,
                            "temp_min": main.get("temp_min", 0),
                            "temp_max": main.get("temp_max", 0),
                            "temp_avg": round((main.get("temp_min", 0) + main.get("temp_max", 0)) / 2, 1),
                            "description": weather.get("description", ""),
                            "icon": weather.get("icon", "01d"),
                            "humidity": main.get("humidity", 0),
                            "wind_speed": item.get("wind", {}).get("speed", 0),
                            "precipitation_chance": int(item.get("pop", 0) * 100),
                        })

            weather_desc = current.get("weather", [{}])[0]
            dest_key = destination.lower()
            dest_data = DESTINATION_TEMPS.get(dest_key, DESTINATION_TEMPS["default"])

            return {
                "destination": destination,
                "country": current.get("sys", {}).get("country", ""),
                "current_temp": current.get("main", {}).get("temp", 20),
                "current_description": weather_desc.get("description", ""),
                "current_icon": weather_desc.get("icon", "01d"),
                "forecast": forecasts[:7],
                "best_months": dest_data.get("best", []),
            }
    except Exception:
        return None


def generate_mock_weather(destination: str) -> dict:
    """Generate mock weather data."""
    from datetime import datetime, timedelta

    dest_key = destination.lower()
    dest_data = DESTINATION_TEMPS.get(dest_key, DESTINATION_TEMPS["default"])

    now = datetime.now()
    season = _get_season(now.month)
    temp_range = dest_data.get(season, (10, 20))

    current_temp = round(random.uniform(temp_range[0], temp_range[1]), 1)
    current_weather = random.choice(WEATHER_CONDITIONS)

    forecasts = []
    for i in range(7):
        day = now + timedelta(days=i)
        weather = random.choice(WEATHER_CONDITIONS)
        t_min = round(random.uniform(temp_range[0], temp_range[0] + 5), 1)
        t_max = round(random.uniform(temp_range[1] - 5, temp_range[1]), 1)
        forecasts.append({
            "date": day.strftime("%Y-%m-%d"),
            "temp_min": t_min,
            "temp_max": t_max,
            "temp_avg": round((t_min + t_max) / 2, 1),
            "description": weather["desc"],
            "icon": weather["icon"],
            "humidity": random.randint(30, 85),
            "wind_speed": round(random.uniform(2, 20), 1),
            "precipitation_chance": random.randint(0, 60),
        })

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    avg_temps = {}
    for i, m in enumerate(months):
        s = _get_season(i + 1)
        tr = dest_data.get(s, (10, 20))
        avg_temps[m] = round((tr[0] + tr[1]) / 2, 1)

    return {
        "destination": destination,
        "country": "",
        "current_temp": current_temp,
        "current_description": current_weather["desc"],
        "current_icon": current_weather["icon"],
        "forecast": forecasts,
        "best_months": dest_data.get("best", []),
        "avg_temp_by_month": avg_temps,
    }


async def get_weather(destination: str) -> dict:
    result = await get_weather_api(destination)
    if result:
        return result
    return generate_mock_weather(destination)
