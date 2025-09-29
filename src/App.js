import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreateJournal from "./pages/CreateJournal";
import AIItineraryPage from "./pages/AIItineraryPage";
import AIRecommendationPage from "./pages/AIRecommendationPage";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/create-journal" element={<CreateJournal />} />
        <Route path="/ai-itinerary" element={<AIItineraryPage />} />
        <Route path="/ai-recommendation" element={<AIRecommendationPage />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
