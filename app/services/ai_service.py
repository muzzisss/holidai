import json
from openai import AsyncOpenAI
from app.services.config import get_setting


SYSTEM_PROMPT = """You are HolidAI, an expert AI travel planner specializing in helping UK-based travelers plan the perfect holiday on any budget. You have deep knowledge of:

- Best flight deals from UK airports (Heathrow, Gatwick, Manchester, Edinburgh, etc.)
- Budget-friendly destinations worldwide
- Hotel recommendations for every budget
- Must-do activities and experiences
- Local food and culture tips
- Visa requirements for UK passport holders
- Best times to visit different destinations
- Money-saving travel hacks
- Safety information and travel advisories

When planning trips:
1. Always consider the user's budget and travel style
2. Suggest specific dates if they offer better value
3. Include a mix of popular and hidden gem activities
4. Factor in local transport costs
5. Recommend places to eat (budget to luxury options)
6. Note any visa requirements or travel restrictions
7. Include weather/climate considerations
8. Suggest packing tips relevant to the destination

Format your responses with clear sections, bullet points, and estimated costs in GBP where possible. Be enthusiastic but practical!"""


async def chat_with_ai(messages: list[dict], context: str | None = None) -> str:
    """Chat with AI about travel planning."""
    api_key = get_setting("openai_api_key")
    if not api_key:
        return _generate_fallback_response(messages)

    try:
        client = AsyncOpenAI(api_key=api_key)
        system_msg = SYSTEM_PROMPT
        if context:
            system_msg += f"\n\nAdditional context: {context}"

        api_messages = [{"role": "system", "content": system_msg}]
        for msg in messages:
            api_messages.append({"role": msg["role"], "content": msg["content"]})

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=api_messages,
            temperature=0.7,
            max_tokens=2000,
        )
        return response.choices[0].message.content or "I couldn't generate a response. Please try again."
    except Exception as e:
        return _generate_fallback_response(messages)


async def plan_trip(params: dict) -> dict:
    """Generate a comprehensive trip plan using AI."""
    api_key = get_setting("openai_api_key")

    prompt = _build_trip_prompt(params)

    if not api_key:
        return _generate_fallback_plan(params)

    try:
        client = AsyncOpenAI(api_key=api_key)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT + "\n\nGenerate a detailed trip plan in JSON format with the following structure: {\"title\": \"...\", \"summary\": \"...\", \"estimated_total_cost\": 0, \"currency\": \"GBP\", \"days\": [{\"day\": 1, \"title\": \"...\", \"activities\": [{\"time\": \"09:00\", \"activity\": \"...\", \"description\": \"...\", \"estimated_cost\": 0, \"tips\": \"...\"}]}], \"budget_breakdown\": {\"flights\": 0, \"accommodation\": 0, \"food\": 0, \"activities\": 0, \"transport\": 0, \"misc\": 0}, \"money_saving_tips\": [\"...\"], \"packing_list\": [\"...\"], \"important_notes\": [\"...\"]}"},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=3000,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content or "{}"
        return json.loads(content)
    except Exception:
        return _generate_fallback_plan(params)


def _build_trip_prompt(params: dict) -> str:
    parts = ["Plan a trip with these details:"]
    if params.get("destination"):
        parts.append(f"- Destination: {params['destination']}")
    if params.get("budget"):
        parts.append(f"- Budget: {params.get('currency', 'GBP')} {params['budget']}")
    if params.get("duration_days"):
        parts.append(f"- Duration: {params['duration_days']} days")
    if params.get("travel_style"):
        parts.append(f"- Travel style: {params['travel_style']}")
    if params.get("interests"):
        parts.append(f"- Interests: {', '.join(params['interests'])}")
    if params.get("departure_city"):
        parts.append(f"- Departing from: {params['departure_city']}")
    if params.get("departure_date"):
        parts.append(f"- Departure date: {params['departure_date']}")
    if params.get("num_travelers"):
        parts.append(f"- Number of travelers: {params['num_travelers']}")
    if params.get("special_requirements"):
        parts.append(f"- Special requirements: {params['special_requirements']}")
    return "\n".join(parts)


def _generate_fallback_response(messages: list[dict]) -> str:
    """Generate a helpful response without OpenAI API."""
    last_msg = messages[-1]["content"].lower() if messages else ""

    if any(w in last_msg for w in ["cheap", "budget", "affordable", "save"]):
        return """## Budget Travel Tips from HolidAI

Here are some great budget-friendly destinations from the UK:

### Top Budget Destinations
- **Budapest, Hungary** - Flights from ~£30, hostels from £8/night
- **Porto, Portugal** - Flights from ~£25, amazing food for £5-10/meal
- **Krakow, Poland** - Flights from ~£20, incredible value for money
- **Marrakech, Morocco** - Flights from ~£40, riads from £15/night
- **Hanoi, Vietnam** - Flights from ~£350 return, daily budget £15-20

### Money-Saving Tips
- Book flights 6-8 weeks in advance for best prices
- Use Skyscanner's "Everywhere" search to find cheapest destinations
- Travel midweek (Tue-Thu) for cheaper flights
- Consider overnight buses/trains to save on accommodation
- Eat where locals eat - avoid tourist trap restaurants
- Get a Revolut/Wise card for fee-free spending abroad

To get a personalised trip plan, please configure your OpenAI API key in Settings!"""

    if any(w in last_msg for w in ["beach", "sun", "warm", "tropical"]):
        return """## Best Beach Destinations from the UK

### Short-Haul (2-4h flights)
- **Algarve, Portugal** - Stunning cliffs, warm water, great value
- **Crete, Greece** - Beautiful beaches, amazing food, rich history
- **Costa Brava, Spain** - Hidden coves, vibrant nightlife
- **Sardinia, Italy** - Crystal-clear waters, stunning coastline

### Long-Haul (Best value)
- **Bali, Indonesia** - Paradise from £400 return, £20/day budget
- **Sri Lanka** - Diverse beaches, wildlife, culture
- **Thailand** - Ko Samui, Krabi, Phuket - something for everyone
- **Maldives** - Surprisingly affordable guesthouses from £40/night

### Best Time to Book
- Book 2-3 months ahead for summer
- Look for deals Jan-Feb for summer holidays
- Consider shoulder season (May, Sep-Oct) for best weather + prices

Configure your OpenAI API key in Settings for personalised AI recommendations!"""

    return """## Welcome to HolidAI! 🌍

I'm your AI travel planning assistant! I can help you with:

### What I Can Do
- **Plan entire trips** - Just tell me your destination, budget, and interests
- **Find deals** - I know the best budget hacks for UK travelers
- **Suggest destinations** - Based on your interests and budget
- **Create itineraries** - Day-by-day plans with activities and costs
- **Answer travel questions** - Visa info, best times to visit, safety tips

### Try Asking Me
- "Plan a 7-day trip to Japan on a £1500 budget"
- "What's the cheapest beach holiday in October?"
- "Suggest a romantic weekend getaway from London"
- "What should I pack for Thailand in December?"
- "Compare costs: Bali vs Thailand for 2 weeks"

### Pro Tip
For the best AI-powered responses, add your OpenAI API key in the Settings page. Without it, I'll still provide helpful pre-built travel advice!

What would you like to plan today?"""


def _generate_fallback_plan(params: dict) -> dict:
    """Generate a trip plan without OpenAI."""
    dest = params.get("destination", "Barcelona")
    days = params.get("duration_days", 5)
    budget = params.get("budget", 500)
    style = params.get("travel_style", "balanced")
    travelers = params.get("num_travelers", 1)

    daily_activities = []
    for d in range(1, days + 1):
        activities = [
            {"time": "08:00", "activity": "Breakfast at local cafe", "description": f"Start your day with authentic local breakfast in {dest}", "estimated_cost": 8, "tips": "Ask locals for recommendations"},
            {"time": "10:00", "activity": f"Morning sightseeing in {dest}", "description": "Visit the top attractions and landmarks", "estimated_cost": 15, "tips": "Book tickets online to skip queues"},
            {"time": "13:00", "activity": "Lunch at local restaurant", "description": "Try the local cuisine at a popular spot", "estimated_cost": 12, "tips": "Lunch menus are usually cheaper than dinner"},
            {"time": "15:00", "activity": f"Afternoon activity - Day {d}", "description": "Explore a different area or do an activity", "estimated_cost": 20, "tips": "Check for free walking tours"},
            {"time": "19:00", "activity": "Dinner", "description": "Evening meal at a recommended restaurant", "estimated_cost": 18, "tips": "Book popular restaurants in advance"},
        ]
        daily_activities.append({
            "day": d,
            "title": f"Day {d} - Exploring {dest}",
            "activities": activities,
        })

    flight_cost = 120 if style == "budget" else 200 if style == "balanced" else 400
    hotel_cost = (30 if style == "budget" else 70 if style == "balanced" else 180) * days

    return {
        "title": f"{days}-Day {dest} Adventure",
        "summary": f"A wonderful {days}-day trip to {dest} for {travelers} traveler(s). This {style} itinerary balances sightseeing, culture, and relaxation.",
        "estimated_total_cost": round((flight_cost + hotel_cost + days * 60) * travelers, 2),
        "currency": params.get("currency", "GBP"),
        "days": daily_activities,
        "budget_breakdown": {
            "flights": round(flight_cost * travelers, 2),
            "accommodation": round(hotel_cost * travelers, 2),
            "food": round(days * 35 * travelers, 2),
            "activities": round(days * 20 * travelers, 2),
            "transport": round(days * 8 * travelers, 2),
            "misc": round(days * 5 * travelers, 2),
        },
        "money_saving_tips": [
            "Book flights 6-8 weeks in advance",
            "Use public transport instead of taxis",
            "Eat lunch at local markets for great value",
            "Get a city pass for free public transport and museum entries",
            "Stay in hostels or Airbnb for budget accommodation",
            "Travel with a Revolut card for fee-free currency exchange",
        ],
        "packing_list": [
            "Passport (check 6+ months validity)",
            "Travel adapter (EU type C/F)",
            "Comfortable walking shoes",
            "Light layers for variable weather",
            "Reusable water bottle",
            "Portable phone charger",
            "Travel insurance documents",
        ],
        "important_notes": [
            "UK passport holders don't need a visa for short stays in most EU countries",
            "Register with the FCDO for travel alerts",
            "Check NHS requirements for travel vaccinations",
            f"Local emergency number in {dest}: 112 (EU standard)",
        ],
    }
