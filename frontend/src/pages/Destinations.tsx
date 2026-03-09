import { useEffect, useState } from "react";
import { Globe, Search, Star, Sun, DollarSign, Shield, TrendingDown } from "lucide-react";
import { getPopularDestinations, getWeather, convertCurrency } from "@/lib/api";
import type { Destination, WeatherForecast, CurrencyConversion } from "@/types";

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [currency, setCurrency] = useState<CurrencyConversion | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    getPopularDestinations(20).then((d) => { setDestinations((d.destinations || []) as Destination[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (dest: Destination) => {
    setSelectedDest(dest);
    setWeatherLoading(true);
    try {
      const [w, c] = await Promise.all([
        getWeather(dest.name).catch(() => null),
        convertCurrency(100, "GBP", dest.currency).catch(() => null),
      ]);
      setWeather(w as WeatherForecast | null);
      setCurrency(c as CurrencyConversion | null);
    } catch { /* empty */ }
    setWeatherLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Globe className="w-6 h-6 text-primary" /> Explore Destinations</h1>
        <p className="text-muted-foreground">Discover your next holiday destination</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search destinations..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Destination Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => handleSelect(dest)}
                  className={`bg-card rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg transition-all ${
                    selectedDest?.id === dest.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={dest.image_url || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400"} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-bold text-lg">{dest.name}</h3>
                      <p className="text-sm text-white/80">{dest.country}</p>
                    </div>
                    {dest.safety_rating && (
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {dest.safety_rating}/10
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="flex items-center gap-1 text-muted-foreground"><DollarSign className="w-3 h-3" /> £{dest.avg_daily_cost_gbp}/day</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Sun className="w-3 h-3" /> {dest.timezone}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dest.best_months.slice(0, 3).map(m => (
                        <span key={m} className="text-xs px-2 py-0.5 bg-muted rounded-full">{m}</span>
                      ))}
                    </div>
                    {dest.top_attractions && dest.top_attractions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dest.top_attractions.slice(0, 2).map(a => (
                          <span key={a} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedDest ? (
            <>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <img src={selectedDest.image_url || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400"} alt={selectedDest.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold">{selectedDest.name}</h2>
                  <p className="text-muted-foreground">{selectedDest.country}</p>
                  <p className="text-sm mt-2">{selectedDest.description}</p>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Daily Cost</p>
                      <p className="font-bold">£{selectedDest.avg_daily_cost_gbp}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Currency</p>
                      <p className="font-bold">{selectedDest.currency}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Language</p>
                      <p className="font-bold text-sm">{selectedDest.language}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Safety</p>
                      <p className="font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{selectedDest.safety_rating}/10</p>
                    </div>
                  </div>

                  {selectedDest.visa_required !== undefined && (
                    <div className={`mt-3 p-2 rounded-lg text-sm ${selectedDest.visa_required ? "bg-orange-500/10 text-orange-600" : "bg-green-500/10 text-green-600"}`}>
                      {selectedDest.visa_required ? "Visa required for UK citizens" : "No visa needed for UK citizens"}
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Best Time to Visit</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedDest.best_months.map(m => (
                        <span key={m} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>

                  {selectedDest.top_attractions && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Top Attractions</p>
                      <div className="space-y-1">
                        {selectedDest.top_attractions.map(a => (
                          <p key={a} className="text-sm flex items-center gap-2"><Star className="w-3 h-3 text-primary" /> {a}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weather */}
              {weatherLoading ? (
                <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : weather ? (
                <div className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Sun className="w-4 h-4 text-yellow-500" /> Weather Forecast</h3>
                  <div className="space-y-2">
                    {(weather.forecast || []).slice(0, 5).map((day, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground w-20">{day.date}</span>
                        <span>{day.condition}</span>
                        <span className="font-semibold">{day.temp_high}° / {day.temp_low}°C</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Currency */}
              {currency && (
                <div className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><TrendingDown className="w-4 h-4 text-green-500" /> Currency</h3>
                  <p className="text-2xl font-bold">£100 = {currency.converted_amount.toFixed(2)} {currency.to_currency}</p>
                  <p className="text-sm text-muted-foreground">Rate: 1 GBP = {currency.rate.toFixed(4)} {currency.to_currency}</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold">Select a Destination</p>
              <p className="text-sm text-muted-foreground">Click on any destination to see weather, currency, and detailed info.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
