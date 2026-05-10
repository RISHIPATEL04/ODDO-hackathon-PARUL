"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Settings, Globe, Trash2, Camera, Save, Loader2 } from "lucide-react";
import "./profile.css";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (status !== "authenticated" || !session?.user?.id) return;
      try {
        const res = await fetch(`/api/users/${session.user.id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsLoading(false);
      }
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
      if (data.success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="flex-center" style={{ height: '60vh' }}><Loader2 className="text-primary animate-spin" size={48} /></div>;
  }

  if (status === "unauthenticated") {
    return <div className="text-center mt-8 text-2xl">Please sign in to view your profile.</div>;
  }

  if (!user) {
    return <div className="text-center mt-8 text-2xl">Failed to load profile</div>;
  }

  return (
    <div className="profile-container animate-fade-in max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex-row"><Settings className="text-primary" /> Profile & Settings</h1>
        <p className="text-muted mt-2">Manage your personal information and preferences.</p>
      </header>

      <div className="profile-grid">
        <section className="glass-panel p-8 profile-main">
          <div className="flex-between mb-8">
            <h2 className="text-2xl font-bold">Personal Info</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
            ) : (
              <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>

          <div className="avatar-section flex-row mb-8">
            <div className="avatar-placeholder bg-surface-hover">
              <User size={48} className="text-muted" />
            </div>
            {isEditing && (
              <button className="btn btn-secondary text-sm flex-row">
                <Camera size={16} /> Change Photo
              </button>
            )}
          </div>

          <form className="flex-col gap-6" onSubmit={handleSave}>
            <div className="form-group">
              <label className="font-medium text-muted mb-2 block">Full Name</label>
              {isEditing ? (
                <div className="relative">
                  <User size={18} className="input-icon text-muted" />
                  <input 
                    type="text" 
                    className="profile-input pl-10" 
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                  />
                </div>
              ) : (
                <p className="text-lg">{user.name}</p>
              )}
            </div>

            <div className="form-group">
              <label className="font-medium text-muted mb-2 block">Email Address</label>
              {isEditing ? (
                <div className="relative">
                  <Mail size={18} className="input-icon text-muted" />
                  <input 
                    type="email" 
                    className="profile-input pl-10" 
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                  />
                </div>
              ) : (
                <p className="text-lg">{user.email}</p>
              )}
            </div>
          </form>
        </section>

        <section className="profile-sidebar flex-col gap-6">
          <div className="glass-panel p-8">
            <h3 className="font-bold mb-6 flex-row"><Globe size={18} className="text-secondary" /> Preferences</h3>
            <div className="form-group">
              <label className="font-medium text-muted mb-2 block">Language</label>
              <select 
                className="profile-select" 
                value={user.language} 
                onChange={(e) => setUser({...user, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>

          <div className="glass-panel p-8 danger-zone">
            <h3 className="font-bold text-danger mb-4 flex-row"><Trash2 size={18} /> Danger Zone</h3>
            <p className="text-sm text-muted mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="btn btn-danger w-full">Delete Account</button>
          </div>
        </section>
      </div>
    </div>
  );
}
