import Link from "next/link";
import { Compass, MapPin, Heart, Star } from "lucide-react";
import connectMongo from "@/lib/mongodb";

const TRENDING_DESTINATIONS = [
  {
    id: 1,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    description: "Experience the perfect blend of ancient tradition and modern serenity.",
    rating: 4.9,
    reviews: 1240
  },
  {
    id: 2,
    name: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1533682805518-48d1f5b8cb3a?q=80&w=2070&auto=format&fit=crop",
    description: "Cliffside villages, vibrant culture, and endless ocean views.",
    rating: 4.8,
    reviews: 980
  },
  {
    id: 3,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1964&auto=format&fit=crop",
    description: "Iconic blue domes and breathtaking sunsets over the Aegean Sea.",
    rating: 4.9,
    reviews: 2150
  },
  {
    id: 4,
    name: "Banff National Park, Canada",
    image: "https://images.unsplash.com/photo-1542668595-fa9394e5b686?q=80&w=1965&auto=format&fit=crop",
    description: "Turquoise glacial lakes and majestic mountain peaks.",
    rating: 4.9,
    reviews: 843
  },
  {
    id: 5,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop",
    description: "Tropical paradise with lush jungles and pristine beaches.",
    rating: 4.7,
    reviews: 3100
  },
  {
    id: 6,
    name: "Reykjavik, Iceland",
    image: "https://images.unsplash.com/photo-1504826260979-242151ce5d2d?q=80&w=2066&auto=format&fit=crop",
    description: "Otherworldly landscapes, hot springs, and the Northern Lights.",
    rating: 4.8,
    reviews: 620
  }
];

export default function ExplorePage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Discover True Serenity</h1>
        <p className="text-lg text-muted">Explore hand-picked destinations curated for your next unforgettable journey.</p>
      </header>

      <div className="grid-cols-3" style={{ gap: '2rem' }}>
        {TRENDING_DESTINATIONS.map(dest => (
          <div key={dest.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                height: '240px', 
                backgroundImage: `url(${dest.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease'
              }} className="hover-zoom" />
              <button className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.8)', color: 'var(--secondary)' }}>
                <Heart size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div className="flex-between mb-2">
                <h3 className="font-bold text-xl">{dest.name}</h3>
                <div className="flex-row" style={{ gap: '0.25rem', color: '#F59E0B' }}>
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{dest.rating}</span>
                </div>
              </div>
              <p className="text-muted mb-6" style={{ flexGrow: 1 }}>{dest.description}</p>
              
              <Link href="/trips/new" className="btn btn-secondary w-full" style={{ width: '100%', justifyContent: 'center' }}>
                Plan Trip Here
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
