import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-bg">
      <nav className="home-nav">
        <div className="nav-logo">
          <img src="/logo192.png" alt="logo" style={{ width: 32, marginRight: 10 }} />
          <span>Travel Journal</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {/* <Link to="/explore">Explore</Link> */}
          <Link to="/profile">My Profile</Link>
          <Link to="/login" className="nav-btn blue">Login</Link>
          <Link to="/register" className="nav-btn gray">Register</Link>
        </div>
      </nav>

      <main className="home-main">
        <h1 className="home-title">Discover Hidden Gems, Together</h1>
        <p className="home-subtitle">
          Share your journeys, explore unique spots found by our community and let our AI build your next perfect itinerary.
        </p>

        {/* CTA Row - with new AI buttons */}
        <div className="home-cta-row">
          <button
            className="home-cta-btn blue"
            onClick={() => navigate("/create-journal")}
          >
            <span style={{ marginRight: 9 }}>☆</span> Share a Trip
          </button>
          {/* <Link to="/explore">
            <button className="home-cta-btn gray">Explore Journals</button>
          </Link> */}
        </div>

        {/* AI Feature Buttons */}
        <div className="ai-feature-btn-row">
          <button
            className="ai-feature-btn itinerary"
            onClick={() => navigate("/ai-itinerary")}
          >
            ✈️ AI Itinerary
          </button>
          <button
            className="ai-feature-btn recommendation"
            onClick={() => navigate("/ai-recommendation")}
          >
            🧭 AI Recommendation
          </button>
        </div>

        <div className="explore-section">
          <h2 className="explore-title">Explore Journals</h2>
          {/* <div className="explore-search-row">
            <input className="explore-search" placeholder="Search by destination..." />
            <button className="explore-search-btn">🔍</button>
          </div> */}
          <div className="explore-journals-row">
            <div className="journal-card">
              <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="" />
              <div className="journal-main">
                <b>A Week in Paris</b>
                <p>From the charming streets of Montmartre to the grandeur of the Louvre, here's my journey through the city of love...</p>
                <div className="journal-meta">
                  <span>By Jane Doe</span>
                  <span>↑ 1.2k</span>
                </div>
              </div>
            </div>
            <div className="journal-card">
              <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=80" alt="" />
              <div className="journal-main">
                <b>Tokyo's Hidden Alleys</b>
                <p>Beyond the neon lights of Shibuya, I found incredible ramen shops and serene temples tucked away in quiet corners.</p>
                <div className="journal-meta">
                  <span>By Kenji Tanaka</span>
                  <span>↑ 876</span>
                </div>
              </div>
            </div>
            <div className="journal-card">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="" />
              <div className="journal-main">
                <b>Andean Adventure</b>
                <p>Trekking through the Peruvian Andes was rewarding. The views from MachuPicchu were breathtaking.</p>
                <div className="journal-meta">
                  <span>By Maria Garcia</span>
                  <span>↑ 2.5k</span>
                </div>
              </div>
            </div>
            {/* 3 more explore cards */}
            <div className="journal-card">
              <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="" />
              <div className="journal-main">
                <b>Sahara Nights</b>
                <p>Under a blanket of stars, my desert trek through Morocco was magical. Sand dunes, camel rides, and campfire tales.</p>
                <div className="journal-meta">
                  <span>By Amira Elbaz</span>
                  <span>↑ 864</span>
                </div>
              </div>
            </div>
            <div className="journal-card">
              <img src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=400&q=80" alt="" />
              <div className="journal-main">
                <b>Nordic Escape</b>
                <p>The fjords of Norway and the northern lights made for a breathtaking, snowy adventure across Scandinavia.</p>
                <div className="journal-meta">
                  <span>By Erik Johansen</span>
                  <span>↑ 990</span>
                </div>
              </div>
            </div>
            <div className="journal-card">
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="" />
              <div className="journal-main">
                <b>Bali Bliss</b>
                <p>Surf, sunsets, and spiritual temples. My escape to Bali was pure paradise, from Ubud to the southern beaches.</p>
                <div className="journal-meta">
                  <span>By Komang Putra</span>
                  <span>↑ 1.1k</span>
                </div>
              </div>
            </div>
            {/* End added cards */}
          </div>
        </div>
      </main>
    </div>
  );
}
