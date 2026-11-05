import React, { useState } from "react";
import { Calendar, Heart, Sparkles, RefreshCw } from "lucide-react";

export default function HealthCycleCalculator() {
  const today = new Date().toISOString().split("T")[0];
  const [lastDate, setLastDate] = useState(today);
  const [cycleLength, setCycleLength] = useState(28);
  const [result, setResult] = useState(null);

  const calculateCycle = (e) => {
    e.preventDefault();
    if (!lastDate) return;

    const startDate = new Date(lastDate);
    const length = parseInt(cycleLength, 10) || 28;

    // Next period
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(startDate.getDate() + length);

    // Estimated ovulation (typically 14 days before next period)
    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(nextPeriod.getDate() - 14);

    // Fertile window (approx 4 days before ovulation to 1 day after)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 4);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    // Calculate days passed since last period to determine current phase
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const dayOfCycle = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    let phase = "Follicular Phase (Rising Energy)";
    let tip = "Estrogen is gradually increasing. Great time for creative tasks, light cardio, and fresh iron-rich greens.";
    let badgeClass = "mint";

    if (dayOfCycle <= 5) {
      phase = "Menstrual Phase (Rest & Reset)";
      tip = "Hormones are at baseline. Prioritize warm foods, herbal tea, gentle stretching, and extra sleep.";
      badgeClass = "pink";
    } else if (dayOfCycle >= 12 && dayOfCycle <= 16) {
      phase = "Ovulation Window (Peak Confidence)";
      tip = "Estrogen and LH peak. You might notice heightened confidence and clear stretchy discharge. Stay well hydrated!";
      badgeClass = "blue";
    } else if (dayOfCycle > 16 && dayOfCycle <= length) {
      phase = "Luteal Phase (Nurture & Balance)";
      tip = "Progesterone rises. You may experience carb cravings or mild water retention. Choose magnesium-rich snacks (pumpkin seeds, dark chocolate).";
      badgeClass = "lav";
    }

    setResult({
      nextPeriod: nextPeriod.toDateString(),
      ovulationDate: ovulationDate.toDateString(),
      fertileWindow: `${fertileStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${fertileEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
      dayOfCycle,
      phase,
      tip,
      badgeClass
    });
  };

  return (
    <div className="panel" style={{ marginTop: 24, background: "linear-gradient(135deg, #ffffff 0%, #fff7fb 100%)", border: "1px solid #f6d8eb" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div className="emoji pink" style={{ width: 40, height: 40, fontSize: 20, marginBottom: 0 }}>🌸</div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>Interactive Cycle & Wellbeing Planner</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Estimate your next cycle, ovulation window, and optimal nutrition tips.</p>
        </div>
      </div>

      <form onSubmit={calculateCycle} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, alignItems: "end", marginTop: 16 }}>
        <div>
          <label style={{ margin: "0 0 6px" }}>First Day of Last Period</label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            required
            style={{ padding: "10px 12px" }}
          />
        </div>

        <div>
          <label style={{ margin: "0 0 6px" }}>Average Cycle Length: <b>{cycleLength} days</b></label>
          <input
            type="range"
            min="21"
            max="38"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            style={{ width: "100%", accentColor: "var(--brand)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
            <span>21 days</span>
            <span>28 days (avg)</span>
            <span>38 days</span>
          </div>
        </div>

        <div>
          <button type="submit" className="btn" style={{ width: "100%", padding: "11px 16px" }}>
            <Sparkles size={16} /> Calculate Estimates
          </button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 20, padding: 18, background: "#ffffff", borderRadius: 16, border: "1px solid #ebd6e8", boxShadow: "0 4px 14px rgba(62,28,68,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--pink2)", border: "1px solid #f9dbe9" }}>
              <small style={{ color: "#8a3a69", fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>Next Estimated Period</small>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>{result.nextPeriod}</div>
            </div>

            <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--mint)", border: "1px solid #c8edd8" }}>
              <small style={{ color: "var(--mint-dark)", fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>Fertile Window</small>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>{result.fertileWindow}</div>
            </div>

            <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--lav)", border: "1px solid #ded0f7" }}>
              <small style={{ color: "var(--lav-dark)", fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>Current Phase</small>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginTop: 4 }}>{result.phase}</div>
            </div>
          </div>

          <div style={{ marginTop: 14, background: "#fffafc", borderLeft: "4px solid var(--brand)", padding: "10px 14px", borderRadius: "0 10px 10px 0" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)" }}>💡 Phase-Wise Self-Care Suggestion:</span>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#483b52" }}>{result.tip}</p>
          </div>

          <p style={{ fontSize: 11, color: "var(--muted)", margin: "10px 0 0", textAlign: "right" }}>
            *Estimates only. Irregular cycles can be caused by stress, travel, illness or hormonal changes.
          </p>
        </div>
      )}
    </div>
  );
}
