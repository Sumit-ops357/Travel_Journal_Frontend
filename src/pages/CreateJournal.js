import React, { useRef, useState } from "react";
import api from "../api";
import "./CreateJournal.css";
const apiUrl = process.env.REACT_APP_API_URL;

export default function CreateJournal() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    map: "",
    isHiddenGem: false,
  });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // State for itinerary: day is number, activities is string
  const [itinerary, setItinerary] = useState([
    { day: 1, activities: "" }
  ]);

  const photoInputRef = useRef();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handlePhotos(e) {
    setPhotos([...e.target.files]);
  }
  function handleCheckbox() {
    setForm(f => ({ ...f, isHiddenGem: !f.isHiddenGem }));
  }

  // Itinerary handlers
  function handleDayChange(idx, value) {
    const dayValue = Number(value) > 0 ? Number(value) : 1;
    setItinerary(it => it.map((d, i) => i === idx ? { ...d, day: dayValue } : d));
  }
  function handleActivityChange(idx, value) {
    setItinerary(it => it.map((d, i) => i === idx ? { ...d, activities: value } : d));
  }
  function addDay() {
    setItinerary([...itinerary, { day: itinerary.length + 1, activities: "" }]);
  }
  function removeDay(idx) {
    if (itinerary.length === 1) return;
    setItinerary(itinerary.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Upload each photo and collect the file URLs
      let photoUrls = [];
      for (const file of photos) {
        const fd = new FormData();
        fd.append("file", file);
        const resp = await api.post(
          `${apiUrl}/photos`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        photoUrls.push(`/api/photos/${resp.data.fileId}`);
      }

      // 2. Prepare journal data object
      const journalData = {
        title: form.title,
        description: form.description,
        location: form.location,
        map: form.map,
        hiddenGem: form.isHiddenGem,
        itinerary, // Already the correct structure: [{ day: 1, activities: "Arrival" }]
        photos: photoUrls
      };

      // 3. Get JWT token and submit journal (with Authorization header)
      const token = localStorage.getItem("jwt");

      await api.post("/journals", journalData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Journal created!");
      setForm({
        title: "",
        description: "",
        location: "",
        map: "",
        isHiddenGem: false,
      });
      setPhotos([]);
      setItinerary([{ day: 1, activities: "" }]);
    } catch (err) {
      alert("Error creating journal: " + (err.response?.data?.msg || err.message));
    } finally {
      setSubmitting(false);
    }
  }

  // Render the structured itinerary inputs
  function renderItineraryFields() {
    return (
      <div className="journal-itinerary-structured">
        <div className="itinerary-day-list">
          {itinerary.map((entry, idx) => (
            <div key={idx} className="itinerary-day-row">
              <div className="itinerary-row-head">
                <input
                  type="number"
                  className="itinerary-day-input"
                  min="1"
                  value={entry.day}
                  onChange={e => handleDayChange(idx, e.target.value)}
                  placeholder={`Day ${idx + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeDay(idx)}
                  disabled={itinerary.length === 1}
                  className="remove-day-btn"
                >
                  Remove Day
                </button>
              </div>
              <textarea
                className="itinerary-activity-input"
                value={entry.activities}
                onChange={e => handleActivityChange(idx, e.target.value)}
                placeholder="Activities for this day"
                required
                rows={2}
              />
            </div>
          ))}
        </div>
        <button type="button" className="add-day-btn" onClick={addDay}>
          + Add Day
        </button>
        <div className="journal-itinerary-note">
          Enter a number for day, and a string for activities.
          <br />
          <b>JSON Preview:</b>
          <pre>{JSON.stringify(itinerary, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-create-bg">
      <form className="journal-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="journal-title">Create a New Journal Entry</h2>
        <div className="journal-subtitle">
          Share your latest adventure with the community.
        </div>
        <label>Title</label>
        <input name="title" placeholder="e.g, A Sunrise Hike in the Dolomites" value={form.title} onChange={handleChange} required />
        <label>Description</label>
        <textarea name="description" placeholder="Describe your experience, the sights, sounds, and feelings..." value={form.description} onChange={handleChange} required rows={3} />
        <div className="journal-row">
          <div className="journal-half">
            <label>Location</label>
            <input name="location" placeholder="e.g, Tre Cime di Lavaredo, Italy" value={form.location} onChange={handleChange} required />
          </div>
          <div className="journal-half">
            <label>Map URL</label>
            <input name="map" placeholder="e.g, https://maps.google.com/" value={form.map} onChange={handleChange} />
          </div>
        </div>
        <label>Photos</label>
        <div className="journal-upload-area" onClick={() => photoInputRef.current?.click()}>
          <input
            ref={photoInputRef}
            type="file"
            multiple
            style={{display: "none"}}
            onChange={handlePhotos}
            accept="image/*"
          />
          <div>
            <span role="img" style={{fontSize:34}}>📷</span><br />
            <span className="upload-highlight">Upload multiple files</span> or drag and drop<br/>
            <span className="upload-note">PNG, JPG up to 10MB each</span>
          </div>
          <div className="selected-files">
            {photos.length > 0 && "Selected: " + photos.map(f => f.name).join(", ")}
          </div>
        </div>
        <label>Itinerary</label>
        {renderItineraryFields()}
        <div className="journal-checkbox-row">
          <input type="checkbox" id="hidden-gem" checked={form.isHiddenGem} onChange={handleCheckbox} />
          <label htmlFor="hidden-gem">
            This is a Hidden Gem <br />
            <span className="checkbox-desc">Check this if you believe this spot is off the beaten path and a special find.</span>
          </label>
        </div>
        <button className="journal-submit-btn" type="submit" disabled={submitting}>
          &#128393; {submitting ? "Publishing..." : "Publish Entry"}
        </button>
      </form>
    </div>
  );
}
