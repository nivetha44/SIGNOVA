import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  Target,
  Trophy,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { getStats } from '../services/localStore'
import { useLanguage } from '../context/LanguageContext'

export default function Progress() {
  const { t } = useLanguage()
  const [stats, setStats] = useState(getStats())

  useEffect(() => {
    setStats(getStats())
  }, [])

  const level = stats.level || 2
  const currentXP = stats.xp || 320
  const nextLevelXP = level * 300
  const progressPercent = Math.min(100, Math.round((currentXP / nextLevelXP) * 100))

  const categories = [
    { name: 'Greetings', mastered: 8, total: 10, percent: 80 },
    { name: 'Basics & Essentials', mastered: 12, total: 15, percent: 80 },
    { name: 'Food & Dining', mastered: 6, total: 10, percent: 60 },
    { name: 'Family & People', mastered: 5, total: 8, percent: 62 },
    { name: 'Emotions', mastered: 4, total: 8, percent: 50 },
    { name: 'Emergency & Safety', mastered: 3, total: 4, percent: 75 },
    { name: 'Action Verbs', mastered: 8, total: 12, percent: 66 },
    { name: 'Nouns & Objects', mastered: 5, total: 10, percent: 50 },
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const activityData = [1, 1, 0, 1, 1, 1, 1] // Active days

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_progress', 'MASTERY & ANALYTICS')}</p>
          <h1 style={styles.title}>{t('prog_title', 'Learner Analytics & Mastery')}</h1>
          <p style={styles.subtitle}>
            {t(
              'prog_subtitle',
              'Track your signing accuracy, milestone streaks, and category mastery over time.'
            )}
          </p>
        </div>

        {/* Level Overview Card */}
        <div className="glass-card" style={styles.levelCard}>
          <div style={styles.levelRingWrap}>
            <div style={styles.levelRing}>
              <strong style={styles.levelNum}>Lv {level}</strong>
              <span style={styles.levelLabel}>Learner</span>
            </div>
          </div>

          <div style={styles.levelCopy}>
            <div style={styles.levelHeaderRow}>
              <h2 style={styles.rankTitle}>Mastery Level {level}</h2>
              <span style={styles.xpPill}>{currentXP} / {nextLevelXP} XP</span>
            </div>
            <p style={styles.rankDesc}>
              Earn {nextLevelXP - currentXP} more XP through live translation and practice arena games to reach Level {level + 1}.
            </p>

            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div style={styles.statsGrid}>
          <div className="glass-card" style={styles.statTile}>
            <Flame size={22} color="#FF5722" />
            <strong style={styles.statVal}>{stats.currentStreak || 1} Days</strong>
            <span style={styles.statLbl}>{t('dash_current_streak', 'Current Streak')}</span>
          </div>

          <div className="glass-card" style={styles.statTile}>
            <Target size={22} color="#10B981" />
            <strong style={styles.statVal}>{stats.accuracy || 88}%</strong>
            <span style={styles.statLbl}>{t('dash_recognition_acc', 'Accuracy Rate')}</span>
          </div>

          <div className="glass-card" style={styles.statTile}>
            <Trophy size={22} color="#FF2E93" />
            <strong style={styles.statVal}>{stats.signsLearned || 14} / 500</strong>
            <span style={styles.statLbl}>Signs Mastered</span>
          </div>

          <div className="glass-card" style={styles.statTile}>
            <Clock size={22} color="#C026D3" />
            <strong style={styles.statVal}>{stats.totalMinutes || 48} mins</strong>
            <span style={styles.statLbl}>Total Practice</span>
          </div>
        </div>

        {/* Category Breakdown & 7-Day Heatmap */}
        <div style={styles.layout}>
          {/* Category Mastery */}
          <div className="glass-card" style={styles.categoryCard}>
            <h3 style={styles.sectionTitle}>{t('prog_category_progress', 'Category Mastery Breakdown')}</h3>
            <div style={styles.categoriesList}>
              {categories.map((cat, idx) => (
                <div key={idx} style={styles.catRow}>
                  <div style={styles.catInfo}>
                    <span style={styles.catName}>{cat.name}</span>
                    <span style={styles.catStats}>{cat.mastered} / {cat.total} signs</span>
                  </div>
                  <div style={styles.catBarBg}>
                    <div style={{ ...styles.catBarFill, width: `${cat.percent}%` }} />
                  </div>
                  <span style={styles.catPercent}>{cat.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Consistency */}
          <div className="glass-card" style={styles.heatmapCard}>
            <h3 style={styles.sectionTitle}>Weekly Practice Activity</h3>
            <p style={styles.heatmapDesc}>
              Maintain consistent daily signing to protect your streak and level rewards.
            </p>

            <div style={styles.daysRow}>
              {weekDays.map((day, idx) => {
                const isActive = activityData[idx] === 1
                return (
                  <div key={idx} style={styles.dayCol}>
                    <div
                      style={{
                        ...styles.dayBox,
                        background: isActive ? 'linear-gradient(135deg, #FF2E93 0%, #C026D3 100%)' : 'rgba(255, 255, 255, 0.04)',
                        borderColor: isActive ? 'var(--pink-primary)' : 'var(--border-color)',
                        boxShadow: isActive ? '0 0 12px rgba(255, 46, 147, 0.3)' : 'none',
                      }}
                    />
                    <span style={styles.dayName}>{day}</span>
                  </div>
                )
              })}
            </div>

            <div style={styles.ctaBox}>
              <Sparkles size={20} color="var(--pink-soft)" />
              <p>Ready to level up your accuracy?</p>
              <Link to="/practice" className="btn-primary" style={styles.ctaBtn}>
                Launch Practice Arena <ArrowRight size={14} />
              </Link>
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
  levelCard: {
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.12) 0%, rgba(20, 10, 22, 0.9) 100%)',
    border: '1.5px solid rgba(255, 46, 147, 0.3)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 46, 147, 0.12)',
    flexWrap: 'wrap',
  },
  levelRingWrap: {
    flexShrink: 0,
  },
  levelRing: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '6px solid var(--pink-primary)',
    borderRightColor: '#C026D3',
    boxShadow: '0 0 25px rgba(255, 46, 147, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(5, 5, 5, 0.5)',
  },
  levelNum: {
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  levelLabel: {
    fontSize: '0.7rem',
    color: 'var(--pink-soft)',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  levelCopy: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
    minWidth: '280px',
  },
  levelHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  xpPill: {
    fontSize: '0.8rem',
    fontWeight: 800,
    color: 'var(--pink-soft)',
    padding: '4px 12px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.15)',
    border: '1px solid var(--pink-border)',
  },
  rankDesc: {
    fontSize: '0.86rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  progressBarBg: {
    height: '10px',
    borderRadius: '9999px',
    background: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginTop: '4px',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    background: 'linear-gradient(90deg, #FF2E93 0%, #C026D3 100%)',
    boxShadow: '0 0 12px rgba(255, 46, 147, 0.5)',
    transition: 'width 0.5s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  statTile: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderRadius: '16px',
  },
  statVal: {
    fontSize: '1.4rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: '0.76rem',
    color: 'var(--text-secondary)',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  categoryCard: {
    padding: '26px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderRadius: '20px',
  },
  sectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  catRow: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr 45px',
    alignItems: 'center',
    gap: '12px',
  },
  catInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  catName: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  catStats: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
  },
  catBarBg: {
    height: '8px',
    borderRadius: '9999px',
    background: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: '9999px',
    background: 'linear-gradient(90deg, #FF2E93 0%, #FDA4AF 100%)',
  },
  catPercent: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--pink-soft)',
    textAlign: 'right',
  },
  heatmapCard: {
    padding: '26px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    borderRadius: '20px',
  },
  heatmapDesc: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  daysRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '16px 0',
  },
  dayCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  dayBox: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '10px',
    border: '1px solid',
  },
  dayName: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  ctaBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    padding: '20px',
    background: 'rgba(255, 46, 147, 0.06)',
    border: '1px solid rgba(255, 46, 147, 0.2)',
    borderRadius: '16px',
    marginTop: '6px',
  },
  ctaBtn: {
    padding: '10px 20px',
    fontSize: '0.82rem',
    gap: '6px',
  },
}
