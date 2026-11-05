import React from "react";
import { X, Check, AlertTriangle, ShieldCheck } from "lucide-react";

export default function HealthDetailModal({ topic, onClose }) {
  if (!topic) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className={`emoji ${topic.colorClass}`} style={{ width: 44, height: 44, fontSize: 24, marginBottom: 0 }}>
              {topic.emoji}
            </div>
            <div>
              <span className="tag">{topic.readTime}</span>
              <h3 style={{ margin: "4px 0 0", fontSize: 20 }}>{topic.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f2e8f1", borderRadius: "50%", width: 32, height: 32, display: "grid", placeItems: "center" }}
          >
            <X size={18} color="#664b63" />
          </button>
        </div>

        <div style={{ marginTop: 18, padding: "14px 16px", background: "var(--lav)", borderRadius: 14, border: "1px solid #e2d4f8" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--lav-dark)", display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={16} /> Key Medical Takeaways:
          </h4>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#3f2c52" }}>
            {topic.keyFacts.map((fact, idx) => (
              <li key={idx} style={{ margin: "5px 0" }}>{fact}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 18, fontSize: 14.5, lineHeight: 1.7, color: "#32233e", whiteSpace: "pre-line" }}>
          {topic.detailedContent}
        </div>

        <div className="notice" style={{ marginTop: 22 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, color: "#c98200" }} />
          <span>
            <strong>Educational Disclaimer:</strong> This article is for informational purposes and should not be used as a medical diagnosis. Consult a qualified gynecologist or general physician for persistent symptoms.
          </span>
        </div>

        <div style={{ textAlign: "right", marginTop: 18 }}>
          <button className="btn secondary" onClick={onClose}>
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
