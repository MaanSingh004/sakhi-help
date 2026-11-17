import React, { useState, useRef, useEffect } from "react";
import { Send, Volume2, VolumeX, Trash2, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { tracker } from "../services/tracker";

export default function SakhiAIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Namaste! 🌷 I'm Dr. Sushma, your women's health information companion.\n\nYou can ask me in English, Hindi (हिन्दी), or Hinglish about periods, PCOS, vaginal health, anaemia, breast health, pregnancy basics, contraception, menopause, nutrition or emotional wellbeing.\n\nI am an educational guide and cannot diagnose diseases or prescribe medicines. Please do not share personal identifiers."
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
    const cleanText = text.replace(/[#*`_🌷🚨•]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const generateBotResponse = (query) => {
    const t = query.toLowerCase();
    const isHindi = /[\u0900-\u097f]/.test(query);

    // 1. Severe Emergency / Crisis detection
    const isUrgent = /severe pain|बहुत तेज दर्द|heavy bleeding|बहुत खून|faint|बेहोश|can't breathe|सांस नहीं|suicid|खुदकुशी|self harm|hurt myself|kill myself|danger|abuse|assault/i.test(t);
    if (isUrgent) {
      return {
        isCrisis: true,
        text: isHindi
          ? "🚨 यह आपात स्थिति हो सकती है। तुरंत नज़दीकी अस्पताल जाएँ या भारत में 112 पर कॉल करें। किसी भरोसेमंद व्यक्ति को अपने साथ रखें। मानसिक स्वास्थ्य सहायता के लिए Tele-MANAS 14416 पर कॉल करें। डॉ. सुषमा आपातकालीन सेवा नहीं है।"
          : "🚨 This may be an emergency. Seek urgent in-person medical care now or call 112 in India (or Women Helpline 181 / Tele-MANAS 14416). Ask a trusted person to stay with you. This assistant cannot provide emergency medical dispatch."
      };
    }

    // 2. Comprehensive Women's Health Topics
    const topics = [
      {
        re: /period|menstru|cramp|bleed|cycle|माहवारी|मासिक धर्म|दर्द|पीरियड/i,
        title: "Periods & Menstrual Health (माहवारी स्वास्थ्य)",
        answer: isHindi
          ? "पीरियड्स 21 से 35 दिनों के अंतराल पर आना सामान्य माना जाता है। पहले कुछ वर्षों में समय थोड़ा बदल सकता है। हल्के दर्द के लिए गुनगुने पानी की सिकाई, अजवाइन की चाय और हल्का खिंचाव (stretching) मदद करता है। यदि दर्द से दैनिक काम रुक जाए, या ब्लीडिंग 7 दिनों से अधिक हो, तो तुरंत स्त्री रोग विशेषज्ञ (Gynecologist) से सलाह लें।"
          : "A menstrual cycle is counted from day 1 of one period to day 1 of the next, typically 21 to 35 days. For mild cramps: a warm compress, chamomile or ginger tea, and gentle yoga help. If you experience disabling pain, soak through pads every 1-2 hours, or miss cycles repeatedly, consult a gynecologist for evaluation."
      },
      {
        re: /pcos|pcod|polycystic|hormone|पीसीओएस|हार्मोन/i,
        title: "PCOS & Hormonal Health (पीसीओएस)",
        answer: isHindi
          ? "PCOS एक आम हार्मोनल और मेटाबॉलिक स्थिति है जो लगभग हर 5 में से 1 महिला को प्रभावित करती है। इसके मुख्य लक्षण: अनियमित पीरियड्स, चेहरे पर अनचाहे बाल, मुंहासे और वजन बढ़ना हैं। संतुलित खान-पान (कम मीठा, उच्च फाइबर), नियमित 30 मिनट का व्यायाम और पर्याप्त नींद से इसे नियंत्रित किया जा सकता है। सटीक जांच के लिए डॉक्टर से अल्ट्रासाउंड व हार्मोन टेस्ट करवाएं।"
          : "PCOS is a common endocrine condition affecting ovulation. Key symptoms include irregular periods, persistent acne, and facial hair. It is managed holistically through low-glycemic nutrition, 30 minutes of daily exercise, and regular sleep. A clinician can assess it using pelvic ultrasound and blood hormone panels."
      },
      {
        re: /discharge|itch|itching|vaginal|योनि|खुजली|स्राव|व्हाइट डिस्चार्ज/i,
        title: "Vaginal Health & Hygiene (योनि स्वास्थ्य)",
        answer: isHindi
          ? "योनि से हल्का सफेद या पारदर्शी स्राव (discharge) सामान्य और प्राकृतिक है जो सफाई का काम करता है। लेकिन यदि स्राव से तेज दुर्गंध आए, दही जैसा गाढ़ापन हो, तेज खुजली, जलन या पेशाब में दर्द हो तो यह इन्फेक्शन (Yeast या BV) हो सकता है। केवल बाहरी हिस्से को सादे गुनगुने पानी से धोएं; सुगंधित साबुन या डौचिंग का उपयोग न करें और डॉक्टर से जांच कराएं।"
          : "Clear or milky discharge without odor is healthy and self-cleaning. However, a foul odor, cottage-cheese texture, intense itching, redness, or burning during urination may indicate an infection. Only wash externally with plain water; avoid harsh perfumed soaps or douching, and seek prescription treatment if needed."
      },
      {
        re: /pregnan|missed period|गर्भवती|प्रेग्न|गर्भ/i,
        title: "Pregnancy Basics (गर्भावस्था शिक्षा)",
        answer: isHindi
          ? "पीरियड मिस होने के कई कारण हो सकते हैं—गर्भावस्था, अत्यधिक तनाव, बीमारी या हार्मोनल असंतुलन। यदि गर्भावस्था की संभावना है, तो पीरियड मिस होने के बाद सुबह के पहले पेशाब से यूरिन प्रेग्नेंसी टेस्ट (जैसे Prega News) करें। सरकारी प्राथमिक स्वास्थ्य केंद्र (PHC) पर गोपनीय और निःशुल्क परामर्श उपलब्ध रहता है।"
          : "A missed period can result from pregnancy, stress, illness, or hormonal shifts. If pregnancy is possible, a home urine test taken after a missed period provides a clear first step. Free, confidential antenatal advice is available at government Primary Health Centres (PHCs)."
      },
      {
        re: /anaemia|anemia|iron|हीमोग्लोबिन|खून की कमी|कमजोरी|थकान/i,
        title: "Iron & Anaemia Prevention (एनीमिया और खून की कमी)",
        answer: isHindi
          ? "आयरन की कमी से थकान, चक्कर, पीलापन और सांस फूलना आम है। भारत में 50% से अधिक किशोरियों में हीमोग्लोबिन कम पाया जाता है। पालक, मेथी, गुड़, भुना चना, दालें और तिल खाएं। हमेशा आयरन युक्त भोजन पर नींबू का रस निचोड़ें (विटामिन C आयरन अवशोषण को 3 गुना बढ़ाता है)। खाने के तुरंत बाद गाढ़ी चाय या कॉफी से बचें।"
          : "Iron-deficiency anaemia causes fatigue, weakness, and dizziness. Boost iron with spinach, methi, jaggery (gud), lentils, and roasted chana. Always pair iron foods with Vitamin C (lemon juice, amla, oranges) for maximum absorption, and avoid drinking strong tea or coffee directly after meals."
      },
      {
        re: /breast|lump|स्तन|गांठ|दर्द/i,
        title: "Breast Health (स्तन स्वास्थ्य जागरूकता)",
        answer: isHindi
          ? "माहवारी के दिनों में स्तनों में हल्का भारीपन या संवेदनशीलता होना पूरी तरह सामान्य है। लेकिन यदि आपको कोई नई सख्त गांठ, निप्पल से असामान्य स्राव, त्वचा में गड्ढा या लगातार एक तरफ दर्द महसूस हो, तो बिना किसी झिझक के महिला डॉक्टर से जांच कराएं। अधिकतर गांठें सामान्य (benign) होती हैं, फिर भी डॉक्टरी जांच जरूरी है।"
          : "Breast tenderness and texture naturally change during menstrual cycles. However, any new firm lump, skin dimpling, bloody discharge, or persistent localized pain should be examined by a clinician. Most breast changes are benign, but a clinical exam provides definitive peace of mind."
      },
      {
        re: /contracept|birth control|गर्भनिरोध|condom/i,
        title: "Contraception Education (गर्भनिरोधक विकल्प)",
        answer: isHindi
          ? "कंडोम, गर्भनिरोधक गोलियां, आईयूडी (कॉपर-टी) और इंजेक्शन जैसे विकल्प उपलब्ध हैं। कंडोम अनचाहे गर्भ के साथ-साथ यौन संचारित संक्रमणों (STIs) से भी सुरक्षा प्रदान करता है। आपके स्वास्थ्य इतिहास के अनुसार कौन सा तरीका सुरक्षित है, यह डॉक्टर या एएनएम दीदी से समझें।"
          : "Modern family planning options include condoms, oral pills, IUDs (Copper-T), and injectables. Condoms uniquely protect against both unintended pregnancy and STIs. A qualified clinician or public health counselor can help determine the safest option for your body."
      },
      {
        re: /stress|anxiety|depress|sad|तनाव|चिंता|sleep|नींद|डिप्रेशन/i,
        title: "Emotional Wellbeing (मानसिक एवं भावनात्मक स्वास्थ्य)",
        answer: isHindi
          ? "तनाव, चिंता या मूड में बदलाव आपके पीरियड्स और नींद को सीधे प्रभावित करते हैं। किसी भरोसेमंद सहेली या परिवारजन से बात करना, 7–8 घंटे की नींद और नियमित हल्की सैर राहत देती है। यदि मन बहुत भारी लगे तो सरकारी मानसिक स्वास्थ्य हेल्पलाइन Tele-MANAS (14416) पर 24 घंटे निःशुल्क और गोपनीय बात कर सकती हैं।"
          : "Stress and emotional fatigue directly disrupt hormones, sleep, and cycles. Talking to a safe friend, regular 7-8 hours of sleep, and gentle walking provide natural relief. If stress feels overwhelming, the Tele-MANAS mental health helpline (14416) is available 24/7 free and confidential across India."
      },
      {
        re: /pubert|body change|growth|bodily/i,
        title: "Puberty & Growing Up (किशोरावस्था बदलाव)",
        answer: isHindi
          ? "प्यूबर्टी 9 से 15 वर्ष की आयु के बीच शुरू होती है। इसमें लंबाई बढ़ना, स्तनों का विकास, शारीरिक बाल और सफेद स्राव आना पूरी तरह स्वाभाविक है। हर शरीर की अपनी गति होती है, किसी से तुलना न करें।"
          : "Puberty occurs between ages 9 and 15. Physical developments including growth spurts, budding breasts, and body hair are completely natural as estrogen rises. Every girl matures on her own healthy timeline."
      },
      {
        re: /nutrition|diet|food|weight|वजन|आहार|खाना/i,
        title: "Nutrition & Balanced Diet (पोषण और आहार)",
        answer: isHindi
          ? "संतुलित आहार में हरी सब्जियां, दालें, साबुत अनाज (बाजरा, ज्वार), दूध/दही और पर्याप्त पानी शामिल होना चाहिए। वजन कम करने के लिए भोजन छोड़ना (crash diet) हार्मोन्स को नुकसान पहुंचाता है।"
          : "A balanced dietary pattern emphasizes lentils, whole grains, seasonal greens, dairy, and 2+ liters of water. Avoid extreme crash diets which disrupt thyroid and reproductive hormones."
      }
    ];

    for (const item of topics) {
      if (item.re.test(t)) {
        return {
          isCrisis: false,
          text: `🌷 **${item.title}**\n\n${item.answer}\n\n*Note: This is educational information, not a medical prescription. Consult a qualified doctor for persistent symptoms.*`
        };
      }
    }

    // Default friendly educational response
    return {
      isCrisis: false,
      text: isHindi
        ? "नमस्ते! 🌷 मैं आपकी बात समझ रही हूँ। आप मुझसे पीरियड्स (माहवारी), पीसीओएस (PCOS), योनि स्वास्थ्य (स्राव/खुजली), एनीमिया (खून की कमी), स्तन स्वास्थ्य, किशोरावस्था के बदलाव, या पोषण के बारे में कोई भी सवाल पूछ सकती हैं। आप क्या जानना चाहती हैं?"
        : "Namaste! 🌷 I am Dr. Sushma, your educational health companion. You can ask me specific questions about periods, menstrual cramps, PCOS, vaginal hygiene, iron deficiency/anaemia, puberty, contraception, or mental wellbeing. What topic would you like to explore?"
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
      tracker.logAIQuestion(query.substring(0, 50), response.isCrisis);
    }, 500);
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Namaste! 🌷 Conversation cleared. What health question can I help you with today?"
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
              <b style={{ fontSize: 16 }}>Dr. Sushma · AI Health Companion</b>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Women's Health Guide · Hindi / English / Hinglish
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

        <div className="notice info" style={{ margin: "10px 0 0", fontSize: 12 }}>
          🔒 <b>Private demo:</b> Do not enter names, phone numbers, addresses, or photos. Dr. Sushma is not an emergency dispatch service.
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
          <button onClick={() => handleSend("Why can periods be irregular?")}>
            🩸 Irregular periods
          </button>
          <button onClick={() => handleSend("What is PCOS and how is it assessed?")}>
            🌸 PCOS guidance
          </button>
          <button onClick={() => handleSend("What can cause unusual vaginal discharge?")}>
            🧬 Vaginal health
          </button>
          <button onClick={() => handleSend("What are signs of iron deficiency anaemia?")}>
            🥗 Anaemia & iron
          </button>
          <button onClick={() => handleSend("What changes happen during puberty?")}>
            🌱 Puberty changes
          </button>
          <button onClick={() => handleSend("मुझे बहुत तनाव और चिंता हो रही है")}>
            🧠 तनाव व चिंता (Hindi)
          </button>
        </div>

        <div className="chatinput">
          <input
            id="question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a health question in English or हिंदी (e.g. cramps, PCOS, anemia)..."
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
          <Sparkles size={18} color="var(--brand)" /> How Dr. Sushma Helps
        </h3>
        <ul className="list" style={{ fontSize: 13 }}>
          <li>Explains sensitive health topics in simple Hindi, English and Hinglish.</li>
          <li>Encourages preventative nutrition, iron intake, and healthy habits.</li>
          <li>Identifies red flags when you need an in-person doctor visit.</li>
          <li>Respectful, non-judgmental, age-aware guidance without storing personal details.</li>
        </ul>

        <div className="notice danger" style={{ marginTop: 16 }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Emergency Warning:</strong> For severe pain, heavy bleeding, fainting, breathing trouble, or immediate danger, call <strong>112</strong> immediately.
          </span>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
          *Educational health companion prototype. Does not replace clinical diagnosis, ultrasound, or prescriptions.
        </p>
      </aside>
    </div>
  );
}
