"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plane, Clock, Check, ArrowRight, TrendingDown } from "lucide-react";

const MOCK_FLIGHTS = [
  { id: 1, airline: "Emirates", departure: "10:00 AM", arrival: "02:30 PM", duration: "4h 30m", price: 35000, type: "Non-stop" },
  { id: 2, airline: "Delta Airlines", departure: "08:15 AM", arrival: "01:45 PM", duration: "5h 30m", price: 28000, type: "1 Stop" },
  { id: 3, airline: "Air India", departure: "11:30 PM", arrival: "04:00 AM", duration: "4h 30m", price: 15000, type: "Non-stop" },
];

export default function FlightsPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [trip, setTrip] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetch(`/api/trips/${p.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setTrip(data.data);
        });
    });
  }, [params]);

  const handleContinue = async () => {
    if (!selectedFlight || !trip) return;
    setIsSaving(true);
    
    await fetch(`/api/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flightCost: selectedFlight.price })
    });
    
    router.push(`/trips/${id}/hotels`);
  };

  const currentBudget = trip?.budget || 0;
  const remainingBudget = currentBudget - (selectedFlight?.price || 0);

  return (
    <div className="flights-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div className="flex-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex-row gap-2">
            <Plane size={24} style={{ color: 'var(--primary)' }} /> Select Your Flight
          </h2>
          <p className="text-muted mt-1">Book a flight for your destination</p>
        </div>
        {trip && (
          <div className="text-right">
            <div className="text-sm text-muted mb-1">Remaining Budget</div>
            <div className={`text-xl font-bold ${remainingBudget < 0 ? 'text-error' : 'text-success'}`}>
              ₹{remainingBudget.toLocaleString()} <span className="text-sm font-normal text-muted">/ ₹{currentBudget.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid-1" style={{ gap: '1rem' }}>
        {MOCK_FLIGHTS.map(flight => (
          <div 
            key={flight.id} 
            className={`glass-panel p-4 hover-lift ${selectedFlight?.id === flight.id ? 'ring-2 ring-primary' : ''}`}
            style={{ 
              cursor: 'pointer',
              border: selectedFlight?.id === flight.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => setSelectedFlight(flight)}
          >
            <div className="flex-row gap-4">
              <div style={{ width: '50px', height: '50px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={20} className="text-muted" />
              </div>
              <div>
                <h3 className="font-bold">{flight.airline}</h3>
                <div className="text-sm text-muted flex-row gap-2 mt-1">
                  <span>{flight.departure} — {flight.arrival}</span>
                  <span>•</span>
                  <span className="flex-row gap-1"><Clock size={12} /> {flight.duration}</span>
                  <span>•</span>
                  <span>{flight.type}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-row gap-4">
              <div className="font-bold text-xl">₹{flight.price.toLocaleString()}</div>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: selectedFlight?.id === flight.id ? 'var(--primary)' : 'var(--bg-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedFlight?.id === flight.id && <Check size={14} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-between mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => router.push(`/trips/${id}/hotels`)} className="btn btn-ghost">
          Skip flights
        </button>
        <button 
          onClick={handleContinue} 
          className="btn btn-primary"
          disabled={!selectedFlight || isSaving}
        >
          {isSaving ? 'Saving...' : <>Continue to Hotels <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}
