import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Key, Save, CheckCircle, AlertCircle, Globe, Sparkles, Cloud, DollarSign } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/api";

interface ApiKeys {
  openai_api_key: string;
  skyscanner_api_key: string;
  booking_com_api_key: string;
  weather_api_key: string;
  currency_api_key: string;
  google_places_api_key: string;
  amadeus_api_key: string;
  amadeus_api_secret: string;
}

export default function Settings() {
  const [keys, setKeys] = useState<ApiKeys>({
    openai_api_key: "",
    skyscanner_api_key: "",
    booking_com_api_key: "",
    weather_api_key: "",
    currency_api_key: "",
    google_places_api_key: "",
    amadeus_api_key: "",
    amadeus_api_secret: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then((data) => {
      if (data && typeof data === "object") {
        setKeys((prev) => ({ ...prev, ...data as Partial<ApiKeys> }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(keys as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* empty */ }
    setSaving(false);
  };

  const apiConfigs = [
    {
      key: "openai_api_key" as const,
      label: "OpenAI API Key",
      icon: Sparkles,
      desc: "Powers the AI Trip Planner. Get yours at platform.openai.com",
      required: false,
      color: "text-purple-500",
    },
    {
      key: "amadeus_api_key" as const,
      label: "Amadeus API Key",
      icon: Globe,
      desc: "Real flight search data. Sign up at developers.amadeus.com",
      required: false,
      color: "text-blue-500",
    },
    {
      key: "amadeus_api_secret" as const,
      label: "Amadeus API Secret",
      icon: Key,
      desc: "Amadeus API secret (paired with key above)",
      required: false,
      color: "text-blue-500",
    },
    {
      key: "weather_api_key" as const,
      label: "OpenWeatherMap API Key",
      icon: Cloud,
      desc: "Live weather forecasts. Free at openweathermap.org",
      required: false,
      color: "text-cyan-500",
    },
    {
      key: "currency_api_key" as const,
      label: "Exchange Rate API Key",
      icon: DollarSign,
      desc: "Live currency rates. Free at exchangerate-api.com",
      required: false,
      color: "text-green-500",
    },
    {
      key: "google_places_api_key" as const,
      label: "Google Places API Key",
      icon: Globe,
      desc: "Enhanced activity and place data. Get from Google Cloud Console",
      required: false,
      color: "text-red-500",
    },
    {
      key: "skyscanner_api_key" as const,
      label: "Skyscanner API Key",
      icon: Globe,
      desc: "Additional flight data source. Partners portal at skyscanner.com",
      required: false,
      color: "text-blue-400",
    },
    {
      key: "booking_com_api_key" as const,
      label: "Booking.com API Key",
      icon: Globe,
      desc: "Hotel search data. Affiliate program at booking.com",
      required: false,
      color: "text-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-primary" /> Settings</h1>
        <p className="text-muted-foreground">Configure API keys for live data. All keys are optional — the app works with realistic mock data by default.</p>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">How it works</p>
          <p className="text-sm text-muted-foreground">HolidAI works out of the box with realistic sample data. Add API keys to unlock live data from real providers. Keys are stored in-memory only and never persisted.</p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2 text-green-600 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        {apiConfigs.map((config) => (
          <div key={config.key} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}>
                <config.icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="font-semibold text-sm block mb-0.5">{config.label}</label>
                <p className="text-xs text-muted-foreground mb-2">{config.desc}</p>
                <input
                  type="password"
                  value={keys[config.key]}
                  onChange={(e) => setKeys({ ...keys, [config.key]: e.target.value })}
                  placeholder={`Enter ${config.label.toLowerCase()}...`}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
              <div className="flex-shrink-0 mt-7">
                {keys[config.key] ? (
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full">Set</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">Mock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
        Save Settings
      </button>
    </div>
  );
}
