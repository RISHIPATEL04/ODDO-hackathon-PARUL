"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Compass, User, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Hide navbar on auth pages for full-screen layouts
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') return null;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo flex-row">
          <Compass className="logo-icon" size={28} />
          <span className="text-gradient font-bold text-xl">Traveloop</span>
        </Link>
        
        <div className="navbar-links flex-row">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <Link href="/explore" className={`nav-link ${pathname === '/explore' ? 'active' : ''}`}>Explore</Link>
              <Link href="/trips" className={`nav-link ${pathname === '/trips' ? 'active' : ''}`}>My Trips</Link>
              <Link href="/profile" className="nav-icon-link">
                <User size={20} />
              </Link>
              <button 
                className="nav-icon-link btn-logout" 
                onClick={() => signOut({ callbackUrl: '/login' })}
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
