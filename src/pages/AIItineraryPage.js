import React, { useState } from "react";
import "./AIItineraryPage.css";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AIItineraryPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    destination: "",
    days: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const token = localStorage.getItem("jwt");
    try {
      if (!token) throw new Error("Authentication required. Please login.");

      const body = {
        title: form.title,
        description: form.description,
        destination: form.destination,
        days: Number(form.days), // Convert to number!
        interests: form.interests.split(",").map(x => x.trim()).filter(Boolean), // To array
      };

      const response = await fetch(`${apiUrl}api/ai/itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401 || response.status === 403)
        throw new Error("Session expired or unauthorized. Please login again.");
      if (!response.ok) throw new Error("API error!");

      const data = await response.json();
      if (!data.success || !Array.isArray(data.itinerary)) throw new Error("Malformed API response.");
      setResult(data.itinerary);
    } catch (err) {
      setError(err.message || "Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-itinerary-bg">
      <div className="ai-itinerary-container">
        <div className="ai-form-col">
          <h2 className="ai-title-main">Plan Your Next Adventure</h2>
          <p className="ai-subtitle">
            Tell us your preferences and we'll craft the perfect itinerary for you.
          </p>
          <form onSubmit={handleSubmit} className="ai-itinerary-form">
            <label>Trip Title</label>
            <input
              name="title"
              placeholder="e.g., Summer in Italy"
              value={form.title}
              onChange={handleChange}
              required
            />
            <label>Trip Description</label>
            <textarea
              name="description"
              placeholder="e.g., A romantic getaway exploring ancient ruins and enjoying delicious food."
              value={form.description}
              onChange={handleChange}
              rows={2}
              required
            />
            <label>Where are you going?</label>
            <input
              name="destination"
              placeholder="e.g., Paris, France"
              value={form.destination}
              onChange={handleChange}
              required
            />
            <label>How many days?</label>
            <input
              name="days"
              placeholder="e.g., 7"
              value={form.days}
              onChange={handleChange}
              type="number"
              min="1"
              required
            />
            <label>What are your interests?</label>
            <textarea
              name="interests"
              placeholder="e.g., hiking, museums, culinary experiences"
              value={form.interests}
              onChange={handleChange}
              rows={2}
              required
            />
            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? "Generating..." : "✨ Generate Itinerary"}
            </button>
            {error && <div className="ai-error">{error}</div>}
          </form>
        </div>

        <div className="ai-result-col">
          <h2 className="ai-result-title">Your AI-Generated Itinerary</h2>
          <div className="ai-result-block">
            {loading && <div className="ai-result-loading">Generating your itinerary...</div>}
            {!loading && result && (
              <div>
                {result.map(dayObj => (
                  <div key={dayObj.day} className="ai-day-block">
                    <h3 className="ai-day-title">Day {dayObj.day}</h3>
                    <ul>
                      {Array.isArray(dayObj.activities) &&
                        dayObj.activities.map((activity, i) => (
                          <li key={i} className="ai-activity-li">
                            <span className="ai-dot">&#9673;</span>
                            <span>{activity}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {!loading && !result && (
              <div className="ai-placeholder">
                <div className="ai-placeholder-bar" style={{width:"76%"}} />
                <div className="ai-placeholder-bar" style={{width:"92%"}} />
                <div className="ai-placeholder-bar" style={{width:"65%"}} />
                <div className="ai-placeholder-bar" style={{width:"40%"}} />
                <div className="ai-placeholder-gap" />
                <div className="ai-placeholder-bar" style={{width:"63%"}} />
                <div className="ai-placeholder-bar" style={{width:"87%"}} />
                <div className="ai-placeholder-bar" style={{width:"40%"}} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
