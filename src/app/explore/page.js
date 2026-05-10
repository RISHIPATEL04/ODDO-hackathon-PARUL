import Link from "next/link";
import "./explore.css";
import { Heart, Star, MapPin, Search, Filter } from "lucide-react";

const DESTINATIONS = [
  {
    id: 1, name: "Kyoto, Japan", tag: "Culture", tagColor: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    description: "Ancient temples, bamboo groves, and cherry blossoms define this timeless city.",
    rating: 4.9, reviews: 1240, duration: "5-7 days"
  },
  {
    id: 2, name: "Amalfi Coast, Italy", tag: "Coastal", tagColor: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1533682805518-48d1f5b8cb3a?q=80&w=800&auto=format&fit=crop",
    description: "Cliffside villages, turquoise water, and world-class Italian cuisine.",
    rating: 4.8, reviews: 980, duration: "4-6 days"
  },
  {
    id: 3, name: "Santorini, Greece", tag: "Romantic", tagColor: "#EC4899",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop",
    description: "Iconic blue domes, volcanic beaches, and the most stunning sunsets in Europe.",
    rating: 4.9, reviews: 2150, duration: "3-5 days"
  },
  {
    id: 4, name: "Banff, Canada", tag: "Nature", tagColor: "#10B981",
    image: "https://images.unsplash.com/photo-1542668595-fa9394e5b686?q=80&w=800&auto=format&fit=crop",
    description: "Turquoise glacial lakes and towering Rocky Mountain peaks await.",
    rating: 4.9, reviews: 843, duration: "5-8 days"
  },
  {
    id: 5, name: "Bali, Indonesia", tag: "Adventure", tagColor: "#F59E0B",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    description: "Lush rice terraces, sacred temples, and vibrant surf culture.",
    rating: 4.7, reviews: 3100, duration: "7-10 days"
  },
  {
    id: 6, name: "Reykjavik, Iceland", tag: "Arctic", tagColor: "#6366F1",
    image: "https://images.unsplash.com/photo-1504826260979-242151ce5d2d?q=80&w=800&auto=format&fit=crop",
    description: "Northern Lights, hot springs, and otherworldly volcanic landscapes.",
    rating: 4.8, reviews: 620, duration: "5-7 days"
  },
  {
    id: 7, name: "Petra, Jordan", tag: "Heritage", tagColor: "#F97316",
    image: "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?q=80&w=800&auto=format&fit=crop",
    description: "The rose-red city carved from rock — one of the world's greatest wonders.",
    rating: 4.9, reviews: 760, duration: "2-3 days"
  },
  {
    id: 8, name: "Patagonia, Argentina", tag: "Wilderness", tagColor: "#059669",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop",
    description: "Dramatic glaciers, pristine forests, and some of the best trekking on Earth.",
    rating: 4.9, reviews: 430, duration: "8-14 days"
  },
  {
    id: 9, name: "Marrakech, Morocco", tag: "Exotic", tagColor: "#DC2626",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop",
    description: "Vibrant souks, ornate palaces, and the sensory magic of the medina.",
    rating: 4.6, reviews: 1580, duration: "3-5 days"
  },
];

export default function ExplorePage() {
  return (
    <div className="explore-page animate-fade-in">
      {/* Header */}
      <div className="explore-header">
        <div>
          <p className="explore-eyebrow">Discover the World</p>
          <h1 className="explore-title">Find Your Next Adventure</h1>
          <p className="explore-sub">Curated destinations handpicked for unforgettable experiences</p>
        </div>

        {/* Search */}
        <div className="explore-search-bar">
          <div className="explore-search-inner">
            <Search size={18} className="explore-search-icon" />
            <input type="text" placeholder="Search destinations..." className="explore-search-input" />
          </div>
          <button className="btn btn-secondary btn-sm">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="explore-grid">
        {DESTINATIONS.map(dest => (
          <div key={dest.id} className="explore-card">
            <div className="explore-img-wrap">
              <img src={dest.image} alt={dest.name} className="explore-img" />
              <div className="explore-img-overlay" />
              <button className="explore-fav-btn">
                <Heart size={16} />
              </button>
              <span className="explore-tag" style={{ background: dest.tagColor }}>{dest.tag}</span>
            </div>

            <div className="explore-card-body">
              <div className="explore-card-top">
                <h3 className="explore-dest-name">{dest.name}</h3>
                <div className="explore-rating">
                  <Star size={13} fill="#F59E0B" stroke="none" />
                  <span className="font-semibold text-sm">{dest.rating}</span>
                  <span className="text-muted text-xs">({dest.reviews})</span>
                </div>
              </div>

              <p className="explore-desc">{dest.description}</p>

              <div className="explore-card-footer">
                <div className="flex-row gap-1">
                  <MapPin size={13} style={{ color: 'var(--primary)' }} />
                  <span className="text-xs text-muted">{dest.duration}</span>
                </div>
                <Link href="/trips/new" className="btn btn-primary btn-sm">
                  Plan Trip
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

