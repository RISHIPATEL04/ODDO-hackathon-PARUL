import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/db-setup/mongodb";
import Trip from "@/database-models/Trip";
import { MapPin, Clock, CreditCard, Plus, Edit2 } from "lucide-react";

const TYPE_COLORS = {
  sightseeing: { bg: '#EFF6FF', color: '#2563EB' },
  food: { bg: '#FFF7ED', color: '#F97316' },
  adventure: { bg: '#ECFDF5', color: '#10B981' },
  culture: { bg: '#F5F3FF', color: '#8B5CF6' },
  shopping: { bg: '#FDF2F8', color: '#EC4899' },
  default: { bg: '#F1F5F9', color: '#64748B' },
};

export default async function ItineraryPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongo();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });
  if (!trip) return null;

  return (
    <div className="itinerary-page animate-slide-up">
      <div className="itin-header">
        <h2 className="itin-title">Your Journey</h2>
        <Link href={`/trips/builder?id=${id}`} className="btn btn-secondary btn-sm">
          <Edit2 size={14} /> Edit Itinerary
        </Link>
      </div>

      {trip.stops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><MapPin size={32} /></div>
          <h3 className="text-lg font-bold">No stops yet</h3>
          <p className="text-muted text-sm">Add destinations to start building your itinerary</p>
          <Link href={`/trips/builder?id=${id}`} className="btn btn-primary">
            <Plus size={16} /> Start Planning
          </Link>
        </div>
      ) : (
        <div className="flex-col gap-4">
          {trip.stops.map((stop, index) => {
            const arrival = new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const departure = new Date(stop.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const totalCost = stop.activities.reduce((s, a) => s + (a.cost || 0), 0);

            return (
              <div key={stop._id || index} className="stop-card">
                <div className="stop-card-header">
                  <div className="stop-number">{index + 1}</div>
                  <div>
                    <h3 className="stop-city">{stop.cityName}</h3>
                    <p className="stop-dates">{arrival} → {departure}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div className="badge badge-primary">{stop.activities.length} activities</div>
                    {totalCost > 0 && (
                      <p className="text-xs text-muted mt-1">${totalCost} est.</p>
                    )}
                  </div>
                </div>

                <div className="stop-body">
                  {stop.activities.length === 0 ? (
                    <p className="text-sm text-muted italic">No activities planned for this stop.</p>
                  ) : (
                    <div className="activities-list">
                      {stop.activities.map((act, i) => {
                        const colors = TYPE_COLORS[act.type?.toLowerCase()] || TYPE_COLORS.default;
                        return (
                          <div key={act._id || i} className="activity-card">
                            <div className="flex-between mb-2">
                              <h4 className="activity-name">{act.name}</h4>
                              {act.type && (
                                <span
                                  className="badge text-xs"
                                  style={{ background: colors.bg, color: colors.color }}
                                >
                                  {act.type}
                                </span>
                              )}
                            </div>
                            <div className="activity-meta">
                              {act.cost !== undefined && act.cost !== null && (
                                <span><CreditCard size={12} /> ${act.cost}</span>
                              )}
                              {act.duration && (
                                <span><Clock size={12} /> {act.duration}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
