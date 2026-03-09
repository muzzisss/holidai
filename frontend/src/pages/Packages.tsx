import { useEffect, useState } from "react";
import { Package, Search, Star, Clock, Check } from "lucide-react";
import { searchPackages } from "@/lib/api";
import type { HolidayPackage } from "@/types";

export default function Packages() {
  const [destination, setDestination] = useState("");
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchPackages().then((d) => { setPackages((d.packages || []) as HolidayPackage[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchPackages(destination || undefined);
      setPackages((data.packages || []) as HolidayPackage[]);
    } catch { setPackages([]); }
    setLoading(false);
  };

  const dealBadge = (type: string) => {
    const styles: Record<string, string> = { hot_deal: "bg-red-500 text-white", last_minute: "bg-orange-500 text-white", early_bird: "bg-blue-500 text-white", regular: "bg-gray-500 text-white" };
    const labels: Record<string, string> = { hot_deal: "HOT", last_minute: "LAST MIN", early_bird: "EARLY BIRD", regular: "" };
    if (type === "regular") return null;
    return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[type] || styles.regular}`}>{labels[type]}</span>;
  };

  const mealLabel = (m: string) => {
    const map: Record<string, string> = { room_only: "Room Only", breakfast: "B&B", half_board: "Half Board", full_board: "Full Board", all_inclusive: "All Inclusive" };
    return map[m] || m;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> Holiday Packages</h1>
        <p className="text-muted-foreground">Flight + Hotel bundles at unbeatable prices</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3">
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Search destination (leave empty for all)" className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
        <button onClick={handleSearch} disabled={loading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />} Search
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
              <div className="relative h-40">
                <img src={pkg.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"} alt={pkg.destination} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">{dealBadge(pkg.deal_type)}</div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-lg">{pkg.destination}</h3>
                  <p className="text-sm text-white/80">{pkg.destination_country}</p>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{mealLabel(pkg.meals)}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold mb-1">{pkg.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {pkg.hotel_rating}</span>
                  <span>·</span>
                  <span>{pkg.hotel_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Clock className="w-3 h-3" /> {pkg.duration_nights} nights · {pkg.departure_date}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pkg.includes.slice(0, 4).map((inc, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />{inc}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-border flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">per person</p>
                    <p className="text-2xl font-bold text-primary">£{pkg.price_per_person.toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">total (2 pax)</p>
                    <p className="font-semibold">£{pkg.total_price.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No packages found</p>
          <p className="text-sm text-muted-foreground">Try a different destination</p>
        </div>
      )}
    </div>
  );
}
