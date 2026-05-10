import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, MapPin, Calendar as CalIcon, ArrowRight, TrendingUp } from "lucide-react";
import "./dashboard.css";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectMongo();
  // Fetch trips for the currently logged-in user
  const trips = await Trip.find({ userId: session.user.id }).sort({ startDate: 1 });
  
  const tripData = trips.map(t => ({
    _id: t._id.toString(),
    name: t.name,
    startDate: new Date(t.startDate),
    endDate: new Date(t.endDate),
    stops: t.stops.length,
    coverPhoto: t.coverPhoto || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
  }));

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header flex-between mb-8">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>Welcome back, {session.user.name.split(' ')[0]}!</h1>
          <p className="text-muted mt-2 text-lg">Ready to design your next journey?</p>
        </div>
        <Link href="/trips/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
          <Plus size={20} />
          Plan New Trip
        </Link>
      </header>

      {tripData.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Next Adventure</h2>
          <div className="glass-panel next-trip-hero" style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${tripData[0].coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '3rem',
            borderRadius: '24px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
            <h3 className="text-4xl font-bold mb-2">{tripData[0].name}</h3>
            <div className="flex-row text-lg mb-6">
              <CalIcon size={20} />
              {tripData[0].startDate.toLocaleDateString()} - {tripData[0].endDate.toLocaleDateString()}
            </div>
            <Link href={`/trips/${tripData[0]._id}`} className="btn btn-primary" style={{ width: 'fit-content', background: 'white', color: 'var(--primary)' }}>
              Open Itinerary <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      <div className="dashboard-grid">
        <section className="trips-section">
          <h2 className="text-2xl font-bold mb-6">All Trips</h2>
          {tripData.length > 0 ? (
            <div className="grid-cols-2">
              {tripData.map(trip => (
                <Link href={`/trips/${trip._id}`} key={trip._id}>
                  <div className="trip-card glass-panel" style={{ padding: 0, overflow: 'hidden', borderLeft: 'none', cursor: 'pointer' }}>
                    <div style={{ 
                      height: '160px', 
                      backgroundImage: `url(${trip.coverPhoto})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                    <div style={{ padding: '1.5rem' }}>
                      <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{trip.name}</h3>
                      <div className="flex-row text-sm text-muted mt-2">
                        <CalIcon size={16} />
                        {trip.startDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel text-center py-12" style={{ borderRadius: '24px' }}>
              <MapPin size={48} className="text-muted mx-auto mb-4" />
              <p className="text-muted text-lg mb-6">Your travel canvas is empty.</p>
              <Link href="/trips/new" className="btn btn-primary">Create your first trip</Link>
            </div>
          )}
        </section>

        <section className="sidebar-section flex-col">
          <div className="glass-panel stat-card" style={{ borderRadius: '24px' }}>
            <div className="flex-between">
              <h3 className="font-bold">Total Budget</h3>
              <TrendingUp className="text-accent" />
            </div>
            <p className="text-4xl font-bold mt-4" style={{ color: 'var(--primary)' }}>$2,450</p>
            <div className="progress-bar mt-6">
              <div className="progress-fill bg-accent" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-muted mt-2">60% of estimated budget used</p>
          </div>

          <div className="glass-panel mt-4" style={{ borderRadius: '24px' }}>
            <h3 className="font-bold mb-4">Trending Now</h3>
            <div className="recommendation-list flex-col">
              {['Kyoto, Japan', 'Amalfi Coast', 'Reykjavik, Iceland'].map(dest => (
                <Link href="/explore" key={dest} className="flex-row" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} className="text-secondary" />
                  <span className="font-medium">{dest}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
