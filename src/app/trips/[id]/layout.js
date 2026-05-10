import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { Navigation, DollarSign, CheckSquare, Calendar, MapPin, Users, ArrowLeft, Edit2 } from "lucide-react";
import "./view.css";

export default async function TripLayout({ children, params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongo();
  const trip = await Trip.findOne({ _id: id, userId: session.user.id });

  if (!trip) {
    return (
      <div className="flex-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Trip not found</h2>
          <Link href="/dashboard" className="btn btn-primary mt-4">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const endDate = new Date(trip.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const coverPhoto = trip.coverPhoto || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop";

  const tabs = [
    { href: `/trips/${id}/itinerary`, label: 'Itinerary', icon: Navigation },
    { href: `/trips/${id}/budget`, label: 'Budget', icon: DollarSign },
    { href: `/trips/${id}/packing`, label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <div className="trip-view animate-fade-in">
      {/* HERO BANNER */}
      <div className="trip-banner" style={{ backgroundImage: `url(${coverPhoto})` }}>
        <div className="trip-banner-overlay" />
        <div className="trip-banner-content">
          <Link href="/dashboard" className="trip-back-btn">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="trip-banner-title">{trip.name}</h1>
          <div className="trip-banner-meta">
            <span><Calendar size={15} /> {startDate} — {endDate}</span>
            <span><MapPin size={15} /> {trip.stops.length} Destination{trip.stops.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <Link href={`/trips/builder?id=${id}`} className="trip-edit-btn">
          <Edit2 size={14} /> Edit Trip
        </Link>
      </div>

      {/* TABS */}
      <div className="trip-tabs-wrap">
        <div className="trip-tabs">
          {tabs.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="trip-tab">
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="trip-content">
        {children}
      </div>
    </div>
  );
}
