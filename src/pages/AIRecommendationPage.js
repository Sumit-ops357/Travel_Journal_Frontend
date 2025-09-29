import React, { useState } from "react";
import "./AIRecommendationPage.css";
const apiUrl = process.env.REACT_APP_API_URL;

export default function AIRecommendationPage() {
  const [form, setForm] = useState({
    destination: "",
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
        destination: form.destination,
        interests: form.interests.split(",").map(x => x.trim()).filter(Boolean) // convert to array
      };

      const response = await fetch(`${apiUrl}api/ai/recommendations`, {
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
      if (!data.recommendations || !Array.isArray(data.recommendations))
        throw new Error("Malformed API response.");
      setResult(data.recommendations);
    } catch (err) {
      setError(err.message || "Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-recommend-bg">
      <div className="ai-recommend-container">
        {/* Left column – form */}
        <div className="ai-form-col">
          <h2 className="ai-title-main">Get Smart Trip Recommendations</h2>
          <p className="ai-subtitle">
            Tell us your destination and interests to get personalized suggestions powered by AI.
          </p>
          <form onSubmit={handleSubmit} className="ai-recommend-form">
            <label>Destination</label>
            <input
              name="destination"
              placeholder="e.g., Dandeli"
              value={form.destination}
              onChange={handleChange}
              required
            />
            <label>Your Interests</label>
            <textarea
              name="interests"
              placeholder="Give Simple interests like: nature, food, resorts (Single interest)"
              value={form.interests}
              onChange={handleChange}
              rows={2}
              required
            />
            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? "Generating..." : "✨ Get Recommendations"}
            </button>
            {error && <div className="ai-error">{error}</div>}
          </form>
        </div>
        {/* Right column – output */}
        <div className="ai-result-col">
          <h2 className="ai-result-title">Your AI Recommendations</h2>
          <div className="ai-result-block">
            {loading && (
              <div className="ai-result-loading">
                Fetching recommendations...
              </div>
            )}
            {!loading && result && result.length > 0 && (
              <div>
                {result.map((rec, idx) => (
                  <div key={idx} className="ai-rec-block">
                    <div className="ai-rec-header">
                      <span className="ai-rec-name">{rec.name}</span>
                      <span className="ai-rec-tags">
                        {rec.tags && rec.tags.map((tag, ti) => (
                          <span className="ai-tag" key={ti}>#{tag}</span>
                        ))}
                      </span>
                    </div>
                    <div className="ai-rec-desc">{rec.description}</div>
                    <div className="ai-rec-perfectfor">
                      <b>Perfect for:</b> {rec.perfectFor}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && (!result || result.length === 0) && (
              <div className="ai-placeholder">
                <div className="ai-placeholder-bar" style={{width:"78%"}} />
                <div className="ai-placeholder-bar" style={{width:"49%"}} />
                <div className="ai-placeholder-gap" />
                <div className="ai-placeholder-bar" style={{width:"66%"}} />
                <div className="ai-placeholder-bar" style={{width:"32%"}} />
                <div className="ai-placeholder-bar" style={{width:"43%"}} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
