// Anonymous User Activity & Journey Tracking Engine for Sakhi Platform
import { SUPABASE_CONFIG, isSupabaseConfigured } from "../config/supabase";

const VISITOR_ID_KEY = "sakhi_visitor_id";
const SESSION_ID_KEY = "sakhi_session_id";
const EVENTS_STORAGE_KEY = "sakhi_analytics_events";
const VISITORS_STORAGE_KEY = "sakhi_analytics_visitors";
const SUPABASE_CONFIG_KEY = "sakhi_supabase_config";

// Resolve active Supabase credentials (codebase config takes priority)
function getActiveCloudConfig() {
  if (isSupabaseConfigured()) {
    return {
      url: SUPABASE_CONFIG.url.trim().replace(/\/+$/, ""),
      anonKey: SUPABASE_CONFIG.anonKey.trim(),
      source: "codebase"
    };
  }
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim().replace(/\/+$/, ""),
          anonKey: parsed.anonKey.trim(),
          source: "localStorage"
        };
      }
    }
  } catch {
    // fallback
  }
  return null;
}

// Generate a random unique identifier
function generateId(prefix = "id") {
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

// Detect client device information anonymously
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = "Desktop";
  let isMobile = false;

  if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
    deviceType = "Mobile";
    isMobile = true;
  } else if (/iPad|Tablet/i.test(ua)) {
    deviceType = "Tablet";
    isMobile = true;
  }

  let browser = "Other";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  const screenRes = `${window.screen?.width || 0}x${window.screen?.height || 0}`;

  return {
    deviceType,
    isMobile,
    browser,
    screenRes,
    language: navigator.language || "en"
  };
}

// Initialize or retrieve anonymous visitor ID
export function getOrCreateVisitorId() {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      const shortCode = Math.floor(1000 + Math.random() * 9000);
      visitorId = `vis_${shortCode}_${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return "vis_guest";
  }
}

// Initialize or retrieve session ID (per tab/browser session)
export function getOrCreateSessionId() {
  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = generateId("sess");
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "sess_default";
  }
}

// Save or update visitor metadata in local storage
function updateVisitorRecord(visitorId, deviceInfo, firstEvent) {
  try {
    const raw = localStorage.getItem(VISITORS_STORAGE_KEY);
    const visitors = raw ? JSON.parse(raw) : {};

    const now = new Date().toISOString();
    if (!visitors[visitorId]) {
      visitors[visitorId] = {
        id: visitorId,
        firstSeen: now,
        lastSeen: now,
        device: deviceInfo,
        eventsCount: 1,
        lastPage: firstEvent.page || "home",
        pagesVisited: [firstEvent.page || "home"]
      };
    } else {
      visitors[visitorId].lastSeen = now;
      visitors[visitorId].eventsCount = (visitors[visitorId].eventsCount || 0) + 1;
      if (firstEvent.page && !visitors[visitorId].pagesVisited.includes(firstEvent.page)) {
        visitors[visitorId].pagesVisited.push(firstEvent.page);
      }
      visitors[visitorId].lastPage = firstEvent.page || visitors[visitorId].lastPage;
    }

    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(visitors));
  } catch (err) {
    console.warn("Tracker: could not update visitor", err);
  }
}

// Cloud sync adapter (Supabase)
async function syncToSupabase(event) {
  try {
    const cloud = getActiveCloudConfig();
    if (!cloud) return;

    await fetch(`${cloud.url}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": cloud.anonKey,
        "Authorization": `Bearer ${cloud.anonKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        visitor_id: event.visitorId,
        session_id: event.sessionId,
        event_type: event.type,
        page: event.page,
        details: event.details,
        device_type: event.device?.deviceType,
        browser: event.device?.browser,
        created_at: event.timestamp
      })
    });
  } catch (err) {
    // Ignore network sync issues silently in background
  }
}

// Seed realistic starter data if the log is empty (for demo/presentation readiness)
function ensureSampleData() {
  try {
    const existing = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (existing && JSON.parse(existing).length > 0) return;

    const sampleVisitors = [
      { id: "vis_1042_k3m9", device: { deviceType: "Mobile", browser: "Chrome", screenRes: "390x844" }, timeOffsetMin: 45 },
      { id: "vis_2081_p7q2", device: { deviceType: "Mobile", browser: "Safari", screenRes: "414x896" }, timeOffsetMin: 30 },
      { id: "vis_3119_x4f1", device: { deviceType: "Desktop", browser: "Chrome", screenRes: "1920x1080" }, timeOffsetMin: 15 },
      { id: "vis_4502_m8w3", device: { deviceType: "Mobile", browser: "Chrome", screenRes: "360x800" }, timeOffsetMin: 5 }
    ];

    const sampleEvents = [];
    const now = Date.now();

    sampleVisitors.forEach((v) => {
      const baseTime = new Date(now - v.timeOffsetMin * 60 * 1000).toISOString();
      sampleEvents.push({
        id: generateId("evt"),
        visitorId: v.id,
        sessionId: "sess_demo_" + v.id,
        type: "page_view",
        page: "home",
        details: { title: "Sakhi Home" },
        device: v.device,
        timestamp: baseTime
      });

      if (v.id.includes("1042")) {
        sampleEvents.push({
          id: generateId("evt"),
          visitorId: v.id,
          sessionId: "sess_demo_" + v.id,
          type: "cycle_calculated",
          page: "health",
          details: { cycleLength: 28, phase: "Follicular Phase" },
          device: v.device,
          timestamp: new Date(now - 40 * 60 * 1000).toISOString()
        });
        sampleEvents.push({
          id: generateId("evt"),
          visitorId: v.id,
          sessionId: "sess_demo_" + v.id,
          type: "health_topic_read",
          page: "health",
          details: { title: "PCOS & Hormonal Health", readTime: "5 min read" },
          device: v.device,
          timestamp: new Date(now - 38 * 60 * 1000).toISOString()
        });
      }

      if (v.id.includes("2081")) {
        sampleEvents.push({
          id: generateId("evt"),
          visitorId: v.id,
          sessionId: "sess_demo_" + v.id,
          type: "scholarship_viewed",
          page: "scholarships",
          details: { title: "Devnarayan Girls Scooty Scheme", category: "Girls", state: "Rajasthan" },
          device: v.device,
          timestamp: new Date(now - 25 * 60 * 1000).toISOString()
        });
        sampleEvents.push({
          id: generateId("evt"),
          visitorId: v.id,
          sessionId: "sess_demo_" + v.id,
          type: "scholarship_bookmarked",
          page: "scholarships",
          details: { title: "Devnarayan Girls Scooty Scheme", action: "saved" },
          device: v.device,
          timestamp: new Date(now - 23 * 60 * 1000).toISOString()
        });
      }

      if (v.id.includes("3119")) {
        sampleEvents.push({
          id: generateId("evt"),
          visitorId: v.id,
          sessionId: "sess_demo_" + v.id,
          type: "ai_question_asked",
          page: "doctor",
          details: { topic: "Period Cramps", queryType: "quick_prompt" },
          device: v.device,
          timestamp: new Date(now - 12 * 60 * 1000).toISOString()
        });
      }

      if (v.id.includes("4502")) {
        sampleEvents.push({
          id: generateId("evt"),
          visitorId: v.id,
          sessionId: "sess_demo_" + v.id,
          type: "emergency_helpline_clicked",
          page: "help",
          details: { helpline: "181 — Women Helpline" },
          device: v.device,
          timestamp: new Date(now - 3 * 60 * 1000).toISOString()
        });
      }
    });

    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(sampleEvents));

    // Also populate visitors index
    const visitorsMap = {};
    sampleVisitors.forEach((v) => {
      visitorsMap[v.id] = {
        id: v.id,
        firstSeen: new Date(now - v.timeOffsetMin * 60 * 1000).toISOString(),
        lastSeen: new Date(now - (v.timeOffsetMin - 10) * 60 * 1000).toISOString(),
        device: v.device,
        eventsCount: sampleEvents.filter(e => e.visitorId === v.id).length,
        lastPage: v.id.includes("1042") ? "health" : v.id.includes("2081") ? "scholarships" : v.id.includes("3119") ? "doctor" : "help",
        pagesVisited: ["home", "doctor", "health"]
      };
    });
    localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(visitorsMap));
  } catch {
    // Ignore storage errors
  }
}

// Seed on module evaluation
ensureSampleData();

// Core Tracking API
export const tracker = {
  // Log any interaction event
  logEvent(type, details = {}, page = "home") {
    try {
      const visitorId = getOrCreateVisitorId();
      const sessionId = getOrCreateSessionId();
      const device = getDeviceInfo();
      const timestamp = new Date().toISOString();

      const event = {
        id: generateId("evt"),
        visitorId,
        sessionId,
        type,
        page,
        details,
        device,
        timestamp
      };

      // 1. Save to Local Events History
      const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
      const events = raw ? JSON.parse(raw) : [];
      events.unshift(event); // newest first

      // Keep up to 2000 events locally
      if (events.length > 2000) events.pop();
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

      // 2. Update Local Visitor Index
      updateVisitorRecord(visitorId, device, event);

      // 3. Sync to Supabase cloud immediately
      syncToSupabase(event);

      return event;
    } catch (err) {
      console.warn("Tracker: failed to log event", err);
      return null;
    }
  },

  // Helper: Log page navigation
  logPageView(pageName) {
    return this.logEvent("page_view", { title: `Viewed ${pageName}` }, pageName);
  },

  // Helper: Log scholarship interaction
  logScholarshipView(scholarship) {
    return this.logEvent(
      "scholarship_viewed",
      { id: scholarship.id, title: scholarship.title, category: scholarship.category },
      "scholarships"
    );
  },

  // Helper: Log scholarship bookmark
  logScholarshipBookmark(scholarshipId, action = "saved") {
    return this.logEvent("scholarship_bookmarked", { id: scholarshipId, action }, "scholarships");
  },

  // Helper: Log cycle calculation
  logCycleCalculated(cycleLength, phase) {
    return this.logEvent("cycle_calculated", { cycleLength, phase }, "health");
  },

  // Helper: Log health article read
  logHealthTopicRead(topic) {
    return this.logEvent(
      "health_topic_read",
      { id: topic.id, title: topic.title, readTime: topic.readTime },
      "health"
    );
  },

  // Helper: Log AI assistant question
  logAIQuestion(topic, isCrisis = false) {
    return this.logEvent(
      "ai_question_asked",
      { topic, isCrisis, timestamp: new Date().toISOString() },
      "doctor"
    );
  },

  // Helper: Log emergency helpline click
  logEmergencyClick(helpline) {
    return this.logEvent("emergency_helpline_clicked", { helpline }, "help");
  },

  // Helper: Log panic button trigger
  logPanicTrigger(fromPage) {
    return this.logEvent("panic_exit_triggered", { fromPage }, fromPage);
  },

  // Check if Central Cloud Database is connected
  isCloudConfigured() {
    return !!getActiveCloudConfig();
  },

  getCloudConfig() {
    return getActiveCloudConfig();
  },

  // Fetch real analytics from the central cloud database (all users & devices)
  async fetchLiveAnalytics() {
    const cloud = getActiveCloudConfig();
    if (!cloud) {
      return {
        events: this.getEvents(),
        visitors: this.getVisitors(),
        isCloud: false,
        source: "local"
      };
    }

    try {
      const res = await fetch(`${cloud.url}/rest/v1/analytics_events?select=*&order=created_at.desc&limit=1500`, {
        headers: {
          "apikey": cloud.anonKey,
          "Authorization": `Bearer ${cloud.anonKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`Cloud returned status ${res.status}`);
      }

      const rows = await res.json();

      // Transform rows to event objects
      const cloudEvents = rows.map((r) => ({
        id: r.id,
        visitorId: r.visitor_id,
        sessionId: r.session_id,
        type: r.event_type,
        page: r.page,
        details: r.details,
        device: {
          deviceType: r.device_type,
          browser: r.browser
        },
        timestamp: r.created_at
      }));

      // Reconstruct visitor list across all devices
      const cloudVisitors = {};
      cloudEvents.forEach((e) => {
        const vId = e.visitorId;
        if (!cloudVisitors[vId]) {
          cloudVisitors[vId] = {
            id: vId,
            firstSeen: e.timestamp,
            lastSeen: e.timestamp,
            device: e.device,
            eventsCount: 1,
            lastPage: e.page || "home",
            pagesVisited: [e.page || "home"]
          };
        } else {
          cloudVisitors[vId].eventsCount += 1;
          if (e.page && !cloudVisitors[vId].pagesVisited.includes(e.page)) {
            cloudVisitors[vId].pagesVisited.push(e.page);
          }
          if (new Date(e.timestamp) < new Date(cloudVisitors[vId].firstSeen)) {
            cloudVisitors[vId].firstSeen = e.timestamp;
          }
        }
      });

      return {
        events: cloudEvents,
        visitors: cloudVisitors,
        isCloud: true,
        source: cloud.source
      };
    } catch (err) {
      console.warn("Failed to fetch cloud analytics, falling back to local:", err);
      return {
        events: this.getEvents(),
        visitors: this.getVisitors(),
        isCloud: false,
        source: "local (cloud offline)"
      };
    }
  },

  // Retrieve local fallback events
  getEvents() {
    try {
      const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Retrieve local fallback visitors metadata
  getVisitors() {
    try {
      const raw = localStorage.getItem(VISITORS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  // Clear local tracking data
  clearData() {
    try {
      localStorage.removeItem(EVENTS_STORAGE_KEY);
      localStorage.removeItem(VISITORS_STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  },

  // Reset to sample data
  resetSampleData() {
    this.clearData();
    ensureSampleData();
  }
};
