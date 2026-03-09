# HolidAI - Ultimate Holiday Booking Dashboard

AI-powered holiday booking tool built for UK travellers. Search flights, hotels, packages, activities — plan your dream trip with an intelligent dashboard.

## Features

- **Flight Search** - Compare flights from all major UK airports worldwide
- **Hotel Search** - Find and compare hotels with detailed amenities, ratings, and pricing
- **Holiday Packages** - Flight + Hotel bundles at unbeatable prices
- **Activities & Experiences** - Discover tours, adventures, and local experiences
- **AI Trip Planner** - Chat with AI to plan your perfect holiday (OpenAI integration)
- **Budget Calculator** - Detailed cost breakdowns with charts and money-saving tips
- **Itinerary Builder** - Plan your trips day by day
- **Destination Explorer** - Browse destinations with weather, currency, and travel info
- **Currency Converter** - Live exchange rates for budget planning
- **Weather Forecasts** - 7-day forecasts for any destination

## Tech Stack

### Backend (FastAPI + Python)
- FastAPI with async/await
- Pydantic validation
- Graceful API degradation (works with mock data, upgradeable with real API keys)
- 11 API endpoint groups

### Frontend (React + TypeScript)
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- Recharts for budget visualizations
- React Router for navigation
- Responsive sidebar layout

## Getting Started

### Backend
```bash
cd /  # root of project
poetry install
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend/
npm install
npm run dev
```

Visit `http://localhost:5173` for the frontend and `http://localhost:8000/docs` for the API docs.

## API Keys (Optional)

The app works out of the box with realistic mock data. Add API keys in the Settings page to unlock live data:

- **OpenAI** - AI Trip Planner (platform.openai.com)
- **Amadeus** - Live flight data (developers.amadeus.com)
- **OpenWeatherMap** - Weather forecasts (openweathermap.org)
- **Exchange Rate API** - Currency rates (exchangerate-api.com)

## Project Structure

```
├── app/
│   ├── main.py          # FastAPI app entry point
│   ├── models/
│   │   └── schemas.py   # Pydantic models
│   ├── routers/         # API route handlers
│   │   ├── flights.py
│   │   ├── hotels.py
│   │   ├── activities.py
│   │   ├── ai_planner.py
│   │   ├── budget.py
│   │   ├── weather.py
│   │   ├── currency.py
│   │   ├── destinations.py
│   │   ├── itineraries.py
│   │   ├── packages.py
│   │   └── settings.py
│   └── services/        # Business logic
│       ├── flight_service.py
│       ├── hotel_service.py
│       ├── activity_service.py
│       ├── ai_service.py
│       ├── budget_service.py
│       ├── weather_service.py
│       ├── currency_service.py
│       ├── destination_service.py
│       ├── itinerary_service.py
│       ├── package_service.py
│       └── config.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Flights.tsx
│   │   │   ├── Hotels.tsx
│   │   │   ├── Packages.tsx
│   │   │   ├── Activities.tsx
│   │   │   ├── AIPlanner.tsx
│   │   │   ├── Budget.tsx
│   │   │   ├── Itineraries.tsx
│   │   │   ├── Destinations.tsx
│   │   │   └── Settings.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── index.ts
│   └── package.json
├── pyproject.toml
└── README.md
```
