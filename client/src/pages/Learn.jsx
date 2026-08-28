import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  X,
  Play,
  Heart,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Volume2,
} from 'lucide-react'
import { SIGNS, CATEGORIES } from '../data/signs'
import SignCard from '../components/SignCard'
import AnimatedHandSign from '../components/AnimatedHandSign'
import { useLanguage } from '../context/LanguageContext'
import { isFavourite, toggleFavourite } from '../services/localStore'

export default function Learn() {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalSign, setActiveModalSign] = useState(null)
  const [modalFaved, setModalFaved] = useState(false)

  // ── Sync incoming target sign from router navigation state ──
  useEffect(() => {
    if (location.state?.selectedSign) {
      setActiveModalSign(location.state.selectedSign)
      setModalFaved(isFavourite(location.state.selectedSign.id))
    }
  }, [location.state])

  // ── Filter Signs ──
  const filteredSigns = useMemo(() => {
    return SIGNS.filter((sign) => {
      // Category filter
      if (selectedCategory !== 'ALL' && sign.category !== selectedCategory) {
        return false
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && sign.difficulty !== selectedDifficulty) {
        return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = sign.name.toLowerCase().includes(q)
        const meaningEn = typeof sign.meaning === 'string' ? sign.meaning.toLowerCase().includes(q) : sign.meaning?.en?.toLowerCase().includes(q)
        const meaningTa = typeof sign.meaning === 'object' && sign.meaning?.ta?.toLowerCase().includes(q)
        const meaningHi = typeof sign.meaning === 'object' && sign.meaning?.hi?.toLowerCase().includes(q)

        return nameMatch || meaningEn || meaningTa || meaningHi
      }

      return true
    })
  }, [selectedCategory, selectedDifficulty, searchQuery])

  // ── Modal Actions ──
  const openSignModal = (sign) => {
    setActiveModalSign(sign)
    setModalFaved(isFavourite(sign.id))
  }

  const closeSignModal = () => {
    setActiveModalSign(null)
  }

  const handleModalFavToggle = () => {
    if (!activeModalSign) return
    toggleFavourite(activeModalSign)
    setModalFaved(!modalFaved)
  }

  const handlePracticeFromModal = (sign) => {
    closeSignModal()
    navigate('/practice', { state: { targetSign: sign.name } })
  }

  const handleSpeak = (text) => {
    if (!text || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_learn', 'ISL VISUAL CURRICULUM')}</p>
          <h1 style={styles.title}>{t('learn_title', 'Learn Indian Sign Language')}</h1>
          <p style={styles.subtitle}>
            {t(
              'learn_subtitle',
              'Explore categorized visual guides, step-by-step hand gestures, and practical everyday phrases.'
            )}
          </p>
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div style={styles.searchBarRow}>
          {/* Search Box */}
          <div style={styles.searchBox}>
            <Search size={18} color="var(--pink-soft)" />
            <input
              type="text"
              placeholder={t('learn_search_placeholder', 'Search signs by English, Tamil, or Hindi...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <X size={15} />
              </button>
            )}
          </div>

          {/* Difficulty Filter Tabs */}
          <div style={styles.diffTabs}>
            {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  ...styles.diffTab,
                  background: selectedDifficulty === diff ? 'linear-gradient(135deg, rgba(255, 46, 147, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: selectedDifficulty === diff ? 'var(--pink-primary)' : 'var(--border-color)',
                  color: selectedDifficulty === diff ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: selectedDifficulty === diff ? 700 : 500,
                }}
              >
                {diff === 'ALL' ? 'All Levels' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div style={styles.categoriesRow}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{
              ...styles.catPill,
              background: selectedCategory === 'ALL' ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: selectedCategory === 'ALL' ? 'var(--pink-primary)' : 'var(--border-color)',
              color: selectedCategory === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: selectedCategory === 'ALL' ? 700 : 500,
            }}
          >
            {t('learn_all_categories', 'All Categories')} ({SIGNS.length})
          </button>

          {CATEGORIES.map((cat) => {
            const catId = typeof cat === 'string' ? cat : cat.id
            const catEmoji = typeof cat === 'object' && cat.emoji ? cat.emoji : '📁'
            const catLabel =
              typeof cat === 'object' && cat.label
                ? cat.label[language] || cat.label.en
                : catId
            const count = SIGNS.filter((s) => s.category === catId).length
            const isSelected = selectedCategory === catId

            return (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                style={{
                  ...styles.catPill,
                  background: isSelected ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: isSelected ? 'var(--pink-primary)' : 'var(--border-color)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                <span>{catEmoji}</span>
                <span>{catLabel}</span>
                <small style={styles.catCount}>({count})</small>
              </button>
            )
          })}
        </div>

        {/* Pinterest-Style Visual Signs Grid */}
        <div style={styles.cardsGrid}>
          {filteredSigns.map((sign) => (
            <SignCard
              key={sign.id}
              sign={sign}
              onClick={openSignModal}
              onPractice={(s) => navigate('/practice', { state: { targetSign: s.name } })}
            />
          ))}
        </div>

        {filteredSigns.length === 0 && (
          <div className="glass-card" style={styles.emptyState}>
            <BookOpen size={48} color="var(--pink-soft)" style={{ opacity: 0.5 }} />
            <h3>No signs found</h3>
            <p>Try adjusting your search keywords or switching category filters.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
                setSelectedDifficulty('ALL')
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Sign Detail Modal */}
        {activeModalSign && (
          <div style={styles.modalBackdrop} onClick={closeSignModal}>
            <div className="glass-card" style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              {/* Modal Top Bar */}
              <div style={styles.modalTop}>
                <div style={styles.modalBadgeRow}>
                  <span style={styles.modalCatBadge}>{activeModalSign.category}</span>
                  <span style={styles.modalDiffBadge}>{activeModalSign.difficulty}</span>
                </div>

                <div style={styles.modalTopActions}>
                  <button
                    onClick={handleModalFavToggle}
                    style={{
                      ...styles.modalFavBtn,
                      color: modalFaved ? 'var(--pink-primary)' : 'var(--text-muted)',
                      borderColor: modalFaved ? 'var(--pink-border)' : 'var(--border-color)',
                    }}
                    title={modalFaved ? 'Remove from Favourites' : 'Add to Favourites'}
                  >
                    <Heart size={16} fill={modalFaved ? 'currentColor' : 'none'} />
                  </button>

                  <button onClick={closeSignModal} style={styles.closeBtn}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Main Sign Visual & Animated Hand Gesture */}
              <div style={styles.modalHero}>
                <div style={styles.animViewerWrap}>
                  <AnimatedHandSign signName={activeModalSign.name} size={320} showControls={true} />
                </div>
                <h2 style={styles.modalSignTitle}>{activeModalSign.name}</h2>
                <p style={styles.modalMeaning}>
                  {typeof activeModalSign.meaning === 'string'
                    ? activeModalSign.meaning
                    : activeModalSign.meaning?.[language] || activeModalSign.meaning?.en || ''}
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div style={styles.stepsSection}>
                <h4 style={styles.sectionHeading}>{t('learn_how_to_perform', 'How to Perform')}</h4>
                <div style={styles.stepsList}>
                  {(Array.isArray(activeModalSign.steps)
                    ? activeModalSign.steps
                    : activeModalSign.steps?.[language] || activeModalSign.steps?.en || []
                  ).map((step, idx) => (
                    <div key={idx} style={styles.stepItem}>
                      <span style={styles.stepNumber}>{idx + 1}</span>
                      <p style={styles.stepText}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips Banner */}
              {activeModalSign.tips && (
                <div style={styles.tipBox}>
                  <Lightbulb size={18} color="#F59E0B" style={{ flexShrink: 0 }} />
                  <p style={styles.tipText}>
                    {typeof activeModalSign.tips === 'string'
                      ? activeModalSign.tips
                      : activeModalSign.tips?.[language] || activeModalSign.tips?.en || ''}
                  </p>
                </div>
              )}

              {/* Contextual Examples */}
              {(activeModalSign.exampleSentence || activeModalSign.examples) && (
                <div style={styles.exampleSection}>
                  <h4 style={styles.sectionHeading}>Example Usage</h4>
                  {(() => {
                    const exObj = activeModalSign.exampleSentence || activeModalSign.examples
                    const exText = typeof exObj === 'string' ? exObj : exObj?.[language] || exObj?.en || ''
                    if (!exText) return null
                    return (
                      <div style={styles.exampleItem}>
                        <p style={styles.exampleText}>"{exText}"</p>
                        <button
                          onClick={() => handleSpeak(exText)}
                          className="btn-secondary"
                          style={styles.speakExampleBtn}
                          title="Speak example"
                        >
                          <Volume2 size={15} color="var(--pink-soft)" />
                        </button>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Model Recognition Support Note */}
              <div style={styles.supportNote}>
                {activeModalSign.supportedByModel ? (
                  <div style={styles.supportedAlert}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>Real-time recognition supported with on-device camera.</span>
                  </div>
                ) : (
                  <div style={styles.guideAlert}>
                    <BookOpen size={16} color="var(--pink-soft)" />
                    <span>Step-by-step visual lesson. Use for reference and practice.</span>
                  </div>
                )}
              </div>

              {/* Modal Bottom Actions */}
              <div style={styles.modalFooter}>
                <button
                  onClick={() => handlePracticeFromModal(activeModalSign)}
                  className="btn-primary"
                  style={styles.modalPracticeBtn}
                >
                  <Play size={16} fill="currentColor" />
                  {t('learn_practice_sign', 'Practice This Sign in Arena')}
                </button>
              </div>
            </div>
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
    gap: '26px',
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
  searchBarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    background: 'rgba(22, 11, 23, 0.8)',
    border: '1px solid var(--border-color)',
    borderRadius: '9999px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    width: '100%',
  },
  clearSearchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  diffTabs: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  diffTab: {
    padding: '9px 16px',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.78rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoriesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '6px',
  },
  catPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  catCount: {
    opacity: 0.7,
    fontSize: '0.72rem',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '18px',
  },
  emptyState: {
    padding: '60px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '14px',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5, 5, 5, 0.85)',
    backdropFilter: 'blur(16px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalCard: {
    maxWidth: '540px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'linear-gradient(180deg, #1C0B18 0%, #0B080D 100%)',
    border: '1.5px solid rgba(255, 46, 147, 0.35)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 46, 147, 0.2)',
  },
  modalTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  modalCatBadge: {
    padding: '4px 10px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.15)',
    border: '1px solid var(--pink-border)',
    color: 'var(--pink-soft)',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  modalDiffBadge: {
    padding: '4px 10px',
    borderRadius: '9999px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.72rem',
    fontWeight: 600,
  },
  modalTopActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  modalFavBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalHero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
  },
  animViewerWrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '4px 0',
  },
  modalVisualWrap: {
    width: '110px',
    height: '110px',
    borderRadius: '24px',
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 46, 147, 0.2) 0%, rgba(20, 10, 22, 0.8) 80%)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    boxShadow: '0 0 25px rgba(255, 46, 147, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px',
  },
  modalEmoji: {
    fontSize: '3.6rem',
  },
  modalSignTitle: {
    fontSize: '1.6rem',
    fontWeight: 900,
    color: '#FFFFFF',
  },
  modalMeaning: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  stepsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionHeading: {
    fontSize: '0.86rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    color: 'var(--pink-soft)',
    textTransform: 'uppercase',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255, 46, 147, 0.2)',
    color: 'var(--pink-soft)',
    fontSize: '0.75rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '0.84rem',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
  },
  tipBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    borderRadius: '12px',
  },
  tipText: {
    fontSize: '0.8rem',
    color: '#FDE68A',
    lineHeight: 1.4,
  },
  exampleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  exampleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px 16px',
    background: 'rgba(255, 46, 147, 0.06)',
    border: '1px solid rgba(255, 46, 147, 0.2)',
    borderRadius: '12px',
  },
  exampleText: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontStyle: 'italic',
  },
  speakExampleBtn: {
    width: '32px',
    height: '32px',
    padding: 0,
    borderRadius: '8px',
    flexShrink: 0,
  },
  supportNote: {
    display: 'flex',
    flexDirection: 'column',
  },
  supportedAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.78rem',
    color: '#10B981',
  },
  guideAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.78rem',
    color: 'var(--pink-soft)',
  },
  modalFooter: {
    marginTop: '6px',
  },
  modalPracticeBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '0.9rem',
  },
}