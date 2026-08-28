import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Clock,
  Search,
  Trash2,
  Copy,
  Check,
  Heart,
  Volume2,
  Layers,
} from 'lucide-react'
import {
  getHistory,
  deleteLocalTranslation,
  clearHistory,
  toggleFavourite,
  isFavourite,
} from '../services/localStore'
import { getTranslations, deleteTranslation } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function History() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  const [historyItems, setHistoryItems] = useState([])
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // ── Load History (Local + Remote) ──
  const loadHistory = useCallback(async () => {
    const local = getHistory()
    if (isAuthenticated) {
      try {
        const res = await getTranslations(1)
        if (res.data?.data?.length > 0) {
          const apiItems = res.data.data.map((item) => ({
            id: item._id,
            smoothedText: item.translatedText || item.detectedText,
            rawText: item.detectedText,
            tokens: item.detectedText.split(' '),
            language: item.language || 'en',
            confidence: item.confidenceScore || 0.85,
            timestamp: item.createdAt,
            isRemote: true,
          }))
          setHistoryItems([...local, ...apiItems])
          return
        }
      } catch {
        // Fallback to local
      }
    }
    setHistoryItems(local)
  }, [isAuthenticated])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // ── Filtered History ──
  const filtered = useMemo(() => {
    if (!search.trim()) return historyItems
    const q = search.toLowerCase()
    return historyItems.filter(
      (item) =>
        item.smoothedText?.toLowerCase().includes(q) ||
        item.rawText?.toLowerCase().includes(q) ||
        item.tokens?.some((t) => t.toLowerCase().includes(q))
    )
  }, [historyItems, search])

  // ── Actions ──
  const handleDelete = async (item) => {
    if (item.isRemote) {
      try {
        await deleteTranslation(item.id)
      } catch {
        // Ignore
      }
    }
    deleteLocalTranslation(item.id)
    setHistoryItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  const handleClearAll = () => {
    if (!window.confirm('Clear all translation history records?')) return
    clearHistory()
    setHistoryItems([])
  }

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      // Fallback
    }
  }

  const handleSpeak = (text, lang) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Recent'
    }
  }

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p className="eyebrow">{t('nav_history', 'LOGS & RECORD ARCHIVE')}</p>
            <h1 style={styles.title}>{t('hist_title', 'Translation History')}</h1>
            <p style={styles.subtitle}>
              {t(
                'hist_subtitle',
                'Review past live translations, replay audio pronunciations, and manage saved phrases.'
              )}
            </p>
          </div>

          {historyItems.length > 0 && (
            <button onClick={handleClearAll} className="btn-secondary" style={styles.clearBtn}>
              <Trash2 size={15} color="#EF4444" />
              {t('hist_clear_all', 'Clear All Records')}
            </button>
          )}
        </div>

        {/* Search Filter */}
        <div style={styles.searchWrap}>
          <Search size={18} color="var(--pink-soft)" />
          <input
            type="text"
            placeholder={t('hist_search_placeholder', 'Search translation records...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Feed List */}
        <div style={styles.feedList}>
          {filtered.map((item) => {
            const isFav = isFavourite(item.id)
            const displayText = item.smoothedText || item.rawText
            return (
              <div key={item.id} className="glass-card" style={styles.historyCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardMeta}>
                    <Clock size={13} color="var(--pink-soft)" />
                    <span>{formatDate(item.timestamp)}</span>
                    <span style={styles.langPill}>{item.language?.toUpperCase() || 'EN'}</span>
                  </div>

                  <div style={styles.confidencePill}>
                    {Math.round((item.confidence || 0.85) * 100)}% Confidence
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <p style={styles.mainSentence}>"{displayText}"</p>
                  {item.tokens && item.tokens.length > 0 && (
                    <div style={styles.tokenPillsRow}>
                      {item.tokens.map((tok, idx) => (
                        <span key={idx} style={styles.historyToken}>
                          {tok}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.actionBtns}>
                    <button
                      onClick={() => handleSpeak(displayText, item.language)}
                      className="btn-secondary"
                      style={styles.cardBtn}
                      title="Speak"
                    >
                      <Volume2 size={15} color="var(--pink-soft)" />
                      <span>Speak</span>
                    </button>

                    <button
                      onClick={() => handleCopy(displayText, item.id)}
                      className="btn-secondary"
                      style={styles.cardBtn}
                      title="Copy"
                    >
                      {copiedId === item.id ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleFavourite({
                          id: item.id,
                          name: displayText,
                          meaning: { [item.language || 'en']: displayText },
                          isPhrase: true,
                        })
                        setHistoryItems([...historyItems])
                      }}
                      className="btn-secondary"
                      style={styles.cardBtn}
                      title="Favourite"
                    >
                      <Heart size={15} fill={isFav ? 'currentColor' : 'none'} color={isFav ? 'var(--pink-primary)' : 'inherit'} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item)}
                    style={styles.deleteBtn}
                    title="Delete record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="glass-card" style={styles.emptyState}>
            <Layers size={48} color="var(--pink-soft)" style={{ opacity: 0.5 }} />
            <h3>No translation records found</h3>
            <p>Translations created in the Live Studio will be securely logged here.</p>
          </div>
        )}
      </div>
    </main>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 900,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
  },
  clearBtn: {
    padding: '9px 16px',
    fontSize: '0.8rem',
    gap: '6px',
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    background: 'rgba(22, 11, 23, 0.8)',
    border: '1px solid var(--border-color)',
    borderRadius: '9999px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    width: '100%',
  },
  feedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  historyCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.6) 0%, rgba(11, 8, 13, 0.85) 100%)',
    border: '1px solid var(--border-color)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  langPill: {
    padding: '2px 7px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.12)',
    border: '1px solid var(--pink-border)',
    color: 'var(--pink-soft)',
    fontSize: '0.68rem',
    fontWeight: 800,
  },
  confidencePill: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#10B981',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainSentence: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  tokenPillsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  historyToken: {
    padding: '3px 9px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '12px',
  },
  actionBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardBtn: {
    padding: '6px 12px',
    fontSize: '0.76rem',
    gap: '5px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    transition: 'color 0.2s',
  },
  emptyState: {
    padding: '60px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
  },
}