import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

// Placeholder pages (we'll build these next)
function Translator() {
  return (
    <div className="page-wrapper" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1>🎥 Live Translator</h1>
      <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Coming next...</p>
    </div>
  )
}

function Learn() {
  return (
    <div className="page-wrapper" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1>📚 Learn ISL</h1>
      <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Coming soon...</p>
    </div>
  )
}

function Practice() {
  return (
    <div className="page-wrapper" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1>🎮 Practice Mode</h1>
      <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Coming soon...</p>
    </div>
  )
}

function History() {
  return (
    <div className="page-wrapper" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1>📊 Translation History</h1>
      <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Coming soon...</p>
    </div>
  )
}

function About() {
  return (
    <div className="page-wrapper" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1>ℹ️ About SIGNOVA</h1>
      <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Coming soon...</p>
    </div>
  )
}

function Login() {
  return (
    <div className="page-wrapper" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h1>🔐 Login</h1>
      <p style={{ color: '#9CA3AF', marginTop: '12px' }}>Coming soon...</p>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  )
}