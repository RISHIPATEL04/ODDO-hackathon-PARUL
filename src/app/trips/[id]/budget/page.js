import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/db-setup/mongodb";
import Trip from "@/database-models/Trip";

const CATEGORY_META = {
  Transport: { color: '#2563EB', bg: '#EFF6FF', emoji: '✈️' },
  Stay: { color: '#10B981', bg: '#ECFDF5', emoji: '🏨' },
  Meals: { color: '#F59E0B', bg: '#FFFBEB', emoji: '🍽️' },
  Activities: { color: '#8B5CF6', bg: '#F5F3FF', emoji: '🎭' },
  Shopping: { color: '#EC4899', bg: '#FDF2F8', emoji: '🛍️' },
  Other: { color: '#64748B', bg: '#F1F5F9', emoji: '📦' },
};

export default async function BudgetPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongo();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });
  if (!trip) return null;

  const budget = trip.budget || 5000;
  const flightCost = trip.flightCost || 0;
  const hotelCost = trip.hotelCost || 0;
  const expenses = trip.expenses || [];
  
  let breakdown = { Transport: flightCost, Stay: hotelCost };
  
  // Add other manual expenses if any
  if (expenses.length > 0) {
    expenses.forEach(curr => {
      // Don't double count if category is Transport or Stay unless we want to
      breakdown[curr.category] = (breakdown[curr.category] || 0) + curr.estimatedCost;
    });
  }

  const totalSpent = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const remaining = Math.max(0, budget - totalSpent);
  const entries = Object.entries(breakdown).filter(([_, amt]) => amt > 0).sort((a, b) => b[1] - a[1]);

  return (
    <div className="budget-page animate-slide-up">
      {/* Hero Total */}
      <div className="budget-hero" style={{ background: totalSpent > budget ? 'var(--error)' : 'var(--primary)' }}>
        <p className="budget-hero-label">Total Spent / Budget</p>
        <p className="budget-hero-amount">₹{totalSpent.toLocaleString()} / ₹{budget.toLocaleString()}</p>
        <p style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.5rem' }}>
          ₹{remaining.toLocaleString()} remaining
        </p>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-xl font-bold mb-4">Spending Breakdown</h3>
        <div className="budget-grid">
          {entries.map(([category, amount]) => {
            const meta = CATEGORY_META[category] || CATEGORY_META.Other;
            const pct = Math.round((amount / budget) * 100);
            return (
              <div key={category} className="budget-cat-card">
                <div className="budget-cat-name" style={{ color: meta.color }}>
                  <span style={{ background: meta.bg, padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                    {meta.emoji} {category}
                  </span>
                </div>
                <div className="budget-cat-amount" style={{ color: meta.color }}>₹{amount.toLocaleString()}</div>
                <div className="budget-cat-bar">
                  <div
                    className="budget-cat-fill"
                    style={{ width: `${Math.min(100, pct)}%`, background: meta.color }}
                  />
                </div>
                <p className="text-xs text-muted mt-2">{pct}% of total budget</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Bar Chart */}
      <div className="glass-panel mt-8">
        <h3 className="text-xl font-bold mb-6">Spending by Category</h3>
        <div className="flex-col gap-5">
          {entries.map(([category, amount]) => {
            const meta = CATEGORY_META[category] || CATEGORY_META.Other;
            const pct = Math.round((amount / budget) * 100);
            return (
              <div key={category}>
                <div className="flex-between mb-2">
                  <div className="flex-row gap-2">
                    <span style={{ fontSize: '1.1rem' }}>{meta.emoji}</span>
                    <span className="font-semibold text-sm">{category}</span>
                  </div>
                  <div className="flex-row gap-3">
                    <span className="text-sm text-muted">{pct}%</span>
                    <span className="font-bold">₹{amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="progress-bar" style={{ height: '10px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, pct)}%`, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
