"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, MapPin, Calendar, Clock, Trash2, Save, GripVertical, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import "./builder.css";

const ACTIVITY_TYPES = ['Sightseeing', 'Food', 'Adventure', 'Culture', 'Shopping', 'Transport', 'Other'];

// Separate inner component so useSearchParams can be inside Suspense
function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');

  const [tripName, setTripName] = useState("My Trip");
  const [stops, setStops] = useState([
    {
      id: 1,
      cityName: "Paris, France",
      arrivalDate: "2025-06-15",
      departureDate: "2025-06-18",
      expanded: true,
      activities: [
        { id: 101, name: "Eiffel Tower Visit", cost: 30, duration: "2h", type: "Sightseeing" }
      ]
    }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (!tripId) return;
    fetch(`/api/trips/${tripId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setTripName(data.data.name);
          if (data.data.stops?.length > 0) {
            setStops(data.data.stops.map((s, i) => ({
              id: s._id || i + 1,
              cityName: s.cityName,
              arrivalDate: s.arrivalDate?.slice(0, 10) || "",
              departureDate: s.departureDate?.slice(0, 10) || "",
              expanded: i === 0,
              activities: s.activities.map((a, j) => ({ id: a._id || j + 1, name: a.name, cost: a.cost, duration: a.duration, type: a.type || "Other" }))
            })));
          }
        }
      })
      .catch(console.error);
  }, [tripId]);

  const addStop = () => {
    setStops(prev => [...prev, { id: Date.now(), cityName: "", arrivalDate: "", departureDate: "", expanded: true, activities: [] }]);
  };

  const removeStop = (id) => setStops(prev => prev.filter(s => s.id !== id));

  const updateStop = (id, field, value) => setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const toggleExpand = (id) => setStops(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));

  const addActivity = (stopId) => {
    setStops(prev => prev.map(s => s.id === stopId
      ? { ...s, activities: [...s.activities, { id: Date.now(), name: "", cost: 0, duration: "", type: "Other" }] }
      : s
    ));
  };

  const updateActivity = (stopId, actId, field, value) => {
    setStops(prev => prev.map(s => s.id === stopId
      ? { ...s, activities: s.activities.map(a => a.id === actId ? { ...a, [field]: value } : a) }
      : s
    ));
  };

  const removeActivity = (stopId, actId) => {
    setStops(prev => prev.map(s => s.id === stopId
      ? { ...s, activities: s.activities.filter(a => a.id !== actId) }
      : s
    ));
  };

  const handleSave = async () => {
    if (!tripId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stops })
      });
      const data = await res.json();
      if (data.success) {
        setSavedMsg("Saved!");
        setTimeout(() => {
          setSavedMsg("");
          router.push(`/trips/${tripId}/itinerary`);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="builder-page animate-fade-in">
      {/* Header */}
      <header className="builder-header">
        <div>
          <h1 className="builder-title">Itinerary Builder</h1>
          <p className="text-muted text-sm mt-1">{tripName} · Design your journey, stop by stop</p>
        </div>
        <div className="flex-row gap-3">
          {savedMsg && <span className="badge badge-success text-sm">{savedMsg}</span>}
          <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Itinerary</>}
          </button>
        </div>
      </header>

      {/* Stops */}
      <div className="builder-stops">
        {stops.map((stop, index) => (
          <div key={stop.id} className="stop-builder-card">
            {/* Stop Header */}
            <div className="stop-builder-header">
              <div className="flex-row gap-3">
                <GripVertical size={18} className="text-muted" style={{ cursor: 'grab' }} />
                <div className="stop-num-badge">{index + 1}</div>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    className="stop-city-input"
                    placeholder="Enter City or Destination"
                    value={stop.cityName}
                    onChange={e => updateStop(stop.id, 'cityName', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-row gap-2">
                <button onClick={() => toggleExpand(stop.id)} className="btn-icon">
                  {stop.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button onClick={() => removeStop(stop.id)} className="btn-icon btn-icon-danger">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {stop.expanded && (
              <div className="stop-builder-body">
                {/* Dates */}
                <div className="stop-dates-row">
                  <div className="form-group">
                    <label className="form-label"><Calendar size={13} className="inline mr-1" />Arrival</label>
                    <input type="date" value={stop.arrivalDate} onChange={e => updateStop(stop.id, 'arrivalDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Calendar size={13} className="inline mr-1" />Departure</label>
                    <input type="date" value={stop.departureDate} onChange={e => updateStop(stop.id, 'departureDate', e.target.value)} />
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <div className="flex-between mb-3">
                    <h4 className="font-bold text-sm flex-row gap-1">
                      <MapPin size={15} style={{ color: 'var(--primary)' }} /> Activities
                    </h4>
                    <button onClick={() => addActivity(stop.id)} className="btn btn-secondary btn-sm">
                      <Plus size={14} /> Add Activity
                    </button>
                  </div>

                  {stop.activities.length === 0 ? (
                    <div className="activity-empty" onClick={() => addActivity(stop.id)}>
                      <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                      <span>Click to add your first activity</span>
                    </div>
                  ) : (
                    <div className="activities-builder-list">
                      {stop.activities.map(act => (
                        <div key={act.id} className="activity-builder-row">
                          <input
                            type="text"
                            placeholder="Activity name"
                            className="activity-name-input"
                            value={act.name}
                            onChange={e => updateActivity(stop.id, act.id, 'name', e.target.value)}
                          />
                          <select
                            value={act.type}
                            onChange={e => updateActivity(stop.id, act.id, 'type', e.target.value)}
                            className="activity-type-select"
                          >
                            {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                          <div className="activity-meta-inputs">
                            <div className="meta-field">
                              <span className="meta-prefix">$</span>
                              <input
                                type="number" placeholder="Cost" value={act.cost}
                                onChange={e => updateActivity(stop.id, act.id, 'cost', e.target.value)}
                                className="meta-input"
                              />
                            </div>
                            <div className="meta-field">
                              <Clock size={14} className="meta-icon" />
                              <input
                                type="text" placeholder="Duration" value={act.duration}
                                onChange={e => updateActivity(stop.id, act.id, 'duration', e.target.value)}
                                className="meta-input"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeActivity(stop.id, act.id)}
                            className="btn-icon"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Stop */}
        <button onClick={addStop} className="add-stop-btn">
          <Plus size={22} />
          Add Another Destination
        </button>
      </div>
    </div>
  );
}

// Wrap in Suspense so useSearchParams works in production build
export default function ItineraryBuilder() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading builder...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
