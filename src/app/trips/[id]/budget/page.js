import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";

export default async function BudgetPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongo();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });
  if (!trip) return null;

  // Process budget exactly like the old client component did
  const expenses = trip.expenses || [];
  let budget = { totalEstimated: 2500, breakdown: { Transport: 800, Stay: 1000, Meals: 400, Activities: 300 } };
  
  if (expenses.length > 0) {
    budget.totalEstimated = expenses.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    budget.breakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.estimatedCost;
      return acc;
    }, {});
  }

  const getBudgetCssWidth = (amount) => {
    return `${(amount / budget.totalEstimated) * 100}%`;
  };

  return (
    <div className="budget-view animate-slide-up">
      <h2 className="text-2xl font-bold mb-6">Cost Breakdown</h2>
      
      <div className="glass-panel text-center p-8 mb-8" style={{ background: 'linear-gradient(135deg, var(--bg-surface), #EFF6FF)' }}>
        <p className="text-muted text-lg">Total Estimated Budget</p>
        <h1 className="text-6xl font-bold text-gradient mt-4">${budget.totalEstimated}</h1>
      </div>

      <div className="glass-panel p-8">
        <h3 className="font-bold text-xl mb-8">Spending by Category</h3>
        <div className="budget-bars flex-col gap-8">
          {Object.entries(budget.breakdown).map(([category, amount]) => (
            <div key={category} className="budget-bar-wrapper">
              <div className="flex-between mb-3">
                <span className="font-medium text-lg">{category}</span>
                <span className="font-bold text-lg">${amount}</span>
              </div>
              <div className="progress-bar bg-surface-hover" style={{ height: '12px' }}>
                <div 
                  className={`progress-fill`} 
                  style={{ 
                    width: getBudgetCssWidth(amount),
                    background: category === 'Stay' ? '#3B82F6' : category === 'Transport' ? '#10B981' : category === 'Meals' ? '#F59E0B' : '#8B5CF6'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
