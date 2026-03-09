const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Flights
export const searchFlights = (params: Record<string, string | number | boolean>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  return fetchApi<{ flights: unknown[]; count: number }>(`/api/flights/search?${qs}`);
};

export const getFlightDeals = (origin = "LHR") =>
  fetchApi<{ deals: unknown[]; count: number }>(`/api/flights/deals?origin=${origin}`);

// Hotels
export const searchHotels = (params: Record<string, string | number>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  return fetchApi<{ hotels: unknown[]; count: number }>(`/api/hotels/search?${qs}`);
};

export const getHotelDeals = () =>
  fetchApi<{ deals: unknown[]; count: number }>("/api/hotels/deals");

// Activities
export const searchActivities = (destination: string, category?: string) => {
  const qs = new URLSearchParams({ destination });
  if (category) qs.set("category", category);
  return fetchApi<{ activities: unknown[]; count: number }>(`/api/activities/search?${qs}`);
};

export const getPopularActivities = () =>
  fetchApi<{ activities: unknown[]; count: number }>("/api/activities/popular");

// Packages
export const searchPackages = (destination?: string, origin = "London") => {
  const qs = new URLSearchParams({ origin });
  if (destination) qs.set("destination", destination);
  return fetchApi<{ packages: unknown[]; count: number }>(`/api/packages/search?${qs}`);
};

export const getPackageDeals = () =>
  fetchApi<{ deals: unknown[]; count: number }>("/api/packages/deals");

// AI Planner
export const chatWithAI = (messages: { role: string; content: string }[], context?: string) =>
  fetchApi<{ response: string }>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ messages, context }),
  });

export const planTrip = (params: Record<string, unknown>) =>
  fetchApi<{ plan: unknown }>("/api/ai/plan-trip", {
    method: "POST",
    body: JSON.stringify(params),
  });

// Budget
export const calculateBudget = (params: Record<string, unknown>) =>
  fetchApi<unknown>("/api/budget/calculate", {
    method: "POST",
    body: JSON.stringify(params),
  });

export const getBudgetEstimates = () =>
  fetchApi<{ estimates: unknown[]; count: number }>("/api/budget/estimates");

// Weather
export const getWeather = (destination: string) =>
  fetchApi<unknown>(`/api/weather/forecast?destination=${encodeURIComponent(destination)}`);

// Currency
export const convertCurrency = (amount: number, from: string, to: string) =>
  fetchApi<unknown>(`/api/currency/convert?from_currency=${from}&to_currency=${to}&amount=${amount}`);

export const getCurrencyRates = (base = "GBP") =>
  fetchApi<unknown>(`/api/currency/rates?base=${base}`);

// Destinations
export const getPopularDestinations = (limit = 12) =>
  fetchApi<{ destinations: unknown[]; count: number }>(`/api/destinations/popular?limit=${limit}`);

export const getDestinationInfo = (name: string) =>
  fetchApi<unknown>(`/api/destinations/info?name=${encodeURIComponent(name)}`);

export const searchDestinations = (query?: string, continent?: string, maxDailyCost?: number) => {
  const qs = new URLSearchParams();
  if (query) qs.set("query", query);
  if (continent) qs.set("continent", continent);
  if (maxDailyCost) qs.set("max_daily_cost", String(maxDailyCost));
  return fetchApi<{ destinations: unknown[]; count: number }>(`/api/destinations/search?${qs}`);
};

// Itineraries
export const getItineraries = () =>
  fetchApi<{ itineraries: unknown[]; count: number }>("/api/itineraries/");

export const createItinerary = (data: Record<string, unknown>) =>
  fetchApi<unknown>("/api/itineraries/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getItinerary = (id: string) =>
  fetchApi<unknown>(`/api/itineraries/${id}`);

export const updateItinerary = (id: string, data: Record<string, unknown>) =>
  fetchApi<unknown>(`/api/itineraries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteItinerary = (id: string) =>
  fetchApi<unknown>(`/api/itineraries/${id}`, { method: "DELETE" });

export const addItineraryItem = (id: string, dayNumber: number, item: Record<string, unknown>) =>
  fetchApi<unknown>(`/api/itineraries/${id}/days/${dayNumber}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  });

// Settings
export const getSettings = () => fetchApi<Record<string, unknown>>("/api/settings/");

export const updateSettings = (data: Record<string, unknown>) =>
  fetchApi<Record<string, unknown>>("/api/settings/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
