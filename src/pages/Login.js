import "./SignUp.css";
// src/pages/Login.js
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
   async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      
      localStorage.setItem("jwt", res.data.token); // Or use Context for auth if needed
      // You can also store res.data.user if you want user info for navbar/profile
      localStorage.setItem("user_id", res.data.user.id);

      console.log("Login successful");

      setTimeout(() => {
        navigate("/");     //Redirect to home page after login
      });
    } catch (err) {
      setMsg("Login failed! " + (err.response?.data?.msg || ""));
    }
  }

  return (
    <div className="auth-bg">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Login to your account</h2>
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
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="auth-btn" type="submit">Login</button>
        {msg && <div className="auth-msg">{msg}</div>}
        <div className="auth-link-row">
          <a href="/register">Don't have an account? Sign up</a>
        </div>
      </form>
    </div>
  );
}
