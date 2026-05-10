import Link from "next/link";
import { Search, Plane, MapPin, Shield, Headphones, Award, Star, ArrowRight, Globe, Users, Sparkles } from "lucide-react";
import "./page.css";

const DESTINATIONS = [
  {
    name: "Udaipur", country: "India", tag: "Heritage",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1932&auto=format&fit=crop",
    price: "₹25,000", rating: 4.9, reviews: 1240, color: "#F59E0B"
  },
  {
    name: "Goa", country: "India", tag: "Coastal",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2074&auto=format&fit=crop",
    price: "₹18,000", rating: 4.7, reviews: 3100, color: "#0EA5E9"
  },
  {
    name: "Kashmir", country: "India", tag: "Alpine",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?q=80&w=1974&auto=format&fit=crop",
    price: "₹32,000", rating: 4.9, reviews: 890, color: "#8B5CF6"
  },
];

const STATS = [
  { value: "50K+", label: "Happy Travelers" },
  { value: "120+", label: "Destinations" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Support" },
];

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ===== NAVBAR ===== */}
      <nav className="landing-nav">
        <Link href="/" className="landing-brand">
          <span className="brand-icon">✈</span>
          Traveloop.
        </Link>
        <div className="landing-nav-links">
          <a href="#destinations" className="landing-link">Destinations</a>
          <a href="#why" className="landing-link">Why Us</a>
          <a href="#" className="landing-link">Blog</a>
        </div>
        <div className="landing-nav-actions">
          <Link href="/login" className="landing-login-btn">Login</Link>
          <Link href="/signup" className="landing-signup-btn">Get Started →</Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title animate-slide-up">
            Plan Your Perfect<br />
            <span className="hero-title-gradient">Journey Effortlessly</span>
          </h1>
          <p className="hero-subtitle animate-slide-up">
            Intelligent, collaborative travel planning that transforms your dream trips into reality.
            From itineraries to budgets — all in one place.
          </p>

          {/* Search Bar */}
          <div className="hero-search animate-slide-up">
            <div className="search-field">
              <span className="search-label">From</span>
              <span className="search-value">Delhi (DEL)</span>
            </div>
            <div className="search-divider">
              <Plane size={16} />
            </div>
            <div className="search-field">
              <span className="search-label">To</span>
              <span className="search-value">Anywhere</span>
            </div>
            <div className="search-divider-line" />
            <div className="search-field">
              <span className="search-label">When</span>
              <span className="search-value">Pick a date</span>
            </div>
            <Link href="/trips/new" className="search-btn">
              <Search size={16} /> Search
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fade-in">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="hero-image-wrap animate-scale-in">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop"
              alt="Travel"
              className="hero-img"
            />
            <div className="hero-float-card top-left">
              <div className="float-icon">🗺️</div>
              <div>
                <div className="float-title">Smart Itinerary</div>
                <div className="float-sub">Custom travel plans</div>
              </div>
            </div>
            <div className="hero-float-card bottom-right">
              <div className="float-icon">💰</div>
              <div>
                <div className="float-title">Budget Tracker</div>
                <div className="float-sub">Real-time spending</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS ===== */}
      <section className="landing-section" id="destinations">
        <div className="section-top">
          <div>
            <p className="section-eyebrow">Handpicked for You</p>
            <h2 className="section-title-lg">Trending Indian Getaways</h2>
            <p className="section-desc-lg">Curated experiences for the discerning traveler.</p>
          </div>
          <Link href="/explore" className="btn btn-secondary btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="dest-grid">
          {DESTINATIONS.map(dest => (
            <Link href={`/trips/new?destination=${dest.name}`} key={dest.name} className="dest-card hover-lift" style={{ textDecoration: 'none' }}>
              <div className="dest-img-wrap">
                <img src={dest.image} alt={dest.name} className="dest-img" />
                <div className="dest-overlay" />
                <span className="dest-tag" style={{ background: dest.color }}>{dest.tag}</span>
                <div className="dest-info">
                  <h3 className="dest-name">{dest.name}</h3>
                  <p className="dest-country">
                    <MapPin size={12} /> {dest.country}
                  </p>
                </div>
              </div>
              <div className="dest-footer">
                <div className="dest-rating">
                  <Star size={13} fill="currentColor" style={{ color: '#F59E0B' }} />
                  <span className="font-semibold">{dest.rating}</span>
                  <span className="text-muted text-xs">({dest.reviews})</span>
                </div>
                <span className="dest-price">{dest.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== WHY CHOOSE ===== */}
      <section className="landing-why" id="why">
        <div className="why-inner">
          <div className="why-header">
            <p className="section-eyebrow">Why Traveloop</p>
            <h2 className="section-title-lg">Everything you need<br />to travel smarter</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: MapPin, color: '#6366F1', bg: '#EEF2FF', title: 'Smart Trip Planning', desc: 'Easily organize personalized itineraries tailored to your preferences, budget, and travel style.' },
              { icon: Users, color: '#0EA5E9', bg: '#F0F9FF', title: 'Collaborative Planning', desc: 'Plan trips together. Share itineraries, split expenses, and vote on activities with your travel group.' },
              { icon: Shield, color: '#10B981', bg: '#ECFDF5', title: 'Smart Budget Tracking', desc: 'Real-time expense tracking, category breakdowns, and budget alerts so you never overspend.' },
              { icon: Globe, color: '#F59E0B', bg: '#FFFBEB', title: '120+ Destinations', desc: 'Curated destination guides, local tips, and insider recommendations for every corner of the world.' },
              { icon: Headphones, color: '#EF4444', bg: '#FEF2F2', title: '24/7 Concierge', desc: 'Round-the-clock dedicated support to handle any request, anywhere in the world, instantly.' },
              { icon: Award, color: '#8B5CF6', bg: '#F5F3FF', title: 'Packing Checklists', desc: 'Auto-generated smart packing lists based on your destination, duration, and travel activities.' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="why-card hover-lift">
                <div className="why-icon" style={{ background: bg, color }}>
                  <Icon size={22} />
                </div>
                <h3 className="why-title">{title}</h3>
                <p className="why-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="landing-cta">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to start your adventure?</h2>
          <p className="cta-sub">Join 50,000+ travelers who plan smarter with Traveloop.</p>
          <div className="cta-actions">
            <Link href="/signup" className="cta-primary-btn">
              Start Planning Free <ArrowRight size={18} />
            </Link>
            <Link href="/explore" className="cta-secondary-btn">
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="landing-brand-text">Traveloop.</span>
            <p>Precision in Travel.</p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
            <a href="#">Careers</a>
          </div>
          <p className="footer-copy">© 2025 Traveloop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

