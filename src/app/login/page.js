"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock } from "lucide-react";
import "./auth.css";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="login-wrapper">
      {/* ========== LEFT: Visual Panel ========== */}
      <div className="login-left">
        <div className="login-porthole">
          <img 
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" 
            alt="Snow-capped mountain peaks"
          />
        </div>

        <div className="login-left-text">
          <h1>Effortless<br/>Elevation.</h1>
          <p>
            Experience the pinnacle of travel planning. Seamless journeys tailored precisely to your schedule and standards.
          </p>
        </div>
      </div>

      {/* ========== RIGHT: Form Panel ========== */}
      <div className="login-right">
        <div className="login-form-box">
          <div className="login-brand">Traveloop.</div>

          <h2 className="login-heading">Welcome back</h2>
          <p className="login-subheading">Please enter your details to access your account.</p>

          {errorMsg && <div className="login-error">{errorMsg}</div>}

          <form onSubmit={handleSubmit}>
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
                <Link href="/forgot" className="login-forgot">Forgot password?</Link>
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
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Bottom */}
          <p className="login-bottom-link">
            Don&apos;t have an account? <Link href="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

