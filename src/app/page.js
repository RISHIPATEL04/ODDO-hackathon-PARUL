import Link from "next/link";
import { Search, Bell, Settings, Shield, Headphones, Award, ArrowRight, Plane } from "lucide-react";
import "./page.css";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ======================== NAVBAR ======================== */}
      <nav className="landing-nav">
        <Link href="/" className="landing-nav-brand">Traveloop.</Link>

        <div className="landing-nav-links">
          <Link href="/" className="landing-nav-link active">Trips</Link>
          <Link href="/explore" className="landing-nav-link">Regional</Link>
          <Link href="/explore" className="landing-nav-link">International</Link>
          <Link href="/explore" className="landing-nav-link">Concierge</Link>
        </div>

        <div className="landing-nav-right">
          <button className="landing-nav-icon"><Search size={18} /></button>
          <button className="landing-nav-icon"><Bell size={18} /></button>
          <button className="landing-nav-icon"><Settings size={18} /></button>
          <Link href="/login" className="landing-nav-avatar">GO</Link>
        </div>
      </nav>

      {/* ======================== HERO BANNER ======================== */}
      <section className="landing-hero">
        <h2>Plan Your Trip</h2>

        <div className="landing-search-bar">
          <div className="landing-search-field">
            <span className="landing-search-label">From</span>
            <span className="landing-search-value">Delhi (DEL)</span>
          </div>

          <Plane size={18} style={{ color: '#1a56db', flexShrink: 0 }} />

          <div className="landing-search-field">
            <span className="landing-search-label">To</span>
            <span className="landing-search-value">Abu Dhabi (AUH)</span>
          </div>

          <div className="landing-search-divider"></div>

          <div className="landing-search-field">
            <span className="landing-search-label">On</span>
            <span className="landing-search-value">Feb 24, 2024</span>
          </div>

          <Link href="/login" className="landing-search-btn">Search</Link>
        </div>
      </section>

      {/* ======================== DESTINATIONS ======================== */}
      <section className="landing-section">
        <div className="landing-section-header">
          <div>
            <h2>Handpicked Indian Getaways</h2>
            <p>Curated experiences for the discerning traveler.</p>
          </div>
          <Link href="/explore" className="landing-view-all">View All →</Link>
        </div>

        <div className="landing-dest-grid">
          {/* Udaipur */}
          <div className="landing-dest-card">
            <img 
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1932&auto=format&fit=crop" 
              alt="Udaipur" 
            />
            <div className="landing-dest-overlay">
              <span className="landing-dest-badge heritage">Heritage</span>
              <h3 className="landing-dest-name">Udaipur</h3>
              <p className="landing-dest-desc">Experience the royal majesty of the City of Lakes.</p>
              <p className="landing-dest-price"><span>From </span>₹25,000</p>
            </div>
          </div>

          {/* Goa */}
          <div className="landing-dest-card">
            <img 
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2074&auto=format&fit=crop" 
              alt="Goa" 
            />
            <div className="landing-dest-overlay">
              <span className="landing-dest-badge coastal">Coastal</span>
              <h3 className="landing-dest-name">Goa</h3>
              <p className="landing-dest-desc">Relax on pristine beaches with exclusive resort stays.</p>
              <p className="landing-dest-price"><span>From </span>₹18,000</p>
            </div>
          </div>

          {/* Kashmir */}
          <div className="landing-dest-card">
            <img 
              src="https://images.unsplash.com/photo-1567157577867-05ccb1388e13?q=80&w=1974&auto=format&fit=crop" 
              alt="Kashmir" 
            />
            <div className="landing-dest-overlay">
              <span className="landing-dest-badge alpine">Alpine</span>
              <h3 className="landing-dest-name">Kashmir</h3>
              <p className="landing-dest-desc">Discover the paradise on earth with luxury alpine lodges.</p>
              <p className="landing-dest-price"><span>From </span>₹32,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== WHY CHOOSE ======================== */}
      <section className="landing-why">
        <h2>Why Choose Traveloop.</h2>
        <p>Elevating your travel experience through uncompromising standards and dedicated service.</p>

        <div className="landing-why-grid">
          <div className="landing-why-card">
            <div className="landing-why-icon blue">
              <Award size={24} />
            </div>
            <h3>Premium Service</h3>
            <p>Experience white-glove service from booking to destination, ensuring a flawless journey.</p>
          </div>

          <div className="landing-why-card">
            <div className="landing-why-icon green">
              <Shield size={24} />
            </div>
            <h3>Uncompromising Safety</h3>
            <p>Your well-being is our paramount concern, with rigorous safety standards at every touchpoint.</p>
          </div>

          <div className="landing-why-card">
            <div className="landing-why-icon sky">
              <Headphones size={24} />
            </div>
            <h3>24/7 Concierge</h3>
            <p>Round-the-clock dedicated support to handle any request, anywhere in the world.</p>
          </div>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="landing-footer">
        <div className="landing-footer-top">
          <span className="landing-footer-brand">Traveloop.</span>
          <div className="landing-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
            <a href="#">Careers</a>
          </div>
        </div>
        <p className="landing-footer-copy">© 2024 Traveloop. Precision in Travel.</p>
      </footer>
    </div>
  );
}
