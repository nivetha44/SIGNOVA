import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Copy,
  Check,
  Hand,
  Sparkles,
  Layers,
} from 'lucide-react'
import { SIGNS } from '../data/signs'
import AnimatedHandSign from '../components/AnimatedHandSign'
import { useLanguage } from '../context/LanguageContext'

export default function TextToSign() {
  const { language, t } = useLanguage()

  const [text, setText] = useState('Good morning, how are you?')
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const playIntervalRef = useRef(null)

  // ── Parse input into tokens matching ISL dataset ──
  const tokens = useMemo(() => {
    if (!text.trim()) {
      return []
    }

    // Clean punctuation and split into words
    const words = text
      .toUpperCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(Boolean)

    const parsed = []
    let i = 0

    while (i < words.length) {
      // Check 2-word combinations first (e.g. THANK YOU, GOOD MORNING)
      if (i + 1 < words.length) {
        const double = `${words[i]} ${words[i + 1]}`
        const signDouble = SIGNS.find((s) => s.name === double)
        if (signDouble) {
          parsed.push({ word: double, sign: signDouble, isSupported: true })
          i += 2
          continue
        }
      }

      // Check single word
      const single = words[i]
      const signSingle = SIGNS.find((s) => s.name === single)
      parsed.push({
        word: single,
        sign: signSingle || null,
        isSupported: !!signSingle,
      })
      i += 1
    }

    return parsed
  }, [text])

  // ── Auto-Play Step Sequence ──
  useEffect(() => {
    if (isPlaying && tokens.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= tokens.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1500)
    } else {
      clearInterval(playIntervalRef.current)
    }

    return () => clearInterval(playIntervalRef.current)
  }, [isPlaying, tokens.length])

  // ── Play Controls ──
  const togglePlay = () => {
    if (tokens.length === 0) return
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (tokens.length === 0) return
    setIsPlaying(false)
    setActiveStep((prev) => (prev < tokens.length - 1 ? prev + 1 : 0))
  }

  const handlePrev = () => {
    if (tokens.length === 0) return
    setIsPlaying(false)
    setActiveStep((prev) => (prev > 0 ? prev - 1 : tokens.length - 1))
  }

  const handleReset = () => {
    setIsPlaying(false)
    setActiveStep(0)
  }

  const handleCopySequence = async () => {
    if (tokens.length === 0) return
    const sequenceStr = tokens.map((t) => t.word).join(' → ')
    try {
      await navigator.clipboard.writeText(sequenceStr)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const samplePhrases = [
    'Good morning, how are you?',
    'Thank you for your help',
    'I want food and water',
    'Hello, nice to meet you',
    'Please help me, emergency',
  ]

  const currentToken = tokens[activeStep] || null

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_text_to_sign', 'REVERSE TRANSLATION ENGINE')}</p>
          <h1 style={styles.title}>{t('text_sign_title', 'Text → Sign Language')}</h1>
          <p style={styles.subtitle}>
            {t(
              'text_sign_subtitle',
              'Convert written sentences into animated visual Indian Sign Language sequences.'
            )}
          </p>
        </div>

        {/* Layout Grid */}
        <div style={styles.layout}>
          {/* Left Column: Text Input & Presets */}
          <div style={styles.leftCol}>
            <div className="glass-card" style={styles.inputCard}>
              <div style={styles.inputHeader}>
                <span className="panel-label">Type or Paste Message</span>
                <span style={styles.charCount}>{text.length} chars</span>
              </div>

              <textarea
                rows={4}
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  setActiveStep(0)
                  setIsPlaying(false)
                }}
                placeholder={t('text_sign_placeholder', 'Enter English text to translate into ISL visual signs...')}
                style={styles.textarea}
              />

              {/* Sample Presets */}
              <div style={styles.presetsSection}>
                <span style={styles.presetsLabel}>Try Sample Sentences:</span>
                <div style={styles.presetsWrap}>
                  {samplePhrases.map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setText(phrase)
                        setActiveStep(0)
                        setIsPlaying(false)
                      }}
                      style={styles.presetChip}
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Sign Timeline Player */}
          <div style={styles.rightCol}>
            <div className="glass-card" style={styles.playerCard}>
              <div style={styles.playerTop}>
                <div style={styles.playerTitleWrap}>
                  <Sparkles size={16} color="var(--pink-soft)" />
                  <span className="panel-label">Visual ISL Sign Sequence</span>
                </div>

                <div style={styles.playerTopActions}>
                  <button
                    onClick={handleCopySequence}
                    disabled={tokens.length === 0}
                    className="btn-secondary"
                    style={styles.copySeqBtn}
                    title="Copy sign sequence"
                  >
                    {isCopied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Central Active Sign Stage */}
              <div style={styles.stageArea}>
                {currentToken ? (
                  currentToken.isSupported ? (
                    <div style={styles.stageContent}>
                      <div style={styles.stageAnimWrap}>
                        <AnimatedHandSign signName={currentToken.word} size={250} showControls={false} />
                      </div>
                      <h2 style={styles.stageWord}>{currentToken.word}</h2>
                      <p style={styles.stageMeaning}>
                        {currentToken.sign.meaning[language] || currentToken.sign.meaning.en}
                      </p>
                      <span style={styles.stageStepTag}>
                        Step {activeStep + 1} of {tokens.length}
                      </span>
                    </div>
                  ) : (
                    <div style={styles.unsupportedContent}>
                      <div style={styles.unsupportedIcon}>
                        <Hand size={36} color="#F59E0B" />
                      </div>
                      <h3 style={styles.unsupportedWord}>"{currentToken.word}"</h3>
                      <p style={styles.unsupportedText}>
                        {t(
                          'text_sign_unsupported',
                          'No direct visual sign available in standard catalog. Fingerspell in ISL.'
                        )}
                      </p>
                      <span style={styles.stageStepTag}>
                        Step {activeStep + 1} of {tokens.length}
                      </span>
                    </div>
                  )
                ) : (
                  <div style={styles.emptyStage}>
                    <Layers size={36} color="var(--pink-soft)" style={{ opacity: 0.5 }} />
                    <p>Enter text to generate visual ISL sign representation.</p>
                  </div>
                )}
              </div>

              {/* Player Timeline Bar */}
              <div style={styles.timelineBar}>
                {tokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPlaying(false)
                      setActiveStep(idx)
                    }}
                    style={{
                      ...styles.timelinePill,
                      background: activeStep === idx ? 'var(--pink-primary)' : tok.isSupported ? 'rgba(255, 46, 147, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      borderColor: activeStep === idx ? 'var(--pink-primary)' : tok.isSupported ? 'var(--pink-border)' : 'rgba(245, 158, 11, 0.4)',
                      color: activeStep === idx ? '#FFFFFF' : 'var(--text-primary)',
                      fontWeight: activeStep === idx ? 800 : 500,
                    }}
                  >
                    <span>{tok.word}</span>
                  </button>
                ))}
              </div>

              {/* Player Controls: Prev, Play/Pause, Next, Reset */}
              <div style={styles.playerControls}>
                <button
                  onClick={handlePrev}
                  disabled={tokens.length === 0}
                  className="btn-secondary"
                  style={styles.playerCtrlBtn}
                  title="Previous sign"
                >
                  <SkipBack size={16} />
                </button>

                <button
                  onClick={togglePlay}
                  disabled={tokens.length === 0}
                  className="btn-primary"
                  style={styles.playMainBtn}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                  {isPlaying ? 'Pause Sequence' : 'Auto Play'}
                </button>

                <button
                  onClick={handleNext}
                  disabled={tokens.length === 0}
                  className="btn-secondary"
                  style={styles.playerCtrlBtn}
                  title="Next sign"
                >
                  <SkipForward size={16} />
                </button>

                <button
                  onClick={handleReset}
                  disabled={tokens.length === 0}
                  className="btn-secondary"
                  style={styles.playerCtrlBtn}
                  title="Restart sequence"
                >
                  <RotateCcw size={16} />
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
    gridTemplateColumns: '1fr 1.15fr',
    gap: '24px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
  },
  inputHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  textarea: {
    width: '100%',
    padding: '16px',
    background: 'rgba(5, 5, 5, 0.7)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    lineHeight: 1.5,
    resize: 'vertical',
  },
  presetsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '4px',
  },
  presetsLabel: {
    fontSize: '0.76rem',
    color: 'var(--text-secondary)',
    fontWeight: 700,
  },
  presetsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  presetChip: {
    padding: '6px 12px',
    borderRadius: '9999px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.74rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  playerCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
  },
  playerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  playerTopActions: {
    display: 'flex',
    alignItems: 'center',
  },
  copySeqBtn: {
    padding: '6px 12px',
    fontSize: '0.74rem',
    gap: '5px',
  },
  stageArea: {
    minHeight: '260px',
    background: 'rgba(5, 5, 5, 0.7)',
    borderRadius: '18px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
  },
  stageContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
  },
  stageAnimWrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '2px 0',
  },
  stageEmojiWrap: {
    width: '100px',
    height: '100px',
    borderRadius: '24px',
    background: 'radial-gradient(circle, rgba(255, 46, 147, 0.2) 0%, rgba(20, 10, 22, 0.8) 80%)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    boxShadow: '0 0 25px rgba(255, 46, 147, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageEmoji: {
    fontSize: '3.6rem',
  },
  stageWord: {
    fontSize: '1.7rem',
    fontWeight: 900,
    color: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  stageMeaning: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  stageStepTag: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--pink-soft)',
    padding: '4px 10px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.12)',
  },
  unsupportedContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '320px',
  },
  unsupportedIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unsupportedWord: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#F59E0B',
  },
  unsupportedText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  emptyStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-muted)',
    fontSize: '0.86rem',
  },
  timelineBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    overflowX: 'auto',
    padding: '4px 0',
  },
  timelinePill: {
    padding: '6px 14px',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.76rem',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  playerControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  playMainBtn: {
    padding: '12px 28px',
    fontSize: '0.88rem',
  },
  playerCtrlBtn: {
    width: '42px',
    height: '42px',
    padding: 0,
    borderRadius: '12px',
  },
}
