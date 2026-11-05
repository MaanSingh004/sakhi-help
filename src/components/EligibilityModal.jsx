import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Circle, ExternalLink, X, Award, ShieldCheck } from "lucide-react";

export default function EligibilityModal({ scholarship, onClose, isBookmarked, toggleBookmark }) {
  if (!scholarship) return null;

  const [checkedItems, setCheckedItems] = useState({});

  const handleToggle = (index) => {
    const updated = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(updated);

    const total = scholarship.eligibilityChecklist.length;
    const count = Object.values(updated).filter(Boolean).length;

    if (count === total) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const total = scholarship.eligibilityChecklist.length;
  const count = Object.values(checkedItems).filter(Boolean).length;
  const isAllEligible = count === total && total > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className={`emoji ${scholarship.colorClass}`} style={{ width: 44, height: 44, fontSize: 22, marginBottom: 0 }}>
              {scholarship.emoji}
            </div>
            <div>
              <span className="tag">{scholarship.category} · {scholarship.state}</span>
              <h3 style={{ margin: "4px 0 0", fontSize: 19 }}>{scholarship.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f2e8f1", borderRadius: "50%", width: 32, height: 32, display: "grid", placeItems: "center" }}
          >
            <X size={18} color="#664b63" />
          </button>
        </div>

        <div style={{ margin: "16px 0", padding: "14px", background: "var(--pink2)", borderRadius: 14, border: "1px solid #f8dceb" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--brand)", marginBottom: 4 }}>
            🎁 Scheme Financial Benefits:
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "#483b52" }}>{scholarship.benefits}</p>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h4 style={{ margin: 0, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={18} color="var(--brand)" /> Interactive Eligibility Check
            </h4>
            <span style={{ fontSize: 12, fontWeight: 700, color: isAllEligible ? "#1b7340" : "var(--muted)" }}>
              {count} of {total} criteria met
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scholarship.eligibilityChecklist.map((item, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => handleToggle(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: isChecked ? "#f0fdf4" : "#ffffff",
                    border: `1px solid ${isChecked ? "#86efac" : "#e6d5e5"}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {isChecked ? (
                    <CheckCircle2 size={18} color="#16a34a" />
                  ) : (
                    <Circle size={18} color="#b29fb1" />
                  )}
                  <span style={{ fontSize: 13, color: isChecked ? "#166534" : "#3e3247", fontWeight: isChecked ? 600 : 400 }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {isAllEligible && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, color: "#166534", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={20} color="#16a34a" />
            <span><strong>High Eligibility Match!</strong> You fulfill the basic criteria. Verify notifications on the portal.</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
          <a
            href={scholarship.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ flex: 1, minWidth: 160 }}
          >
            Apply on Official Portal <ExternalLink size={15} />
          </a>

          <button
            type="button"
            className={`btn ${isBookmarked ? "secondary" : "soft"}`}
            onClick={() => toggleBookmark(scholarship.id)}
            style={{ minWidth: 130 }}
          >
            {isBookmarked ? "★ Saved in Sakhi" : "☆ Bookmark Scheme"}
          </button>
        </div>
      </div>
    </div>
  );
}
