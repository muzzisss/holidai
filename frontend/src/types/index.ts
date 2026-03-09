export interface Flight {
  id: string;
  airline: string;
  airline_logo: string | null;
  flight_number: string;
  origin: string;
  origin_city: string;
  destination: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabin_class: string;
  booking_url: string | null;
  carbon_emissions: string | null;
}

export interface FlightDeal {
  id: string;
  origin: string;
  origin_city: string;
  destination: string;
  destination_city: string;
  destination_country: string;
  destination_image: string | null;
  price: number;
  currency: string;
  departure_date: string;
  return_date: string;
  airline: string;
  deal_type: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  review_count: number;
  price_per_night: number;
  total_price: number;
  currency: string;
  image_url: string | null;
  amenities: string[];
  stars: number;
  booking_url: string | null;
  description: string | null;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  destination: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  review_count: number;
  image_url: string | null;
  booking_url: string | null;
  highlights: string[];
  included: string[];
}

export interface HolidayPackage {
  id: string;
  name: string;
  destination: string;
  destination_country: string;
  description: string;
  image_url: string | null;
  flight_details: string;
  hotel_name: string;
  hotel_rating: number;
  duration_nights: number;
  price_per_person: number;
  total_price: number;
  currency: string;
  includes: string[];
  deal_type: string;
  departure_date: string;
  return_date: string;
  origin: string;
  meals: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  image_url: string | null;
  avg_flight_price_gbp: number | null;
  avg_hotel_price_gbp: number | null;
  avg_daily_cost_gbp: number | null;
  best_months: string[];
  highlights: string[];
  currency: string;
  language: string;
  timezone: string;
  visa_required: boolean;
  safety_rating: number | null;
  latitude: number | null;
  longitude: number | null;
  top_attractions?: string[];
}

export interface WeatherForecastDay {
  date: string;
  temp_low: number;
  temp_high: number;
  temp_avg: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  precipitation_chance: number;
}

export interface WeatherForecast {
  destination: string;
  country?: string;
  current_temp?: number;
  current_description?: string;
  forecast: WeatherForecastDay[];
  best_months?: string[];
}

export interface DestinationWeather {
  destination: string;
  country: string;
  current_temp: number;
  current_description: string;
  current_icon: string;
  forecast: WeatherForecast[];
  best_months: string[];
  avg_temp_by_month: Record<string, number>;
}

export interface BudgetCategory {
  category: string;
  estimated_min: number;
  estimated_max: number;
  average: number;
  currency: string;
  notes: string;
}

export interface BudgetBreakdown {
  destination: string;
  duration_days: number;
  num_travelers: number;
  travel_style: string;
  categories: BudgetCategory[];
  total_min: number;
  total_max: number;
  total_average: number;
  daily_average: number;
  currency: string;
  tips: string[];
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  cost: number | null;
  currency: string;
  booking_url: string | null;
  notes: string | null;
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  notes?: string;
}

export interface ItineraryDay {
  day_number: number;
  date: string;
  title: string;
  items: ItineraryItem[];
  activities?: ItineraryActivity[];
}

export interface Itinerary {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: ItineraryDay[];
  total_cost: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CurrencyConversion {
  from_currency: string;
  to_currency: string;
  amount: number;
  converted_amount: number;
  rate: number;
  last_updated: string;
}
