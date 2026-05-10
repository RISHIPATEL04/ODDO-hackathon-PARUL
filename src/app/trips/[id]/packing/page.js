"use client";

import { use, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PackingPage({ params }) {
  const { id } = use(params);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await fetch(`/api/trips/${id}`);
        const data = await res.json();
        if (data.success) {
          const dbTrip = data.data;
          setChecklist(dbTrip.checklist?.length > 0 ? dbTrip.checklist : [
            { id: 1, itemName: "Passport & ID", packed: true },
            { id: 2, itemName: "Phone Charger", packed: false },
            { id: 3, itemName: "Travel Adapters", packed: false },
            { id: 4, itemName: "Comfortable Shoes", packed: false },
            { id: 5, itemName: "Camera", packed: true }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [id]);

  const toggleItem = (itemId) => {
    setChecklist(prev => prev.map(item => {
      const currentId = item._id || item.id;
      if (currentId === itemId) return { ...item, packed: !item.packed };
      return item;
    }));
  };

  if (loading) {
    return <div className="flex-center py-12"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="checklist-view animate-slide-up glass-panel p-8">
      <h2 className="text-2xl font-bold mb-6">Packing Checklist</h2>
      <div className="flex-col gap-4">
        {checklist.map(item => {
          const itemId = item._id || item.id;
          return (
            <label 
              key={itemId} 
              className={`checklist-item flex-row p-4 rounded-lg cursor-pointer transition-all duration-200 ${item.packed ? 'packed' : ''}`}
              style={{
                background: item.packed ? 'var(--bg-surface-hover)' : 'var(--bg-main)',
                border: '1px solid',
                borderColor: item.packed ? 'var(--border-color)' : 'var(--primary-glow)',
                opacity: item.packed ? 0.6 : 1
              }}
            >
              <input 
                type="checkbox" 
                checked={item.packed} 
                onChange={() => toggleItem(itemId)}
                className="checklist-checkbox mr-4" 
                style={{ transform: 'scale(1.2)' }}
              />
              <span className={`font-medium text-lg ${item.packed ? 'line-through text-muted' : ''}`}>{item.itemName}</span>
            </label>
          );
        })}
      </div>
      <button className="btn btn-secondary mt-8 w-full">Add New Item</button>
    </div>
  );
}
