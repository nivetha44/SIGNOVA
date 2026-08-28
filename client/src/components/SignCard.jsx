import { useState } from 'react'
import { Heart, Play, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { isFavourite, toggleFavourite } from '../services/localStore'

export default function SignCard({ sign, onClick, onPractice }) {
  const { language } = useLanguage()
  const [faved, setFaved] = useState(() => isFavourite(sign.id))

  const handleFav = (e) => {
    e.stopPropagation()
    toggleFavourite(sign)
    setFaved(!faved)
  }

  const difficultyColors = {
    Beginner: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: 'rgba(16, 185, 129, 0.25)' },
    Intermediate: { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)' },
    Advanced: { bg: 'rgba(255, 46, 147, 0.12)', text: '#FF2E93', border: 'rgba(255, 46, 147, 0.25)' },
  }

  const diffStyle = difficultyColors[sign.difficulty] || difficultyColors.Beginner

  return (
    <div className="glass-card" style={styles.card} onClick={() => onClick && onClick(sign)}>
      {/* Top Badges */}
      <div style={styles.topRow}>
        <span
          style={{
            ...styles.diffBadge,
            background: diffStyle.bg,
            color: diffStyle.text,
            borderColor: diffStyle.border,
          }}
        >
          {sign.difficulty}
        </span>

        <button
          onClick={handleFav}
          style={{
            ...styles.favBtn,
            color: faved ? 'var(--pink-primary)' : 'var(--text-muted)',
            borderColor: faved ? 'var(--pink-border)' : 'var(--border-color)',
            background: faved ? 'rgba(255, 46, 147, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          }}
          title={faved ? 'Remove from Favourites' : 'Add to Favourites'}
        >
          <Heart size={14} fill={faved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Visual Sign Focus */}
      <div style={styles.visualArea}>
        <span style={styles.emoji}>{sign.emoji || '👋'}</span>
      </div>

      {/* Sign Info */}
      <div style={styles.infoArea}>
        <h3 style={styles.signName}>{sign.name}</h3>
        <p style={styles.meaning}>{sign.meaning[language] || sign.meaning.en}</p>
      </div>

      {/* Card Footer: Model Support & Practice Trigger */}
      <div style={styles.cardFooter}>
        {sign.supportedByModel ? (
          <span style={styles.aiTag}>
            <Sparkles size={11} color="var(--pink-soft)" />
            <span>Live AI</span>
          </span>
        ) : (
          <span style={styles.guideTag}>Visual Guide</span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            if (onPractice) onPractice(sign)
          }}
          className="btn-secondary"
          style={styles.practiceBtn}
        >
          <Play size={12} fill="currentColor" />
          <span>Practice</span>
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '12px',
    cursor: 'pointer',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.5) 0%, rgba(11, 8, 13, 0.8) 100%)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '220px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diffBadge: {
    fontSize: '0.66rem',
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: '9999px',
    border: '1px solid',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  favBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid',
    transition: 'all 0.2s',
  },
  visualArea: {
    height: '80px',
    borderRadius: '14px',
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 46, 147, 0.08) 0%, rgba(16, 10, 18, 0.6) 80%)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '4px 0',
  },
  emoji: {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
  },
  infoArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  signName: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  meaning: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  aiTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'var(--pink-soft)',
  },
  guideTag: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  practiceBtn: {
    padding: '6px 12px',
    fontSize: '0.74rem',
    fontWeight: 700,
    borderRadius: '9999px',
    gap: '5px',
  },
}
