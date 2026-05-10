import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { MapPin, Clock, CreditCard } from "lucide-react";

export default async function ItineraryPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongo();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });
  if (!trip) return null;

  return (
    <div className="itinerary-view animate-slide-up">
      <div className="flex-between mb-6">
        <h2 className="text-2xl font-bold">Your Journey</h2>
        <Link href={`/trips/builder?id=${id}`} className="btn btn-secondary text-sm">Edit Itinerary</Link>
      </div>
      
      <div className="timeline-view">
        {trip.stops.map((stop, index) => (
          <div key={stop._id || index} className="timeline-stop glass-panel mb-8" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="stop-badge bg-primary text-white" style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1rem',
              backgroundColor: 'var(--primary)'
            }}>
              Day {index * 3 + 1}
            </div>
            <h3 className="text-xl font-bold flex-row mb-2">
              <MapPin className="text-primary" /> {stop.cityName}
            </h3>
            <p className="text-sm text-muted mb-6">
              {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
            </p>
            
            <div className="activities-grid grid-cols-2">
              {stop.activities.map((act, i) => (
                <div key={act._id || i} className="activity-card" style={{ 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  background: 'var(--bg-main)'
                }}>
                  <div className="flex-between">
                    <h4 className="font-bold">{act.name}</h4>
                    <span className="activity-type text-xs" style={{
                      padding: '0.2rem 0.5rem',
                      background: 'var(--bg-surface-hover)',
                      borderRadius: '4px'
                    }}>{act.type}</span>
                  </div>
                  <div className="flex-row text-sm text-muted mt-4">
                    <span className="flex-row gap-1"><CreditCard size={14} /> ${act.cost}</span>
                    <span className="flex-row gap-1 ml-4"><Clock size={14} /> {act.duration}</span>
                  </div>
                </div>
              ))}
              {stop.activities.length === 0 && (
                <p className="text-muted italic text-sm">No activities planned yet.</p>
              )}
            </div>
          </div>
        ))}
        {trip.stops.length === 0 && (
          <div className="text-center py-12 glass-panel">
            <p className="text-muted mb-4">No stops have been added to this trip.</p>
            <Link href={`/trips/builder?id=${id}`} className="btn btn-primary">Start Planning</Link>
          </div>
        )}
      </div>
    </div>
  );
}
