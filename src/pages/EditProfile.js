import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL;

export default function EditProfile() {
  // Get from localStorage
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("jwt");

  const [form, setForm] = useState({ username: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fileInput = useRef();

  useEffect(() => {
    setLoading(true);
    axios.get(`${apiUrl}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setForm({
          username: res.data.username || "",
          email: res.data.email || "",
          avatar: res.data.avatar || ""
        });
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, [userId, token]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
      const file = e.target.files[0];
      setForm({ ...form, avatar: file ? file.name : "" });
    }
    async function handleSubmit(e) {
      e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        username: form.username,
        email: form.email,
        avatar: form.avatar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError("Failed to update profile: " + (err.response?.data?.msg || err.message));
    }
    setLoading(false);
  }

  return (
    <div className="editprof-bg">
      <form className="editprof-form-card" onSubmit={handleSubmit} autoComplete="off">
        <h1 className="editprof-title">Update Profile</h1>
        <label className="editprof-label">Username</label>
        <input
          className="editprof-input"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label className="editprof-label">Email</label>
        <input
          className="editprof-input"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label className="editprof-label">Avatar</label>
        <div className="editprof-avatar-flex">
          <input
            className="editprof-input"
            type="text"
            name="avatar"
            value={form.avatar}
            placeholder="Paste avatar URL or upload"
            onChange={handleChange}
            style={{ flex: 1 }}
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="button"
            className="editprof-upload-btn"
            onClick={() => fileInput.current.click()}
            tabIndex={-1}
          >
            <svg width="22" height="22" fill="none"><path d="M4 14v2.5A2.5 2.5 0 0 0 6.5 19h11a2.5 2.5 0 0 0 2.5-2.5V14M16 8l-5-5-5 5M11 3v11" stroke="#3a6b92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        <small className="editprof-desc">Upload new avatar</small>

        <div className="editprof-btns">
          <button
            type="button"
            className="editprof-cancel-btn"
            onClick={() => navigate("/profile")}
            disabled={loading}
          >
            Cancel
          </button>
          <button className="editprof-save-btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {error && <div className="editprof-error">{error}</div>}
      </form>
    </div>
  );
}
