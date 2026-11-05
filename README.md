# 🌷 Sakhi — Women's & Girls' Support Platform

> A safe, non-judgmental space for health guidance, career exploration, government scholarships, and women's wellbeing.

---

## 🌟 Key Features

- **🩺 Sakhi AI Health Companion:** Confidential health information companion with real-time interactive answers, crisis/SOS detection, quick chips, and Web Speech voice read-aloud.
- **🌸 Interactive Health Hub & Cycle Planner:** Period and fertile window estimator with phase-specific nutrition and self-care recommendations.
- **🏅 Government Scholarships & Scooty Schemes Directory:** Central & Rajasthan state schemes (Devnarayan Scooty, Kalibai Scooty, CM B.Ed Sambal, Anuprati Coaching, etc.) with filter pills, search, and an interactive eligibility checklist.
- **🎓 Career Pathways by Age:** Interactive roadmap spanning 6–10, 11–14, 15–18, 18–21, 21–25, and 25+ years with career families and links to the National Career Service.
- **👭 Safe Peer Community:** Moderated forum prototype with categories, like counts, and anonymous posting.
- **🚨 Quick Safe Exit (Panic Button):** One-tap button in the header that immediately disguises the screen with a science study sheet for privacy.
- **💬 Feedback Collection & CSV Export:** Star ratings and suggestions with one-click CSV file export for survey reporting.
- **🌐 Language Switcher:** Instant English / हिन्दी toggle.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Icons:** Lucide React
- **Animations / Effects:** Canvas Confetti & CSS3 Transitions
- **Design System:** Custom pastel UI with full mobile-first responsive bottom navigation

---

## 🚀 How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📤 Step-by-Step: Push to GitHub

1. Open your terminal in this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sakhi Women Support Platform React Prototype"
   git branch -M main
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. named `sakhi-help`).

3. Link your local repo and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sakhi-help.git
   git push -u origin main
   ```

---

## 🌐 How to Deploy (Free Hosting Options)

### Option 1: Deploy on Vercel (Recommended — Takes 1 minute)
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **"Add New Project"** and import your `sakhi-help` repository.
3. Vercel will automatically detect **Vite**. Leave default settings and click **"Deploy"**.
4. You get an instant live HTTPS link (e.g., `https://sakhi-help.vercel.app`).

---

### Option 2: Deploy on Netlify
1. Go to [Netlify](https://www.netlify.com/) and sign in.
2. Click **"Add new site"** -> **"Import an existing project"** -> **GitHub**.
3. Select `sakhi-help`.
4. Build command: `npm run build`, Publish directory: `dist`.
5. Click **"Deploy Sakhi"**.

---

### Option 3: Deploy on GitHub Pages
This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Push your code to GitHub.
2. Go to your GitHub repository **Settings** -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish your site!
