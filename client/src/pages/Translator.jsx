import { useState, useRef, useCallback } from 'react'
import {
  Volume2,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  Sparkles,
  Bookmark,
  Check,
  Hand,
  Layers,
} from 'lucide-react'
import Camera from '../components/Camera'
import { smoothGrammar, formatRawSequence } from '../services/grammar'
import { saveLocalTranslation } from '../services/localStore'
import { createTranslation } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Translator() {
  const { language, t } = useLanguage()
  const { isAuthenticated } = useAuth()

  // Translation sequence buffer
  const [tokens, setTokens] = useState([])
  const [historyStack, setHistoryStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [currentGesture, setCurrentGesture] = useState(null)
  const [useGrammarSmoothing, setUseGrammarSmoothing] = useState(true)

  // Status feedback
  const [isCopied, setIsCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Gesture debouncer ref (avoids duplicate frame pushes)
  const lastDetectedSignRef = useRef(null)
  const lastDetectTimeRef = useRef(0)

  // ── Handle incoming gesture from Camera ──
  const handleGestureDetected = useCallback((detected) => {
    setCurrentGesture(detected)
    const now = Date.now()

    // Debounce: must be high confidence and at least 1.4s since same sign
    if (detected.confidence >= 0.75) {
      if (
        lastDetectedSignRef.current !== detected.sign ||
        now - lastDetectTimeRef.current > 1600
      ) {
        lastDetectedSignRef.current = detected.sign
        lastDetectTimeRef.current = now

        setTokens((prev) => {
          setHistoryStack((h) => [...h, prev])
          setRedoStack([])
          return [...prev, detected.sign]
        })
      }
    }
  }, [])

  // ── Undo Action ──
  const handleUndo = () => {
    if (tokens.length === 0) return
    const lastState = historyStack[historyStack.length - 1] || []
    setRedoStack((r) => [...r, tokens])
    setTokens(lastState)
    setHistoryStack((h) => h.slice(0, -1))
  }

  // ── Redo Action ──
  const handleRedo = () => {
    if (redoStack.length === 0) return
    const nextState = redoStack[redoStack.length - 1]
    setHistoryStack((h) => [...h, tokens])
    setTokens(nextState)
    setRedoStack((r) => r.slice(0, -1))
  }

  // ── Clear Sequence ──
  const handleClear = () => {
    if (tokens.length === 0) return
    setHistoryStack((h) => [...h, tokens])
    setTokens([])
    setRedoStack([])
  }

  // ── Derived Outputs ──
  const rawTranslation = formatRawSequence(tokens)
  const smoothedTranslation = smoothGrammar(tokens, language)
  const activeTranslation = useGrammarSmoothing ? smoothedTranslation : rawTranslation

  // ── Text-to-Speech ──
  const handleSpeak = () => {
    if (!activeTranslation || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(activeTranslation)
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.95

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  // ── Copy Output ──
  const handleCopy = async () => {
    if (!activeTranslation) return
    try {
      await navigator.clipboard.writeText(activeTranslation)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  // ── Save Translation ──
  const handleSave = async () => {
    if (!activeTranslation) return

    const record = {
      rawText: rawTranslation,
      smoothedText: smoothedTranslation,
      tokens,
      language,
      confidence: currentGesture ? currentGesture.confidence : 0.85,
    }

    // Save locally
    saveLocalTranslation(record)

    // Save to API if authenticated
    if (isAuthenticated) {
      try {
        await createTranslation({
          detectedText: activeTranslation,
          translatedText: activeTranslation,
          confidenceScore: record.confidence,
          language,
        })
      } catch (err) {
        console.warn('Could not sync translation to cloud database:', err.message)
      }
    }

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2200)
  }

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_translator', 'REAL-TIME TRANSLATION STUDIO')}</p>
          <h1 style={styles.title}>{t('trans_title', 'Live ISL Translation')}</h1>
          <p style={styles.subtitle}>
            {t(
              'trans_subtitle',
              'Perform Indian Sign Language gestures in front of the camera for instant text and voice translation.'
            )}
          </p>
        </div>

        {/* Split Studio Grid */}
        <div style={styles.layout}>
          {/* Left: Camera Feed */}
          <div style={styles.cameraCol}>
            <Camera onGestureDetected={handleGestureDetected} />
          </div>

          {/* Right: Studio Translation Panel */}
          <div style={styles.panelCol}>
            <div className="glass-card" style={styles.panelCard}>
              {/* Header with Live Status */}
              <div style={styles.panelTop}>
                <div style={styles.panelHeading}>
                  <Hand size={18} color="var(--pink-soft)" />
                  <h3 style={styles.panelTitle}>{t('trans_live_sequence', 'Sign Sequence Buffer')}</h3>
                </div>

                <div style={styles.tokenCountBadge}>
                  {tokens.length} {tokens.length === 1 ? 'sign' : 'signs'}
                </div>
              </div>

              {/* Tokens Chip Buffer */}
              <div style={styles.tokensArea}>
                {tokens.length === 0 ? (
                  <div style={styles.emptyTokens}>
                    <Layers size={28} color="var(--pink-soft)" style={{ opacity: 0.6 }} />
                    <p>{t('trans_no_tokens', 'Perform signs in front of the camera to assemble your message.')}</p>
                  </div>
                ) : (
                  <div style={styles.tokenChipsWrap}>
                    {tokens.map((tok, idx) => (
                      <span key={idx} style={styles.tokenChip}>
                        {tok}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Buffer Controls: Undo, Redo, Clear */}
              <div style={styles.bufferControls}>
                <button
                  onClick={handleUndo}
                  disabled={tokens.length === 0}
                  className="btn-secondary"
                  style={styles.actionBtn}
                  title="Undo last sign"
                >
                  <Undo2 size={15} />
                  {t('trans_undo', 'Undo')}
                </button>

                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="btn-secondary"
                  style={styles.actionBtn}
                  title="Redo sign"
                >
                  <Redo2 size={15} />
                  {t('trans_redo', 'Redo')}
                </button>

                <button
                  onClick={handleClear}
                  disabled={tokens.length === 0}
                  className="btn-secondary"
                  style={{ ...styles.actionBtn, color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' }}
                  title="Clear all"
                >
                  <Trash2 size={15} />
                  {t('trans_clear', 'Clear')}
                </button>
              </div>

              {/* Grammar Smoothing Toggle */}
              <div style={styles.grammarToggleRow}>
                <label style={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={useGrammarSmoothing}
                    onChange={(e) => setUseGrammarSmoothing(e.target.checked)}
                    style={{ cursor: 'pointer', accentColor: 'var(--pink-primary)' }}
                  />
                  <Sparkles size={15} color="var(--pink-soft)" />
                  <span>{t('trans_smooth_grammar', 'AI Grammar Smoothing (Natural Sentence)')}</span>
                </label>
              </div>

              {/* Translation Output Displays */}
              <div style={styles.outputBox}>
                <span className="panel-label">
                  {useGrammarSmoothing ? t('trans_improved', 'Translated Sentence') : t('trans_raw', 'Raw ISL Stream')}
                </span>

                <div style={styles.outputContent}>
                  {activeTranslation ? (
                    <p style={styles.outputText}>{activeTranslation}</p>
                  ) : (
                    <p style={styles.outputPlaceholder}>
                      {t('trans_awaiting', 'Awaiting signs for translation...')}
                    </p>
                  )}
                </div>

                {useGrammarSmoothing && rawTranslation && (
                  <div style={styles.rawSubtitle}>
                    <small>Raw Tokens: {rawTranslation}</small>
                  </div>
                )}
              </div>

              {/* Output Actions: Speak, Copy, Save */}
              <div style={styles.footerActions}>
                <button
                  onClick={handleSpeak}
                  disabled={!activeTranslation || isSpeaking}
                  className="btn-secondary"
                  style={styles.footerBtn}
                >
                  <Volume2 size={16} color="var(--pink-soft)" />
                  {isSpeaking ? t('common_speaking', 'Speaking...') : t('trans_speak', 'Speak Text')}
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!activeTranslation}
                  className="btn-secondary"
                  style={styles.footerBtn}
                >
                  {isCopied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                  {isCopied ? t('common_copied', 'Copied!') : t('common_copy', 'Copy')}
                </button>

                <button
                  onClick={handleSave}
                  disabled={!activeTranslation}
                  className="btn-primary"
                  style={styles.footerBtn}
                >
                  {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                  {isSaved ? t('common_saved', 'Saved!') : t('trans_save_history', 'Save Translation')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 900,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    maxWidth: '650px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.05fr',
    gap: '24px',
    alignItems: 'start',
  },
  cameraCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  panelCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  panelCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
  },
  panelTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  panelTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  tokenCountBadge: {
    padding: '3px 10px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.12)',
    border: '1px solid var(--pink-border)',
    color: 'var(--pink-soft)',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  tokensArea: {
    minHeight: '90px',
    padding: '14px',
    background: 'rgba(5, 5, 5, 0.6)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  emptyTokens: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '0.84rem',
    padding: '10px',
  },
  tokenChipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    width: '100%',
  },
  tokenChip: {
    padding: '6px 14px',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)',
    border: '1px solid rgba(255, 46, 147, 0.45)',
    color: '#FFFFFF',
    fontSize: '0.84rem',
    fontWeight: 700,
    boxShadow: '0 0 12px rgba(255, 46, 147, 0.15)',
  },
  bufferControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '8px 14px',
    fontSize: '0.8rem',
    gap: '6px',
  },
  grammarToggleRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'rgba(255, 46, 147, 0.06)',
    border: '1px solid rgba(255, 46, 147, 0.2)',
    borderRadius: '12px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    width: '100%',
  },
  outputBox: {
    padding: '18px',
    background: 'rgba(5, 5, 5, 0.7)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  outputContent: {
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  outputText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1.4,
  },
  outputPlaceholder: {
    fontSize: '0.86rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  rawSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.74rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '6px',
  },
  footerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  footerBtn: {
    flex: 1,
    padding: '11px 16px',
    fontSize: '0.84rem',
    minWidth: '120px',
  },
}