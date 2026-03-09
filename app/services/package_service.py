"""Holiday package service combining flights + hotels."""

import hashlib
import random
from datetime import datetime, timedelta

PACKAGE_IMAGES = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
]

PACKAGE_DESTINATIONS = [
    {"name": "Barcelona", "country": "Spain", "hotel": "Hotel Arts Barcelona", "rating": 4.5},
    {"name": "Paris", "country": "France", "hotel": "Hotel Le Marais", "rating": 4.3},
    {"name": "Rome", "country": "Italy", "hotel": "Hotel Colosseo", "rating": 4.2},
    {"name": "Lisbon", "country": "Portugal", "hotel": "Pestana Palace", "rating": 4.6},
    {"name": "Amsterdam", "country": "Netherlands", "hotel": "NH Collection", "rating": 4.1},
    {"name": "Athens", "country": "Greece", "hotel": "Athens Grand Hotel", "rating": 4.0},
    {"name": "Dubai", "country": "UAE", "hotel": "Atlantis The Palm", "rating": 4.8},
    {"name": "Bangkok", "country": "Thailand", "hotel": "Shangri-La Bangkok", "rating": 4.7},
    {"name": "Bali", "country": "Indonesia", "hotel": "Four Seasons Bali", "rating": 4.9},
    {"name": "Cancun", "country": "Mexico", "hotel": "Hyatt Ziva Cancun", "rating": 4.5},
    {"name": "Marrakech", "country": "Morocco", "hotel": "Riad Kniza", "rating": 4.4},
    {"name": "Istanbul", "country": "Turkey", "hotel": "Raffles Istanbul", "rating": 4.3},
    {"name": "Cape Town", "country": "South Africa", "hotel": "Table Bay Hotel", "rating": 4.6},
    {"name": "Maldives", "country": "Maldives", "hotel": "Soneva Fushi", "rating": 4.9},
    {"name": "Reykjavik", "country": "Iceland", "hotel": "Hotel Borg", "rating": 4.2},
]

MEAL_OPTIONS = ["room_only", "breakfast", "half_board", "full_board", "all_inclusive"]


def _generate_id(prefix: str, *args: str) -> str:
    raw = "-".join(str(a) for a in args)
    return f"{prefix}-{hashlib.md5(raw.encode()).hexdigest()[:12]}"


def generate_packages(destination: str | None = None, origin: str = "London") -> list[dict]:
    """Generate holiday packages."""
    today = datetime.now()
    packages = []
    deal_types = ["regular", "regular", "hot_deal", "last_minute", "early_bird"]

    dests = PACKAGE_DESTINATIONS
    if destination:
        dests = [d for d in dests if d["name"].lower() == destination.lower()]
        if not dests:
            dests = [{"name": destination, "country": "", "hotel": f"Hotel {destination}", "rating": 4.0}]

    for i, dest in enumerate(dests):
        for j in range(random.randint(1, 3)):
            nights = random.choice([3, 4, 5, 7, 10, 14])
            dep_offset = random.randint(7, 120)
            dep_date = today + timedelta(days=dep_offset)
            ret_date = dep_date + timedelta(days=nights)
            meal = random.choice(MEAL_OPTIONS)
            deal_type = random.choice(deal_types)

            base_price = random.uniform(200, 1200)
            if deal_type == "hot_deal":
                base_price *= 0.7
            elif deal_type == "last_minute":
                base_price *= 0.6
            elif deal_type == "early_bird":
                base_price *= 0.85

            ppp = round(base_price, 2)
            total = round(ppp * 2, 2)  # Assume 2 people

            includes = ["Return flights", f"{nights} nights accommodation"]
            if meal == "breakfast":
                includes.append("Daily breakfast")
            elif meal == "half_board":
                includes.extend(["Daily breakfast", "Daily dinner"])
            elif meal == "full_board":
                includes.extend(["Daily breakfast", "Daily lunch", "Daily dinner"])
            elif meal == "all_inclusive":
                includes.extend(["All meals", "Unlimited drinks", "Selected activities"])

            if random.random() > 0.5:
                includes.append("Airport transfers")
            if random.random() > 0.7:
                includes.append("Travel insurance")

            packages.append({
                "id": _generate_id("pkg", dest["name"], str(i), str(j)),
                "name": f"{nights}-Night {dest['name']} {'All-Inclusive ' if meal == 'all_inclusive' else ''}{'Beach ' if random.random() > 0.5 else ''}Getaway",
                "destination": dest["name"],
                "destination_country": dest["country"],
                "description": f"Enjoy {nights} unforgettable nights in {dest['name']}, {dest['country']}. Stay at the wonderful {dest['hotel']} with {meal.replace('_', ' ')} included.",
                "image_url": random.choice(PACKAGE_IMAGES),
                "flight_details": f"Return flights from {origin} to {dest['name']}",
                "hotel_name": dest["hotel"],
                "hotel_rating": dest["rating"],
                "duration_nights": nights,
                "price_per_person": ppp,
                "total_price": total,
                "currency": "GBP",
                "includes": includes,
                "deal_type": deal_type,
                "departure_date": dep_date.strftime("%Y-%m-%d"),
                "return_date": ret_date.strftime("%Y-%m-%d"),
                "origin": origin,
                "meals": meal,
            })

    packages.sort(key=lambda x: x["price_per_person"])
    return packages


def get_package_deals() -> list[dict]:
    """Get top package deals."""
    all_packages = generate_packages()
    deals = [p for p in all_packages if p["deal_type"] in ("hot_deal", "last_minute")]
    if not deals:
        deals = all_packages[:8]
    return deals[:12]
