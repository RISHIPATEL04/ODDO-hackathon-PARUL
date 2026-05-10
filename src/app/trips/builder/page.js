"use client";

import { useState } from "react";
import { Plus, MapPin, Calendar, Clock, Trash2, Save, GripVertical } from "lucide-react";
import "./builder.css";

export default function ItineraryBuilder() {
  const [stops, setStops] = useState([
    {
      id: 1,
      cityName: "Paris, France",
      arrivalDate: "2024-06-15",
      departureDate: "2024-06-18",
      activities: [
        { id: 101, name: "Eiffel Tower Visit", cost: 30, duration: "2h" }
      ]
    }
  ]);

  const addStop = () => {
    setStops([...stops, { 
      id: Date.now(), 
      cityName: "", 
      arrivalDate: "", 
      departureDate: "", 
      activities: [] 
    }]);
  };

  const updateStop = (id, field, value) => {
    setStops(stops.map(stop => stop.id === id ? { ...stop, [field]: value } : stop));
  };

  const removeStop = (id) => {
    setStops(stops.filter(stop => stop.id !== id));
  };

  const addActivity = (stopId) => {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        return { ...stop, activities: [...stop.activities, { id: Date.now(), name: "", cost: 0, duration: "" }] };
      }
      return stop;
    }));
  };

  const updateActivity = (stopId, activityId, field, value) => {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: stop.activities.map(act => act.id === activityId ? { ...act, [field]: value } : act)
        };
      }
      return stop;
    }));
  };

  const removeActivity = (stopId, activityId) => {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        return { ...stop, activities: stop.activities.filter(act => act.id !== activityId) };
      }
      return stop;
    }));
  };

  return (
    <div className="builder-container animate-fade-in">
      <header className="flex-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Itinerary Builder</h1>
          <p className="text-muted mt-2">Design your perfect journey, stop by stop.</p>
        </div>
        <button className="btn btn-primary">
          <Save size={20} />
          Save Itinerary
        </button>
      </header>

      <div className="timeline-container">
        {stops.map((stop, index) => (
          <div key={stop.id} className="stop-card glass-panel mb-8">
            <div className="stop-header flex-between">
              <div className="flex-row">
                <GripVertical className="text-muted drag-handle" />
                <div className="stop-number bg-primary-light text-primary">{index + 1}</div>
                <input 
                  type="text" 
                  className="city-input text-2xl font-bold" 
                  placeholder="Enter City Name" 
                  value={stop.cityName}
                  onChange={(e) => updateStop(stop.id, 'cityName', e.target.value)}
                />
              </div>
              <button onClick={() => removeStop(stop.id)} className="btn-icon-danger">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="stop-dates grid-cols-2 mt-4">
              <div className="flex-row">
                <Calendar size={16} className="text-muted" />
                <input 
                  type="date" 
                  className="date-input" 
                  value={stop.arrivalDate}
                  onChange={(e) => updateStop(stop.id, 'arrivalDate', e.target.value)}
                />
              </div>
              <div className="flex-row">
                <Calendar size={16} className="text-muted" />
                <input 
                  type="date" 
                  className="date-input" 
                  value={stop.departureDate}
                  onChange={(e) => updateStop(stop.id, 'departureDate', e.target.value)}
                />
              </div>
            </div>

            <div className="activities-section mt-8">
              <h4 className="font-bold mb-4 flex-row">
                <MapPin size={18} className="text-secondary" />
                Activities
              </h4>
              
              <div className="activities-list flex-col">
                {stop.activities.map((act) => (
                  <div key={act.id} className="activity-item flex-between">
                    <input 
                      type="text" 
                      className="activity-input flex-grow" 
                      placeholder="What to do?" 
                      value={act.name}
                      onChange={(e) => updateActivity(stop.id, act.id, 'name', e.target.value)}
                    />
                    <div className="flex-row activity-meta">
                      <div className="meta-input-wrapper">
                        <span className="text-muted">$</span>
                        <input 
                          type="number" 
                          className="meta-input" 
                          placeholder="Cost" 
                          value={act.cost}
                          onChange={(e) => updateActivity(stop.id, act.id, 'cost', e.target.value)}
                        />
                      </div>
                      <div className="meta-input-wrapper">
                        <Clock size={14} className="text-muted" />
                        <input 
                          type="text" 
                          className="meta-input" 
                          placeholder="Duration" 
                          value={act.duration}
                          onChange={(e) => updateActivity(stop.id, act.id, 'duration', e.target.value)}
                        />
                      </div>
                      <button onClick={() => removeActivity(stop.id, act.id)} className="text-muted hover-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button onClick={() => addActivity(stop.id)} className="btn btn-secondary mt-2 w-fit">
                  <Plus size={16} /> Add Activity
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="add-stop-wrapper flex-center mt-8">
          <button onClick={addStop} className="btn add-stop-btn">
            <Plus size={24} />
            Add Another Stop
          </button>
        </div>
      </div>
    </div>
  );
}
