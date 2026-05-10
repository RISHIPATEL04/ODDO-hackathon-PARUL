"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Compass, LayoutDashboard, Map, Binoculars, Users, LogOut, Bell, Plus } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Hide navbar on landing, login, signup
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') return null;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/trips', label: 'My Trips', icon: Map },
    { href: '/explore', label: 'Explore', icon: Binoculars },
    { href: '/community', label: 'Community', icon: Users },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <Compass className="logo-icon" size={24} />
          <span className="text-gradient">Traveloop</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated && navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link href="/trips/new" className="btn btn-primary btn-sm">
                <Plus size={14} /> New Trip
              </Link>
              <button className="btn-icon" title="Notifications">
                <Bell size={16} />
              </button>
              <Link href="/profile" className="nav-avatar" title="Profile">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </Link>
              <button
                className="btn-icon"
                onClick={() => signOut({ callbackUrl: '/login' })}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

