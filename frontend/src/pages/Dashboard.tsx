import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plane, Hotel, TrendingDown, Globe, ArrowRight,
  Sparkles, Star, Clock, Flame, DollarSign, Sun
} from "lucide-react";
import { getFlightDeals, getPopularDestinations, getPackageDeals } from "@/lib/api";
import type { FlightDeal, Destination, HolidayPackage } from "@/types";

export default function Dashboard() {
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFlightDeals().catch(() => ({ deals: [] })),
      getPopularDestinations(8).catch(() => ({ destinations: [] })),
      getPackageDeals().catch(() => ({ deals: [] })),
    ]).then(([flightData, destData, pkgData]) => {
      setDeals((flightData.deals || []) as FlightDeal[]);
      setDestinations((destData.destinations || []) as Destination[]);
      setPackages((pkgData.deals || []) as HolidayPackage[]);
      setLoading(false);
    });
  }, []);

  const dealBadge = (type: string) => {
    const styles: Record<string, string> = {
      hot_deal: "bg-red-500/10 text-red-600 border-red-500/20",
      last_minute: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      error_fare: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      regular: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
    const labels: Record<string, string> = {
      hot_deal: "HOT DEAL",
      last_minute: "LAST MINUTE",
      error_fare: "ERROR FARE",
      regular: "DEAL",
    };
    return (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${styles[type] || styles.regular}`}>
        {labels[type] || "DEAL"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your travel dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-8 lg:p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-blue-100">AI-Powered Travel Planning</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Where will your next adventure take you?
          </h1>
          <p className="text-blue-100 max-w-2xl mb-6">
            Discover incredible deals, plan your perfect trip, and explore the world — all from one smart dashboard built for UK travellers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/flights" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              <Plane className="w-4 h-4" /> Search Flights
            </Link>
            <Link to="/ai-planner" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur text-white rounded-lg font-semibold hover:bg-white/25 transition-colors border border-white/20">
              <Sparkles className="w-4 h-4" /> AI Trip Planner
            </Link>
            <Link to="/packages" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur text-white rounded-lg font-semibold hover:bg-white/25 transition-colors border border-white/20">
              <Hotel className="w-4 h-4" /> Holiday Packages
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Plane, label: "Flight Deals", value: `${deals.length}+`, color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Globe, label: "Destinations", value: `${destinations.length}+`, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: TrendingDown, label: "From", value: `£${Math.min(...deals.map(d => d.price), 999).toFixed(0)}`, color: "text-green-500", bg: "bg-green-500/10" },
          { icon: Sun, label: "Packages", value: `${packages.length}+`, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-border">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Flight Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Hot Flight Deals from UK
            </h2>
            <p className="text-sm text-muted-foreground">Cheapest return flights found today</p>
          </div>
          <Link to="/flights" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {deals.slice(0, 8).map((deal) => (
            <div key={deal.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={deal.destination_image || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400"}
                  alt={deal.destination_city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">{dealBadge(deal.deal_type)}</div>
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-lg font-bold">
                  £{deal.price.toFixed(0)}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold">{deal.destination_city}</h3>
                <p className="text-xs text-muted-foreground">{deal.destination_country}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Plane className="w-3 h-3" />{deal.airline}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{deal.departure_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Popular Destinations
            </h2>
            <p className="text-sm text-muted-foreground">Top picks for UK travellers</p>
          </div>
          <Link to="/destinations" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            Explore all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.slice(0, 8).map((dest) => (
            <div key={dest.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={dest.image_url || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400"}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-lg">{dest.name}</h3>
                  <p className="text-sm text-white/80">{dest.country}</p>
                </div>
                {dest.safety_rating && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {dest.safety_rating}
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-bold text-primary">£{dest.avg_daily_cost_gbp}/day</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {dest.best_months.slice(0, 3).map((m) => (
                    <span key={m} className="text-xs px-2 py-0.5 bg-muted rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Holiday Packages */}
      {packages.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Package Deals
              </h2>
              <p className="text-sm text-muted-foreground">Flight + Hotel bundles</p>
            </div>
            <Link to="/packages" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.slice(0, 6).map((pkg) => (
              <div key={pkg.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.destination}, {pkg.destination_country}</p>
                  </div>
                  {dealBadge(pkg.deal_type)}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{pkg.hotel_name} - {pkg.duration_nights} nights</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pkg.includes.slice(0, 3).map((inc, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">{inc}</span>
                  ))}
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">per person</p>
                    <p className="text-xl font-bold text-primary">£{pkg.price_per_person.toFixed(0)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{pkg.departure_date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 lg:p-8 text-center">
        <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold mb-2">Let AI Plan Your Dream Trip</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-4">
          Tell our AI your budget, interests, and travel dates — get a complete personalised itinerary in seconds.
        </p>
        <Link to="/ai-planner" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          <Brain className="w-4 h-4" /> Start Planning with AI
        </Link>
      </div>
    </div>
  );
}

function Brain(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}
