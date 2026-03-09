import { useState } from "react";
import { Hotel as HotelIcon, Search, Star, MapPin, Wifi, Coffee } from "lucide-react";
import { searchHotels } from "@/lib/api";
import type { Hotel } from "@/types";

export default function Hotels() {
  const [destination, setDestination] = useState("Barcelona");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useState(() => {
    const today = new Date();
    const ci = new Date(today.getTime() + 30 * 86400000);
    const co = new Date(ci.getTime() + 5 * 86400000);
    setCheckIn(ci.toISOString().split("T")[0]);
    setCheckOut(co.toISOString().split("T")[0]);
  });

  const handleSearch = async () => {
    if (!destination || !checkIn || !checkOut) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchHotels({ destination, check_in: checkIn, check_out: checkOut, guests, rooms });
      setHotels((data.hotels || []) as Hotel[]);
    } catch { setHotels([]); }
    setLoading(false);
  };

  const renderStars = (count: number) =>
    Array.from({ length: count }, (_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><HotelIcon className="w-6 h-6 text-primary" /> Hotel Search</h1>
        <p className="text-muted-foreground">Find the best hotels worldwide</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Destination</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City name" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Check-in</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Check-out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Guests</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Rooms</label>
              <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={handleSearch} disabled={loading} className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {searched && !loading && hotels.length > 0 && (
        <div className="space-y-4">
          <p className="font-semibold">{hotels.length} hotels found in {destination}</p>
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                  <img src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{hotel.name}</h3>
                        <div className="flex">{renderStars(hotel.stars)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {hotel.address}, {hotel.city}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-primary" />
                        <span className="font-bold">{hotel.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{hotel.review_count} reviews</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{hotel.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hotel.amenities.slice(0, 5).map((a) => (
                      <span key={a} className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1">
                        {a === "Free WiFi" ? <Wifi className="w-3 h-3" /> : a === "Breakfast Included" ? <Coffee className="w-3 h-3" /> : null}
                        {a}
                      </span>
                    ))}
                    {hotel.amenities.length > 5 && <span className="text-xs px-2 py-1 bg-muted rounded-full">+{hotel.amenities.length - 5} more</span>}
                  </div>
                  <div className="flex items-end justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">per night</p>
                      <p className="text-2xl font-bold text-primary">£{hotel.price_per_night.toFixed(0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">total</p>
                      <p className="font-semibold">£{hotel.total_price.toFixed(0)}</p>
                      {hotel.booking_url && (
                        <a href={hotel.booking_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-xs px-4 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">Book</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && !loading && hotels.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <HotelIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No hotels found</p>
          <p className="text-sm text-muted-foreground">Try a different destination or dates</p>
        </div>
      )}
    </div>
  );
}
