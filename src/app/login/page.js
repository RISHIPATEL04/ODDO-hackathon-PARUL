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

          {/* Divider */}
          <div className="login-divider">
            <span>Or continue with</span>
          </div>

          {/* Social */}
          <div className="login-social-row">
            <button type="button" className="login-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.8 15.7 17.58V20.34H19.26C21.34 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.7 17.58C14.73 18.23 13.47 18.62 12 18.62C9.16 18.62 6.75 16.7 5.88 14.12H2.2V16.98C4.01 20.57 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.88 14.12C5.66 13.47 5.53 12.76 5.53 12C5.53 11.24 5.66 10.53 5.88 9.88V7.02H2.2C1.45 8.52 1 10.21 1 12C1 13.79 1.45 15.48 2.2 16.98L5.88 14.12Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.07 5.94 16.21 7.03L19.34 3.9C17.45 2.14 14.97 1 12 1C7.7 1 4.01 3.43 2.2 7.02L5.88 9.88C6.75 7.3 9.16 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="login-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                <path d="M16.14 12.01C16.14 9.07 18.52 7.65 18.63 7.58C17.28 5.6 15.16 5.29 14.42 5.21C12.57 5.02 10.78 6.31 9.84 6.31C8.89 6.31 7.43 5.23 5.91 5.25C3.93 5.27 2.11 6.4 1.1 8.16C-0.96 11.75 0.57 17.06 2.59 19.97C3.58 21.38 4.76 22.95 6.28 22.89C7.75 22.82 8.32 21.92 10.05 21.92C11.77 21.92 12.29 22.89 13.83 22.87C15.41 22.82 16.43 21.42 17.42 20.01C18.57 18.34 19.04 16.71 19.08 16.62C19.04 16.6 16.14 15.51 16.14 12.01Z"/>
                <path d="M13.68 3.52C14.5 2.53 15.06 1.14 14.91 -0.22C13.75 0.28 12.29 1.04 11.43 2.06C10.67 2.93 10.01 4.36 10.2 5.72C11.52 5.82 12.87 5.02 13.68 3.52Z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Bottom */}
          <p className="login-bottom-link">
            Don&apos;t have an account? <Link href="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

