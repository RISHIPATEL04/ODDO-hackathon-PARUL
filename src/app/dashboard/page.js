import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, MapPin, Calendar, ArrowRight, TrendingUp, Clock, Users, Sparkles, BarChart2, CheckCircle } from "lucide-react";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import "./dashboard.css";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectMongo();
  const trips = await Trip.find({ userId: session.user.id }).sort({ startDate: 1 });

  const tripData = trips.map(t => ({
    _id: t._id.toString(),
    name: t.name,
    description: t.description || "",
    startDate: new Date(t.startDate),
    endDate: new Date(t.endDate),
    stops: t.stops.length,
    coverPhoto: t.coverPhoto || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
  }));

  const upcomingTrip = tripData[0] || null;
  const firstName = session.user.name?.split(' ')[0] || 'Traveler';

  const today = new Date();
  const daysUntil = upcomingTrip
    ? Math.max(0, Math.ceil((upcomingTrip.startDate - today) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="dash-page animate-fade-in">
      {/* ===== HEADER ===== */}
      <header className="dash-header">
        <div>
          <p className="dash-greeting">Good morning, {firstName} 👋</p>
          <h1 className="dash-title">Your Travel Hub</h1>
        </div>
        <Link href="/trips/new" className="btn btn-primary">
          <Plus size={18} /> Plan New Trip
        </Link>
      </header>

      {/* ===== STATS ROW ===== */}
      <div className="dash-stats-row">
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <MapPin size={20} />
          </div>
          <div>
            <div className="dash-stat-num">{tripData.length}</div>
            <div className="dash-stat-lbl">Total Trips</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="dash-stat-num">{tripData.reduce((acc, t) => acc + t.stops, 0)}</div>
            <div className="dash-stat-lbl">Destinations Planned</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="dash-stat-num">{daysUntil !== null ? daysUntil : '—'}</div>
            <div className="dash-stat-lbl">Days Until Next Trip</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="dash-stat-num">$2.4K</div>
            <div className="dash-stat-lbl">Budget Tracked</div>
          </div>
        </div>
      </div>

      <div className="dash-body">
        {/* ===== LEFT COLUMN ===== */}
        <div className="dash-main">
          {/* Upcoming Trip Hero */}
          {upcomingTrip && (
            <div className="dash-section">
              <div className="section-header flex-between mb-4">
                <h2 className="section-title">Next Adventure</h2>
                <Link href={`/trips/${upcomingTrip._id}`} className="btn btn-ghost btn-sm">
                  Open <ArrowRight size={14} />
                </Link>
              </div>
              <div
                className="dash-hero-trip"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%), url(${upcomingTrip.coverPhoto})`
                }}
              >
                <div className="dash-hero-content">
                  <span className="dash-hero-badge">
                    <Calendar size={12} /> {daysUntil} days away
                  </span>
                  <h3 className="dash-hero-name">{upcomingTrip.name}</h3>
                  <p className="dash-hero-dates">
                    {upcomingTrip.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                    {upcomingTrip.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="dash-hero-meta">
                    <span><MapPin size={13} /> {upcomingTrip.stops} Destinations</span>
                  </div>
                </div>
                <Link href={`/trips/${upcomingTrip._id}`} className="dash-hero-btn">
                  View Itinerary <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* All Trips */}
          <div className="dash-section">
            <div className="section-header flex-between mb-4">
              <h2 className="section-title">All Trips</h2>
              <Link href="/trips/new" className="btn btn-secondary btn-sm">
                <Plus size={14} /> New
              </Link>
            </div>
            {tripData.length > 0 ? (
              <div className="trips-grid">
                {tripData.map(trip => (
                  <Link key={trip._id} href={`/trips/${trip._id}`} className="trip-card-link">
                    <div className="trip-mini-card">
                      <div
                        className="trip-mini-img"
                        style={{ backgroundImage: `url(${trip.coverPhoto})` }}
                      />
                      <div className="trip-mini-info">
                        <h4 className="trip-mini-name">{trip.name}</h4>
                        <p className="trip-mini-date">
                          <Calendar size={12} />
                          {trip.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                          {trip.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <div className="trip-mini-footer">
                          <span className="badge badge-primary">{trip.stops} stops</span>
                          <ArrowRight size={14} className="text-muted" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <MapPin size={32} />
                </div>
                <h3 className="text-lg font-bold">No trips yet</h3>
                <p className="text-muted text-sm">Start planning your first adventure!</p>
                <Link href="/trips/new" className="btn btn-primary">
                  <Plus size={16} /> Create First Trip
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="dash-sidebar">
          {/* Quick Actions */}
          <div className="glass-panel dash-widget">
            <h3 className="widget-title">Quick Actions</h3>
            <div className="quick-actions">
              <Link href="/trips/new" className="quick-action-btn">
                <div className="quick-action-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}><Plus size={18} /></div>
                <span>New Trip</span>
              </Link>
              <Link href="/explore" className="quick-action-btn">
                <div className="quick-action-icon" style={{ background: '#ECFDF5', color: '#10B981' }}><MapPin size={18} /></div>
                <span>Explore</span>
              </Link>
              <Link href="/profile" className="quick-action-btn">
                <div className="quick-action-icon" style={{ background: '#F5F3FF', color: '#8B5CF6' }}><Users size={18} /></div>
                <span>Profile</span>
              </Link>
              <Link href="/trips/builder" className="quick-action-btn">
                <div className="quick-action-icon" style={{ background: '#FFF7ED', color: '#F97316' }}><BarChart2 size={18} /></div>
                <span>Builder</span>
              </Link>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="glass-panel dash-widget">
            <div className="flex-between mb-4">
              <h3 className="widget-title">AI Suggestions</h3>
              <span className="badge badge-accent">
                <Sparkles size={10} /> Gemini
              </span>
            </div>
            <div className="ai-suggestions">
              {['Kyoto, Japan', 'Amalfi Coast, Italy', 'Banff, Canada'].map(dest => (
                <Link href="/explore" key={dest} className="ai-suggestion-item">
                  <div className="suggestion-dot" />
                  <span>{dest}</span>
                  <ArrowRight size={13} className="text-muted ml-auto" />
                </Link>
              ))}
            </div>
            <Link href="/explore" className="btn btn-secondary btn-sm w-full mt-4" style={{ justifyContent: 'center' }}>
              See All Destinations
            </Link>
          </div>

          {/* Budget Overview */}
          <div className="glass-panel dash-widget">
            <div className="flex-between mb-4">
              <h3 className="widget-title">Budget Overview</h3>
              <TrendingUp size={16} className="text-success" />
            </div>
            <div className="budget-total">$2,450 <span>estimated</span></div>
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: '62%' }} />
            </div>
            <p className="text-xs text-muted mb-4">62% of budget allocated</p>
            <div className="budget-breakdown">
              {[
                { label: 'Flights', pct: 35, color: '#2563EB' },
                { label: 'Hotels', pct: 42, color: '#10B981' },
                { label: 'Activities', pct: 15, color: '#F59E0B' },
                { label: 'Food', pct: 8, color: '#8B5CF6' },
              ].map(item => (
                <div key={item.label} className="budget-row">
                  <div className="flex-row gap-2">
                    <div className="budget-dot" style={{ background: item.color }} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
