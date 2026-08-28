import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Volume2, BookOpen, Play } from 'lucide-react'
import { getFavourites, toggleFavourite } from '../services/localStore'
import { useLanguage } from '../context/LanguageContext'

export default function Favourites() {
  const { language, t } = useLanguage()
  const [favs, setFavs] = useState([])

  const loadFavs = () => {
    setFavs(getFavourites())
  }

  useEffect(() => {
    loadFavs()
  }, [])

  const handleRemove = (item) => {
    toggleFavourite(item)
    loadFavs()
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
          <p className="eyebrow">{t('nav_favourites', 'CURATED BOOKMARKS')}</p>
          <h1 style={styles.title}>{t('fav_title', 'Saved Signs & Phrases')}</h1>
          <p style={styles.subtitle}>
            {t(
              'fav_subtitle',
              'Quickly reference your favourite vocabulary, saved sentences, and study lists.'
            )}
          </p>
        </div>

        {/* Favourites Grid */}
        <div style={styles.grid}>
          {favs.map((item) => {
            const displayText = item.meaning?.[language] || item.meaning?.en || item.name
            return (
              <div key={item.id} className="glass-card" style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.emoji}>{item.emoji || '🤟'}</span>
                  <button
                    onClick={() => handleRemove(item)}
                    style={styles.unfavBtn}
                    title="Remove bookmark"
                  >
                    <Heart size={16} fill="var(--pink-primary)" color="var(--pink-primary)" />
                  </button>
                </div>

                <div style={styles.cardInfo}>
                  <h3 style={styles.name}>{item.name}</h3>
                  <p style={styles.meaning}>{displayText}</p>
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => handleSpeak(displayText)}
                    className="btn-secondary"
                    style={styles.actionBtn}
                    title="Pronounce"
                  >
                    <Volume2 size={15} color="var(--pink-soft)" />
                    <span>Speak</span>
                  </button>

                  <Link
                    to="/practice"
                    state={{ targetSign: item.name }}
                    className="btn-primary"
                    style={styles.actionBtn}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Practice</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {favs.length === 0 && (
          <div className="glass-card" style={styles.emptyState}>
            <Heart size={48} color="var(--pink-soft)" style={{ opacity: 0.5 }} />
            <h3>No favourites saved yet</h3>
            <p>Tap the heart icon on any sign or phrase in the curriculum to pin it here.</p>
            <Link to="/learn" className="btn-primary" style={styles.browseBtn}>
              <BookOpen size={16} />
              Browse Signs
            </Link>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '18px',
  },
  card: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '14px',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.65) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
    minHeight: '200px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: '2.4rem',
  },
  unfavBtn: {
    background: 'rgba(255, 46, 147, 0.15)',
    border: '1px solid var(--pink-border)',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  name: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  meaning: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '12px',
  },
  actionBtn: {
    flex: 1,
    padding: '8px',
    fontSize: '0.78rem',
    gap: '5px',
  },
  emptyState: {
    padding: '60px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '14px',
  },
  browseBtn: {
    marginTop: '6px',
    padding: '12px 24px',
    fontSize: '0.86rem',
  },
}
