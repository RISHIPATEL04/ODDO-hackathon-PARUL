import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";

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

  const expenses = trip.expenses || [];
  let breakdown = { Transport: 800, Stay: 1000, Meals: 400, Activities: 300 };

  if (expenses.length > 0) {
    breakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.estimatedCost;
      return acc;
    }, {});
  }

  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="budget-page animate-slide-up">
      {/* Hero Total */}
      <div className="budget-hero">
        <p className="budget-hero-label">Total Estimated Budget</p>
        <p className="budget-hero-amount">${total.toLocaleString()}</p>
        <p style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Across {entries.length} spending categories
        </p>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-xl font-bold mb-4">Spending Breakdown</h3>
        <div className="budget-grid">
          {entries.map(([category, amount]) => {
            const meta = CATEGORY_META[category] || CATEGORY_META.Other;
            const pct = Math.round((amount / total) * 100);
            return (
              <div key={category} className="budget-cat-card">
                <div className="budget-cat-name" style={{ color: meta.color }}>
                  <span style={{ background: meta.bg, padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                    {meta.emoji} {category}
                  </span>
                </div>
                <div className="budget-cat-amount" style={{ color: meta.color }}>${amount}</div>
                <div className="budget-cat-bar">
                  <div
                    className="budget-cat-fill"
                    style={{ width: `${pct}%`, background: meta.color }}
                  />
                </div>
                <p className="text-xs text-muted mt-2">{pct}% of total budget</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Bar Chart */}
      <div className="glass-panel">
        <h3 className="text-xl font-bold mb-6">Spending by Category</h3>
        <div className="flex-col gap-5">
          {entries.map(([category, amount]) => {
            const meta = CATEGORY_META[category] || CATEGORY_META.Other;
            const pct = Math.round((amount / total) * 100);
            return (
              <div key={category}>
                <div className="flex-between mb-2">
                  <div className="flex-row gap-2">
                    <span style={{ fontSize: '1.1rem' }}>{meta.emoji}</span>
                    <span className="font-semibold text-sm">{category}</span>
                  </div>
                  <div className="flex-row gap-3">
                    <span className="text-sm text-muted">{pct}%</span>
                    <span className="font-bold">${amount}</span>
                  </div>
                </div>
                <div className="progress-bar" style={{ height: '10px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)` }}
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
