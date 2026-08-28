import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Volume2,
  Trash2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  Info,
} from 'lucide-react'
import CameraComponent from '../components/Camera'
import ConfidenceBar from '../components/ConfidenceBar'

export default function Translator() {
  const [currentGesture, setCurrentGesture] = useState(null)
  const [sentence, setSentence] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [detectionCount, setDetectionCount] = useState(0)

  // Stability buffer for duplicate filtering
  const stabilityRef = useRef({
    lastSign: null,
    count: 0,
    threshold: 8, // Must detect same sign 8 times before adding
  })

  // ── Handle gesture from camera ──
  const handleGestureDetected = useCallback((gesture) => {
    if (!gesture || !gesture.sign) return

    setCurrentGesture(gesture)
    setDetectionCount((c) => c + 1)

    const stability = stabilityRef.current

    if (gesture.sign === stability.lastSign) {
      stability.count++

      // Add to sentence only after stable detection
      if (stability.count === stability.threshold) {
        setSentence((prev) => {
          // Don't add if last word in sentence is the same
          if (prev.length > 0 && prev[prev.length - 1] === gesture.sign) {
            return prev
          }
          return [...prev, gesture.sign]
        })
        stability.count = 0 // Reset after adding
      }
    } else {
      stability.lastSign = gesture.sign
      stability.count = 1
    }
  }, [])

  // ── Build sentence string ──
  const sentenceText = sentence.join(' ')

  // ── Text to Speech ──
  const speakSentence = () => {
    if (!sentenceText || isSpeaking) return

    const utterance = new SpeechSynthesisUtterance(sentenceText)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.lang = 'en-IN'

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  // ── Copy to clipboard ──
  const copySentence = async () => {
    if (!sentenceText) return
    await navigator.clipboard.writeText(sentenceText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Clear sentence ──
  const clearSentence = () => {
    setSentence([])
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  // ── Remove last word ──
  const removeLastWord = () => {
    setSentence((prev) => prev.slice(0, -1))
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={styles.page}>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <div>
            <h1 style={styles.title}>
              <Camera size={28} color="#6C63FF" />
              Live <span className="gradient-text">Translator</span>
            </h1>
            <p style={styles.subtitle}>
              Show ISL signs to your camera. AI will recognize and translate them in real-time.
            </p>
          </div>
          <div style={styles.headerBadge}>
            <Sparkles size={14} />
            {detectionCount} detections
          </div>
        </motion.div>

        {/* Main Grid */}
        <div style={styles.grid}>

          {/* Left: Camera */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={styles.cameraSection}
          >
            <CameraComponent onGestureDetected={handleGestureDetected} />

            {/* Current Detection Card */}
            <AnimatePresence>
              {currentGesture && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card"
                  style={styles.detectionCard}
                >
                  <div style={styles.detectionHeader}>
                    <span style={styles.detectionLabel}>
                      Current Detection
                    </span>
                    <button
                      onClick={() => {
                        setSentence((prev) => [...prev, currentGesture.sign])
                        stabilityRef.current.count = 0
                      }}
                      style={styles.addBtn}
                    >
                      <Plus size={14} />
                      Add to Sentence
                    </button>
                  </div>

                  <div style={styles.detectionResult}>
                    <span style={styles.detectionSign}>
                      {currentGesture.sign}
                    </span>
                  </div>

                  <ConfidenceBar
                    confidence={currentGesture.confidence}
                    label="Confidence"
                  />

                  <p style={styles.detectionNote}>
                    <Info size={12} />
                    Hold sign steady for auto-detection
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Sentence Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={styles.sentenceSection}
          >

            {/* Sentence Output */}
            <div className="glass-card" style={styles.sentenceCard}>
              <div style={styles.sentenceHeader}>
                <h3 style={styles.sentenceTitle}>
                  <ArrowRight size={18} color="#6C63FF" />
                  Translation Output
                </h3>
                {sentence.length > 0 && (
                  <span style={styles.wordCount}>
                    {sentence.length} words
                  </span>
                )}
              </div>

              <div style={styles.sentenceOutput}>
                {sentence.length === 0 ? (
                  <div style={styles.emptyState}>
                    <Clock size={32} color="rgba(108,99,255,0.3)" />
                    <p style={styles.emptyText}>
                      Waiting for signs...
                    </p>
                    <p style={styles.emptySubtext}>
                      Start your camera and show ISL gestures
                    </p>
                  </div>
                ) : (
                  <motion.p
                    key={sentenceText}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    style={styles.sentenceText}
                  >
                    {sentence.map((word, i) => (
                      <motion.span
                        key={`${word}-${i}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={styles.word}
                      >
                        {word}
                        {i < sentence.length - 1 ? ' ' : ''}
                      </motion.span>
                    ))}
                    <span style={styles.cursor}>|</span>
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.actions}>
                <button
                  onClick={speakSentence}
                  disabled={!sentenceText || isSpeaking}
                  style={{
                    ...styles.actionBtn,
                    ...styles.speakBtn,
                    opacity: !sentenceText ? 0.4 : 1,
                  }}
                >
                  <Volume2 size={16} />
                  {isSpeaking ? 'Speaking...' : 'Speak'}
                </button>

                <button
                  onClick={copySentence}
                  disabled={!sentenceText}
                  style={{
                    ...styles.actionBtn,
                    opacity: !sentenceText ? 0.4 : 1,
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                <button
                  onClick={removeLastWord}
                  disabled={sentence.length === 0}
                  style={{
                    ...styles.actionBtn,
                    opacity: sentence.length === 0 ? 0.4 : 1,
                  }}
                >
                  Undo
                </button>

                <button
                  onClick={clearSentence}
                  disabled={sentence.length === 0}
                  style={{
                    ...styles.actionBtn,
                    ...styles.clearBtn,
                    opacity: sentence.length === 0 ? 0.4 : 1,
                  }}
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="glass-card" style={styles.referenceCard}>
              <h4 style={styles.referenceTitle}>
                Supported Signs
              </h4>
              <div style={styles.referenceGrid}>
                {[
                  'HELLO', 'THANK YOU', 'YES', 'NO', 'PLEASE',
                  'SORRY', 'HELP', 'GOOD', 'BAD', 'LOVE',
                  'WATER', 'FOOD', 'WELCOME', 'I', 'YOU',
                ].map((sign) => (
                  <span
                    key={sign}
                    style={{
                      ...styles.referenceChip,
                      ...(currentGesture?.sign === sign
                        ? styles.referenceChipActive
                        : {}),
                    }}
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>

            {/* Privacy Notice */}
            <div style={styles.privacyNotice}>
              <Info size={14} />
              <span>
                Your camera feed is processed locally.
                No video is recorded or stored.
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    padding: '100px 24px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.8rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#9CA3AF',
    maxWidth: '500px',
  },
  headerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(108, 99, 255, 0.1)',
    border: '1px solid rgba(108, 99, 255, 0.2)',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#6C63FF',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  cameraSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detectionCard: {
    padding: '20px',
  },
  detectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  detectionLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: 'rgba(108, 99, 255, 0.1)',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    borderRadius: '9999px',
    color: '#6C63FF',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  detectionResult: {
    marginBottom: '12px',
  },
  detectionSign: {
    fontSize: '2rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  detectionNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  sentenceSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sentenceCard: {
    padding: '24px',
  },
  sentenceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sentenceTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
    fontWeight: 700,
  },
  wordCount: {
    fontSize: '0.75rem',
    color: '#6B7280',
    fontWeight: 500,
  },
  sentenceOutput: {
    minHeight: '120px',
    padding: '20px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '16px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '8px',
    padding: '20px 0',
  },
  emptyText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: '0.8rem',
    color: '#4B5563',
  },
  sentenceText: {
    fontSize: '1.3rem',
    fontWeight: 600,
    lineHeight: 1.8,
    color: '#fff',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  word: {
    display: 'inline',
  },
  cursor: {
    color: '#6C63FF',
    animation: 'blink 1s step-end infinite',
    fontWeight: 300,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#9CA3AF',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  speakBtn: {
    background: 'rgba(108, 99, 255, 0.1)',
    borderColor: 'rgba(108, 99, 255, 0.3)',
    color: '#6C63FF',
  },
  clearBtn: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
  },
  referenceCard: {
    padding: '20px',
  },
  referenceTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#9CA3AF',
  },
  referenceGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  referenceChip: {
    padding: '4px 10px',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#6B7280',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '6px',
    transition: 'all 0.3s',
  },
  referenceChipActive: {
    color: '#fff',
    background: 'rgba(108, 99, 255, 0.2)',
    borderColor: 'rgba(108, 99, 255, 0.5)',
  },
  privacyNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(34, 197, 94, 0.05)',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    borderRadius: '10px',
    fontSize: '0.75rem',
    color: '#22C55E',
    fontWeight: 500,
  },
}

// Responsive
const responsiveStyle = document.createElement('style')
responsiveStyle.textContent = `
  @media (max-width: 900px) {
    .container > div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }
  }
`
if (!document.getElementById('translator-responsive')) {
  responsiveStyle.id = 'translator-responsive'
  document.head.appendChild(responsiveStyle)
}