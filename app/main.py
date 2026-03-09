from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import flights, hotels, activities, ai_planner, budget, weather, currency, destinations, itineraries, packages, settings as settings_router

app = FastAPI(
    title="HolidAI API",
    description="Ultimate Holiday Booking Tool - AI-Powered Travel Planning",
    version="1.0.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(flights.router, prefix="/api/flights", tags=["Flights"])
app.include_router(hotels.router, prefix="/api/hotels", tags=["Hotels"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(ai_planner.router, prefix="/api/ai", tags=["AI Planner"])
app.include_router(budget.router, prefix="/api/budget", tags=["Budget"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(currency.router, prefix="/api/currency", tags=["Currency"])
app.include_router(destinations.router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(itineraries.router, prefix="/api/itineraries", tags=["Itineraries"])
app.include_router(packages.router, prefix="/api/packages", tags=["Packages"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["Settings"])

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "name": "HolidAI API",
        "version": "1.0.0",
        "description": "Ultimate Holiday Booking Tool - AI-Powered Travel Planning",
        "endpoints": {
            "flights": "/api/flights",
            "hotels": "/api/hotels",
            "activities": "/api/activities",
            "ai_planner": "/api/ai",
            "budget": "/api/budget",
            "weather": "/api/weather",
            "currency": "/api/currency",
            "destinations": "/api/destinations",
            "itineraries": "/api/itineraries",
            "packages": "/api/packages",
            "settings": "/api/settings",
        }
    }
