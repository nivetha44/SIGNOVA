# 🤟 SIGNOVA — AI-Powered Indian Sign Language Platform

> **Real-time Indian Sign Language (ISL) recognition, bidirectional translation, interactive learning, and practice games.**

---

## 🌟 Overview

**SIGNOVA** is a modern, accessible platform designed to bridge communication gaps for the deaf and hard-of-hearing communities using on-device artificial intelligence. The application runs entirely in the web browser with **zero software installations** and **no persistent video recording**.

---

## ✨ Features

### 1. 🤟 Live Sign Translation (`/translator`)
- **Real-Time Camera AI**: Uses Google MediaPipe Tasks Vision to detect 21 3D hand keypoints per hand at up to 60 FPS.
- **ISL Gesture Classifier**: Accurately recognizes model-supported ISL signs (`HELLO`, `THANK YOU`, `YES`, `NO`, `PLEASE`, `SORRY`, `HELP`, `GOOD`, `LOVE`, `WATER`, `FOOD`, `WELCOME`, `YOU`, `I`).
- **Temporal Frame Smoothing**: Debounces gesture detection to eliminate duplicate frame jitter.
- **Dual Translation Mode**: Displays both raw token sequences and natural grammar-smoothed sentences.
- **Multilingual Text-to-Speech**: Speaks translations aloud in English, Tamil, and Hindi.
- **Undo / Redo / Clear / Copy / Save**: Complete controls over the recognized message.

### 2. 📚 Visual Sign Library & Lessons (`/learn`)
- **Categorized Catalog**: Alphabet, Numbers, Greetings, Basics, Family, Food, Emotions, Emergency, Verbs, and Nouns.
- **Step-by-Step Guides**: Clear instructions and pro tips in English, Tamil, and Hindi.
- **Visual Illustrations**: Clean animated emojis and visual guides for every sign.
- **Deep Practice Links**: One-click jump to practice mode for any specific sign.
- **Bookmark & Favourites**: Save frequently referenced signs for offline access.

### 3. 🎮 Practice Arena & Game Modes (`/practice`)
- **Single Sign Practice**: Camera evaluation with live confidence matching and accuracy scoring.
- **60s Timed Challenge**: Rapid-fire sign challenge against the countdown clock.
- **Sign Recognition Quiz**: Multiple-choice visual quiz matching signs with meanings.
- **Daily Challenge**: 3 curated daily signs rewarding +150 bonus XP.
- **Scoring & Streak Multipliers**: Earn XP, build consecutive day streaks, and climb levels.

### 4. ✍️ Interactive Sentence Builder (`/sentence-builder`)
- **Token Canvas**: Add, remove, and reorder sign tokens with intuitive move buttons.
- **Grammar Smoothing Engine**: Converts ISL grammatical structure into natural language in English, Tamil, and Hindi.
- **One-Click Actions**: Speak, Copy, and Save translations.

### 5. 🔄 Text → Sign Reverse Translation (`/text-to-sign`)
- **Bidirectional Conversion**: Translates written sentences into animated visual sign sequences.
- **Timeline Player**: Auto-Play, Pause, Step Next, and Step Previous controls.
- **Honest Feedback**: Clearly marks words without available visual signs so incorrect gestures are never substituted.

### 6. 🌐 Multilingual Accessibility (i18n)
- **Languages Supported**:
  - 🇬🇧 English (`en`)
  - 🇮🇳 தமிழ் / Tamil (`ta`)
  - 🇮🇳 हिन्दी / Hindi (`hi`)
- **Global Language Selector**: Switches UI strings, lessons, audio speech synthesis, and grammar translations instantly.

### 7. ♿ Accessibility & Theming
- **Appearance Themes**: Dark Mode, Light Mode, and System Default.
- **Text Scaling**: Normal (100%), Large (115%), and Extra Large (130%).
- **Mobile First**: Thumb-friendly bottom navigation bar, large camera viewport, and touch targets.

### 8. 🔒 Privacy by Design
- **Zero Video Recording**: Camera frames are processed strictly in GPU memory in real-time. Video footage is never recorded, saved, or uploaded to any server.
- **Translation History**: Stores only recognized text; history can be disabled or cleared at any time.

### 9. 📶 Offline-First Architecture
- Core recognition, lessons, practice games, sentence building, and local history operate smoothly without internet connectivity.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Styling & UI** | Pure CSS Variables + Glassmorphism + Responsive Design |
| **Icons & Animation** | Lucide React + Framer Motion |
| **Computer Vision / AI** | MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) |
| **Backend Server** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose (Resilient offline fallback) |
| **Authentication** | JWT + bcryptjs |
| **Routing** | React Router v7 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Web browser with webcam access (Chrome, Edge, Firefox, Safari)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nivetha44/SIGNOVA.git
   cd SIGNOVA
   ```

2. **Install dependencies**:
   ```bash
   npm --prefix client install
   npm --prefix server install
   ```

---

## 💻 Running the Application

### Option A: Development Mode (Hot Reloading)

Run backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend API (Port 5000)
npm run server

# Terminal 2 — Frontend Client (Port 5173)
npm run client
```

Open `http://localhost:5173` in your browser.

---

### Option B: Unified Production Server (Single Port)

Build the client and serve both frontend and API on a single port (`http://localhost:5000`):

```bash
# 1. Build the frontend
npm run build

# 2. Start the unified server
npm start
```

Open `http://localhost:5000` in your browser.

---

## 🗄️ Database Configuration

By default, the platform runs in **Offline Guest Mode** without requiring a database. To enable persistent cloud accounts and multi-device sync:

1. Open `server/.env`
2. Configure your MongoDB connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/signova
   # Or MongoDB Atlas:
   # MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/signova
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=30d
   ```

---

## 🧪 Testing

```bash
# Lint frontend code
npm --prefix client run lint

# Build client production bundle
npm run build
```

---

## 📄 License

MIT License &copy; SIGNOVA Team.
