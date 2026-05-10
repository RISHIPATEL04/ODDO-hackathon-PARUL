"use client";

import { use, useState, useEffect } from "react";
import { Loader2, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

const DEFAULT_ITEMS = [
  { id: 1, itemName: "Passport & ID", packed: true, category: "Documents" },
  { id: 2, itemName: "Visa (if required)", packed: false, category: "Documents" },
  { id: 3, itemName: "Travel Insurance", packed: false, category: "Documents" },
  { id: 4, itemName: "Phone Charger", packed: false, category: "Electronics" },
  { id: 5, itemName: "Travel Adapter", packed: false, category: "Electronics" },
  { id: 6, itemName: "Portable Power Bank", packed: false, category: "Electronics" },
  { id: 7, itemName: "Comfortable Walking Shoes", packed: false, category: "Clothing" },
  { id: 8, itemName: "Weather-appropriate Clothes", packed: false, category: "Clothing" },
  { id: 9, itemName: "Sunscreen & Toiletries", packed: false, category: "Health" },
  { id: 10, itemName: "First Aid Kit", packed: false, category: "Health" },
];

const CATEGORIES = ['Documents', 'Electronics', 'Clothing', 'Health', 'Other'];

export default function PackingPage({ params }) {
  const { id } = use(params);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("Other");

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await fetch(`/api/trips/${id}`);
        const data = await res.json();
        if (data.success) {
          setChecklist(data.data.checklist?.length > 0 ? data.data.checklist : DEFAULT_ITEMS);
        }
      } catch (err) {
        setChecklist(DEFAULT_ITEMS);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [id]);

  const toggleItem = (itemId) => {
    setChecklist(prev => prev.map(item => {
      const cid = item._id || item.id;
      return cid === itemId ? { ...item, packed: !item.packed } : item;
    }));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setChecklist(prev => [...prev, {
      id: Date.now(), itemName: newItem.trim(), packed: false, category: newCategory
    }]);
    setNewItem("");
  };

  const removeItem = (itemId) => {
    setChecklist(prev => prev.filter(item => (item._id || item.id) !== itemId));
  };

  if (loading) {
    return (
      <div className="flex-center py-16">
        <div className="flex-col flex-center gap-3">
          <Loader2 className="animate-spin" size={36} style={{ color: 'var(--primary)' }} />
          <p className="text-muted text-sm">Loading checklist...</p>
        </div>
      </div>
    );
  }

  const packed = checklist.filter(i => i.packed).length;
  const total = checklist.length;
  const pct = total > 0 ? Math.round((packed / total) * 100) : 0;

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = checklist.filter(i => (i.category || 'Other') === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="checklist-page animate-slide-up">
      {/* Progress */}
      <div className="checklist-progress-wrap">
        <div className="checklist-progress-label">
          <span className="font-bold text-lg">{packed} / {total} packed</span>
          <span className="badge badge-success">{pct}% ready</span>
        </div>
        <div className="progress-bar" style={{ height: '10px' }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Add Item */}
      <div className="glass-panel">
        <h3 className="font-bold mb-3">Add Item</h3>
        <div className="flex-row gap-2">
          <input
            type="text" placeholder="e.g. Sunglasses"
            value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            style={{ flex: 1 }}
          />
          <select
            value={newCategory} onChange={e => setNewCategory(e.target.value)}
            style={{ width: 'auto', minWidth: '130px' }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={addItem} className="btn btn-primary">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Grouped Items */}
      <div className="flex-col gap-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="glass-panel">
            <div className="flex-between mb-3">
              <h3 className="font-bold text-sm text-secondary uppercase" style={{ letterSpacing: '0.06em' }}>
                {category}
              </h3>
              <span className="text-xs text-muted">{items.filter(i => i.packed).length}/{items.length}</span>
            </div>
            <div className="flex-col gap-2">
              {items.map(item => {
                const itemId = item._id || item.id;
                return (
                  <div
                    key={itemId}
                    onClick={() => toggleItem(itemId)}
                    className={`checklist-item ${item.packed ? 'checked' : ''}`}
                  >
                    <div className={`ci-checkbox ${item.packed ? 'done' : ''}`}>
                      {item.packed && <CheckCircle2 size={12} color="white" />}
                    </div>
                    <span className="ci-name">{item.itemName}</span>
                    <button
                      className="btn-icon ml-auto"
                      onClick={e => { e.stopPropagation(); removeItem(itemId); }}
                      style={{ width: 28, height: 28 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
