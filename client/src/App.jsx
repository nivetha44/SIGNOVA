import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'
import OfflineBadge from './components/OfflineBadge'

import Dashboard from './pages/Dashboard'
import Translator from './pages/Translator'
import Learn from './pages/Learn'
import Practice from './pages/Practice'
import SentenceBuilder from './pages/SentenceBuilder'
import TextToSign from './pages/TextToSign'
import History from './pages/History'
import Favourites from './pages/Favourites'
import Progress from './pages/Progress'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import About from './pages/About'
import Login from './pages/Login'

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <OfflineBadge />
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/sentence-builder" element={<SentenceBuilder />} />
              <Route path="/text-to-sign" element={<TextToSign />} />
              <Route path="/history" element={<History />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            <MobileNav />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}