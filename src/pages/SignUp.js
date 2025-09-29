import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        avatar: "", // optional - use blank or a default image URL
      });
      
      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user_id", res.data.user.id);

      console.log("Signup successful");

      setTimeout(() => {
        navigate("/");
      });
    } catch (err) {
      setMsg(
        "Signup failed! " +
          (err.response?.data?.message || err.response?.data?.msg || "")
      );
    }
  }

  return (
    <div className="auth-bg">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Create your account</h2>
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label>Avatar</label>
        <input
          type="text"
          name="avatar"
          placeholder="Avatar URL (optional)"
          value={form.avatar}
          onChange={handleChange}
        />
        <button className="auth-btn" type="submit">
          Sign up
        </button>
        {msg && (
          <div
            style={{
              marginTop: 10,
              color: msg.startsWith("Signup successful") ? "green" : "red",
            }}
          >
            {msg}
          </div>
        )}
        <div className="auth-link-row">
          <a href="/login">Already have an account? Log in</a>
        </div>
      </form>
    </div>
  );
}
