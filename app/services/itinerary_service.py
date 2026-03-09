"""In-memory itinerary storage service."""

import uuid
from datetime import datetime

_itineraries: dict[str, dict] = {}


def create_itinerary(data: dict) -> dict:
    itinerary_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()

    # Generate day structure
    from datetime import datetime as dt, timedelta
    try:
        start = dt.strptime(data["start_date"], "%Y-%m-%d")
        end = dt.strptime(data["end_date"], "%Y-%m-%d")
        num_days = max((end - start).days, 1)
    except (ValueError, KeyError):
        num_days = 5
        start = dt.now()

    days = []
    for i in range(num_days):
        day_date = start + timedelta(days=i)
        days.append({
            "day_number": i + 1,
            "date": day_date.strftime("%Y-%m-%d"),
            "title": f"Day {i + 1}",
            "items": [],
        })

    itinerary = {
        "id": itinerary_id,
        "name": data.get("name", "My Trip"),
        "destination": data.get("destination", ""),
        "start_date": data.get("start_date", ""),
        "end_date": data.get("end_date", ""),
        "days": days,
        "total_cost": 0,
        "currency": "GBP",
        "notes": data.get("notes", ""),
        "created_at": now,
        "updated_at": now,
    }

    _itineraries[itinerary_id] = itinerary
    return itinerary


def get_itinerary(itinerary_id: str) -> dict | None:
    return _itineraries.get(itinerary_id)


def list_itineraries() -> list[dict]:
    return list(_itineraries.values())


def update_itinerary(itinerary_id: str, data: dict) -> dict | None:
    if itinerary_id not in _itineraries:
        return None

    itinerary = _itineraries[itinerary_id]
    for key, value in data.items():
        if key != "id" and value is not None:
            itinerary[key] = value
    itinerary["updated_at"] = datetime.now().isoformat()

    # Recalculate total cost
    total = 0
    for day in itinerary.get("days", []):
        for item in day.get("items", []):
            total += item.get("cost", 0) or 0
    itinerary["total_cost"] = round(total, 2)

    _itineraries[itinerary_id] = itinerary
    return itinerary


def delete_itinerary(itinerary_id: str) -> bool:
    if itinerary_id in _itineraries:
        del _itineraries[itinerary_id]
        return True
    return False


def add_item_to_day(itinerary_id: str, day_number: int, item: dict) -> dict | None:
    itinerary = _itineraries.get(itinerary_id)
    if not itinerary:
        return None

    for day in itinerary.get("days", []):
        if day["day_number"] == day_number:
            item_id = str(uuid.uuid4())[:8]
            item["id"] = item_id
            day["items"].append(item)
            itinerary["updated_at"] = datetime.now().isoformat()

            # Recalculate total
            total = sum(
                (it.get("cost", 0) or 0)
                for d in itinerary["days"]
                for it in d.get("items", [])
            )
            itinerary["total_cost"] = round(total, 2)
            return itinerary

    return None


def remove_item_from_day(itinerary_id: str, day_number: int, item_id: str) -> dict | None:
    itinerary = _itineraries.get(itinerary_id)
    if not itinerary:
        return None

    for day in itinerary.get("days", []):
        if day["day_number"] == day_number:
            day["items"] = [it for it in day["items"] if it.get("id") != item_id]
            itinerary["updated_at"] = datetime.now().isoformat()
            total = sum(
                (it.get("cost", 0) or 0)
                for d in itinerary["days"]
                for it in d.get("items", [])
            )
            itinerary["total_cost"] = round(total, 2)
            return itinerary

    return None
