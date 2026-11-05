import React, { useState, useRef, useEffect } from "react";
import { Send, Volume2, VolumeX, Trash2, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

export default function SakhiAIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! 🌷 I'm Sakhi, your private health companion.\n\nYou can ask me general questions about periods, puberty, cramps, hygiene, nutrition, PCOS, or emotional wellbeing.\n\nI am an educational assistant and cannot diagnose diseases or prescribe medications. Please do not share personal identifiers."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const speakText = (text) => {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const generateBotResponse = (query) => {
    const s = query.toLowerCase();

    // 1. Crisis / Emergency detection
    if (/suicid|kill myself|self harm|hurt myself|end my life/.test(s)) {
      return {
        isCrisis: true,
        text: "🚨 I care about your safety. You are not alone, and you deserve immediate support right now.\n\nPlease reach out immediately:\n• Tele-MANAS (Mental Health Helpline): Call 14416 (24x7 Free)\n• National Emergency Services: Call 112\n• Kiran Mental Health Helpline: 1800-599-0019\n\nPlease stay with someone you trust. Sakhi cannot provide crisis care."
      };
    }

    if (/unsafe|abuse|harass|assault|danger|molest|violence|hit me/.test(s)) {
      return {
        isCrisis: true,
        text: "🚨 Your safety is the highest priority. If you are in immediate danger:\n• National Emergency: Call 112\n• Women Helpline (Domestic Abuse / Harassment): Call 181\n• Child Helpline (for minors): Call 1098\n\nIf safe, move to a crowded public space and alert someone you trust. This prototype cannot dispatch police or emergency workers."
      };
    }

    // 2. Health specific educational topics
    if (/period|menstru|cramp|bleed|cycle|pad|flow/.test(s)) {
      return {
        isCrisis: false,
        text: "🩸 **Menstrual Health Guidance:**\n• **For Cramp Relief:** A warm compress or hot water bottle on your lower abdomen helps relax uterine muscles. Chamomile, ginger tea, and gentle yoga stretches (child's pose) are very effective.\n• **Hygiene:** Change pads every 4 to 6 hours to prevent bacterial buildup.\n• **When to consult a doctor:** If your cramps prevent normal daily activity, if bleeding lasts longer than 7 days, or if you soak a pad every 1-2 hours."
      };
    }

    if (/pcos|pcod|hormone|facial hair|irregular period/.test(s)) {
      return {
        isCrisis: false,
        text: "🌸 **Understanding PCOS / PCOD:**\n• Polycystic Ovary Syndrome is a common metabolic and endocrine condition affecting roughly 1 in 5 women.\n• **Key Symptoms:** Irregular or skipped cycles, cystic acne, hair thinning, or extra facial hair.\n• **Management:** It is very manageable with a balanced diet (high fiber, whole grains, seeds), regular physical movement, and sound sleep.\n• *A gynecologist can verify diagnosis through an ultrasound and basic hormone profile (LH/FSH, Thyroid, Insulin).*"
      };
    }

    if (/pubert|body change|breast|growth|hair|voice/.test(s)) {
      return {
        isCrisis: false,
        text: "🌱 **Puberty & Bodily Changes:**\n• Puberty usually starts between ages 9 and 15. Every girl's timeline is completely unique.\n• You may experience growth spurts, budding breasts (which may feel tender initially), development of body hair, and mild white discharge.\n• These changes are completely natural as your ovaries begin producing estrogen. If you feel pain or lumps, a doctor can reassure you."
      };
    }

    if (/nutrition|food|diet|weight|anemia|iron|weakness|fatigue/.test(s)) {
      return {
        isCrisis: false,
        text: "🥗 **Nutrition & Energy Care:**\n• **Combating Anemia:** Eat iron-rich foods such as spinach (palak), methi, lentils, jaggery (gud), and roasted chana.\n• **The Golden Rule:** Always combine iron with Vitamin C (squeeze lemon on your food or have amla/oranges) to help your body absorb it.\n• **Hydration:** Drink at least 8 to 10 glasses of water. Avoid drinking strong chai or coffee right after your meals."
      };
    }

    if (/pregnan|abortion|contracept|sex|sexual/.test(s)) {
      return {
        isCrisis: false,
        text: "🩺 **Reproductive Health & Pregnancy:**\n• Accurate advice depends heavily on timing, age, and individual health history.\n• If you suspect a pregnancy, an over-the-counter urine pregnancy test (like Prega News) taken after a missed period provides quick confirmation.\n• Confident, confidential medical advice is available at your nearest government Primary Health Centre (PHC) or Community Health Centre (CHC)."
      };
    }

    // Default friendly educational response
    return {
      isCrisis: false,
      text: "🌷 Thank you for your question! I can share introductory health information on topics like menstrual hygiene, puberty changes, nutrition for anemia, PCOS symptoms, or stress management.\n\nBecause I am a prototype educational tool, I cannot diagnose medical conditions or recommend specific prescription medicines. What specific health or wellbeing topic would you like to explore?"
    };
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.text,
        isCrisis: response.isCrisis
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      speakText(response.text);
    }, 600);
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Chat cleared. What health topic can I help you explore today? 🌷"
      }
    ]);
  };

  return (
    <div className="two">
      <div className="panel chatbox">
        <div className="chathead">
          <div className="chathead-left">
            <div className="avatar">🩺</div>
            <div>
              <b style={{ fontSize: 16 }}>Sakhi AI</b>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Women's Health & Wellbeing Assistant · Educational Prototype
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => {
                const nextState = !speechEnabled;
                setSpeechEnabled(nextState);
                if (!nextState) window.speechSynthesis?.cancel();
              }}
              style={{
                background: speechEnabled ? "var(--brand-light)" : "#f5f0f8",
                color: speechEnabled ? "var(--brand)" : "#6a5475",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 5
              }}
              title="Toggle Read Aloud"
            >
              {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span style={{ fontSize: 11, fontWeight: 700 }}>
                {speechEnabled ? "Voice ON" : "Voice OFF"}
              </span>
            </button>

            <button
              onClick={clearChat}
              style={{
                background: "#f5f0f8",
                color: "#7e628a",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 4
              }}
              title="Clear Conversation"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="chatmessages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bubble ${m.sender === "user" ? "user" : "bot"} ${m.isCrisis ? "sos-alert" : ""}`}
            >
              {m.isCrisis && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800, marginBottom: 6, color: "var(--danger)" }}>
                  <ShieldAlert size={18} /> URGENT SAFETY NOTICE
                </div>
              )}
              {m.text}
            </div>
          ))}

          {isTyping && (
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick">
          <button onClick={() => handleSend("How can I manage period cramps safely?")}>
            🩸 Period Cramps
          </button>
          <button onClick={() => handleSend("What is PCOS and what are the symptoms?")}>
            🌸 What is PCOS?
          </button>
          <button onClick={() => handleSend("What changes happen during puberty?")}>
            🌱 Puberty Changes
          </button>
          <button onClick={() => handleSend("What iron-rich foods help prevent anemia?")}>
            🥗 Foods for Anemia
          </button>
          <button onClick={() => handleSend("Why might my period cycle be delayed?")}>
            ⏱️ Irregular Cycles
          </button>
        </div>

        <div className="chatinput">
          <input
            id="question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a general health question (e.g. cramps, PCOS, nutrition)..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button className="btn" onClick={() => handleSend()}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>

      <aside className="panel" style={{ height: "fit-content" }}>
        <h3 style={{ marginTop: 0, fontSize: 17, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={18} color="var(--brand)" /> How Sakhi AI Helps
        </h3>
        <ul className="list" style={{ fontSize: 13 }}>
          <li>Explains sensitive health topics in plain, non-judgmental language.</li>
          <li>Focuses on preventative nutrition, hygiene, and self-care habits.</li>
          <li>Clearly tells you when in-person clinical care is needed.</li>
          <li>Provides multilingual voice speech output for accessibility.</li>
        </ul>

        <div className="notice danger" style={{ marginTop: 16 }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Emergency Warning:</strong> If you experience severe bleeding, sudden intense abdominal pain, breathing trouble, or acute danger, call <strong>112</strong> immediately.
          </span>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
          *Demonstration AI prototype. No personal health records or personal identifiers are stored.
        </p>
      </aside>
    </div>
  );
}
