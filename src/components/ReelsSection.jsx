import React, { useState } from "react";
import { ExternalLink, Play, Filter, Sparkles, Video } from "lucide-react";
import { REELS_DATA } from "../data/reels";
import { tracker } from "../services/tracker";

export default function ReelsSection() {
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLang, setSelectedLang] = useState("all");

  const filteredReels = REELS_DATA.filter((r) => {
    const matchAge = selectedAge === "all" || r.age === selectedAge;
    const matchTopic = selectedTopic === "all" || r.topic.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchLang = selectedLang === "all" || r.lang.toLowerCase() === selectedLang.toLowerCase();
    return matchAge && matchTopic && matchLang;
  });

  const handleWatchClick = (reel) => {
    tracker.logEvent("reel_watched", { id: reel.id, title: reel.title, topic: reel.topic, lang: reel.lang }, "reels");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <span className="eyebrow">Watch · Learn · Grow</span>
          <h2>🎬 SAKHI Reels & Learning Videos</h2>
          <p>Educational videos for girls and women at every life stage.</p>
        </div>
      </div>

      <div className="notice info" style={{ marginBottom: 18 }}>
        <span>
          💡 <strong>Safe Educational Content:</strong> Tap “Watch videos” to open trusted learning videos from UNICEF, WHO, and official ministries on YouTube. SAKHI does not copy or re-upload other creators' content.
        </span>
      </div>

      {/* Filter Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          margin: "16px 0 20px"
        }}
      >
        <div>
          <label style={{ margin: "0 0 6px" }}>Filter by Age Group</label>
          <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
            <option value="all">All ages</option>
            <option value="6–10">6–10 years</option>
            <option value="11–14">11–14 years</option>
            <option value="15–18">15–18 years</option>
            <option value="18+">18+ years</option>
          </select>
        </div>

        <div>
          <label style={{ margin: "0 0 6px" }}>Filter by Topic</label>
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="all">All topics</option>
            <option value="Growing up">Growing up</option>
            <option value="Periods">Periods</option>
            <option value="Safety">Safety & rights</option>
            <option value="Health">Women's health</option>
            <option value="Education">Education & careers</option>
          </select>
        </div>

        <div>
          <label style={{ margin: "0 0 6px" }}>Filter by Language</label>
          <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
            <option value="all">All languages</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Reels Grid */}
      {filteredReels.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "var(--muted)" }}>No learning reels found matching this specific filter.</p>
          <button
            className="btn soft sm"
            onClick={() => {
              setSelectedAge("all");
              setSelectedTopic("all");
              setSelectedLang("all");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 18
          }}
        >
          {filteredReels.map((reel) => (
            <article
              key={reel.id}
              style={{
                border: "1px solid var(--line)",
                borderRadius: 20,
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Reel Card Header Thumbnail */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  background: "linear-gradient(135deg, #fce0ee 0%, #eee3fc 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 8,
                  color: "#804875"
                }}
              >
                <div style={{ fontSize: 44 }}>{reel.emoji}</div>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{reel.subtitle}</span>
              </div>

              {/* Reel Info */}
              <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 15, margin: "0 0 6px", lineHeight: 1.35 }}>{reel.title}</h3>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 14px" }}>{reel.meta}</p>
                </div>

                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn sm"
                  onClick={() => handleWatchClick(reel)}
                  style={{ width: "100%", textDecoration: "none" }}
                >
                  <Play size={14} fill="#fff" /> Watch Videos ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Trusted Publishers Panel */}
      <div className="panel" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0, fontSize: 17, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={18} color="var(--brand)" /> Trusted Official Publishers
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 12px" }}>
          Explore full playlists directly from verified public health and education channels:
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="https://www.youtube.com/@UNICEF"
            target="_blank"
            rel="noopener noreferrer"
            className="btn secondary sm"
          >
            <Video size={15} color="#d93858" /> UNICEF India Official
          </a>
          <a
            href="https://www.youtube.com/@WHO"
            target="_blank"
            rel="noopener noreferrer"
            className="btn secondary sm"
          >
            <Video size={15} color="#d93858" /> World Health Organization (WHO)
          </a>
          <a
            href="https://www.youtube.com/@MoHFW_INDIA"
            target="_blank"
            rel="noopener noreferrer"
            className="btn secondary sm"
          >
            <Video size={15} color="#d93858" /> Ministry of Health & Family Welfare
          </a>
        </div>
      </div>
    </div>
  );
}
