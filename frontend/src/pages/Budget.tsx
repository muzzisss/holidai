import { useState } from "react";
import { Calculator, TrendingDown, PieChart as PieChartIcon, Lightbulb } from "lucide-react";
import { calculateBudget } from "@/lib/api";
import type { BudgetBreakdown } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

const DESTINATIONS = ["Barcelona", "Paris", "Rome", "Amsterdam", "Lisbon", "Athens", "Istanbul", "Dubai", "Bangkok", "New York", "Tokyo", "Bali", "Cancun", "Cape Town", "Marrakech"];

export default function Budget() {
  const [destination, setDestination] = useState("Barcelona");
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState("balanced");
  const [includeFlights, setIncludeFlights] = useState(true);
  const [includeHotels, setIncludeHotels] = useState(true);
  const [includeFood, setIncludeFood] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeTransport, setIncludeTransport] = useState(true);
  const [result, setResult] = useState<BudgetBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await calculateBudget({
        destination, duration_days: days, num_travelers: travelers,
        travel_style: style, include_flights: includeFlights,
        include_hotels: includeHotels, include_food: includeFood,
        include_activities: includeActivities, include_transport: includeTransport,
      });
      setResult(data as BudgetBreakdown);
    } catch { setResult(null); }
    setLoading(false);
  };

  const pieData = result?.categories.map((c, i) => ({
    name: c.category,
    value: c.average,
    color: COLORS[i % COLORS.length],
  })) || [];

  const barData = result?.categories.map((c) => ({
    name: c.category.replace(" (return)", "").replace("& Experiences", ""),
    min: c.estimated_min,
    avg: c.average,
    max: c.estimated_max,
  })) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calculator className="w-6 h-6 text-primary" /> Budget Calculator</h1>
        <p className="text-muted-foreground">Plan your trip budget and see cost breakdowns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-card rounded-xl border border-border p-4 lg:p-6 space-y-4">
          <h2 className="font-semibold text-lg">Trip Details</h2>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Days</label>
              <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min={1} max={60} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Travellers</label>
              <input type="number" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} min={1} max={20} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Travel Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(["budget", "balanced", "luxury"] as const).map((s) => (
                <button key={s} onClick={() => setStyle(s)} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${style === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Include</label>
            {[
              { label: "Flights", checked: includeFlights, set: setIncludeFlights },
              { label: "Hotels", checked: includeHotels, set: setIncludeHotels },
              { label: "Food & Drinks", checked: includeFood, set: setIncludeFood },
              { label: "Activities", checked: includeActivities, set: setIncludeActivities },
              { label: "Local Transport", checked: includeTransport, set: setIncludeTransport },
            ].map(({ label, checked, set }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="rounded border-input" />
                {label}
              </label>
            ))}
          </div>
          <button onClick={handleCalculate} disabled={loading} className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Calculator className="w-4 h-4" />}
            Calculate Budget
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total (avg)", value: `£${result.total_average.toFixed(0)}`, color: "text-primary", bg: "bg-primary/10" },
                  { label: "Daily Average", value: `£${result.daily_average.toFixed(0)}`, color: "text-purple-500", bg: "bg-purple-500/10" },
                  { label: "Min Estimate", value: `£${result.total_min.toFixed(0)}`, color: "text-green-500", bg: "bg-green-500/10" },
                  { label: "Max Estimate", value: `£${result.total_max.toFixed(0)}`, color: "text-orange-500", bg: "bg-orange-500/10" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-4 ${s.bg} border border-border`}>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><PieChartIcon className="w-4 h-4" /> Cost Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => `£${value.toFixed(0)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><TrendingDown className="w-4 h-4" /> Min / Avg / Max</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData} layout="vertical">
                      <XAxis type="number" tickFormatter={(v) => `£${v}`} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => `£${value.toFixed(0)}`} />
                      <Bar dataKey="min" fill="#22c55e" name="Min" />
                      <Bar dataKey="avg" fill="#3b82f6" name="Avg" />
                      <Bar dataKey="max" fill="#f59e0b" name="Max" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Details */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold mb-3">Detailed Breakdown</h3>
                <div className="space-y-3">
                  {result.categories.map((cat, i) => (
                    <div key={cat.category} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">{cat.notes}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold">£{cat.average.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">£{cat.estimated_min.toFixed(0)} - £{cat.estimated_max.toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {result.tips.length > 0 && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-yellow-500" /> Money-Saving Tips</h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-96 bg-card rounded-xl border border-border">
              <div className="text-center">
                <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Calculate Your Trip Budget</h2>
                <p className="text-muted-foreground max-w-md">Fill in your trip details and click Calculate to see a detailed cost breakdown.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
