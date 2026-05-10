"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Compass, Mail, Lock, User } from "lucide-react";
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
    <div className="auth-container animate-fade-in flex-center">
      <div className="auth-card glass-panel flex-col flex-center">
        <Compass size={48} className="text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-2">Join Traveloop</h1>
        <p className="text-muted text-center mb-8">Start planning your dream multi-city trips today</p>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-md p-3 mb-4 w-full text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', color: '#EF4444' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex-col">
          <div className="form-group relative">
            <User size={20} className="input-icon text-muted" />
            <input 
              type="text" 
              className="auth-input pl-10" 
              placeholder="Full Name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group relative mt-4">
            <Mail size={20} className="input-icon text-muted" />
            <input 
              type="email" 
              className="auth-input pl-10" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group relative mt-4">
            <Lock size={20} className="input-icon text-muted" />
            <input 
              type="password" 
              className="auth-input pl-10" 
              placeholder="Password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-8" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account? <Link href="/login" className="text-primary font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
