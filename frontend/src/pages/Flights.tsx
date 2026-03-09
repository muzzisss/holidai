import { useState } from "react";
import { Plane, Search, ArrowRight, Clock, Filter, SlidersHorizontal } from "lucide-react";
import { searchFlights, getFlightDeals } from "@/lib/api";
import type { Flight, FlightDeal } from "@/types";
import { useEffect } from "react";

const UK_AIRPORTS = [
  { code: "LHR", name: "London Heathrow" },
  { code: "LGW", name: "London Gatwick" },
  { code: "STN", name: "London Stansted" },
  { code: "LTN", name: "London Luton" },
  { code: "MAN", name: "Manchester" },
  { code: "EDI", name: "Edinburgh" },
  { code: "BHX", name: "Birmingham" },
  { code: "BRS", name: "Bristol" },
  { code: "GLA", name: "Glasgow" },
  { code: "NCL", name: "Newcastle" },
  { code: "BFS", name: "Belfast" },
  { code: "LBA", name: "Leeds Bradford" },
];

export default function Flights() {
  const [origin, setOrigin] = useState("LHR");
  const [destination, setDestination] = useState("BCN");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Set default dates
    const today = new Date();
    const dep = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ret = new Date(dep.getTime() + 7 * 24 * 60 * 60 * 1000);
    setDepartureDate(dep.toISOString().split("T")[0]);
    setReturnDate(ret.toISOString().split("T")[0]);

    getFlightDeals("LHR").then((data) => setDeals((data.deals || []) as FlightDeal[])).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!destination || !departureDate) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchFlights({
        origin, destination, departure_date: departureDate,
        return_date: returnDate, passengers, cabin_class: cabinClass,
        direct_only: directOnly,
      });
      setFlights((data.flights || []) as Flight[]);
    } catch {
      setFlights([]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" /> Flight Search
        </h1>
        <p className="text-muted-foreground">Compare flights from UK airports worldwide</p>
      </div>

      {/* Search Form */}
      <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">From</label>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              {UK_AIRPORTS.map((a) => <option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">To (Airport Code)</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="e.g. BCN, JFK, BKK" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Departure</label>
            <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Return</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Passengers</label>
            <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Cabin</label>
            <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="rounded border-input" />
              <span className="text-sm">Direct flights only</span>
            </label>
          </div>
          <div className="flex items-end">
            <button onClick={handleSearch} disabled={loading} className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 text-muted-foreground">Searching flights...</p>
          </div>
        </div>
      )}

      {searched && !loading && flights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {flights.length} flights found
            </h2>
            <span className="text-sm text-muted-foreground">Sorted by price</span>
          </div>
          <div className="space-y-3">
            {flights.map((flight) => (
              <div key={flight.id} className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {flight.airline_logo ? (
                        <img src={flight.airline_logo} alt={flight.airline} className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <Plane className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-xs text-muted-foreground">{flight.flight_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold">{flight.departure_time.split("T")[1]?.substring(0, 5) || "--:--"}</p>
                      <p className="text-xs text-muted-foreground">{flight.origin}</p>
                    </div>
                    <div className="flex flex-col items-center flex-1 max-w-32">
                      <p className="text-xs text-muted-foreground mb-1">{flight.duration}</p>
                      <div className="w-full flex items-center">
                        <div className="h-px flex-1 bg-border" />
                        <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{flight.arrival_time.split("T")[1]?.substring(0, 5) || "--:--"}</p>
                      <p className="text-xs text-muted-foreground">{flight.destination}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-primary">£{flight.price.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{passengers > 1 ? `${passengers} passengers` : "per person"}</p>
                    {flight.booking_url && (
                      <a href={flight.booking_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs px-3 py-1 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                        Book Now
                      </a>
                    )}
                  </div>
                </div>
                {flight.carbon_emissions && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {flight.carbon_emissions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {searched && !loading && flights.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No flights found</p>
          <p className="text-sm text-muted-foreground">Try different dates or airports</p>
        </div>
      )}

      {/* Deals section when no search */}
      {!searched && deals.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Trending Flight Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.slice(0, 9).map((deal) => (
              <div key={deal.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-32 overflow-hidden">
                  <img src={deal.destination_image || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400"} alt={deal.destination_city} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full font-bold">£{deal.price.toFixed(0)}</div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold">{deal.destination_city}, {deal.destination_country}</h3>
                  <p className="text-xs text-muted-foreground">{deal.airline} · {deal.departure_date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
