import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Edit3, Save, X, MapPin, Clock, GripVertical } from "lucide-react";
import { getItineraries, createItinerary, deleteItinerary } from "@/lib/api";
import type { Itinerary } from "@/types";

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Create form
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      const data = await getItineraries();
      setItineraries((data.itineraries || []) as Itinerary[]);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!name || !destination || !startDate || !endDate) return;
    try {
      await createItinerary({ name, destination, start_date: startDate, end_date: endDate, notes, days: [] });
      setShowCreate(false);
      setName(""); setDestination(""); setStartDate(""); setEndDate(""); setNotes("");
      loadItineraries();
    } catch { /* empty */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItinerary(id);
      setItineraries(itineraries.filter(it => it.id !== id));
    } catch { /* empty */ }
  };

  const getDayCount = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="w-6 h-6 text-primary" /> Itineraries</h1>
          <p className="text-muted-foreground">Plan and organize your trips day by day</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2">
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showCreate ? "Cancel" : "New Itinerary"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-card rounded-xl border border-border p-4 lg:p-6 animate-fadeIn">
          <h2 className="font-semibold text-lg mb-4">Create New Itinerary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Trip Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer in Barcelona" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Destination</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Barcelona, Spain" className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium mb-1.5 block">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes for your trip..." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm resize-none" />
          </div>
          <button onClick={handleCreate} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2">
            <Save className="w-4 h-4" /> Create Itinerary
          </button>
        </div>
      )}

      {/* Itineraries List */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : itineraries.length > 0 ? (
        <div className="space-y-4">
          {itineraries.map((it) => (
            <div key={it.id} className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors">
              <div className="p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === it.id ? null : it.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{it.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {it.destination}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getDayCount(it.start_date, it.end_date)} days</span>
                        <span>{it.start_date} — {it.end_date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(it.id); }} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {expandedId === it.id && (
                <div className="border-t border-border p-4 bg-muted/30 animate-fadeIn">
                  {it.notes && <p className="text-sm text-muted-foreground mb-3">{it.notes}</p>}
                  {it.days && it.days.length > 0 ? (
                    <div className="space-y-3">
                      {it.days.map((day, i) => (
                        <div key={i} className="bg-card rounded-lg border border-border p-3">
                          <h4 className="font-semibold text-sm mb-2">Day {day.day_number}: {day.title || `Day ${day.day_number}`}</h4>
                          {day.activities && day.activities.length > 0 ? (
                            <div className="space-y-2">
                              {day.activities.map((act, j) => (
                                <div key={j} className="flex items-start gap-2 text-sm">
                                  <span className="text-xs text-muted-foreground w-12 flex-shrink-0">{act.time}</span>
                                  <div>
                                    <p className="font-medium">{act.activity}</p>
                                    {act.notes && <p className="text-xs text-muted-foreground">{act.notes}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No activities planned yet</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Edit3 className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No days planned yet. Use the AI Planner to generate an itinerary!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Itineraries Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">Create your first itinerary to start planning your trip day by day.</p>
          <button onClick={() => setShowCreate(true)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> Create Itinerary
          </button>
        </div>
      )}
    </div>
  );
}
