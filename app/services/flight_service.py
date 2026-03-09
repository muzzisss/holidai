import httpx
import hashlib
import random
from datetime import datetime, timedelta
from app.services.config import get_setting

# UK airports for generating deals
UK_AIRPORTS = {
    "LHR": "London Heathrow",
    "LGW": "London Gatwick",
    "STN": "London Stansted",
    "LTN": "London Luton",
    "MAN": "Manchester",
    "EDI": "Edinburgh",
    "BHX": "Birmingham",
    "BRS": "Bristol",
    "GLA": "Glasgow",
    "LPL": "Liverpool",
    "NCL": "Newcastle",
    "EMA": "East Midlands",
    "BFS": "Belfast",
    "LBA": "Leeds Bradford",
    "ABZ": "Aberdeen",
    "CWL": "Cardiff",
    "SOU": "Southampton",
}

POPULAR_DESTINATIONS = [
    {"code": "BCN", "city": "Barcelona", "country": "Spain", "image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400"},
    {"code": "CDG", "city": "Paris", "country": "France", "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400"},
    {"code": "FCO", "city": "Rome", "country": "Italy", "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400"},
    {"code": "AMS", "city": "Amsterdam", "country": "Netherlands", "image": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400"},
    {"code": "LIS", "city": "Lisbon", "country": "Portugal", "image": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400"},
    {"code": "ATH", "city": "Athens", "country": "Greece", "image": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400"},
    {"code": "IST", "city": "Istanbul", "country": "Turkey", "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400"},
    {"code": "DXB", "city": "Dubai", "country": "UAE", "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400"},
    {"code": "BKK", "city": "Bangkok", "country": "Thailand", "image": "https://images.unsplash.com/photo-1508009603885-50cf7c8a1ee8?w=400"},
    {"code": "JFK", "city": "New York", "country": "USA", "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400"},
    {"code": "NRT", "city": "Tokyo", "country": "Japan", "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400"},
    {"code": "SIN", "city": "Singapore", "country": "Singapore", "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400"},
    {"code": "MLE", "city": "Male", "country": "Maldives", "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400"},
    {"code": "HNL", "city": "Honolulu", "country": "USA", "image": "https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=400"},
    {"code": "CPT", "city": "Cape Town", "country": "South Africa", "image": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400"},
    {"code": "CUN", "city": "Cancun", "country": "Mexico", "image": "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=400"},
    {"code": "CMB", "city": "Colombo", "country": "Sri Lanka", "image": "https://images.unsplash.com/photo-1586613835341-c2a55769a84a?w=400"},
    {"code": "HAN", "city": "Hanoi", "country": "Vietnam", "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400"},
    {"code": "RAK", "city": "Marrakech", "country": "Morocco", "image": "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400"},
    {"code": "PMI", "city": "Palma de Mallorca", "country": "Spain", "image": "https://images.unsplash.com/photo-1580277672681-38bceadfa704?w=400"},
]

AIRLINES = [
    {"name": "British Airways", "code": "BA", "logo": "https://logo.clearbit.com/britishairways.com"},
    {"name": "easyJet", "code": "U2", "logo": "https://logo.clearbit.com/easyjet.com"},
    {"name": "Ryanair", "code": "FR", "logo": "https://logo.clearbit.com/ryanair.com"},
    {"name": "Wizz Air", "code": "W6", "logo": "https://logo.clearbit.com/wizzair.com"},
    {"name": "Jet2", "code": "LS", "logo": "https://logo.clearbit.com/jet2.com"},
    {"name": "TUI", "code": "BY", "logo": "https://logo.clearbit.com/tui.co.uk"},
    {"name": "Virgin Atlantic", "code": "VS", "logo": "https://logo.clearbit.com/virginatlantic.com"},
    {"name": "Emirates", "code": "EK", "logo": "https://logo.clearbit.com/emirates.com"},
    {"name": "Qatar Airways", "code": "QR", "logo": "https://logo.clearbit.com/qatarairways.com"},
    {"name": "Turkish Airlines", "code": "TK", "logo": "https://logo.clearbit.com/turkishairlines.com"},
    {"name": "KLM", "code": "KL", "logo": "https://logo.clearbit.com/klm.com"},
    {"name": "Lufthansa", "code": "LH", "logo": "https://logo.clearbit.com/lufthansa.com"},
    {"name": "Air France", "code": "AF", "logo": "https://logo.clearbit.com/airfrance.com"},
    {"name": "Norwegian", "code": "DY", "logo": "https://logo.clearbit.com/norwegian.com"},
    {"name": "Iberia", "code": "IB", "logo": "https://logo.clearbit.com/iberia.com"},
]


def _generate_id(prefix: str, *args: str) -> str:
    raw = "-".join(str(a) for a in args)
    return f"{prefix}-{hashlib.md5(raw.encode()).hexdigest()[:12]}"


def _random_duration(min_h: float, max_h: float) -> str:
    total_min = random.randint(int(min_h * 60), int(max_h * 60))
    hours = total_min // 60
    mins = total_min % 60
    return f"{hours}h {mins}m"


async def search_flights_amadeus(params: dict) -> list[dict]:
    """Try to search flights using Amadeus API if key is available."""
    api_key = get_setting("amadeus_api_key")
    api_secret = get_setting("amadeus_api_secret")
    if not api_key or not api_secret:
        return []

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            # Get access token
            token_resp = await client.post(
                "https://api.amadeus.com/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": api_key,
                    "client_secret": api_secret,
                },
            )
            if token_resp.status_code != 200:
                return []
            token = token_resp.json().get("access_token", "")

            # Search flights
            search_params = {
                "originLocationCode": params.get("origin", "LHR"),
                "destinationLocationCode": params.get("destination", ""),
                "departureDate": params.get("departure_date", ""),
                "adults": params.get("passengers", 1),
                "currencyCode": params.get("currency", "GBP"),
                "max": 20,
            }
            if params.get("return_date"):
                search_params["returnDate"] = params["return_date"]
            if params.get("direct_only"):
                search_params["nonStop"] = "true"
            if params.get("cabin_class"):
                cabin_map = {
                    "economy": "ECONOMY",
                    "premium_economy": "PREMIUM_ECONOMY",
                    "business": "BUSINESS",
                    "first": "FIRST",
                }
                search_params["travelClass"] = cabin_map.get(params["cabin_class"], "ECONOMY")

            resp = await client.get(
                "https://api.amadeus.com/v2/shopping/flight-offers",
                params=search_params,
                headers={"Authorization": f"Bearer {token}"},
            )
            if resp.status_code == 200:
                data = resp.json()
                flights = []
                for offer in data.get("data", [])[:20]:
                    segments = offer.get("itineraries", [{}])[0].get("segments", [])
                    if not segments:
                        continue
                    first_seg = segments[0]
                    last_seg = segments[-1]
                    carrier = first_seg.get("carrierCode", "")
                    airline_info = next((a for a in AIRLINES if a["code"] == carrier), {"name": carrier, "logo": None})

                    flights.append({
                        "id": _generate_id("fl", offer.get("id", ""), carrier),
                        "airline": airline_info["name"],
                        "airline_logo": airline_info.get("logo"),
                        "flight_number": f"{carrier}{first_seg.get('number', '')}",
                        "origin": first_seg.get("departure", {}).get("iataCode", ""),
                        "origin_city": params.get("origin", ""),
                        "destination": last_seg.get("arrival", {}).get("iataCode", ""),
                        "destination_city": params.get("destination", ""),
                        "departure_time": first_seg.get("departure", {}).get("at", ""),
                        "arrival_time": last_seg.get("arrival", {}).get("at", ""),
                        "duration": offer.get("itineraries", [{}])[0].get("duration", ""),
                        "stops": len(segments) - 1,
                        "price": float(offer.get("price", {}).get("total", 0)),
                        "currency": offer.get("price", {}).get("currency", "GBP"),
                        "cabin_class": params.get("cabin_class", "economy"),
                        "booking_url": None,
                    })
                return flights
            return []
    except Exception:
        return []


def generate_mock_flights(params: dict) -> list[dict]:
    """Generate realistic mock flight data when no API key is available."""
    origin = params.get("origin", "LHR")
    destination = params.get("destination", "BCN")
    dep_date = params.get("departure_date", "2026-04-15")
    cabin = params.get("cabin_class", "economy")
    passengers = params.get("passengers", 1)

    dest_info = next((d for d in POPULAR_DESTINATIONS if d["code"] == destination), 
                     {"code": destination, "city": destination, "country": ""})
    origin_name = UK_AIRPORTS.get(origin, origin)

    base_prices = {
        "economy": {"short": (30, 150), "medium": (150, 400), "long": (350, 900)},
        "premium_economy": {"short": (80, 250), "medium": (300, 700), "long": (600, 1400)},
        "business": {"short": (200, 600), "medium": (600, 1800), "long": (1500, 4000)},
        "first": {"short": (500, 1200), "medium": (1500, 4000), "long": (3000, 8000)},
    }

    # Determine distance category
    long_haul = destination in ["JFK", "BKK", "NRT", "SIN", "MLE", "HNL", "CPT", "CUN", "HAN", "CMB"]
    medium_haul = destination in ["IST", "DXB", "RAK"]
    distance = "long" if long_haul else "medium" if medium_haul else "short"

    prices = base_prices.get(cabin, base_prices["economy"])[distance]
    duration_ranges = {"short": (1.5, 4), "medium": (4, 7), "long": (7, 16)}
    dur_range = duration_ranges[distance]

    flights = []
    num_flights = random.randint(6, 12)
    for i in range(num_flights):
        airline = random.choice(AIRLINES)
        price = round(random.uniform(prices[0], prices[1]) * passengers, 2)
        stops = 0 if distance == "short" else random.choice([0, 0, 1]) if distance == "medium" else random.choice([0, 1, 1, 2])

        dep_hour = random.randint(5, 22)
        dep_min = random.choice([0, 15, 30, 45])
        duration = _random_duration(dur_range[0], dur_range[1])

        flights.append({
            "id": _generate_id("fl", str(i), airline["code"], dep_date),
            "airline": airline["name"],
            "airline_logo": airline["logo"],
            "flight_number": f"{airline['code']}{random.randint(100, 9999)}",
            "origin": origin,
            "origin_city": origin_name,
            "destination": destination,
            "destination_city": dest_info.get("city", destination),
            "departure_time": f"{dep_date}T{dep_hour:02d}:{dep_min:02d}:00",
            "arrival_time": f"{dep_date}T{min(dep_hour + int(dur_range[0]) + 1, 23):02d}:{dep_min:02d}:00",
            "duration": duration,
            "stops": stops,
            "price": price,
            "currency": params.get("currency", "GBP"),
            "cabin_class": cabin,
            "booking_url": f"https://www.skyscanner.net/transport/flights/{origin.lower()}/{destination.lower()}/{dep_date.replace('-', '')}",
            "carbon_emissions": f"{random.randint(80, 500)} kg CO2",
        })

    flights.sort(key=lambda x: x["price"])

    if params.get("max_price"):
        flights = [f for f in flights if f["price"] <= params["max_price"]]
    if params.get("direct_only"):
        flights = [f for f in flights if f["stops"] == 0]

    return flights


def generate_flight_deals(origin: str = "LHR") -> list[dict]:
    """Generate trending flight deals from UK airports."""
    deals = []
    deal_types = ["regular", "hot_deal", "last_minute", "error_fare"]
    today = datetime.now()

    for i, dest in enumerate(random.sample(POPULAR_DESTINATIONS, min(12, len(POPULAR_DESTINATIONS)))):
        dep_offset = random.randint(7, 90)
        duration = random.randint(3, 14)
        dep_date = today + timedelta(days=dep_offset)
        ret_date = dep_date + timedelta(days=duration)

        long_haul = dest["code"] in ["JFK", "BKK", "NRT", "SIN", "MLE", "HNL", "CPT", "CUN", "HAN", "CMB"]
        base_price = random.uniform(250, 600) if long_haul else random.uniform(20, 200)
        deal_type = random.choice(deal_types)
        if deal_type == "hot_deal":
            base_price *= 0.7
        elif deal_type == "error_fare":
            base_price *= 0.4

        deals.append({
            "id": _generate_id("deal", dest["code"], str(i)),
            "origin": origin,
            "origin_city": UK_AIRPORTS.get(origin, origin),
            "destination": dest["code"],
            "destination_city": dest["city"],
            "destination_country": dest["country"],
            "destination_image": dest["image"],
            "price": round(base_price, 2),
            "currency": "GBP",
            "departure_date": dep_date.strftime("%Y-%m-%d"),
            "return_date": ret_date.strftime("%Y-%m-%d"),
            "airline": random.choice(AIRLINES)["name"],
            "deal_type": deal_type,
        })

    deals.sort(key=lambda x: x["price"])
    return deals


async def search_flights(params: dict) -> list[dict]:
    """Search flights - tries Amadeus API first, falls back to mock data."""
    # Try Amadeus API first
    results = await search_flights_amadeus(params)
    if results:
        return results

    # Fallback to generated data
    return generate_mock_flights(params)
