import React, { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Smartphone,
  Monitor,
  Calendar,
  Search,
  Filter,
  Download,
  Database,
  Lock,
  Unlock,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Bot,
  Heart,
  Compass,
  FileSpreadsheet,
  Cloud,
  Check,
  Copy
} from "lucide-react";
import { tracker } from "../services/tracker";
import { SUPABASE_CONFIG, isSupabaseConfigured } from "../config/supabase";
import { SUPABASE_SQL_SCHEMA } from "../services/supabaseSchema";

export default function AdminPanel({ onClose }) {
  // Authentication gate for admin
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("sakhi_admin_authed") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Active tab in admin
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'feed' | 'visitors' | 'cloud'

  // Data states
  const [events, setEvents] = useState([]);
  const [visitors, setVisitors] = useState({});
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);
  const [isLiveCloud, setIsLiveCloud] = useState(false);
  const [cloudSource, setCloudSource] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Filters for feed
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setIsLoadingData(true);
    const res = await tracker.fetchLiveAnalytics();
    setEvents(res.events || []);
    setVisitors(res.visitors || {});
    setIsLiveCloud(res.isCloud);
    setCloudSource(res.source || "");
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "sakhi2026" || passcode === "admin123" || passcode === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("sakhi_admin_authed", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode. Try 'sakhi2026' or 'admin123'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("sakhi_admin_authed");
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleExportCSV = () => {
    if (!events.length) {
      alert("No events to export.");
      return;
    }

    const headers = ["Timestamp", "Visitor_ID", "Event_Type", "Page", "Device_Type", "Browser", "Details_JSON"];
    const rows = events.map((e) => [
      `"${e.timestamp}"`,
      `"${e.visitorId}"`,
      `"${e.type}"`,
      `"${e.page || ""}"`,
      `"${e.device?.deviceType || ""}"`,
      `"${e.device?.browser || ""}"`,
      `"${JSON.stringify(e.details || {}).replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sakhi_analytics_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      databaseMode: isLiveCloud ? "Supabase Central Cloud" : "Local Storage",
      totalEvents: events.length,
      totalVisitors: Object.keys(visitors).length,
      events,
      visitors
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sakhi_analytics_full_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper: Format relative timestamp
  const formatTimeAgo = (isoString) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return isoString;
    }
  };

  // Calculations for Overview stats
  const visitorList = Object.values(visitors);
  const totalVisitorsCount = visitorList.length || 0;
  const totalEventsCount = events.length;

  const mobileCount = visitorList.filter((v) => v.device?.deviceType === "Mobile").length;
  const desktopCount = visitorList.filter((v) => v.device?.deviceType === "Desktop").length;
  const mobilePercent = totalVisitorsCount > 0 ? Math.round((mobileCount / totalVisitorsCount) * 100) : 50;

  const aiQueriesCount = events.filter((e) => e.type === "ai_question_asked").length;
  const cycleCalcsCount = events.filter((e) => e.type === "cycle_calculated").length;
  const emergencyClicksCount = events.filter((e) => e.type === "emergency_helpline_clicked").length;
  const scholarshipsViewCount = events.filter((e) => e.type === "scholarship_viewed" || e.type === "scholarship_finder_used").length;

  // Page breakdown count
  const pageVisits = {
    home: events.filter((e) => e.page === "home").length,
    doctor: events.filter((e) => e.page === "doctor").length,
    health: events.filter((e) => e.page === "health").length,
    reels: events.filter((e) => e.page === "reels").length,
    scholarships: events.filter((e) => e.page === "scholarships").length,
    career: events.filter((e) => e.page === "career").length,
    help: events.filter((e) => e.page === "help").length,
    community: events.filter((e) => e.page === "community").length
  };

  // Filtered events for the live feed
  const filteredEvents = events.filter((e) => {
    const matchesFilter =
      eventTypeFilter === "All" ||
      (eventTypeFilter === "Pages" && e.type === "page_view") ||
      (eventTypeFilter === "AI Assistant" && e.type === "ai_question_asked") ||
      (eventTypeFilter === "Scholarships" && (e.type.includes("scholarship") || e.type.includes("scheme"))) ||
      (eventTypeFilter === "Health Tools" && (e.type === "cycle_calculated" || e.type === "health_topic_read")) ||
      (eventTypeFilter === "Reels" && e.type === "reel_watched") ||
      (eventTypeFilter === "Emergency" && (e.type === "emergency_helpline_clicked" || e.type === "panic_exit_triggered"));

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      e.visitorId.toLowerCase().includes(query) ||
      e.page?.toLowerCase().includes(query) ||
      JSON.stringify(e.details).toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  // Render passcode lock if not logged in
  if (!isAuthenticated) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: 420, textAlign: "center", padding: "34px 28px" }}>
          <div style={{ width: 56, height: 56, background: "var(--pink2)", borderRadius: 18, margin: "0 auto 16px", display: "grid", placeItems: "center" }}>
            <Lock size={26} color="var(--brand)" />
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>Sakhi Admin Portal</h2>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--muted)" }}>
            Enter administrator passcode to access analytics & user tracking database.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin passcode (e.g. sakhi2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={{ textAlign: "center", letterSpacing: 2, fontSize: 16 }}
              autoFocus
            />

            {authError && (
              <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <AlertCircle size={14} /> {authError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button type="button" className="btn secondary" onClick={onClose} style={{ flex: 1 }}>
                Back to Site
              </button>
              <button type="submit" className="btn" style={{ flex: 1 }}>
                <Unlock size={15} /> Access Panel
              </button>
            </div>
          </form>

          <div style={{ marginTop: 20, padding: "10px", background: "#f8f3f8", borderRadius: 10, fontSize: 11, color: "var(--muted)" }}>
            💡 Demo Passcode: <b>sakhi2026</b> or <b>admin123</b>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" style={{ padding: 12 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: 1100,
          width: "96%",
          height: "92vh",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center" }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>Sakhi Analytics & User Journey Portal</h2>
                {isLiveCloud ? (
                  <span className="tag" style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" }}>
                    🟢 LIVE CLOUD DATABASE (Supabase)
                  </span>
                ) : (
                  <span className="tag" style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }}>
                    🟡 LOCAL PREVIEW (Connect Supabase in src/config/supabase.js)
                  </span>
                )}
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--muted)" }}>
                Auditing user paths, feature usage, and scheme queries without privacy invasion
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn secondary sm" onClick={loadData} disabled={isLoadingData} title="Refresh Live Data">
              <RefreshCw size={14} className={isLoadingData ? "animate-spin" : ""} /> {isLoadingData ? "Loading..." : "Refresh"}
            </button>
            <button className="btn secondary sm" onClick={handleExportCSV} title="Export CSV for Excel">
              <Download size={14} /> Export CSV
            </button>
            <button className="btn soft sm" onClick={handleLogout} title="Lock Admin Portal">
              <Lock size={14} /> Lock
            </button>
            <button
              onClick={onClose}
              style={{ background: "#f2e8f1", borderRadius: 10, padding: "7px 12px", fontSize: 13, fontWeight: 700, color: "var(--brand)" }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: 8, margin: "16px 0 14px", borderBottom: "1px solid var(--line)", paddingBottom: 8, overflowX: "auto" }}>
          {[
            { id: "overview", label: "📊 Analytics Overview" },
            { id: "feed", label: `⚡ Live Journey Feed (${events.length})` },
            { id: "visitors", label: `👥 Visitor Directory (${Object.keys(visitors).length})` },
            { id: "cloud", label: `☁️ Cloud Database (${isLiveCloud ? "Connected" : "Setup Guide"})` }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ whiteSpace: "nowrap" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
            {/* Stat Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              <div style={{ padding: 16, borderRadius: 16, background: "var(--pink2)", border: "1px solid #f8dbe9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--brand)" }}>
                  <Users size={20} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>UNIQUE VISITORS</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: "var(--ink)" }}>
                  {totalVisitorsCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                  Anonymous Device IDs
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 16, background: "var(--lav)", border: "1px solid #ded0f7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--lav-dark)" }}>
                  <TrendingUp size={20} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>TOTAL INTERACTIONS</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: "var(--ink)" }}>
                  {totalEventsCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                  Clicks, views, calculators
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 16, background: "var(--mint)", border: "1px solid #c9eed8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--mint-dark)" }}>
                  <Bot size={20} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>DR. SUSHMA CHATS</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: "var(--ink)" }}>
                  {aiQueriesCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                  Health questions asked
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 16, background: "var(--blue)", border: "1px solid #cce3fa" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--blue-dark)" }}>
                  <Compass size={20} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>SCHOLARSHIP HITS</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: "var(--ink)" }}>
                  {scholarshipsViewCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                  Location matcher & schemes
                </div>
              </div>

              <div style={{ padding: 16, borderRadius: 16, background: "#fff1f2", border: "1px solid #fecdd3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#e11d48" }}>
                  <ShieldAlert size={20} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>EMERGENCY TAPS</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: "#9f1239" }}>
                  {emergencyClicksCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                  112, 181, 1098 calls clicked
                </div>
              </div>
            </div>

            {/* Visual Breakdown Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 20 }}>
              {/* Section Popularity */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: 18, padding: 18, boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Most Explored Sections</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Home", count: pageVisits.home, color: "#f472b6" },
                    { label: "Health Hub & Calculator", count: pageVisits.health, color: "#34d399" },
                    { label: "Dr. Sushma (AI Companion)", count: pageVisits.doctor, color: "#a78bfa" },
                    { label: "Learning Reels 🎬", count: pageVisits.reels, color: "#ec4899" },
                    { label: "Scholarships & Finder", count: pageVisits.scholarships, color: "#38bdf8" },
                    { label: "Help & Emergency", count: pageVisits.help, color: "#fb7185" },
                    { label: "Careers by Age", count: pageVisits.career, color: "#fbbf24" }
                  ].map((sec) => {
                    const pct = totalEventsCount > 0 ? Math.round((sec.count / totalEventsCount) * 100) : 0;
                    return (
                      <div key={sec.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{sec.label}</span>
                          <span style={{ color: "var(--muted)" }}>{sec.count} actions ({pct}%)</span>
                        </div>
                        <div style={{ height: 8, background: "#f0e6f0", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${Math.max(5, pct)}%`, height: "100%", background: sec.color, borderRadius: 99 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Device & Platform Breakdown */}
              <div style={{ background: "#ffffff", border: "1px solid var(--line)", borderRadius: 18, padding: 18, boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Audience Device Types</h3>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ flex: 1, padding: 14, borderRadius: 14, background: "#faf5fb", border: "1px solid #ebd8ea", textAlign: "center" }}>
                    <Smartphone size={24} color="var(--brand)" style={{ margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{mobilePercent}%</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Mobile Devices</div>
                  </div>
                  <div style={{ flex: 1, padding: 14, borderRadius: 14, background: "#f5f8fc", border: "1px solid #dbe6f5", textAlign: "center" }}>
                    <Monitor size={24} color="#2563eb" style={{ margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{100 - mobilePercent}%</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Desktop / Laptops</div>
                  </div>
                </div>

                <div style={{ padding: "12px 14px", background: "var(--pink2)", borderRadius: 12, fontSize: 12, color: "#613653", lineHeight: 1.5 }}>
                  💡 <b>Real Analytics Mode:</b> {isLiveCloud ? "All actions from every smartphone and laptop across India are being recorded in your central Supabase PostgreSQL table." : "Currently running on local browser preview. To sync data across all visitor phones, add your Supabase credentials in src/config/supabase.js."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Activity Feed */}
        {activeTab === "feed" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Filter & Search Bar */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <Search size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Search visitor ID, page, or action details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 36, fontSize: 13, height: 38 }}
                />
              </div>

              <div className="filter-bar" style={{ margin: 0 }}>
                {["All", "Pages", "AI Assistant", "Scholarships", "Health Tools", "Reels", "Emergency"].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${eventTypeFilter === cat ? "active" : ""}`}
                    onClick={() => setEventTypeFilter(cat)}
                    style={{ fontSize: 12, padding: "5px 12px" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Scroll Area */}
            <div style={{ flex: 1, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 14, background: "#faf8fb" }}>
              {filteredEvents.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                  No interactions found matching this filter.
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  let badgeColor = "#e0e7ff";
                  let textColor = "#3730a3";
                  let icon = <Activity size={14} />;

                  if (evt.type === "ai_question_asked") {
                    badgeColor = "#fae8ff";
                    textColor = "#86198f";
                    icon = <Bot size={14} />;
                  } else if (evt.type.includes("scholarship") || evt.type.includes("scheme")) {
                    badgeColor = "#fef3c7";
                    textColor = "#92400e";
                    icon = <Compass size={14} />;
                  } else if (evt.type === "cycle_calculated" || evt.type === "health_topic_read") {
                    badgeColor = "#dcfce7";
                    textColor = "#166534";
                    icon = <Heart size={14} />;
                  } else if (evt.type === "reel_watched") {
                    badgeColor = "#fce7f3";
                    textColor = "#be185d";
                    icon = <Activity size={14} />;
                  } else if (evt.type === "emergency_helpline_clicked" || evt.type === "panic_exit_triggered") {
                    badgeColor = "#fee2e2";
                    textColor = "#991b1b";
                    icon = <ShieldAlert size={14} />;
                  }

                  return (
                    <div
                      key={evt.id}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0e6f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        background: "#ffffff"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: badgeColor, color: textColor, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          {icon}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                              {evt.type.replace(/_/g, " ").toUpperCase()}
                            </span>
                            <span style={{ fontSize: 11, background: "#f3e8f3", color: "#6e4768", padding: "2px 6px", borderRadius: 6, fontFamily: "monospace" }}>
                              {evt.visitorId}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--muted)" }}>
                              ({evt.device?.deviceType} • {evt.device?.browser})
                            </span>
                          </div>

                          <div style={{ fontSize: 12.5, color: "#4f3b55", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {evt.details?.title ? `“${evt.details.title}”` : ""}
                            {evt.details?.helpline ? `Called helpline: ${evt.details.helpline}` : ""}
                            {evt.details?.topic ? `Asked about: ${evt.details.topic}` : ""}
                            {evt.details?.state ? `Filtered state: ${evt.details.state} (${evt.details.category})` : ""}
                            {evt.details?.cycleLength ? `Calculated cycle: ${evt.details.cycleLength} days (${evt.details.phase})` : ""}
                            {!evt.details?.title && !evt.details?.helpline && !evt.details?.topic && !evt.details?.state && !evt.details?.cycleLength && evt.page ? `Navigated to ${evt.page}` : ""}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0, textAlign: "right" }}>
                        <div>{formatTimeAgo(evt.timestamp)}</div>
                        <div style={{ fontSize: 10 }}>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Visitors Directory & Journeys */}
        {activeTab === "visitors" && (
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, minHeight: 0 }}>
            {/* Visitors List */}
            <div style={{ overflowY: "auto", border: "1px solid var(--line)", borderRadius: 14, background: "#fff" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", background: "#faf8fb", fontWeight: 700, fontSize: 13 }}>
                Anonymous Visitors List ({visitorList.length})
              </div>

              {visitorList.map((vis) => {
                const isSelected = selectedVisitorId === vis.id;
                return (
                  <div
                    key={vis.id}
                    onClick={() => setSelectedVisitorId(vis.id)}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f6edf5",
                      cursor: "pointer",
                      background: isSelected ? "var(--pink2)" : "transparent",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{vis.id}</span>
                        <span className="tag" style={{ fontSize: 10, padding: "2px 6px" }}>
                          {vis.device?.deviceType}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                        First seen {formatTimeAgo(vis.firstSeen)} • {vis.eventsCount || 1} total actions
                      </div>
                    </div>
                    <ChevronRight size={16} color={isSelected ? "var(--brand)" : "#baa6b9"} />
                  </div>
                );
              })}
            </div>

            {/* Individual Visitor Journey Detail */}
            <div style={{ overflowY: "auto", border: "1px solid var(--line)", borderRadius: 14, background: "#faf8fb", padding: 16 }}>
              {selectedVisitorId ? (
                (() => {
                  const visitorEvents = events.filter((e) => e.visitorId === selectedVisitorId);
                  const visObj = visitors[selectedVisitorId];
                  return (
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: 16 }}>Visitor Click Path</h4>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, fontFamily: "monospace" }}>
                        ID: {selectedVisitorId}
                      </div>

                      {visObj?.device && (
                        <div style={{ padding: "10px 12px", background: "#fff", borderRadius: 10, border: "1px solid #eed8e9", fontSize: 12, marginBottom: 14 }}>
                          <div><b>Device:</b> {visObj.device.deviceType} ({visObj.device.browser})</div>
                          <div><b>First Seen:</b> {new Date(visObj.firstSeen).toLocaleString()}</div>
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {visitorEvents.map((step, idx) => (
                          <div
                            key={step.id}
                            style={{
                              padding: "10px 12px",
                              background: "#ffffff",
                              borderRadius: 10,
                              border: "1px solid #ebdce8",
                              display: "flex",
                              gap: 10,
                              alignItems: "flex-start"
                            }}
                          >
                            <span style={{ background: "var(--brand-light)", color: "var(--brand)", width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                              {idx + 1}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>
                                {step.type.replace(/_/g, " ")}
                              </div>
                              <div style={{ fontSize: 11, color: "#5d4b63" }}>
                                {JSON.stringify(step.details)}
                              </div>
                              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                                {formatTimeAgo(step.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
                  <Users size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: 13 }}>Click on any visitor on the left to inspect their step-by-step browsing journey.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Cloud Database Setup */}
        {activeTab === "cloud" && (
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
              {/* Connection Status Card */}
              <div className="panel" style={{ border: "1px solid #ebd6e8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: isLiveCloud ? "#ecfdf5" : "#fffbeb", display: "grid", placeItems: "center", color: isLiveCloud ? "#059669" : "#d97706" }}>
                    <Database size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17 }}>Central Supabase Database Status</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>Configured directly in the codebase for production</p>
                  </div>
                </div>

                <div style={{ padding: "14px 16px", borderRadius: 12, background: isLiveCloud ? "#f0fdf4" : "#fff8e6", border: `1px solid ${isLiveCloud ? "#86efac" : "#fde68a"}`, margin: "14px 0" }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: isLiveCloud ? "#166534" : "#92400e", display: "flex", alignItems: "center", gap: 6 }}>
                    {isLiveCloud ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {isLiveCloud ? "Connected to Central Supabase Cloud" : "Not Yet Configured in Codebase"}
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: isLiveCloud ? "#166534" : "#78350f" }}>
                    {isLiveCloud
                      ? "Every visitor's activity from any phone or computer is being captured in your central database in real time."
                      : "Currently displaying local browser preview. To sync data across all visitors' phones into one central dashboard, add your Supabase credentials to the code."}
                  </p>
                </div>

                <h4 style={{ margin: "16px 0 8px", fontSize: 14 }}>Where to set credentials:</h4>
                <div style={{ background: "#22162a", color: "#f7e8f5", padding: "12px 14px", borderRadius: 10, fontFamily: "monospace", fontSize: 12 }}>
                  File: <b>src/config/supabase.js</b>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 0" }}>
                  Or define <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in Render / <code>.env</code> file.
                </p>
              </div>

              {/* Data Export & Maintenance Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="panel" style={{ border: "1px solid #ebd6e8" }}>
                  <h3 style={{ marginTop: 0, fontSize: 16 }}>Direct Data Exports</h3>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 14px" }}>
                    Export complete tracking records directly to Excel or data analysis tools.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="btn sm" onClick={handleExportCSV} style={{ width: "100%", justifyContent: "flex-start" }}>
                      <FileSpreadsheet size={16} /> Download CSV Spreadsheet (.csv)
                    </button>
                    <button className="btn secondary sm" onClick={handleExportJSON} style={{ width: "100%", justifyContent: "flex-start" }}>
                      <Download size={16} /> Download Raw JSON (.json)
                    </button>
                  </div>
                </div>

                <div className="panel" style={{ border: "1px solid #fecdd3" }}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: "var(--danger)" }}>Maintenance Controls</h3>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 12px" }}>
                    Reset local preview tracking data or wipe local browser logs.
                  </p>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn secondary sm"
                      onClick={() => {
                        tracker.resetSampleData();
                        loadData();
                        alert("Sample presentation data reloaded!");
                      }}
                    >
                      <RefreshCw size={13} /> Reload Demo Data
                    </button>

                    <button
                      className="btn danger sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear local user analytics records?")) {
                          tracker.clearData();
                          loadData();
                        }
                      }}
                    >
                      <Trash2 size={13} /> Clear Local
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase SQL Instructions */}
            <div className="panel" style={{ marginTop: 16, border: "1px solid #ebd6e8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14 }}>Supabase SQL Table Setup Script</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--muted)" }}>Paste this once into your Supabase SQL Editor and click "Run"</p>
                </div>
                <button
                  className="btn secondary sm"
                  style={{ fontSize: 12 }}
                  onClick={handleCopySQL}
                >
                  {copiedSchema ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copiedSchema ? "Copied to Clipboard!" : "Copy SQL Script"}
                </button>
              </div>
              <pre
                style={{
                  background: "#23182b",
                  color: "#f3e8f3",
                  padding: 14,
                  borderRadius: 12,
                  fontSize: 11.5,
                  overflowX: "auto",
                  margin: 0
                }}
              >
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
