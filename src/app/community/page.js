"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Heart, MessageCircle, Send, Plus, X, MapPin,
  Users, Globe, Sparkles, Tag, Image as ImageIcon,
  Loader2, ChevronDown, ChevronUp
} from "lucide-react";
import "./community.css";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop",
];

const TAG_OPTIONS = ["Adventure", "Beach", "Culture", "Food", "Nature", "City", "Mountains", "Budget", "Luxury", "Solo"];

function getInitials(name = "") {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ── Post Card ──────────────────────────────────────────────────────────────
function PostCard({ post, session, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const inputRef = useRef(null);

  const isLiked = session && localPost.likes.some(id => id === session.user.id || id.toString() === session.user.id);
  const coverImg = localPost.coverPhoto || SAMPLE_IMAGES[Math.abs(localPost._id.charCodeAt?.(0) ?? 0) % SAMPLE_IMAGES.length];

  const handleLike = async () => {
    if (!session) return;
    const res = await onLike(localPost._id);
    if (res?.success) {
      setLocalPost(p => ({
        ...p,
        likes: res.liked
          ? [...p.likes, session.user.id]
          : p.likes.filter(id => id !== session.user.id && id.toString() !== session.user.id),
      }));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    const res = await onComment(localPost._id, commentText.trim());
    if (res?.success) {
      setLocalPost(p => ({ ...p, comments: [...p.comments, res.data] }));
      setCommentText("");
    }
    setSubmitting(false);
  };

  return (
    <article className="cp-card animate-slide-up">
      {/* Cover Image */}
      <div className="cp-cover-wrap">
        <img src={coverImg} alt={localPost.tripName} className="cp-cover-img" />
        <div className="cp-cover-overlay" />
        <div className="cp-cover-info">
          <h2 className="cp-trip-name">{localPost.tripName}</h2>
          <div className="cp-destination">
            <MapPin size={13} />
            <span>{localPost.destination}</span>
          </div>
        </div>
        {localPost.tags?.length > 0 && (
          <div className="cp-tags-row">
            {localPost.tags.slice(0, 3).map(tag => (
              <span key={tag} className="cp-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Author Row */}
      <div className="cp-author-row">
        <div className="cp-avatar">{getInitials(localPost.userName)}</div>
        <div className="cp-author-info">
          <span className="cp-author-name">{localPost.userName}</span>
          <span className="cp-author-time">{timeAgo(localPost.createdAt)}</span>
        </div>
      </div>

      {/* Description */}
      {localPost.description && (
        <p className="cp-description">{localPost.description}</p>
      )}

      {/* Action Bar */}
      <div className="cp-action-bar">
        <button
          className={`cp-action-btn ${isLiked ? "cp-liked" : ""}`}
          onClick={handleLike}
          disabled={!session}
          title={!session ? "Login to like" : ""}
        >
          <Heart size={17} fill={isLiked ? "currentColor" : "none"} />
          <span>{localPost.likes.length}</span>
          <span className="cp-action-label">Likes</span>
        </button>

        <button
          className={`cp-action-btn ${showComments ? "cp-active" : ""}`}
          onClick={() => {
            setShowComments(v => !v);
            setTimeout(() => inputRef.current?.focus(), 200);
          }}
        >
          <MessageCircle size={17} />
          <span>{localPost.comments.length}</span>
          <span className="cp-action-label">Comments</span>
          {showComments ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="cp-comments-panel">
          <div className="cp-comments-divider" />

          {localPost.comments.length === 0 && (
            <p className="cp-no-comments">No comments yet — be the first!</p>
          )}

          <div className="cp-comments-list">
            {localPost.comments.map((c, i) => (
              <div key={c._id || i} className="cp-comment">
                <div className="cp-comment-avatar">{getInitials(c.userName)}</div>
                <div className="cp-comment-bubble">
                  <span className="cp-comment-author">{c.userName}</span>
                  <p className="cp-comment-text">{c.text}</p>
                  <span className="cp-comment-time">{timeAgo(c.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {session ? (
            <form className="cp-comment-form" onSubmit={handleComment}>
              <div className="cp-comment-form-avatar">{getInitials(session.user.name)}</div>
              <div className="cp-comment-input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  className="cp-comment-input"
                  placeholder="Write a comment…"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  disabled={submitting}
                />
                <button
                  type="submit"
                  className="cp-comment-send"
                  disabled={!commentText.trim() || submitting}
                  title="Post comment"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </form>
          ) : (
            <p className="cp-login-prompt">
              <a href="/login">Login</a> to leave a comment.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

// ── Create Post Modal ──────────────────────────────────────────────────────
function CreatePostModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    tripName: "", destination: "", coverPhoto: "", description: "", tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tripName.trim() || !form.destination.trim()) {
      setError("Trip name and destination are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSuccess(data.data);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="cp-modal-backdrop" onClick={onClose}>
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <h2 className="cp-modal-title">Share Your Trip</h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="cp-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Trip Name *</label>
            <input
              placeholder="e.g. Golden Triangle Adventure"
              value={form.tripName}
              onChange={e => setForm(f => ({ ...f, tripName: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Destination *</label>
            <div className="input-wrapper">
              <MapPin size={16} className="input-icon" />
              <input
                className="input-with-icon"
                placeholder="e.g. Rajasthan, India"
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Photo URL (optional)</label>
            <div className="input-wrapper">
              <ImageIcon size={16} className="input-icon" />
              <input
                className="input-with-icon"
                placeholder="https://images.unsplash.com/..."
                value={form.coverPhoto}
                onChange={e => setForm(f => ({ ...f, coverPhoto: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              placeholder="Tell the community about your trip experience…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="cp-tag-selector">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag} type="button"
                  className={`cp-tag-btn ${form.tags.includes(tag) ? "cp-tag-selected" : ""}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="cp-modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Posting…</> : <><Sparkles size={15} /> Share Trip</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/community")
      .then(r => r.json())
      .then(d => { if (d.success) setPosts(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    const res = await fetch(`/api/community/${postId}/like`, { method: "POST" });
    return res.json();
  };

  const handleComment = async (postId, text) => {
    const res = await fetch(`/api/community/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.json();
  };

  const onPostCreated = (newPost) => {
    setPosts(p => [newPost, ...p]);
  };

  const allTags = ["All", ...TAG_OPTIONS];
  const filtered = activeFilter === "All"
    ? posts
    : posts.filter(p => p.tags?.includes(activeFilter));

  const totalLikes = posts.reduce((acc, p) => acc + p.likes.length, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p className="text-muted">Loading community…</p>
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* ── Hero ── */}
      <section className="comm-hero">
        <div className="comm-hero-inner">
          <div className="comm-hero-text">
            <div className="hero-pill animate-fade-in">
              <Users size={14} />
              <span>Traveler Community</span>
            </div>
            <h1 className="comm-hero-title animate-slide-up">
              Stories from<br />
              <span className="text-gradient">Fellow Travelers</span>
            </h1>
            <p className="comm-hero-sub animate-slide-up">
              Discover real trips, get inspired, and share your own adventures with thousands of travelers.
            </p>
            {session && (
              <button
                className="btn btn-primary btn-lg animate-slide-up"
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} /> Share Your Trip
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="comm-hero-stats animate-scale-in">
            <div className="comm-stat-card">
              <Globe size={22} className="comm-stat-icon" style={{ color: "var(--primary)" }} />
              <div className="stat-chip">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Trip Stories</span>
              </div>
            </div>
            <div className="comm-stat-card">
              <Heart size={22} className="comm-stat-icon" style={{ color: "#EF4444" }} />
              <div className="stat-chip">
                <span className="stat-value">{totalLikes}</span>
                <span className="stat-label">Total Likes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="comm-filter-bar">
        <div className="comm-filter-inner">
          <div className="tabs-bar">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tab-btn ${activeFilter === tag ? "active" : ""}`}
                onClick={() => setActiveFilter(tag)}
              >
                {tag === "All" ? <Globe size={14} /> : <Tag size={12} />}
                {tag}
              </button>
            ))}
          </div>
          {session && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <Plus size={14} /> New Post
            </button>
          )}
        </div>
      </div>

      {/* ── Feed ── */}
      <div className="comm-feed-section">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p className="text-muted">Loading posts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Globe size={32} />
            </div>
            <h3>No trips found</h3>
            <p className="text-muted text-sm">
              {activeFilter !== "All"
                ? `No posts tagged "${activeFilter}" yet.`
                : "Be the first to share your travel story!"}
            </p>
            {session && (
              <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
                <Plus size={16} /> Share Your Trip
              </button>
            )}
          </div>
        ) : (
          <div className="comm-grid">
            {filtered.map(post => (
              <PostCard
                key={post._id}
                post={post}
                session={session}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Create Post Modal ── */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSuccess={onPostCreated}
        />
      )}
    </div>
  );
}

