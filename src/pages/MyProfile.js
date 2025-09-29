import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProfile.css";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("jwt");
    if (!userId || !token) {
      setError("You must login to view your profile.");
      setLoading(false);
      return;
    }
    axios.get(`${apiUrl}api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load profile: " +
          (err.response?.data?.msg || err.response?.data?.message || err.message));
        setLoading(false);
      });
  }, []);

  const avatarUrl =
    profile && profile.avatar && profile.avatar.trim() !== ""
      ? profile.avatar
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.username || "User");

  function handleLogout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user_id");
    navigate("/login");
  }

  function handleEditProfile() {
    navigate("/edit-profile");
  }

  if (loading)
    return <div className="profile-loading">Loading your profile...</div>;
  if (error)
    return <div className="profile-error">{error}</div>;
  if (!profile)
    return null;

  return (
    <div className="profile-wrapper">
      <div className="profile-card-large">
        <div className="profile-avatar-container">
          <img src={avatarUrl} alt="Avatar" className="profile-avatar-lg" />
          <span className="profile-edit-pen" onClick={handleEditProfile}>
            <svg height="32" width="32" viewBox="0 0 24 24"><circle cx="16" cy="16" r="14" fill="#fff"/><path d="M14.3 8.1l1.6 1.6-6.1 6.2-2.2.6.6-2.2 6.1-6.2zm1.7-1.7l.7-.7c.4-.4 1.1-.4 1.5 0l1.3 1.3c.4.4.4 1.1 0 1.5l-.7.7-2.1-2.1z" fill="#5f5f5f"/></svg>
          </span>
        </div>
        <h2 className="profile-main-name">{profile.username}</h2>
        <div className="profile-joined">Joined on {new Date(profile.joinedAt).toLocaleDateString()}</div>
        <div className="profile-row">
          <span className="profile-icon">
            <svg width="19" height="19" fill="none"><path d="M3 6.25v-.5a6.25 6.25 0 0 1 12.5 0v.5" stroke="#50566d" strokeWidth="2" /><rect x="3" y="6.25" width="12.5" height="9.25" rx="4.625" fill="#eaf0fb"/><rect x="3" y="6.25" width="12.5" height="9.25" rx="4.625" stroke="#50566d" strokeWidth="2"/></svg>
          </span>
          <span className="profile-row-email">{profile.email}</span>
        </div>
        <div className="profile-id-row">
          <span className="profile-id-icon">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none"><rect x="4" y="4" width="11" height="11" rx="2.5" fill="#eaf0fb"/><rect x="4" y="4" width="11" height="11" rx="2.5" stroke="#50566d" strokeWidth="2"/></svg>
          </span>
          <span className="profile-id-label">User ID: <span className="profile-id-text">{profile._id}</span></span>
          <button className="profile-id-copy" onClick={() => navigator.clipboard.writeText(profile._id)}>Copy</button>
        </div>
        <div className="profile-actions">
          <button className="profile-edit-btn" onClick={handleEditProfile}>
            <span className="profile-action-icon">✏️</span> Edit Profile
          </button>
          <button className="profile-logout-btn" onClick={handleLogout}>
            <span className="profile-action-icon">⎋</span> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
