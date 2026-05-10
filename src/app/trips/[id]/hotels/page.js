"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Star, MapPin, ArrowRight, Check } from "lucide-react";

const MOCK_HOTELS = [
  { id: 1, name: "Grand Plaza Resort", rating: 4.8, price: 8500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop", type: "Luxury" },
  { id: 2, name: "Sunset Boutique Hotel", rating: 4.5, price: 4500, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop", type: "Boutique" },
  { id: 3, name: "Oceanview Inn", rating: 4.2, price: 2500, image: "https://images.unsplash.com/photo-1551882547-ff40c0d13c85?q=80&w=800&auto=format&fit=crop", type: "Budget" },
  { id: 4, name: "The Heritage Palace", rating: 4.9, price: 12000, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop", type: "Heritage" },
];

export default function HotelsPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [trip, setTrip] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
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
    if (!selectedHotel || !trip) return;
    setIsSaving(true);
    
    await fetch(`/api/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotelCost: selectedHotel.price })
    });

    router.push(`/trips/${id}/billing`);
  };

  const currentBudget = trip?.budget || 0;
  const flightCost = trip?.flightCost || 0;
  // Let's assume the hotel price is per night, and trip is N nights.
  // For simplicity here, let's just use the hotel price as total cost.
  const remainingBudget = currentBudget - flightCost - (selectedHotel?.price || 0);

  return (
    <div className="hotels-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
      <div className="flex-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex-row gap-2">
            <Building2 size={24} style={{ color: 'var(--primary)' }} /> Recommended Hotels
          </h2>
          <p className="text-muted mt-1">Select an accommodation to add to your trip</p>
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

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {MOCK_HOTELS.map(hotel => (
          <div 
            key={hotel.id} 
            className={`glass-panel p-0 hover-lift ${selectedHotel?.id === hotel.id ? 'ring-2 ring-primary' : ''}`}
            style={{ 
              overflow: 'hidden', 
              cursor: 'pointer',
              border: selectedHotel?.id === hotel.id ? '2px solid var(--primary)' : '1px solid var(--border-color)'
            }}
            onClick={() => setSelectedHotel(hotel)}
          >
            <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {hotel.type}
              </div>
              {selectedHotel?.id === hotel.id && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '50%' }}>
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex-between mb-2">
                <h3 className="font-bold text-lg">{hotel.name}</h3>
                <span className="font-semibold text-primary">₹{hotel.price.toLocaleString()}/night</span>
              </div>
              <div className="flex-row gap-4 text-sm text-muted">
                <span className="flex-row gap-1"><Star size={14} fill="#F59E0B" color="#F59E0B" /> {hotel.rating}</span>
                <span className="flex-row gap-1"><MapPin size={14} /> City Center</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-between mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => router.push(`/trips/${id}/billing`)} className="btn btn-ghost">
          Skip for now
        </button>
        <button 
          onClick={handleContinue} 
          className="btn btn-primary"
          disabled={!selectedHotel || isSaving}
        >
          {isSaving ? 'Saving...' : <>Continue to Billing <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}
