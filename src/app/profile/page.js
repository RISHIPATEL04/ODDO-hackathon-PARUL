"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Globe, Trash2, Camera, Save, Loader2, Shield, Bell, Key, ChevronRight } from "lucide-react";
import "./profile.css";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (status !== "authenticated" || !session?.user?.id) return;
      try {
        const res = await fetch(`/api/users/${session.user.id}`);
        const data = await res.json();
        if (data.success) setUser(data.data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    }
    fetchUser();
  }, [session, status]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email, language: user.language })
      });
      const data = await res.json();
      if (data.success) { setIsEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch (err) { console.error(err); }
    finally { setIsSaving(false); }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p className="text-muted">Loading your profile...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <div className="flex-center min-h-screen text-xl text-muted">Please sign in to view your profile.</div>;
  }

  if (!user) {
    return <div className="flex-center min-h-screen text-xl text-muted">Failed to load profile</div>;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          {/* Avatar */}
          <div className="profile-avatar-card">
            <div className="profile-avatar">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="avatar-camera-btn" title="Change photo">
              <Camera size={14} />
            </button>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email-display">{user.email}</div>
            <div className="profile-since">Member since 2025</div>
          </div>

          {/* Tabs */}
          <nav className="profile-nav">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`profile-nav-btn ${activeTab === id ? 'active' : ''}`}
              >
                <Icon size={17} />
                {label}
                <ChevronRight size={14} className="ml-auto" />
              </button>
            ))}
          </nav>

          {/* Stats */}
          <div className="profile-mini-stats">
            <div className="mini-stat"><span className="mini-stat-num">0</span><span>Trips</span></div>
            <div className="mini-stat"><span className="mini-stat-num">0</span><span>Countries</span></div>
            <div className="mini-stat"><span className="mini-stat-num">0</span><span>Cities</span></div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-section animate-slide-up">
              <div className="profile-section-header">
                <div>
                  <h2 className="profile-section-title">Personal Information</h2>
                  <p className="text-muted text-sm">Manage your name, email and preferences</p>
                </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
                ) : (
                  <div className="flex-row gap-2">
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
                    </button>
                  </div>
                )}
              </div>

              {saved && <div className="alert alert-success mb-4">Profile updated successfully!</div>}

              <form className="profile-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <User size={16} className="input-icon" />
                      <input
                        type="text" value={user.name} className="input-with-icon"
                        onChange={e => setUser({ ...user, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                  ) : (
                    <p className="profile-field-val">{user.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email" value={user.email} className="input-with-icon"
                        onChange={e => setUser({ ...user, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  ) : (
                    <p className="profile-field-val">{user.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label"><Globe size={14} className="inline mr-1" /> Language</label>
                  <select value={user.language || 'en'} onChange={e => setUser({ ...user, language: e.target.value })}>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="ja">🇯🇵 日本語</option>
                    <option value="hi">🇮🇳 Hindi</option>
                  </select>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="danger-zone">
                <h3 className="danger-title"><Trash2 size={16} /> Danger Zone</h3>
                <p className="text-sm text-muted mb-4">Once you delete your account, all your trip data will be permanently removed. This action cannot be undone.</p>
                <button className="btn btn-danger">Delete My Account</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section animate-slide-up">
              <div className="profile-section-header">
                <div>
                  <h2 className="profile-section-title">Security Settings</h2>
                  <p className="text-muted text-sm">Manage your password and security preferences</p>
                </div>
              </div>
              <div className="security-cards">
                <div className="security-card">
                  <div className="icon-box icon-box-primary"><Key size={18} /></div>
                  <div>
                    <div className="font-semibold">Change Password</div>
                    <div className="text-sm text-muted">Last changed: Never</div>
                  </div>
                  <button className="btn btn-secondary btn-sm ml-auto">Update</button>
                </div>
                <div className="security-card">
                  <div className="icon-box icon-box-success"><Shield size={18} /></div>
                  <div>
                    <div className="font-semibold">Two-Factor Authentication</div>
                    <div className="text-sm text-muted">Add an extra layer of security</div>
                  </div>
                  <button className="btn btn-secondary btn-sm ml-auto">Enable</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="profile-section animate-slide-up">
              <div className="profile-section-header">
                <div>
                  <h2 className="profile-section-title">Notification Preferences</h2>
                  <p className="text-muted text-sm">Manage how and when you receive notifications</p>
                </div>
              </div>
              <div className="notif-list">
                {[
                  { label: 'Trip Reminders', desc: 'Reminders before your trip starts', enabled: true },
                  { label: 'Budget Alerts', desc: 'Alerts when nearing your budget limit', enabled: true },
                  { label: 'New Destinations', desc: 'Discover new trending destinations', enabled: false },
                  { label: 'Collaborator Updates', desc: 'When someone edits a shared trip', enabled: true },
                ].map(({ label, desc, enabled }) => (
                  <div key={label} className="notif-row">
                    <div>
                      <div className="font-semibold text-sm">{label}</div>
                      <div className="text-xs text-muted">{desc}</div>
                    </div>
                    <div className={`toggle ${enabled ? 'on' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

