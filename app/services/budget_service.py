"""Budget estimation service with cost data for popular destinations."""

# Daily cost estimates per person in GBP by destination and style
DESTINATION_COSTS = {
    "barcelona": {"budget": {"food": 20, "transport": 5, "activities": 10, "hotel": 30, "flight": 40}, "balanced": {"food": 40, "transport": 10, "activities": 25, "hotel": 80, "flight": 80}, "luxury": {"food": 80, "transport": 25, "activities": 60, "hotel": 200, "flight": 200}},
    "paris": {"budget": {"food": 25, "transport": 8, "activities": 12, "hotel": 40, "flight": 50}, "balanced": {"food": 50, "transport": 15, "activities": 30, "hotel": 100, "flight": 100}, "luxury": {"food": 100, "transport": 30, "activities": 70, "hotel": 300, "flight": 250}},
    "rome": {"budget": {"food": 20, "transport": 5, "activities": 10, "hotel": 35, "flight": 45}, "balanced": {"food": 40, "transport": 10, "activities": 25, "hotel": 90, "flight": 90}, "luxury": {"food": 80, "transport": 25, "activities": 55, "hotel": 220, "flight": 220}},
    "amsterdam": {"budget": {"food": 22, "transport": 6, "activities": 12, "hotel": 35, "flight": 40}, "balanced": {"food": 45, "transport": 12, "activities": 28, "hotel": 95, "flight": 85}, "luxury": {"food": 90, "transport": 25, "activities": 60, "hotel": 250, "flight": 200}},
    "lisbon": {"budget": {"food": 15, "transport": 4, "activities": 8, "hotel": 25, "flight": 35}, "balanced": {"food": 30, "transport": 8, "activities": 20, "hotel": 65, "flight": 70}, "luxury": {"food": 65, "transport": 20, "activities": 45, "hotel": 180, "flight": 180}},
    "athens": {"budget": {"food": 15, "transport": 4, "activities": 8, "hotel": 25, "flight": 50}, "balanced": {"food": 30, "transport": 8, "activities": 20, "hotel": 70, "flight": 100}, "luxury": {"food": 65, "transport": 20, "activities": 45, "hotel": 200, "flight": 200}},
    "istanbul": {"budget": {"food": 10, "transport": 3, "activities": 8, "hotel": 20, "flight": 60}, "balanced": {"food": 25, "transport": 6, "activities": 18, "hotel": 55, "flight": 120}, "luxury": {"food": 55, "transport": 15, "activities": 40, "hotel": 160, "flight": 250}},
    "dubai": {"budget": {"food": 20, "transport": 8, "activities": 15, "hotel": 40, "flight": 150}, "balanced": {"food": 45, "transport": 15, "activities": 35, "hotel": 100, "flight": 250}, "luxury": {"food": 100, "transport": 30, "activities": 80, "hotel": 350, "flight": 500}},
    "bangkok": {"budget": {"food": 8, "transport": 3, "activities": 5, "hotel": 12, "flight": 200}, "balanced": {"food": 18, "transport": 6, "activities": 12, "hotel": 35, "flight": 350}, "luxury": {"food": 45, "transport": 15, "activities": 35, "hotel": 120, "flight": 600}},
    "new york": {"budget": {"food": 30, "transport": 10, "activities": 15, "hotel": 60, "flight": 200}, "balanced": {"food": 55, "transport": 18, "activities": 35, "hotel": 140, "flight": 350}, "luxury": {"food": 120, "transport": 35, "activities": 80, "hotel": 400, "flight": 700}},
    "tokyo": {"budget": {"food": 15, "transport": 8, "activities": 10, "hotel": 30, "flight": 250}, "balanced": {"food": 35, "transport": 15, "activities": 25, "hotel": 80, "flight": 400}, "luxury": {"food": 80, "transport": 25, "activities": 55, "hotel": 250, "flight": 700}},
    "bali": {"budget": {"food": 6, "transport": 3, "activities": 5, "hotel": 10, "flight": 250}, "balanced": {"food": 15, "transport": 6, "activities": 12, "hotel": 35, "flight": 400}, "luxury": {"food": 40, "transport": 15, "activities": 30, "hotel": 150, "flight": 650}},
    "cancun": {"budget": {"food": 15, "transport": 5, "activities": 10, "hotel": 25, "flight": 250}, "balanced": {"food": 30, "transport": 10, "activities": 25, "hotel": 70, "flight": 400}, "luxury": {"food": 70, "transport": 20, "activities": 55, "hotel": 200, "flight": 650}},
    "cape town": {"budget": {"food": 10, "transport": 4, "activities": 8, "hotel": 18, "flight": 250}, "balanced": {"food": 22, "transport": 8, "activities": 18, "hotel": 50, "flight": 400}, "luxury": {"food": 50, "transport": 18, "activities": 40, "hotel": 150, "flight": 650}},
    "marrakech": {"budget": {"food": 8, "transport": 3, "activities": 5, "hotel": 12, "flight": 50}, "balanced": {"food": 18, "transport": 6, "activities": 12, "hotel": 40, "flight": 100}, "luxury": {"food": 40, "transport": 15, "activities": 30, "hotel": 120, "flight": 200}},
    "default": {"budget": {"food": 18, "transport": 5, "activities": 10, "hotel": 30, "flight": 100}, "balanced": {"food": 35, "transport": 10, "activities": 25, "hotel": 80, "flight": 200}, "luxury": {"food": 75, "transport": 22, "activities": 55, "hotel": 200, "flight": 400}},
}


def calculate_budget(params: dict) -> dict:
    """Calculate a trip budget breakdown."""
    destination = params.get("destination", "Barcelona").lower()
    days = params.get("duration_days", 5)
    travelers = params.get("num_travelers", 1)
    style = params.get("travel_style", "balanced")

    costs = DESTINATION_COSTS.get(destination, DESTINATION_COSTS["default"])
    style_costs = costs.get(style, costs["balanced"])

    categories = []
    total_min = 0
    total_max = 0

    if params.get("include_flights", True):
        flight_cost = style_costs["flight"]
        categories.append({
            "category": "Flights (return)",
            "estimated_min": round(flight_cost * 0.7 * travelers, 2),
            "estimated_max": round(flight_cost * 1.5 * travelers, 2),
            "average": round(flight_cost * travelers, 2),
            "currency": "GBP",
            "notes": "Prices vary by booking time and airline. Book 6-8 weeks ahead for best deals.",
        })
        total_min += flight_cost * 0.7 * travelers
        total_max += flight_cost * 1.5 * travelers

    if params.get("include_hotels", True):
        hotel_cost = style_costs["hotel"] * days
        categories.append({
            "category": "Accommodation",
            "estimated_min": round(hotel_cost * 0.7 * travelers / max(travelers, 1), 2),
            "estimated_max": round(hotel_cost * 1.4 * travelers / max(travelers, 1), 2),
            "average": round(hotel_cost, 2),
            "currency": "GBP",
            "notes": f"Based on {days} nights. Consider hostels/Airbnb for budget stays.",
        })
        total_min += hotel_cost * 0.7
        total_max += hotel_cost * 1.4

    if params.get("include_food", True):
        food_cost = style_costs["food"] * days * travelers
        categories.append({
            "category": "Food & Drinks",
            "estimated_min": round(food_cost * 0.7, 2),
            "estimated_max": round(food_cost * 1.3, 2),
            "average": round(food_cost, 2),
            "currency": "GBP",
            "notes": "Eat like a local to save! Markets and street food are cheapest.",
        })
        total_min += food_cost * 0.7
        total_max += food_cost * 1.3

    if params.get("include_activities", True):
        activity_cost = style_costs["activities"] * days * travelers
        categories.append({
            "category": "Activities & Experiences",
            "estimated_min": round(activity_cost * 0.5, 2),
            "estimated_max": round(activity_cost * 1.5, 2),
            "average": round(activity_cost, 2),
            "currency": "GBP",
            "notes": "Many free walking tours and museums have free entry days.",
        })
        total_min += activity_cost * 0.5
        total_max += activity_cost * 1.5

    if params.get("include_transport", True):
        transport_cost = style_costs["transport"] * days * travelers
        categories.append({
            "category": "Local Transport",
            "estimated_min": round(transport_cost * 0.6, 2),
            "estimated_max": round(transport_cost * 1.4, 2),
            "average": round(transport_cost, 2),
            "currency": "GBP",
            "notes": "Get a daily/weekly transit pass for savings.",
        })
        total_min += transport_cost * 0.6
        total_max += transport_cost * 1.4

    # Misc
    misc = days * 5 * travelers
    categories.append({
        "category": "Miscellaneous",
        "estimated_min": round(misc * 0.5, 2),
        "estimated_max": round(misc * 2, 2),
        "average": round(misc, 2),
        "currency": "GBP",
        "notes": "Tips, souvenirs, SIM card, travel insurance, etc.",
    })
    total_min += misc * 0.5
    total_max += misc * 2

    total_avg = sum(c["average"] for c in categories)

    tips = [
        "Book flights on Tuesdays for potentially lower prices",
        "Use Skyscanner or Google Flights for best flight comparison",
        "Get a Revolut or Wise card for fee-free spending abroad",
        "Consider traveling in shoulder season for lower prices and fewer crowds",
        "Book accommodation with free cancellation in case plans change",
        "Download offline maps to avoid roaming charges",
        "Look for city tourism passes that bundle attractions and transport",
        "Eat lunch at restaurants (set menus are cheaper) and cook dinner at Airbnb",
    ]

    return {
        "destination": params.get("destination", "Barcelona"),
        "duration_days": days,
        "num_travelers": travelers,
        "travel_style": style,
        "categories": categories,
        "total_min": round(total_min, 2),
        "total_max": round(total_max, 2),
        "total_average": round(total_avg, 2),
        "daily_average": round(total_avg / days, 2) if days > 0 else 0,
        "currency": "GBP",
        "tips": tips,
    }


def get_budget_estimates() -> list[dict]:
    """Get quick budget estimates for popular destinations."""
    estimates = []
    display_names = {
        "barcelona": "Barcelona", "paris": "Paris", "rome": "Rome",
        "bangkok": "Bangkok", "tokyo": "Tokyo", "bali": "Bali",
        "dubai": "Dubai", "new york": "New York", "lisbon": "Lisbon",
        "marrakech": "Marrakech", "cape town": "Cape Town", "istanbul": "Istanbul",
    }

    for key, name in display_names.items():
        costs = DESTINATION_COSTS.get(key, DESTINATION_COSTS["default"])
        for style in ["budget", "balanced", "luxury"]:
            sc = costs[style]
            daily = sc["food"] + sc["transport"] + sc["activities"] + sc["hotel"]
            estimates.append({
                "destination": name,
                "travel_style": style,
                "daily_cost_gbp": daily,
                "weekly_cost_gbp": daily * 7 + sc["flight"],
                "flight_cost_gbp": sc["flight"],
            })

    return estimates
