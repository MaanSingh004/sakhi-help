import React, { useState } from "react";
import { Search, MapPin, ExternalLink, Sparkles, Filter, Award } from "lucide-react";
import { INDIAN_STATES_UT, FINDER_SCHEMES } from "../data/scholarshipFinder";
import { tracker } from "../services/tracker";

export default function ScholarshipLocationFinder({ onSelectSchemeForChecklist }) {
  const [selectedState, setSelectedState] = useState("Rajasthan");
  const [district, setDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindSchemes = (e) => {
    e.preventDefault();
    if (!selectedState) {
      alert("Please select your State / Union Territory.");
      return;
    }

    const matches = FINDER_SCHEMES.filter((scheme) => {
      const matchState = scheme.stateScope === "All India" || selectedState === "Rajasthan";
      const matchCat = selectedCategory === "all" || scheme.categories.includes(selectedCategory);
      const matchLevel = selectedLevel === "all" || scheme.levels.includes(selectedLevel);
      return matchState && matchCat && matchLevel;
    });

    setMatchedSchemes(matches);
    setHasSearched(true);

    tracker.logEvent("scholarship_finder_used", {
      state: selectedState,
      district: district.trim() || "All",
      category: selectedCategory,
      level: selectedLevel,
      matchesCount: matches.length
    }, "scholarships");
  };

  return (
    <div className="panel" style={{ margin: "20px 0", border: "1px solid #ebd4e4", background: "linear-gradient(145deg, #ffffff 0%, #fff9fc 100%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--pink2)", display: "grid", placeItems: "center", color: "var(--brand)" }}>
          <MapPin size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>Find Scholarships by Your Location & Category</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Filter national & state schemes by State, District, Community Category, and Education Level.</p>
        </div>
      </div>

      <form onSubmit={handleFindSchemes}>
        <div className="formrow">
          <div>
            <label style={{ margin: "0 0 6px" }}>State / Union Territory *</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
            >
              <option value="">Select State / UT</option>
              {INDIAN_STATES_UT.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ margin: "0 0 6px" }}>District (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Jaipur, Alwar, Pune..."
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
        </div>

        <div className="formrow" style={{ marginTop: 12 }}>
          <div>
            <label style={{ margin: "0 0 6px" }}>Social / Eligibility Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="OBC">OBC (Other Backward Classes)</option>
              <option value="EBC">EBC</option>
              <option value="DNT">DNT</option>
              <option value="Minority">Minority Communities</option>
              <option value="EWS / Low income">EWS / Low Income</option>
              <option value="Disability">Students with Disabilities (PwD)</option>
              <option value="Girls / Women">Girls / Women Specific (Scooty / Incentives)</option>
              <option value="Merit based">Merit Based</option>
              <option value="Special circumstances">Special Circumstances (Widows / Divorced)</option>
            </select>
          </div>

          <div>
            <label style={{ margin: "0 0 6px" }}>Current Study Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All levels</option>
              <option value="School">School (Pre-Matric / Class 9–12)</option>
              <option value="Undergraduate">Undergraduate (B.A, B.Sc, B.Tech, B.Ed)</option>
              <option value="Postgraduate">Postgraduate (M.A, M.Sc, M.Tech, MBA)</option>
              <option value="Technical / Diploma">Technical / Diploma (Polytechnic, ITI)</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="submit" className="btn" style={{ padding: "10px 20px" }}>
            <Search size={16} /> Find Schemes for Me
          </button>
        </div>
      </form>

      {/* Results Area */}
      {hasSearched && (
        <div style={{ marginTop: 22, borderTop: "1px solid var(--line)", paddingTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 16, color: "var(--brand)" }}>
              🎯 {matchedSchemes.length} Schemes Matched for {selectedState} {district ? `(${district})` : ""}
            </h4>
            <span className="tag">{selectedCategory === "all" ? "All Categories" : selectedCategory}</span>
          </div>

          {matchedSchemes.length === 0 ? (
            <div style={{ padding: 18, background: "#fffafb", borderRadius: 12, border: "1px solid #ebdce8", color: "var(--muted)", fontSize: 13 }}>
              No specific schemes matched this exact combination. Try setting Category or Study Level to "All".
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {matchedSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  style={{
                    border: "1px solid var(--line)",
                    padding: 16,
                    borderRadius: 14,
                    background: "#ffffff",
                    boxShadow: "0 2px 8px rgba(62,28,68,0.03)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                    <div>
                      <h4 style={{ margin: "0 0 6px", fontSize: 15, color: "var(--ink)" }}>{scheme.title}</h4>
                      <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{scheme.desc}</p>
                    </div>
                    <span className="tag" style={{ background: "#fdf2f8", color: "#8a3a69" }}>{scheme.stateScope}</span>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
                    <a
                      href={scheme.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn secondary sm"
                      style={{ fontSize: 12 }}
                    >
                      Check Official Guidelines ↗
                    </a>

                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      Levels: {scheme.levels.join(", ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="notice" style={{ marginTop: 16, fontSize: 12 }}>
            <span>
              ℹ️ <strong>Official Notice:</strong> This is an initial discovery shortlist, not a complete state/district database or final award guarantee. Check domicile, district circulars, income certificates, marks, and renewal dates on official portals. Never pay any private agent.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
