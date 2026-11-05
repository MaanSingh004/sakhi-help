import React from "react";
import { Shield, Globe, EyeOff } from "lucide-react";

export default function Header({ activePage, setActivePage, onPanicTrigger, language, setLanguage }) {
  const navItems = [
    { id: "home", label: language === "hi" ? "होम" : "Home" },
    { id: "doctor", label: language === "hi" ? "सखी AI" : "Sakhi AI" },
    { id: "health", label: language === "hi" ? "स्वास्थ्य हब" : "Health Hub" },
    { id: "learn", label: language === "hi" ? "सीखें और बढ़ें" : "Learn & Grow" },
    { id: "career", label: language === "hi" ? "कैरियर मार्ग" : "Careers" },
    { id: "scholarships", label: language === "hi" ? "छात्रवृत्तियां" : "Scholarships" },
    { id: "community", label: language === "hi" ? "समुदाय" : "Community" },
    { id: "help", label: language === "hi" ? "मदद लें" : "Get Support" },
    { id: "feedback", label: language === "hi" ? "फीडबैक" : "Feedback" }
  ];

  return (
    <header className="top-header">
      <div className="brand" onClick={() => setActivePage("home")}>
        <div className="logo">🌷</div>
        <div className="brand-text">
          <span className="brand-title">Sakhi</span>
          <small>{language === "hi" ? "महिला एवं किशोरी सहायता मंच" : "Women's Support Platform"}</small>
        </div>
      </div>

      <nav className="desktop-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? "active" : ""}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="top-actions">
        <button
          className="lang-btn"
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          title="Toggle Language"
        >
          <Globe size={13} style={{ display: "inline", marginRight: 4 }} />
          {language === "en" ? "हिन्दी" : "English"}
        </button>

        <button
          className="btn-panic"
          onClick={onPanicTrigger}
          title="Instantly switch to safe study notes screen if someone walks by"
        >
          <EyeOff size={14} />
          <span>Quick Safe Exit</span>
        </button>
      </div>
    </header>
  );
}
