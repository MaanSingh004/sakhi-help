import React from "react";
import { Home, Stethoscope, GraduationCap, Award, MessageSquare } from "lucide-react";

export default function MobileNav({ activePage, setActivePage }) {
  const items = [
    { id: "home", label: "Home", icon: <Home size={18} /> },
    { id: "doctor", label: "Sakhi AI", icon: <Stethoscope size={18} /> },
    { id: "career", label: "Careers", icon: <GraduationCap size={18} /> },
    { id: "scholarships", label: "Scholarships", icon: <Award size={18} /> },
    { id: "feedback", label: "Feedback", icon: <MessageSquare size={18} /> }
  ];

  return (
    <div className="mobile-nav" aria-label="Mobile Bottom Navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={activePage === item.id ? "active" : ""}
          onClick={() => {
            setActivePage(item.id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
