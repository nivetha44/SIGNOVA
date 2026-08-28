import { useState } from 'react'
import {
  Sparkles,
  Volume2,
  Copy,
  Check,
  Bookmark,
  Trash2,
  Undo2,
  ArrowRight,
  ArrowLeft,
  Plus,
} from 'lucide-react'
import { SIGNS, CATEGORIES } from '../data/signs'
import { smoothGrammar, formatRawSequence } from '../services/grammar'
import { saveLocalTranslation } from '../services/localStore'
import { useLanguage } from '../context/LanguageContext'

export default function SentenceBuilder() {
  const { language, t } = useLanguage()

  const [sequence, setSequence] = useState(['I', 'WANT', 'GO', 'HOME'])
  const [history, setHistory] = useState([])
  const [selectedBankCategory, setSelectedBankCategory] = useState('ALL')

  const [isCopied, setIsCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // ── Push State to History ──
  const pushState = (newSeq) => {
    setHistory((h) => [...h, sequence])
    setSequence(newSeq)
  }

  // ── Add Sign to Sequence ──
  const handleAddSign = (signName) => {
    pushState([...sequence, signName])
  }

  // ── Remove Sign from Sequence ──
  const handleRemoveSign = (index) => {
    const updated = [...sequence]
    updated.splice(index, 1)
    pushState(updated)
  }

  // ── Move Sign Left / Right ──
  const handleMoveSign = (index, direction) => {
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= sequence.length) return
    const updated = [...sequence]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    pushState(updated)
  }

  // ── Undo Last Edit ──
  const handleUndo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setSequence(prev)
    setHistory((h) => h.slice(0, -1))
  }

  // ── Clear Sequence ──
  const handleClear = () => {
    if (sequence.length === 0) return
    pushState([])
  }

  // ── Outputs ──
  const rawText = formatRawSequence(sequence)
  const improvedText = smoothGrammar(sequence, language)

  // ── Text-to-Speech ──
  const handleSpeak = () => {
    if (!improvedText || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(improvedText)
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.95

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  // ── Copy Output ──
  const handleCopy = async () => {
    if (!improvedText) return
    try {
      await navigator.clipboard.writeText(improvedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  // ── Save Translation ──
  const handleSave = () => {
    if (!improvedText) return
    saveLocalTranslation({
      rawText,
      smoothedText: improvedText,
      tokens: sequence,
      language,
      confidence: 1.0,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const bankSigns =
    selectedBankCategory === 'ALL'
      ? SIGNS
      : SIGNS.filter((s) => s.category === selectedBankCategory)

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_sentence_builder', 'SYNTAX & COMPOSITION STUDIO')}</p>
          <h1 style={styles.title}>{t('build_title', 'Interactive Sentence Builder')}</h1>
          <p style={styles.subtitle}>
            {t(
              'build_subtitle',
              'Assemble, reorder, and refine ISL sign tokens into grammatically coherent sentences.'
            )}
          </p>
        </div>

        {/* Studio Grid */}
        <div style={styles.layout}>
          {/* Left Column: Sequence Assembly Canvas */}
          <div style={styles.leftCol}>
            <div className="glass-card" style={styles.canvasCard}>
              <div style={styles.canvasHeader}>
                <span className="panel-label">Sign Sequence Canvas</span>
                <span style={styles.canvasCount}>{sequence.length} Tokens</span>
              </div>

              {/* Tokens Canvas */}
              <div style={styles.canvasDropZone}>
                {sequence.length === 0 ? (
                  <p style={styles.emptyPrompt}>
                    Select signs from the word bank below to build your sentence.
                  </p>
                ) : (
                  <div style={styles.sequenceChipsWrap}>
                    {sequence.map((tok, idx) => {
                      const signObj = SIGNS.find((s) => s.name === tok)
                      return (
                        <div key={idx} style={styles.tokenCard}>
                          <div style={styles.tokenTop}>
                            <span style={styles.tokenEmoji}>{signObj?.emoji || '👋'}</span>
                            <span style={styles.tokenName}>{tok}</span>
                            <button
                              onClick={() => handleRemoveSign(idx)}
                              style={styles.tokenRemoveBtn}
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
                          <div style={styles.tokenReorderRow}>
                            <button
                              onClick={() => handleMoveSign(idx, -1)}
                              disabled={idx === 0}
                              style={styles.reorderBtn}
                              title="Move left"
                            >
                              <ArrowLeft size={12} />
                            </button>
                            <span style={styles.tokenOrderNum}>{idx + 1}</span>
                            <button
                              onClick={() => handleMoveSign(idx, 1)}
                              disabled={idx === sequence.length - 1}
                              style={styles.reorderBtn}
                              title="Move right"
                            >
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Canvas Controls: Undo, Clear */}
              <div style={styles.canvasControls}>
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="btn-secondary"
                  style={styles.canvasCtrlBtn}
                >
                  <Undo2 size={15} />
                  Undo
                </button>

                <button
                  onClick={handleClear}
                  disabled={sequence.length === 0}
                  className="btn-secondary"
                  style={{ ...styles.canvasCtrlBtn, color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' }}
                >
                  <Trash2 size={15} />
                  Clear All
                </button>
              </div>

              {/* Output Result Card */}
              <div style={styles.outputBox}>
                <div style={styles.outputHeader}>
                  <Sparkles size={16} color="var(--pink-soft)" />
                  <span className="panel-label">Natural Grammatical Translation</span>
                </div>

                <div style={styles.outputBody}>
                  {improvedText ? (
                    <p style={styles.outputSentence}>"{improvedText}"</p>
                  ) : (
                    <p style={styles.outputPlaceholder}>Assembled translation will appear here.</p>
                  )}
                </div>

                {rawText && (
                  <div style={styles.rawTokensFooter}>
                    <small>Raw Tokens: {rawText}</small>
                  </div>
                )}

                {/* Actions */}
                <div style={styles.outputActions}>
                  <button
                    onClick={handleSpeak}
                    disabled={!improvedText || isSpeaking}
                    className="btn-secondary"
                    style={styles.outBtn}
                  >
                    <Volume2 size={15} color="var(--pink-soft)" />
                    {isSpeaking ? 'Speaking...' : 'Speak'}
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!improvedText}
                    className="btn-secondary"
                    style={styles.outBtn}
                  >
                    {isCopied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!improvedText}
                    className="btn-primary"
                    style={styles.outBtn}
                  >
                    {isSaved ? <Check size={15} /> : <Bookmark size={15} />}
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Categorized Sign Bank */}
          <div style={styles.rightCol}>
            <div className="glass-card" style={styles.bankCard}>
              <div style={styles.bankHeader}>
                <span className="panel-label">ISL Vocabulary Bank</span>
                <span style={styles.bankCount}>{bankSigns.length} Signs</span>
              </div>

              {/* Category Pills */}
              <div style={styles.bankCatRow}>
                <button
                  onClick={() => setSelectedBankCategory('ALL')}
                  style={{
                    ...styles.bankCatPill,
                    background: selectedBankCategory === 'ALL' ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: selectedBankCategory === 'ALL' ? 'var(--pink-primary)' : 'var(--border-color)',
                    color: selectedBankCategory === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: selectedBankCategory === 'ALL' ? 700 : 500,
                  }}
                >
                  All
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedBankCategory(cat.id)}
                    style={{
                      ...styles.bankCatPill,
                      background: selectedBankCategory === cat.id ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
                      borderColor: selectedBankCategory === cat.id ? 'var(--pink-primary)' : 'var(--border-color)',
                      color: selectedBankCategory === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                      fontWeight: selectedBankCategory === cat.id ? 700 : 500,
                    }}
                  >
                    {cat.emoji} {cat.id}
                  </button>
                ))}
              </div>

              {/* Bank Chips Grid */}
              <div style={styles.bankChipsGrid}>
                {bankSigns.map((sign) => (
                  <button
                    key={sign.id}
                    onClick={() => handleAddSign(sign.name)}
                    style={styles.bankSignChip}
                  >
                    <span style={styles.bankEmoji}>{sign.emoji}</span>
                    <span style={styles.bankName}>{sign.name}</span>
                    <Plus size={13} color="var(--pink-soft)" style={styles.bankPlus} />
                  </button>
                ))}
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
    gridTemplateColumns: '1.2fr 1fr',
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
  canvasCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
  },
  canvasHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  canvasCount: {
    padding: '3px 10px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.12)',
    border: '1px solid var(--pink-border)',
    color: 'var(--pink-soft)',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  canvasDropZone: {
    minHeight: '130px',
    padding: '16px',
    background: 'rgba(5, 5, 5, 0.65)',
    border: '1.5px dashed rgba(255, 46, 147, 0.3)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  emptyPrompt: {
    color: 'var(--text-muted)',
    fontSize: '0.86rem',
    textAlign: 'center',
    width: '100%',
  },
  sequenceChipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
  },
  tokenCard: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.2) 0%, rgba(28, 11, 24, 0.85) 100%)',
    border: '1px solid rgba(255, 46, 147, 0.45)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 0 14px rgba(255, 46, 147, 0.15)',
  },
  tokenTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tokenEmoji: {
    fontSize: '1.2rem',
  },
  tokenName: {
    fontSize: '0.88rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  tokenRemoveBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '0 2px',
    lineHeight: 1,
  },
  tokenReorderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '4px',
  },
  reorderBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    padding: '2px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenOrderNum: {
    fontSize: '0.66rem',
    color: 'var(--pink-soft)',
    fontWeight: 700,
  },
  canvasControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  canvasCtrlBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
    gap: '6px',
  },
  outputBox: {
    padding: '20px',
    background: 'rgba(5, 5, 5, 0.75)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  outputHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  outputBody: {
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  outputSentence: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1.4,
  },
  outputPlaceholder: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  rawTokensFooter: {
    color: 'var(--text-secondary)',
    fontSize: '0.74rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '6px',
  },
  outputActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  outBtn: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.82rem',
    minWidth: '90px',
    gap: '6px',
  },
  bankCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
    maxHeight: '620px',
    overflowY: 'auto',
  },
  bankHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankCount: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  bankCatRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  bankCatPill: {
    padding: '6px 12px',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.74rem',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bankChipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '8px',
    overflowY: 'auto',
  },
  bankSignChip: {
    padding: '8px 12px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  bankEmoji: {
    fontSize: '1.2rem',
  },
  bankName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bankPlus: {
    flexShrink: 0,
  },
}
