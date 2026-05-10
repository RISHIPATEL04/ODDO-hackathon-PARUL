"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Map, Camera, ArrowRight, Sparkles, X, CheckCircle } from "lucide-react";
import "./newTrip.css";

const COVER_SUGGESTIONS = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800&auto=format&fit=crop",
];

export default function NewTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: "", startDate: "", endDate: "", description: "", coverPhoto: "",
    destination: "Paris", tripType: "International", modeOfTravel: "Flight", budget: 5000
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // Read from window.location instead of useSearchParams to avoid Suspense requirement
    const params = new URLSearchParams(window.location.search);
    const dest = params.get('destination');
    if (dest) {
      setFormData(prev => ({ ...prev, destination: dest, name: `${dest} Trip` }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'budget' ? Number(value) : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrorMsg("Image size should be less than 5MB"); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, coverPhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect to local flights page to pick a flight instead of MakeMyTrip
        router.push(`/trips/${data.data._id}/flights`);
      } else {
        setErrorMsg(data.error || "Failed to create trip");
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-trip-page animate-fade-in">
      <div className="new-trip-container">
        {/* Left - Preview */}
        <div className="new-trip-preview">
          <div
            className="preview-cover"
            style={{ backgroundImage: formData.coverPhoto ? `url(${formData.coverPhoto})` : 'none' }}
          >
            {!formData.coverPhoto && (
              <div className="preview-placeholder">
                <Map size={48} className="text-muted" />
                <p className="text-muted mt-2">Cover photo preview</p>
              </div>
            )}
            {formData.coverPhoto && <div className="preview-overlay" />}
            {formData.name && (
              <div className="preview-name-badge">
                <h3 className="preview-trip-name">{formData.name}</h3>
                {formData.startDate && (
                  <p className="preview-trip-dates">
                    {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {formData.endDate && ` — ${new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Suggested Covers */}
          <div className="preview-suggestions">
            <p className="text-xs text-muted font-semibold mb-2">SUGGESTED COVERS</p>
            <div className="suggestions-grid">
              {COVER_SUGGESTIONS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setFormData(prev => ({ ...prev, coverPhoto: url }))}
                  className={`suggestion-img-btn ${formData.coverPhoto === url ? 'selected' : ''}`}
                >
                  <img src={url} alt={`Suggestion ${i + 1}`} />
                  {formData.coverPhoto === url && (
                    <div className="suggestion-check">
                      <CheckCircle size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="new-trip-form-wrap">
          <div className="new-trip-form-header">
            <div className="icon-box icon-box-primary icon-box-lg mb-4">
              <Sparkles size={24} />
            </div>
            <h1 className="text-3xl font-bold">Plan a New Trip</h1>
            <p className="text-muted mt-2">Where is your next adventure taking you?</p>
          </div>

          {errorMsg && (
            <div className="alert alert-error mb-6">
              <X size={16} className="flex-shrink-0" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="new-trip-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Trip Name *</label>
              <input
                id="name" name="name" type="text"
                placeholder='e.g. "Euro Summer 2025" or "Goa Beach Escape"'
                value={formData.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="destination">Destination *</label>
              <input
                id="destination" name="destination" type="text"
                placeholder='e.g. "Paris", "Bali", "Goa"'
                value={formData.destination} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label flex-between" htmlFor="budget">
                <span>Trip Budget</span>
                <span className="font-bold text-primary">₹{formData.budget}</span>
              </label>
              <input
                id="budget" name="budget" type="range"
                min="5000" max="500000" step="1000"
                value={formData.budget} onChange={handleChange} 
                style={{ width: '100%', accentColor: 'var(--primary)', height: '6px', borderRadius: '4px', appearance: 'none', background: 'var(--border-color)' }}
              />
              <div className="flex-between text-xs text-muted mt-2">
                <span>₹5,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="tripType">Trip Type</label>
                <select id="tripType" name="tripType" value={formData.tripType} onChange={handleChange} className="form-select">
                  <option value="Regional">Regional</option>
                  <option value="International">International</option>
                </select>
              </div>

              {formData.tripType === 'Regional' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="modeOfTravel">Mode of Travel</label>
                  <select id="modeOfTravel" name="modeOfTravel" value={formData.modeOfTravel} onChange={handleChange} className="form-select">
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Bus">Bus</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
              )}
              {formData.tripType === 'International' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="modeOfTravel">Mode of Travel</label>
                  <select id="modeOfTravel" name="modeOfTravel" value={formData.modeOfTravel} onChange={handleChange} className="form-select" disabled>
                    <option value="Flight">Flight</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="startDate">
                  <Calendar size={14} className="inline mr-1" /> Start Date *
                </label>
                <input
                  id="startDate" name="startDate" type="date"
                  value={formData.startDate} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="endDate">
                  <Calendar size={14} className="inline mr-1" /> End Date *
                </label>
                <input
                  id="endDate" name="endDate" type="date"
                  value={formData.endDate} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description (Optional)</label>
              <textarea
                id="description" name="description"
                placeholder="What's the vibe? Backpacking, luxury, adventure, family..."
                rows="3" value={formData.description} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Photo</label>
              <label htmlFor="coverPhoto" className="upload-area">
                <Camera size={20} className="text-muted" />
                <span className="text-sm font-medium">
                  {fileName || "Upload a custom photo"}
                </span>
                <span className="text-xs text-muted">JPEG, PNG up to 5MB</span>
                <input
                  id="coverPhoto" type="file" accept="image/*"
                  onChange={handleImageUpload} className="hidden"
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Creating...
                  </>
                ) : (
                  <>Continue to Flights <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

