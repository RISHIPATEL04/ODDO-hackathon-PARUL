import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { Navigation, DollarSign, CheckCircle, Calendar as CalIcon, MapPin } from "lucide-react";
import "./view.css";

// This layout wraps the nested trip pages
export default async function TripLayout({ children, params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  await connectMongo();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });

  if (!trip) {
    return <div className="container mt-8 text-center text-2xl">Trip not found</div>;
  }

  const startDate = new Date(trip.startDate).toLocaleDateString();
  const endDate = new Date(trip.endDate).toLocaleDateString();

  return (
    <div className="trip-view-container animate-fade-in pb-12">
      <div className="trip-hero-banner" style={{ 
        backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.9)), url(${trip.coverPhoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '4rem 2rem',
        color: 'white',
        textAlign: 'center',
        borderRadius: '0 0 24px 24px',
        marginBottom: '2rem'
      }}>
        <h1 className="text-4xl font-bold mb-4">{trip.name}</h1>
        <div className="flex-row justify-center gap-6 text-lg" style={{ opacity: 0.9 }}>
          <div className="flex-row"><CalIcon size={20} className="mr-2"/> {startDate} - {endDate}</div>
          <div className="flex-row"><MapPin size={20} className="mr-2"/> {trip.stops.length} Destinations</div>
        </div>
      </div>

      <div className="container">
        <div className="tab-navigation flex-row justify-center mb-8 bg-surface-solid" style={{ 
          padding: '0.5rem', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          display: 'inline-flex',
          margin: '0 auto',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <Link href={`/trips/${id}/itinerary`} className="tab-btn flex-row gap-2" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
            <Navigation size={18} /> Itinerary
          </Link>
          <Link href={`/trips/${id}/budget`} className="tab-btn flex-row gap-2" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
            <DollarSign size={18} /> Budget
          </Link>
          <Link href={`/trips/${id}/packing`} className="tab-btn flex-row gap-2" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
            <CheckCircle size={18} /> Checklist
          </Link>
        </div>

        <main className="tab-content w-full max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
