"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, User } from "lucide-react";
import "../login/auth.css";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Automatically sign them in after successful registration
        await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        router.push("/dashboard");
      } else {
        setErrorMsg(data.error || "Registration failed");
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg("Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* ========== LEFT: Visual Panel ========== */}
      <div className="login-left">
        <div className="login-porthole">
          <img 
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop" 
            alt="Beautiful beach horizon"
          />
        </div>

        <div className="login-left-text">
          <h1>Boundless<br/>Horizons.</h1>
          <p>
            Start your journey with us. Plan multi-city trips seamlessly and discover the world's hidden gems.
          </p>
        </div>
      </div>

      {/* ========== RIGHT: Form Panel ========== */}
      <div className="login-right">
        <div className="login-form-box">
          <div className="login-brand">Traveloop.</div>

          <h2 className="login-heading">Create an account</h2>
          <p className="login-subheading">Join us to start planning your dream trips.</p>

          {errorMsg && <div className="login-error">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">Full Name</label>
              </div>
              <div className="login-input-wrap">
                <User size={18} className="login-input-icon" />
                <input 
                  type="text"
                  className="login-input"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Email */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">Email address</label>
              </div>
              <div className="login-input-wrap">
                <Mail size={18} className="login-input-icon" />
                <input 
                  type="email"
                  className="login-input"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">Password</label>
              </div>
              <div className="login-input-wrap">
                <Lock size={18} className="login-input-icon" />
                <input 
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Bottom */}
          <p className="login-bottom-link">
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

