"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Map, Camera, ArrowRight } from "lucide-react";
import "./newTrip.css";

export default function NewTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    coverPhoto: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size should be less than 5MB");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
        router.push(`/trips/builder?id=${data.data._id}`);
      } else {
        setErrorMsg(data.error || "Failed to create trip");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while communicating with the server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-trip-container animate-slide-up">
      <div className="glass-panel max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <div className="icon-wrapper bg-primary-light mx-auto mb-4">
            <Map size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Plan a New Trip</h1>
          <p className="text-muted mt-2">Where is your next adventure taking you?</p>
        </header>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-md p-3 mb-6 w-full text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', color: '#EF4444' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col">
          <div className="form-group">
            <label htmlFor="name" className="font-medium mb-2 block">Trip Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="e.g. Euro Summer 2024" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label htmlFor="startDate" className="font-medium mb-2 block flex-row">
                <Calendar size={16} className="text-muted"/> Start Date
              </label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                value={formData.startDate}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate" className="font-medium mb-2 block flex-row">
                <Calendar size={16} className="text-muted"/> End Date
              </label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                value={formData.endDate}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="font-medium mb-2 block">Description (Optional)</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="What's the goal of this trip?" 
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group cover-upload flex-col flex-center text-center p-8 mt-4" style={{
            backgroundImage: formData.coverPhoto ? `url(${formData.coverPhoto})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: formData.coverPhoto ? 'white' : 'inherit',
            textShadow: formData.coverPhoto ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'
          }}>
            <Camera size={32} className={formData.coverPhoto ? "text-white mb-2" : "text-muted mb-2"} />
            <p className="font-medium">{fileName || "Upload a Cover Photo"}</p>
            {!formData.coverPhoto && <p className="text-sm text-muted">JPEG, PNG up to 5MB</p>}
            <input 
              type="file" 
              id="coverPhoto" 
              className="hidden-input" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label htmlFor="coverPhoto" className="btn btn-secondary mt-4" style={{
              backgroundColor: formData.coverPhoto ? 'rgba(0,0,0,0.5)' : '',
              color: formData.coverPhoto ? 'white' : ''
            }}>
              {formData.coverPhoto ? "Change Photo" : "Choose File"}
            </label>
          </div>

          <div className="form-actions mt-8 flex-between">
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Continue to Itinerary'}
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
