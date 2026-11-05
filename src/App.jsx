import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Heart,
  Search,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  ShieldAlert,
  MessageCircle,
  PhoneCall,
  CheckCircle,
  Download,
  Filter,
  ArrowRight,
  ExternalLink,
  Users,
  Compass,
  Smile,
  AlertTriangle,
  Bookmark
} from "lucide-react";

import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import QuickExitDecoy from "./components/QuickExitDecoy";
import SakhiAIChat from "./components/SakhiAIChat";
import HealthCycleCalculator from "./components/HealthCycleCalculator";
import EligibilityModal from "./components/EligibilityModal";
import HealthDetailModal from "./components/HealthDetailModal";

import { SCHOLARSHIPS_DATA } from "./data/scholarships";
import { HEALTH_TOPICS } from "./data/healthTopics";
import { CAREER_STAGES, CAREER_DOMAINS } from "./data/careers";
import { INITIAL_POSTS } from "./data/communityPosts";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [language, setLanguage] = useState("en");
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Modals state
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [selectedHealthTopic, setSelectedHealthTopic] = useState(null);

  // Scholarships filter & search state
  const [scholarshipCategory, setScholarshipCategory] = useState("All");
  const [scholarshipSearch, setScholarshipSearch] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sakhi_saved_scholarships") || "[]");
    } catch {
      return [];
    }
  });
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Careers state
  const [selectedAgeStage, setSelectedAgeStage] = useState("15-18");

  // Community state
  const [communityPosts, setCommunityPosts] = useState(() => {
    try {
      const stored = localStorage.getItem("sakhi_community_posts");
      return stored ? JSON.parse(stored) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });
  const [activeCommunityFilter, setActiveCommunityFilter] = useState("All");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("CollegeLife");

  // Feedback form state
  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sakhiFeedback") || "[]");
    } catch {
      return [];
    }
  });
  const [fbAge, setFbAge] = useState("");
  const [fbRating, setFbRating] = useState("5");
  const [fbInterest, setFbInterest] = useState("AI health companion");
  const [fbSuggestion, setFbSuggestion] = useState("");
  const [fbConsent, setFbConsent] = useState(false);
  const [fbSuccessMsg, setFbSuccessMsg] = useState("");

  // Daily empowerment check state
  const [dailyChecklist, setDailyChecklist] = useState({
    water: false,
    movement: false,
    kindness: false,
    study: false
  });

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("sakhi_saved_scholarships", JSON.stringify(updated));
      return updated;
    });
  };

  const handlePostLike = (postId) => {
    setCommunityPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.userLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            userLiked: !hasLiked
          };
        }
        return p;
      });
      localStorage.setItem("sakhi_community_posts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: "SakhiFriend_" + Math.floor(100 + Math.random() * 900),
      avatar: "🌸",
      tag: newPostTag,
      timeAgo: "Just now",
      title: newPostTitle,
      content: newPostContent,
      likes: 1,
      repliesCount: 0,
      isModerated: true,
      replies: []
    };

    const updated = [newPost, ...communityPosts];
    setCommunityPosts(updated);
    localStorage.setItem("sakhi_community_posts", JSON.stringify(updated));
    setNewPostTitle("");
    setNewPostContent("");
    setIsNewPostOpen(false);

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!fbConsent) return;

    const item = {
      date: new Date().toISOString(),
      age: fbAge || "Prefer not to say",
      rating: fbRating,
      interest: fbInterest,
      suggestion: fbSuggestion
    };

    const updated = [item, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem("sakhiFeedback", JSON.stringify(updated));
    setFbSuggestion("");
    setFbSuccessMsg("Thank you! Your feedback has been securely recorded for the prototype.");
    setTimeout(() => setFbSuccessMsg(""), 6000);

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  const downloadFeedbackCSV = () => {
    if (!feedbackList.length) {
      alert("No feedback recorded in this browser yet.");
      return;
    }
    const cols = ["date", "age", "rating", "interest", "suggestion"];
    const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const csv = [
      cols.join(","),
      ...feedbackList.map((r) => cols.map((c) => esc(r[c])).join(","))
    ].join("\n");

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "sakhi-prototype-feedback.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Filter scholarships
  const filteredScholarships = SCHOLARSHIPS_DATA.filter((s) => {
    const matchesCategory =
      scholarshipCategory === "All" ||
      s.category.toLowerCase().includes(scholarshipCategory.toLowerCase());
    const matchesSearch =
      s.title.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
      s.state.toLowerCase().includes(scholarshipSearch.toLowerCase());
    const matchesBookmark = showOnlyBookmarks ? bookmarkedIds.includes(s.id) : true;

    return matchesCategory && matchesSearch && matchesBookmark;
  });

  // Filter community posts
  const filteredPosts = communityPosts.filter((p) => {
    if (activeCommunityFilter === "All") return true;
    return p.tag.toLowerCase() === activeCommunityFilter.toLowerCase();
  });

  if (isPanicActive) {
    return <QuickExitDecoy onClose={() => setIsPanicActive(false)} />;
  }

  return (
    <div>
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onPanicTrigger={() => setIsPanicActive(true)}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="main-content">
        {/* ===================== PAGE: HOME ===================== */}
        {activePage === "home" && (
          <div>
            <div className="hero">
              <div>
                <span className="eyebrow">
                  {language === "hi" ? "हर मोड़ पर आपका अपना सुरक्षित मंच" : "A safe space at every stage of life"}
                </span>
                <h1>
                  {language === "hi" ? (
                    <>आपके सवाल महत्वपूर्ण हैं।<br />आपकी सेहत सर्वोपरि है।</>
                  ) : (
                    <>Your questions matter.<br />Your wellbeing comes first.</>
                  )}
                </h1>
                <p>
                  {language === "hi"
                    ? "स्वास्थ्य, शिक्षा, सरकारी छात्रवृत्तियों और कैरियर के बारे में बिना किसी झिझक के सही जानकारी पाने का एक सुरक्षित स्थान।"
                    : "A welcoming place to learn about health, build confidence, discover government scholarships, and feel heard — without judgement."}
                </p>

                <div className="pill-row">
                  <span className="pill">🔒 100% Anonymous & Private</span>
                  <span className="pill">🌼 Girl & Women Centric</span>
                  <span className="pill">🏅 Central & Rajasthan Schemes</span>
                  <span className="pill">🩺 Verified Health Insights</span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                  <button className="btn" onClick={() => setActivePage("doctor")}>
                    <Sparkles size={16} /> Talk to Sakhi AI →
                  </button>
                  <button className="btn secondary" onClick={() => setActivePage("health")}>
                    Explore Health Hub
                  </button>
                  <button className="btn soft" onClick={() => setActivePage("scholarships")}>
                    Find Scholarships
                  </button>
                </div>
              </div>

              <div className="hero-art">🌸</div>
            </div>

            {/* Quick Stats Ticker */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, margin: "22px 0" }}>
              <div style={{ background: "white", border: "1px solid var(--line)", padding: "14px 18px", borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 24 }}>🛡️</div>
                <div>
                  <b style={{ fontSize: 16, color: "var(--ink)" }}>Safe & Private</b>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>No registration needed</div>
                </div>
              </div>
              <div style={{ background: "white", border: "1px solid var(--line)", padding: "14px 18px", borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 24 }}>🛵</div>
                <div>
                  <b style={{ fontSize: 16, color: "var(--ink)" }}>Scooty & Aid Schemes</b>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Devnarayan, Kalibai & more</div>
                </div>
              </div>
              <div style={{ background: "white", border: "1px solid var(--line)", padding: "14px 18px", borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 24 }}>🚨</div>
                <div>
                  <b style={{ fontSize: 16, color: "var(--ink)" }}>24/7 Helpline Links</b>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>112, 181, 1098 & Cyber</div>
                </div>
              </div>
            </div>

            <div className="section-head">
              <div>
                <h2>Explore Your Support Space</h2>
                <p>Choose what you need assistance with today.</p>
              </div>
            </div>

            <div className="grid">
              <button className="tile" onClick={() => setActivePage("doctor")}>
                <div className="emoji pink">🩺</div>
                <h3>Sakhi AI Health Guide</h3>
                <p>Ask confidential questions about periods, puberty, hygiene, nutrition & PCOS.</p>
              </button>

              <button className="tile" onClick={() => setActivePage("health")}>
                <div className="emoji mint">💗</div>
                <h3>Women's Health Hub</h3>
                <p>Evidence-based guides and interactive period cycle & ovulation planner.</p>
              </button>

              <button className="tile" onClick={() => setActivePage("career")}>
                <div className="emoji lav">🎓</div>
                <h3>Career Pathways by Age</h3>
                <p>Age-appropriate roadmaps from early school years to professional careers.</p>
              </button>

              <button className="tile" onClick={() => setActivePage("scholarships")}>
                <div className="emoji gold">🏅</div>
                <h3>Scholarships & Benefits</h3>
                <p>Explore central & Rajasthan schemes with instant eligibility checklist.</p>
              </button>

              <button className="tile" onClick={() => setActivePage("community")}>
                <div className="emoji blue">👭</div>
                <h3>Safe Peer Community</h3>
                <p>Moderated peer discussions, shared courage, and academic advice.</p>
              </button>

              <button className="tile" onClick={() => setActivePage("help")}>
                <div className="emoji gold">🛡️</div>
                <h3>Get Immediate Support</h3>
                <p>Direct emergency contacts, safe escape advice, and women helplines.</p>
              </button>

              <button className="tile" onClick={() => setActivePage("feedback")}>
                <div className="emoji pink">💬</div>
                <h3>Share Prototype Feedback</h3>
                <p>Help us shape a platform that responds to real grassroots needs.</p>
              </button>
            </div>

            <div className="notice" style={{ marginTop: 22 }}>
              <span>
                <strong>Prototype Notice:</strong> This is a college competition frontend prototype. It is designed to demonstrate privacy, accessibility, and empathetic women-centric features. It does not replace live clinical diagnosis or emergency dispatch.
              </span>
            </div>
          </div>
        )}

        {/* ===================== PAGE: SAKHI AI (DOCTOR) ===================== */}
        {activePage === "doctor" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Confidential Health Education</span>
                <h2>Sakhi AI — Health Companion</h2>
                <p>Empathetic, clear, non-judgmental answers to questions about your body and wellbeing.</p>
              </div>
              <span className="tag">INTERACTIVE ASSISTANT</span>
            </div>

            <SakhiAIChat />
          </div>
        )}

        {/* ===================== PAGE: HEALTH HUB ===================== */}
        {activePage === "health" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Understand Your Body</span>
                <h2>Women's Health Hub</h2>
                <p>Click any card to read comprehensive clinical insights, symptom guides, and doctor advice.</p>
              </div>
            </div>

            <div className="grid">
              {HEALTH_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="tile"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedHealthTopic(topic)}
                >
                  <div className={`emoji ${topic.colorClass}`}>{topic.emoji}</div>
                  <h3>{topic.title}</h3>
                  <p>{topic.shortDesc}</p>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="tag">{topic.readTime}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)" }}>
                      Read Guide →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Cycle Calculator Component */}
            <HealthCycleCalculator />

            <div className="notice" style={{ marginTop: 20 }}>
              <span>
                <strong>Educational Review:</strong> All medical educational materials reflect clinical health consensus from WHO and National Health Mission (NHM) guidelines.
              </span>
            </div>
          </div>
        )}

        {/* ===================== PAGE: LEARN & GROW ===================== */}
        {activePage === "learn" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Build Skills & Confidence</span>
                <h2>Learn, Grow & Become Independent</h2>
                <p>Knowledge pillars designed to foster financial, legal, and academic freedom.</p>
              </div>
            </div>

            <div className="grid">
              <div className="tile" onClick={() => setActivePage("scholarships")} style={{ cursor: "pointer" }}>
                <div className="emoji lav">📚</div>
                <h3>Scholarships & Higher Education</h3>
                <p>Identify grants, tuition waivers, and scooty schemes for higher studies.</p>
              </div>
              <div className="tile" onClick={() => setActivePage("career")} style={{ cursor: "pointer" }}>
                <div className="emoji pink">💼</div>
                <h3>Career Pathways</h3>
                <p>Stage-by-stage guidance, entrance exams, and resume building tips.</p>
              </div>
              <div className="tile">
                <div className="emoji mint">💰</div>
                <h3>Financial Literacy for Girls</h3>
                <p>Understanding savings accounts, Jan Dhan Yojana, UPI security, and budgeting.</p>
              </div>
              <div className="tile">
                <div className="emoji gold">⚖️</div>
                <h3>Legal Rights & Protection</h3>
                <p>Fundamental rights, POCSO awareness, domestic violence legal safeguards, and workplace POSH.</p>
              </div>
              <div className="tile">
                <div className="emoji blue">💻</div>
                <h3>Digital Skills & Cyber Safety</h3>
                <p>Social media privacy, avoiding online phishing, and learning free digital skills.</p>
              </div>
              <div className="tile">
                <div className="emoji pink">✨</div>
                <h3>Self-Confidence & Well-Being</h3>
                <p>Communication techniques, mental resilience, boundary setting, and self-care routines.</p>
              </div>
            </div>

            {/* Interactive Daily Habit Tracker */}
            <div className="panel" style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18 }}>🌸 Daily Empowerment Habits</h3>
                  <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: 13 }}>Track simple acts of daily wellness and self-confidence.</p>
                </div>
                <span className="tag">
                  {Object.values(dailyChecklist).filter(Boolean).length} / 4 Habits Done
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
                {[
                  { key: "water", label: "Hydrate: Drank 8 glasses of water" },
                  { key: "movement", label: "Movement: 20 mins walk or stretching" },
                  { key: "study", label: "Curiosity: Read or learned 1 new skill" },
                  { key: "kindness", label: "Self-Care: Spoke kindly to myself today" }
                ].map((habit) => (
                  <label
                    key={habit.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px",
                      borderRadius: 12,
                      background: dailyChecklist[habit.key] ? "var(--pink2)" : "#faf8fb",
                      border: "1px solid #eadce8",
                      cursor: "pointer",
                      fontSize: 13
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={dailyChecklist[habit.key]}
                      onChange={() => {
                        const updated = { ...dailyChecklist, [habit.key]: !dailyChecklist[habit.key] };
                        setDailyChecklist(updated);
                        if (Object.values(updated).filter(Boolean).length === 4) {
                          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                        }
                      }}
                      style={{ width: "auto" }}
                    />
                    <span>{habit.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== PAGE: CAREERS ===================== */}
        {activePage === "career" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Explore Possibilities</span>
                <h2>Career Pathways by Age</h2>
                <p>Every girl deserves to dream big without premature pressure or stereotypes.</p>
              </div>
            </div>

            {/* Age selector tabs */}
            <div className="filter-bar">
              {CAREER_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  className={`filter-btn ${selectedAgeStage === stage.id ? "active" : ""}`}
                  onClick={() => setSelectedAgeStage(stage.id)}
                >
                  {stage.emoji} {stage.ageRange}
                </button>
              ))}
            </div>

            {/* Selected Age Stage Card */}
            {(() => {
              const current = CAREER_STAGES.find((s) => s.id === selectedAgeStage) || CAREER_STAGES[0];
              return (
                <div className="panel" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div className={`emoji ${current.colorClass}`} style={{ width: 48, height: 48, fontSize: 24, marginBottom: 0 }}>
                      {current.emoji}
                    </div>
                    <div>
                      <span className="tag">{current.ageRange}</span>
                      <h3 style={{ margin: "4px 0 0", fontSize: 22 }}>
                        {current.phase}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: 15, color: "#493952", fontStyle: "italic", margin: "8px 0 16px" }}>
                    "{current.tagline}"
                  </p>

                  <h4 style={{ margin: "16px 0 8px", fontSize: 15, color: "var(--brand)" }}>
                    Recommended Focus Areas:
                  </h4>
                  <ul className="list">
                    {current.focusAreas.map((area, idx) => (
                      <li key={idx}>{area}</li>
                    ))}
                  </ul>

                  <div style={{ marginTop: 18, padding: "12px 16px", background: "var(--pink2)", borderRadius: 14, border: "1px solid #f6d8eb" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)" }}>💡 Mentor Advice:</span>
                    <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#473850" }}>{current.guidance}</p>
                  </div>
                </div>
              );
            })()}

            {/* Career families grid */}
            <div className="panel" style={{ marginTop: 20 }}>
              <h3 style={{ marginTop: 0, fontSize: 18 }}>Career Families to Explore</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {CAREER_DOMAINS.map((domain, i) => (
                  <span key={i} className="pill" style={{ background: "#fff", border: "1px solid #ebd8e8" }}>
                    ✨ {domain}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
                <a
                  href="https://www.ncs.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn secondary"
                  style={{ fontSize: 13 }}
                >
                  National Career Service (NCS Portal) <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn secondary"
                  style={{ fontSize: 13 }}
                >
                  My Career Advisor / India.gov.in <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===================== PAGE: SCHOLARSHIPS ===================== */}
        {activePage === "scholarships" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Education Support Directory</span>
                <h2>Government Scholarships & Benefits</h2>
                <p>Filter official central and Rajasthan state schemes and verify your eligibility criteria.</p>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "14px 0" }}>
              <div style={{ position: "relative", flex: "1 1 240px" }}>
                <Search size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Search scheme name, state, or course..."
                  value={scholarshipSearch}
                  onChange={(e) => setScholarshipSearch(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>

              <button
                className={`btn ${showOnlyBookmarks ? "secondary" : "soft"}`}
                onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                style={{ fontSize: 13 }}
              >
                <Bookmark size={15} />
                {showOnlyBookmarks ? `Saved Only (${bookmarkedIds.length})` : `Saved Schemes (${bookmarkedIds.length})`}
              </button>
            </div>

            <div className="filter-bar">
              {["All", "Girls", "SC", "ST", "OBC/EBC", "Minority", "PwD", "Special", "Competitive Exams"].map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${scholarshipCategory === cat ? "active" : ""}`}
                  onClick={() => setScholarshipCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredScholarships.length === 0 ? (
              <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ color: "var(--muted)", fontSize: 15 }}>No matching scholarships found for this filter.</p>
                <button
                  className="btn soft sm"
                  onClick={() => {
                    setScholarshipCategory("All");
                    setScholarshipSearch("");
                    setShowOnlyBookmarks(false);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid">
                {filteredScholarships.map((s) => {
                  const isSaved = bookmarkedIds.includes(s.id);
                  return (
                    <div key={s.id} className="tile">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div className={`emoji ${s.colorClass}`}>{s.emoji}</div>
                        <button
                          onClick={() => toggleBookmark(s.id)}
                          style={{
                            background: "transparent",
                            fontSize: 18,
                            color: isSaved ? "var(--brand)" : "#bdaabf",
                            padding: 4
                          }}
                          title={isSaved ? "Remove Bookmark" : "Save Scheme"}
                        >
                          {isSaved ? "★" : "☆"}
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                        <span className="tag">{s.category}</span>
                        <span className="tag" style={{ background: "#edf5ff", color: "#245ca6" }}>{s.state}</span>
                      </div>

                      <h3>{s.title}</h3>
                      <p>{s.shortDesc}</p>

                      <div style={{ marginTop: 16 }}>
                        <button
                          className="btn sm"
                          style={{ width: "100%" }}
                          onClick={() => setSelectedScholarship(s)}
                        >
                          Check Eligibility Checklist →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Official Portals Box */}
            <div className="panel" style={{ marginTop: 24 }}>
              <h3 style={{ marginTop: 0 }}>Official Portals — Always Verify Latest Notifications</h3>
              <ul className="list">
                <li>
                  <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer">
                    National Scholarship Portal (NSP)
                  </a> — Central schemes and national guidelines.
                </li>
                <li>
                  <a href="https://scholarship.rajasthan.gov.in/" target="_blank" rel="noopener noreferrer">
                    Rajasthan Scholarship Portal
                  </a> — State Post-Matric, MBC, and CM scholarship schemes.
                </li>
                <li>
                  <a href="https://hte.rajasthan.gov.in/" target="_blank" rel="noopener noreferrer">
                    Higher & Technical Education (HTE Rajasthan)
                  </a> — Devnarayan and Kalibai Scooty Yojana notifications.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ===================== PAGE: COMMUNITY ===================== */}
        {activePage === "community" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Safe & Moderated Support</span>
                <h2>Sakhi Community Space</h2>
                <p>Peer encouragement, exam strategies, and health questions answered in a safe environment.</p>
              </div>
              <button className="btn" onClick={() => setIsNewPostOpen(true)}>
                + Ask or Share Your Story
              </button>
            </div>

            <div className="notice info" style={{ marginBottom: 16 }}>
              <span>
                <strong>Safety Policy:</strong> Personal contact info (phone, addresses) is automatically withheld. All discussions adhere to positive peer support guidelines.
              </span>
            </div>

            <div className="filter-bar">
              {["All", "CollegeLife", "ScholarshipTips", "Health", "Career"].map((tag) => (
                <button
                  key={tag}
                  className={`filter-btn ${activeCommunityFilter === tag ? "active" : ""}`}
                  onClick={() => setActiveCommunityFilter(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 14 }}>
              {filteredPosts.map((post) => (
                <div key={post.id} className="panel">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ width: 38, height: 38, fontSize: 20 }}>
                        {post.avatar}
                      </div>
                      <div>
                        <b style={{ fontSize: 14 }}>{post.author}</b>
                        <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
                          {post.timeAgo}
                        </span>
                      </div>
                    </div>

                    <span className="tag">#{post.tag}</span>
                  </div>

                  <h3 style={{ fontSize: 17, margin: "12px 0 6px" }}>{post.title}</h3>
                  <p style={{ margin: 0, color: "#483b52", fontSize: 14, lineHeight: 1.6 }}>{post.content}</p>

                  <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 14, borderTop: "1px solid #f6edf5", paddingTop: 10 }}>
                    <button
                      onClick={() => handlePostLike(post.id)}
                      style={{
                        background: post.userLiked ? "var(--pink2)" : "#faf5fb",
                        color: post.userLiked ? "var(--brand)" : "#6d5872",
                        border: "1px solid #f0e1ee",
                        borderRadius: 99,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      <Heart size={14} fill={post.userLiked ? "var(--brand)" : "none"} />
                      {post.likes} {post.likes === 1 ? "Supporter" : "Supporters"}
                    </button>

                    <span style={{ fontSize: 12, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <MessageCircle size={14} /> {post.repliesCount} Replies
                    </span>
                  </div>

                  {post.replies && post.replies.length > 0 && (
                    <div style={{ marginTop: 12, background: "#faf7fb", borderRadius: 12, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {post.replies.map((rep) => (
                        <div key={rep.id} style={{ fontSize: 12.5, color: "#4a3c54" }}>
                          <b>@{rep.author}:</b> {rep.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal for creating a new post */}
            {isNewPostOpen && (
              <div className="modal-overlay" onClick={() => setIsNewPostOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ marginTop: 0 }}>Start a Safe Community Discussion</h3>
                  <form onSubmit={handleCreatePost}>
                    <label>Category Tag</label>
                    <select value={newPostTag} onChange={(e) => setNewPostTag(e.target.value)}>
                      <option value="CollegeLife">#CollegeLife</option>
                      <option value="ScholarshipTips">#ScholarshipTips</option>
                      <option value="Health">#Health</option>
                      <option value="Career">#Career</option>
                    </select>

                    <label>Question or Topic Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Tips for managing exams during periods?"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      required
                    />

                    <label>Your Message (Keep it helpful & respectful)</label>
                    <textarea
                      placeholder="Share your experience or ask a question. Please do not include phone numbers or sensitive medical details."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      required
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                      <button type="button" className="btn secondary" onClick={() => setIsNewPostOpen(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn">
                        Publish to Community
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== PAGE: GET SUPPORT (HELP) ===================== */}
        {activePage === "help" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">When You Need Support</span>
                <h2>Help Me Now — Trusted Helplines</h2>
                <p>Confidential emergency pathways and protection services across India.</p>
              </div>
            </div>

            <div className="grid">
              <div className="tile" style={{ borderLeft: "4px solid #d93858" }}>
                <div className="emoji pink" style={{ background: "#ffebee" }}>🚨</div>
                <h3>112 — National Emergency</h3>
                <p>Police, Ambulance & Fire combined emergency service for immediate life danger across India.</p>
                <div style={{ marginTop: 16 }}>
                  <a href="tel:112" className="btn danger sm" style={{ width: "100%" }}>
                    <PhoneCall size={14} /> Call 112 Now
                  </a>
                </div>
              </div>

              <div className="tile" style={{ borderLeft: "4px solid var(--brand)" }}>
                <div className="emoji pink">🤝</div>
                <h3>181 — Women Helpline</h3>
                <p>Toll-free 24/7 dedicated helpline for women facing domestic distress, harassment, or violence.</p>
                <div style={{ marginTop: 16 }}>
                  <a href="tel:181" className="btn sm" style={{ width: "100%" }}>
                    <PhoneCall size={14} /> Call 181
                  </a>
                </div>
              </div>

              <div className="tile" style={{ borderLeft: "4px solid #634399" }}>
                <div className="emoji lav">👧</div>
                <h3>1098 — Childline India</h3>
                <p>Emergency assistance and safeguarding for any girl or child under 18 years in distress.</p>
                <div style={{ marginTop: 16 }}>
                  <a href="tel:1098" className="btn secondary sm" style={{ width: "100%" }}>
                    <PhoneCall size={14} /> Call 1098
                  </a>
                </div>
              </div>

              <div className="tile">
                <div className="emoji blue">💻</div>
                <h3>1930 — Cyber Crime Helpline</h3>
                <p>For reporting online harassment, morphed photos, blackmail, or digital cyber fraud.</p>
                <div style={{ marginTop: 16 }}>
                  <a href="tel:1930" className="btn secondary sm" style={{ width: "100%" }}>
                    <PhoneCall size={14} /> Call 1930
                  </a>
                </div>
              </div>

              <div className="tile">
                <div className="emoji mint">🧠</div>
                <h3>14416 — Tele-MANAS</h3>
                <p>Free Government of India mental health counseling helpline for stress, anxiety, and emotional support.</p>
                <div style={{ marginTop: 16 }}>
                  <a href="tel:14416" className="btn secondary sm" style={{ width: "100%" }}>
                    <PhoneCall size={14} /> Call 14416
                  </a>
                </div>
              </div>

              <div className="tile">
                <div className="emoji gold">🛡️</div>
                <h3>Quick Safe Exit Strategy</h3>
                <p>If you feel someone is watching your screen, tap the "Quick Safe Exit" button in the top bar to switch immediately to study notes.</p>
                <div style={{ marginTop: 16 }}>
                  <button className="btn soft sm" style={{ width: "100%" }} onClick={() => setIsPanicActive(true)}>
                    Test Panic Screen
                  </button>
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginTop: 24 }}>
              <h3 style={{ marginTop: 0 }}>Safe Steps If You Feel Unsafe</h3>
              <ul className="list">
                <li><strong>Move to a public space:</strong> A crowded store, railway station booth, or hospital lobby is safer than remaining isolated.</li>
                <li><strong>Share live location:</strong> Use WhatsApp or Google Maps to share your live location with a trusted friend or sister.</li>
                <li><strong>Code Words:</strong> Agree on a discreet code word (e.g., "Did you return my chemistry book?") with a trusted relative that signals you need urgent pick-up without alerting the perpetrator.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===================== PAGE: FEEDBACK ===================== */}
        {activePage === "feedback" && (
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">Help Us Build What Matters</span>
                <h2>Share Your Prototype Feedback</h2>
                <p>Tell us what would make Sakhi more useful, trustworthy, and impactful for girls.</p>
              </div>
            </div>

            <div className="two">
              <form className="panel" onSubmit={handleFeedbackSubmit}>
                <h3 style={{ marginTop: 0 }}>Prototype Evaluation Form</h3>

                <div className="formrow">
                  <div>
                    <label>Age Group (Optional)</label>
                    <select value={fbAge} onChange={(e) => setFbAge(e.target.value)}>
                      <option value="">Prefer not to say</option>
                      <option value="Under 13">Under 13</option>
                      <option value="13–17">13–17</option>
                      <option value="18–24">18–24</option>
                      <option value="25–34">25–34</option>
                      <option value="35+">35+</option>
                    </select>
                  </div>

                  <div>
                    <label>Rating (1 to 5 Stars)</label>
                    <select value={fbRating} onChange={(e) => setFbRating(e.target.value)}>
                      <option value="5">⭐⭐⭐⭐⭐ (Excellent / Very Useful)</option>
                      <option value="4">⭐⭐⭐⭐ (Good / Useful)</option>
                      <option value="3">⭐⭐⭐ (Average / Needs Work)</option>
                      <option value="2">⭐⭐ (Needs Improvement)</option>
                    </select>
                  </div>
                </div>

                <label>Which Feature Was Most Impactful?</label>
                <select value={fbInterest} onChange={(e) => setFbInterest(e.target.value)}>
                  <option value="AI health companion">Sakhi AI Health Companion</option>
                  <option value="Women's Health Hub">Women's Health Hub & Period Tracker</option>
                  <option value="Scholarships & Scooty Schemes">Scholarships & Scooty Schemes</option>
                  <option value="Career Pathways by Age">Career Pathways by Age</option>
                  <option value="Safe Community">Safe Peer Community</option>
                  <option value="Quick Panic Exit">Quick Panic Exit / Helplines</option>
                </select>

                <label>What Should We Improve or Add?</label>
                <textarea
                  value={fbSuggestion}
                  onChange={(e) => setFbSuggestion(e.target.value)}
                  placeholder="Suggestions for local language support, new health topics, or competition judging criteria..."
                  required
                />

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 12 }}>
                  <input
                    type="checkbox"
                    checked={fbConsent}
                    onChange={(e) => setFbConsent(e.target.checked)}
                    required
                    style={{ width: "auto" }}
                  />
                  <span>I agree to submit non-sensitive feedback for this college prototype.</span>
                </label>

                <button type="submit" className="btn" style={{ marginTop: 16 }}>
                  Submit Evaluation Feedback
                </button>

                {fbSuccessMsg && (
                  <p style={{ color: "#166534", background: "#f0fdf4", border: "1px solid #86efac", padding: 10, borderRadius: 10, fontSize: 13, marginTop: 12 }}>
                    ✓ {fbSuccessMsg}
                  </p>
                )}
              </form>

              <aside className="panel">
                <h3 style={{ marginTop: 0 }}>Demo Data Collection</h3>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>
                  All evaluation reviews are saved locally in your browser storage. You can export the collected survey as a CSV file to show in competition presentations.
                </p>

                <div style={{ padding: "12px 14px", background: "var(--pink2)", borderRadius: 14, margin: "14px 0", border: "1px solid #f8dceb" }}>
                  <b style={{ fontSize: 14, color: "var(--brand)" }}>Total Submissions: {feedbackList.length}</b>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Ready for project report export</div>
                </div>

                <button className="btn secondary" onClick={downloadFeedbackCSV} style={{ width: "100%", fontSize: 13 }}>
                  <Download size={15} /> Export Feedback CSV
                </button>
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedScholarship && (
        <EligibilityModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          isBookmarked={bookmarkedIds.includes(selectedScholarship.id)}
          toggleBookmark={toggleBookmark}
        />
      )}

      {selectedHealthTopic && (
        <HealthDetailModal
          topic={selectedHealthTopic}
          onClose={() => setSelectedHealthTopic(null)}
        />
      )}

      {/* Mobile Navigation Bar */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* Footer */}
      <footer>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--ink)" }}>
            🌷 Sakhi Women's & Girls' Support Platform
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)" }}>
            College Competition React Frontend Prototype · Dedicated to dignity, privacy, and education for women.
          </p>
        </div>
      </footer>
    </div>
  );
}
