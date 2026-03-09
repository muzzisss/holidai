import { useState } from "react";
import { MapPin, Search, Star, Clock, Tag, ExternalLink } from "lucide-react";
import { searchActivities } from "@/lib/api";
import type { Activity } from "@/types";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "adventure", label: "Adventure" },
  { value: "culture", label: "Culture" },
  { value: "food", label: "Food & Drink" },
  { value: "nature", label: "Nature" },
  { value: "nightlife", label: "Nightlife" },
  { value: "water_sports", label: "Water Sports" },
  { value: "sightseeing", label: "Sightseeing" },
  { value: "relaxation", label: "Relaxation" },
];

export default function Activities() {
  const [destination, setDestination] = useState("Barcelona");
  const [category, setCategory] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!destination) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchActivities(destination, category || undefined);
      setActivities((data.activities || []) as Activity[]);
    } catch { setActivities([]); }
    setLoading(false);
  };

  const categoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      adventure: "bg-red-500/10 text-red-600", culture: "bg-purple-500/10 text-purple-600",
      food: "bg-orange-500/10 text-orange-600", nature: "bg-green-500/10 text-green-600",
      nightlife: "bg-pink-500/10 text-pink-600", water_sports: "bg-cyan-500/10 text-cyan-600",
      sightseeing: "bg-blue-500/10 text-blue-600", relaxation: "bg-teal-500/10 text-teal-600",
      shopping: "bg-yellow-500/10 text-yellow-700", workshops: "bg-indigo-500/10 text-indigo-600",
    };
    return colors[cat] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6 text-primary" /> Activities & Experiences</h1>
        <p className="text-muted-foreground">Discover amazing things to do at your destination</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3">
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where are you going?" className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button onClick={handleSearch} disabled={loading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />} Search
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : searched && activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => (
            <div key={act.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
              <div className="relative h-44">
                <img src={act.image_url || "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400"} alt={act.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColor(act.category)}`}>{act.category.replace("_", " ")}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold mb-1 line-clamp-2">{act.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{act.description}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {act.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.duration}</span>
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {act.review_count} reviews</span>
                </div>
                {act.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {act.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full">{h}</span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-3 border-t border-border flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">from</p>
                    <p className="text-xl font-bold text-primary">£{act.price.toFixed(0)}</p>
                  </div>
                  {act.booking_url && (
                    <a href={act.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                      Book <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searched ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No activities found</p>
          <p className="text-sm text-muted-foreground">Try a different destination or category</p>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Find Your Next Adventure</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Search for activities, tours, and experiences in any destination worldwide.</p>
        </div>
      )}
    </div>
  );
}
