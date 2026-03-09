import hashlib
import random

ACTIVITY_CATEGORIES = ["adventure", "culture", "food", "nature", "nightlife", "relaxation", "shopping", "sightseeing", "water_sports", "workshops"]

ACTIVITY_TEMPLATES = {
    "adventure": [
        ("Zip Line Adventure", "Soar through the sky on an exhilarating zip line course"),
        ("Mountain Hiking Tour", "Guided trek through stunning mountain landscapes"),
        ("Bungee Jumping Experience", "Heart-pounding bungee jump from iconic heights"),
        ("Paragliding Flight", "Tandem paragliding with breathtaking views"),
        ("Rock Climbing Session", "Indoor or outdoor climbing with expert guides"),
        ("Quad Biking Safari", "Off-road quad biking through rugged terrain"),
    ],
    "culture": [
        ("Historical Walking Tour", "Discover centuries of history with expert local guides"),
        ("Museum Pass & Guided Tour", "Skip-the-line access to top museums"),
        ("Local Art Gallery Tour", "Explore the vibrant local art scene"),
        ("Traditional Cooking Class", "Learn to cook authentic local dishes"),
        ("Archaeological Site Visit", "Explore ancient ruins with an archaeologist"),
        ("Traditional Dance Show", "Experience authentic local performing arts"),
    ],
    "food": [
        ("Street Food Walking Tour", "Taste the best street food with a local foodie"),
        ("Wine Tasting Experience", "Sample premium local wines with a sommelier"),
        ("Market Tour & Cooking Class", "Shop at local markets and cook a feast"),
        ("Craft Beer Tasting", "Discover local craft breweries"),
        ("Fine Dining Experience", "Multi-course meal at a top restaurant"),
        ("Food & History Tour", "Combine culture and cuisine on this walking tour"),
    ],
    "nature": [
        ("National Park Day Trip", "Full-day guided tour of stunning natural beauty"),
        ("Sunset Boat Cruise", "Romantic cruise with panoramic sunset views"),
        ("Wildlife Safari", "Spot incredible wildlife in their natural habitat"),
        ("Botanical Garden Visit", "Stroll through exotic gardens and greenhouses"),
        ("Whale Watching Tour", "Spot majestic whales in the open ocean"),
        ("Waterfall Hike", "Trek to breathtaking hidden waterfalls"),
    ],
    "nightlife": [
        ("Pub Crawl", "Visit the best bars and pubs with a fun group"),
        ("Rooftop Bar Experience", "Cocktails with panoramic city views"),
        ("Live Music Night", "Experience the local live music scene"),
        ("Night Market Tour", "Explore vibrant night markets"),
        ("Comedy Show Evening", "Laugh the night away at a top comedy club"),
    ],
    "water_sports": [
        ("Snorkelling Adventure", "Explore crystal-clear waters and marine life"),
        ("Surfing Lesson", "Learn to surf with professional instructors"),
        ("Kayaking Tour", "Paddle through scenic coastlines and caves"),
        ("Scuba Diving Experience", "Discover the underwater world"),
        ("Jet Ski Rental", "Adrenaline-pumping jet ski adventure"),
        ("Stand-Up Paddleboard", "Relaxing SUP session on calm waters"),
    ],
    "sightseeing": [
        ("Hop-On Hop-Off Bus Tour", "See all the top landmarks at your own pace"),
        ("City Segway Tour", "Fun and unique way to explore the city"),
        ("Helicopter Sightseeing Tour", "Breathtaking aerial city views"),
        ("E-Bike City Tour", "Effortlessly explore the city on an e-bike"),
        ("Photography Walking Tour", "Capture the best shots with a pro photographer"),
    ],
    "relaxation": [
        ("Luxury Spa Day", "Full day of pampering at a premium spa"),
        ("Yoga Retreat Session", "Rejuvenating yoga in a serene setting"),
        ("Hot Springs Visit", "Soak in natural thermal waters"),
        ("Beach Day Package", "Sun lounger, umbrella, and refreshments included"),
        ("Meditation Workshop", "Find your inner peace with guided meditation"),
    ],
}

ACTIVITY_IMAGES = [
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
    "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=400",
]


def _generate_id(prefix: str, *args: str) -> str:
    raw = "-".join(str(a) for a in args)
    return f"{prefix}-{hashlib.md5(raw.encode()).hexdigest()[:12]}"


def generate_activities(destination: str, category: str | None = None) -> list[dict]:
    """Generate activities for a destination."""
    activities = []
    categories = [category] if category and category in ACTIVITY_TEMPLATES else list(ACTIVITY_TEMPLATES.keys())

    for cat in categories:
        templates = ACTIVITY_TEMPLATES.get(cat, [])
        for j, (name, desc) in enumerate(templates):
            price = round(random.uniform(15, 200), 2)
            duration_hours = random.choice([1, 1.5, 2, 2.5, 3, 4, 6, 8])
            duration_str = f"{int(duration_hours)}h" if duration_hours == int(duration_hours) else f"{duration_hours}h"

            activities.append({
                "id": _generate_id("act", destination, cat, str(j)),
                "name": f"{name} in {destination}",
                "description": f"{desc} in {destination}. An unforgettable experience!",
                "category": cat,
                "destination": destination,
                "price": price,
                "currency": "GBP",
                "duration": duration_str,
                "rating": round(random.uniform(3.8, 5.0), 1),
                "review_count": random.randint(50, 3000),
                "image_url": random.choice(ACTIVITY_IMAGES),
                "booking_url": f"https://www.viator.com/searchResults/all?text={destination}+{name.replace(' ', '+')}",
                "highlights": [
                    f"Expert local guide in {destination}",
                    "Small group experience",
                    "Free cancellation up to 24h before",
                    random.choice(["Hotel pickup included", "Includes snacks & drinks", "Photo opportunities", "Equipment provided"]),
                ],
                "included": random.sample([
                    "Guide", "Equipment", "Snacks", "Drinks", "Transport", "Insurance", "Photos", "Entrance fees"
                ], random.randint(2, 5)),
            })

    activities.sort(key=lambda x: (-x["rating"], x["price"]))
    return activities


def get_popular_activities() -> list[dict]:
    """Get popular activities across trending destinations."""
    destinations = ["Barcelona", "Paris", "Rome", "Bangkok", "Tokyo", "Bali", "Dubai", "New York"]
    all_activities = []
    for dest in destinations:
        cat = random.choice(list(ACTIVITY_TEMPLATES.keys()))
        acts = generate_activities(dest, cat)
        if acts:
            all_activities.append(random.choice(acts))
    return all_activities
