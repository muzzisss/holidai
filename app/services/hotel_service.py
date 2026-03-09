import httpx
import hashlib
import random
from app.services.config import get_setting

HOTEL_CHAINS = [
    "Hilton", "Marriott", "Holiday Inn", "Premier Inn", "Travelodge",
    "Best Western", "Hyatt", "Radisson", "Ibis", "Novotel",
    "Sheraton", "Westin", "Four Seasons", "Ritz-Carlton", "InterContinental",
    "Crowne Plaza", "Hampton Inn", "DoubleTree", "Mercure", "Accor",
]

HOTEL_AMENITIES = [
    "Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar",
    "Room Service", "Airport Shuttle", "Parking", "Breakfast Included",
    "Air Conditioning", "Pet Friendly", "Beach Access", "Balcony",
    "Kitchen", "Laundry", "Business Center", "Concierge", "Rooftop Terrace",
]

HOTEL_IMAGES = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
]


def _generate_id(prefix: str, *args: str) -> str:
    raw = "-".join(str(a) for a in args)
    return f"{prefix}-{hashlib.md5(raw.encode()).hexdigest()[:12]}"


def generate_mock_hotels(params: dict) -> list[dict]:
    """Generate realistic mock hotel data."""
    destination = params.get("destination", "Barcelona")
    check_in = params.get("check_in", "2026-04-15")
    check_out = params.get("check_out", "2026-04-20")
    rooms = params.get("rooms", 1)

    # Calculate nights
    from datetime import datetime
    try:
        ci = datetime.strptime(check_in, "%Y-%m-%d")
        co = datetime.strptime(check_out, "%Y-%m-%d")
        nights = max((co - ci).days, 1)
    except ValueError:
        nights = 5

    hotels = []
    num_hotels = random.randint(8, 15)

    for i in range(num_hotels):
        stars = random.choice([2, 3, 3, 4, 4, 4, 5, 5])
        rating = round(random.uniform(max(6.0, stars * 1.5), min(10.0, stars * 2.1)), 1)
        base_price = {2: (30, 80), 3: (50, 130), 4: (80, 250), 5: (150, 600)}
        price_range = base_price.get(stars, (50, 150))
        ppn = round(random.uniform(price_range[0], price_range[1]) * rooms, 2)
        total = round(ppn * nights, 2)
        num_amenities = random.randint(4, 10)

        chain = random.choice(HOTEL_CHAINS)
        name = f"{chain} {destination}" if random.random() > 0.3 else f"Hotel {destination} {random.choice(['Palace', 'Grand', 'Central', 'Plaza', 'Boutique', 'Suites', 'Resort'])}"

        hotels.append({
            "id": _generate_id("htl", name, str(i)),
            "name": name,
            "address": f"{random.randint(1, 200)} {random.choice(['Main', 'High', 'Central', 'Grand', 'Royal'])} Street",
            "city": destination,
            "country": "",
            "rating": rating,
            "review_count": random.randint(100, 5000),
            "price_per_night": ppn,
            "total_price": total,
            "currency": params.get("currency", "GBP"),
            "image_url": random.choice(HOTEL_IMAGES),
            "amenities": random.sample(HOTEL_AMENITIES, num_amenities),
            "stars": stars,
            "booking_url": f"https://www.booking.com/searchresults.html?ss={destination.replace(' ', '+')}",
            "description": f"Beautiful {stars}-star hotel in the heart of {destination}. Enjoy premium amenities and exceptional service.",
            "latitude": round(random.uniform(35, 55), 6),
            "longitude": round(random.uniform(-5, 25), 6),
        })

    hotels.sort(key=lambda x: x["price_per_night"])

    if params.get("min_rating"):
        hotels = [h for h in hotels if h["rating"] >= params["min_rating"]]
    if params.get("max_price"):
        hotels = [h for h in hotels if h["price_per_night"] <= params["max_price"]]

    return hotels


def generate_hotel_deals() -> list[dict]:
    """Generate hotel deal highlights."""
    destinations = ["Barcelona", "Paris", "Rome", "Amsterdam", "Lisbon", "Dubai", "Bangkok", "New York", "Tokyo", "Bali"]
    deals = []
    for i, dest in enumerate(destinations):
        stars = random.choice([3, 4, 4, 5])
        ppn = round(random.uniform(30, 120), 2)
        deals.append({
            "id": _generate_id("hdeal", dest, str(i)),
            "name": f"{random.choice(HOTEL_CHAINS)} {dest}",
            "address": f"Central {dest}",
            "city": dest,
            "country": "",
            "rating": round(random.uniform(7.5, 9.8), 1),
            "review_count": random.randint(500, 3000),
            "price_per_night": ppn,
            "total_price": round(ppn * 5, 2),
            "currency": "GBP",
            "image_url": random.choice(HOTEL_IMAGES),
            "amenities": random.sample(HOTEL_AMENITIES, 5),
            "stars": stars,
            "booking_url": f"https://www.booking.com/searchresults.html?ss={dest}",
            "description": f"Special deal at this beautiful {stars}-star property in {dest}.",
        })
    deals.sort(key=lambda x: x["price_per_night"])
    return deals


async def search_hotels(params: dict) -> list[dict]:
    return generate_mock_hotels(params)
