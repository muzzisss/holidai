from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


# ── Flight Models ──
class FlightSearchRequest(BaseModel):
    origin: str = Field(..., description="Origin airport code e.g. LHR")
    destination: str = Field(..., description="Destination airport code e.g. JFK")
    departure_date: str = Field(..., description="Departure date YYYY-MM-DD")
    return_date: Optional[str] = Field(None, description="Return date YYYY-MM-DD")
    passengers: int = Field(1, ge=1, le=9)
    cabin_class: str = Field("economy", description="economy, premium_economy, business, first")
    direct_only: bool = False
    max_price: Optional[float] = None
    currency: str = "GBP"


class Flight(BaseModel):
    id: str
    airline: str
    airline_logo: Optional[str] = None
    flight_number: str
    origin: str
    origin_city: str
    destination: str
    destination_city: str
    departure_time: str
    arrival_time: str
    duration: str
    stops: int
    price: float
    currency: str = "GBP"
    cabin_class: str
    booking_url: Optional[str] = None
    carbon_emissions: Optional[str] = None


class FlightDeal(BaseModel):
    id: str
    origin: str
    origin_city: str
    destination: str
    destination_city: str
    destination_country: str
    destination_image: Optional[str] = None
    price: float
    currency: str = "GBP"
    departure_date: str
    return_date: str
    airline: str
    deal_type: str = "regular"  # regular, hot_deal, last_minute, error_fare


# ── Hotel Models ──
class HotelSearchRequest(BaseModel):
    destination: str
    check_in: str
    check_out: str
    guests: int = Field(2, ge=1)
    rooms: int = Field(1, ge=1)
    min_rating: Optional[float] = None
    max_price: Optional[float] = None
    currency: str = "GBP"


class Hotel(BaseModel):
    id: str
    name: str
    address: str
    city: str
    country: str
    rating: float
    review_count: int
    price_per_night: float
    total_price: float
    currency: str = "GBP"
    image_url: Optional[str] = None
    amenities: list[str] = []
    stars: int = 0
    booking_url: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# ── Activity Models ──
class Activity(BaseModel):
    id: str
    name: str
    description: str
    category: str
    destination: str
    price: float
    currency: str = "GBP"
    duration: str
    rating: float
    review_count: int
    image_url: Optional[str] = None
    booking_url: Optional[str] = None
    highlights: list[str] = []
    included: list[str] = []


# ── Package Models ──
class HolidayPackage(BaseModel):
    id: str
    name: str
    destination: str
    destination_country: str
    description: str
    image_url: Optional[str] = None
    flight_details: str
    hotel_name: str
    hotel_rating: float
    duration_nights: int
    price_per_person: float
    total_price: float
    currency: str = "GBP"
    includes: list[str] = []
    deal_type: str = "regular"
    departure_date: str
    return_date: str
    origin: str = "London"
    meals: str = "room_only"  # room_only, breakfast, half_board, full_board, all_inclusive


# ── AI Planner Models ──
class TripPlanRequest(BaseModel):
    destination: Optional[str] = None
    budget: Optional[float] = None
    currency: str = "GBP"
    duration_days: Optional[int] = None
    travel_style: str = "balanced"  # budget, balanced, luxury
    interests: list[str] = []
    departure_city: str = "London"
    departure_date: Optional[str] = None
    num_travelers: int = 1
    special_requirements: Optional[str] = None


class ChatMessage(BaseModel):
    role: str  # user, assistant
    content: str


class AIChatRequest(BaseModel):
    messages: list[ChatMessage]
    context: Optional[str] = None


# ── Budget Models ──
class BudgetCalculateRequest(BaseModel):
    destination: str
    duration_days: int
    num_travelers: int = 1
    travel_style: str = "balanced"
    include_flights: bool = True
    include_hotels: bool = True
    include_food: bool = True
    include_activities: bool = True
    include_transport: bool = True
    currency: str = "GBP"


class BudgetEstimate(BaseModel):
    category: str
    estimated_min: float
    estimated_max: float
    average: float
    currency: str = "GBP"
    notes: str = ""


class BudgetBreakdown(BaseModel):
    destination: str
    duration_days: int
    num_travelers: int
    travel_style: str
    categories: list[BudgetEstimate]
    total_min: float
    total_max: float
    total_average: float
    daily_average: float
    currency: str = "GBP"
    tips: list[str] = []


# ── Weather Models ──
class WeatherForecast(BaseModel):
    date: str
    temp_min: float
    temp_max: float
    temp_avg: float
    description: str
    icon: str
    humidity: int
    wind_speed: float
    precipitation_chance: int


class DestinationWeather(BaseModel):
    destination: str
    country: str
    current_temp: float
    current_description: str
    current_icon: str
    forecast: list[WeatherForecast]
    best_months: list[str] = []
    avg_temp_by_month: dict[str, float] = {}


# ── Currency Models ──
class CurrencyConversion(BaseModel):
    from_currency: str
    to_currency: str
    amount: float
    converted_amount: float
    rate: float
    last_updated: str


# ── Destination Models ──
class Destination(BaseModel):
    id: str
    name: str
    country: str
    continent: str
    description: str
    image_url: Optional[str] = None
    avg_flight_price_gbp: Optional[float] = None
    avg_hotel_price_gbp: Optional[float] = None
    avg_daily_cost_gbp: Optional[float] = None
    best_months: list[str] = []
    highlights: list[str] = []
    currency: str = ""
    language: str = ""
    timezone: str = ""
    visa_required: bool = False
    safety_rating: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# ── Itinerary Models ──
class ItineraryItem(BaseModel):
    id: str
    time: str
    title: str
    description: str
    category: str  # flight, hotel, activity, transport, food, free_time
    location: Optional[str] = None
    cost: Optional[float] = None
    currency: str = "GBP"
    booking_url: Optional[str] = None
    notes: Optional[str] = None


class ItineraryDay(BaseModel):
    day_number: int
    date: str
    title: str
    items: list[ItineraryItem] = []


class Itinerary(BaseModel):
    id: str
    name: str
    destination: str
    start_date: str
    end_date: str
    days: list[ItineraryDay] = []
    total_cost: float = 0
    currency: str = "GBP"
    notes: Optional[str] = None
    created_at: str = ""
    updated_at: str = ""


class ItineraryCreateRequest(BaseModel):
    name: str
    destination: str
    start_date: str
    end_date: str
    notes: Optional[str] = None


# ── Settings Models ──
class UserSettings(BaseModel):
    openai_api_key: Optional[str] = None
    amadeus_api_key: Optional[str] = None
    amadeus_api_secret: Optional[str] = None
    weather_api_key: Optional[str] = None
    currency_api_key: Optional[str] = None
    serpapi_key: Optional[str] = None
    home_airport: str = "LHR"
    preferred_currency: str = "GBP"
    preferred_cabin_class: str = "economy"
    travel_style: str = "balanced"
    notification_deals: bool = True
    dark_mode: bool = False
