import { useState, useEffect } from 'react'
import { Flame, Zap, ShieldCheck, User } from 'lucide-react'
import { getStats, getSettings, saveSettings } from '../services/localStore'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Leaderboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [stats, setStats] = useState(getStats())
  const [optIn, setOptIn] = useState(() => getSettings().leaderboardOptIn !== false)

  useEffect(() => {
    setStats(getStats())
  }, [])

  const handleToggleOptIn = (e) => {
    const val = e.target.checked
    setOptIn(val)
    saveSettings({ leaderboardOptIn: val })
  }

  // Top 3 Podium Leaders
  const topPodium = [
    { rank: 1, name: 'Ananya S.', xp: 12450, streak: 34, level: 18, medal: '🥇' },
    { rank: 2, name: 'Rahul V.', xp: 11890, streak: 28, level: 16, medal: '🥈' },
    { rank: 3, name: 'Kavitha M.', xp: 11200, streak: 22, level: 15, medal: '🥉' },
  ]

  const rankedUsers = [
    { rank: 4, name: 'Dev P.', xp: 9800, streak: 19, level: 14 },
    { rank: 5, name: 'Priya K.', xp: 8750, streak: 15, level: 12 },
    { rank: 6, name: 'Siddharth R.', xp: 7600, streak: 12, level: 10 },
    { rank: 7, name: 'Neha G.', xp: 6900, streak: 10, level: 9 },
    { rank: 8, name: 'Aditya T.', xp: 5800, streak: 8, level: 7 },
  ]

  const userRank = 9
  const userName = user?.name || 'You (Learner)'

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_leaderboard', 'COMMUNITY RANKINGS')}</p>
          <h1 style={styles.title}>{t('lead_title', 'Learner Leaderboard')}</h1>
          <p style={styles.subtitle}>
            {t(
              'lead_subtitle',
              'Celebrate consistency and accuracy across the Indian Sign Language learning community.'
            )}
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div style={styles.podiumGrid}>
          {topPodium.map((leader) => (
            <div
              key={leader.rank}
              className="glass-card"
              style={{
                ...styles.podiumCard,
                borderColor: leader.rank === 1 ? 'var(--pink-primary)' : 'rgba(255, 46, 147, 0.25)',
                boxShadow: leader.rank === 1 ? '0 12px 35px rgba(255, 46, 147, 0.25)' : 'none',
              }}
            >
              <div style={styles.podiumRankWrap}>
                <span style={styles.medalEmoji}>{leader.medal}</span>
                <span style={styles.rankNum}>#{leader.rank}</span>
              </div>

              <div style={styles.podiumAvatar}>
                <User size={32} color="var(--pink-soft)" />
              </div>

              <h3 style={styles.podiumName}>{leader.name}</h3>
              <span style={styles.podiumLevel}>Level {leader.level}</span>

              <div style={styles.podiumStats}>
                <div style={styles.podiumStat}>
                  <Zap size={15} color="#FF2E93" />
                  <strong>{leader.xp.toLocaleString()} XP</strong>
                </div>
                <div style={styles.podiumStat}>
                  <Flame size={15} color="#FF5722" />
                  <strong>{leader.streak}d</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Highlight Row */}
        {optIn && (
          <div className="glass-card" style={styles.userHighlightRow}>
            <div style={styles.userLeft}>
              <span style={styles.userRankNum}>#{userRank}</span>
              <div style={styles.userAvatar}>
                <User size={20} color="var(--pink-soft)" />
              </div>
              <div>
                <h4 style={styles.userNameText}>{userName}</h4>
                <span style={styles.userLevelTag}>Level {stats.level || 2} Learner</span>
              </div>
            </div>

            <div style={styles.userRight}>
              <div style={styles.userStatBadge}>
                <Zap size={16} color="#FF2E93" />
                <strong>{stats.xp || 320} XP</strong>
              </div>
              <div style={styles.userStatBadge}>
                <Flame size={16} color="#FF5722" />
                <strong>{stats.currentStreak || 1}d</strong>
              </div>
            </div>
          </div>
        )}

        {/* Ranked Community List */}
        <div className="glass-card" style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span>Rank & Learner</span>
            <span>Level</span>
            <span>Streak</span>
            <span>XP Points</span>
          </div>

          <div style={styles.tableRows}>
            {rankedUsers.map((u) => (
              <div key={u.rank} style={styles.tableRow}>
                <div style={styles.rowUser}>
                  <span style={styles.rowRank}>#{u.rank}</span>
                  <span style={styles.rowName}>{u.name}</span>
                </div>
                <span style={styles.rowLevel}>Lv {u.level}</span>
                <span style={styles.rowStreak}>
                  <Flame size={14} color="#FF5722" style={{ display: 'inline', marginRight: 2 }} />
                  {u.streak}d
                </span>
                <span style={styles.rowXp}>
                  <Zap size={14} color="#FF2E93" style={{ display: 'inline', marginRight: 2 }} />
                  {u.xp.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Opt-Out */}
        <div style={styles.privacyRow}>
          <label style={styles.optInLabel}>
            <input
              type="checkbox"
              checked={optIn}
              onChange={handleToggleOptIn}
              style={{ cursor: 'pointer', accentColor: 'var(--pink-primary)' }}
            />
            <ShieldCheck size={16} color="var(--pink-soft)" />
            <span>{t('set_leaderboard_visible', 'Display my learner rank on the public leaderboard')}</span>
          </label>
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
    maxWidth: '960px',
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
  podiumGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  podiumCard: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid',
  },
  podiumRankWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  medalEmoji: {
    fontSize: '1.4rem',
  },
  rankNum: {
    fontSize: '0.82rem',
    fontWeight: 800,
    color: 'var(--pink-soft)',
  },
  podiumAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(255, 46, 147, 0.15)',
    border: '1.5px solid var(--pink-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '4px 0',
  },
  podiumName: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  podiumLevel: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  podiumStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '10px',
    width: '100%',
    justifyContent: 'center',
  },
  podiumStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.78rem',
  },
  userHighlightRow: {
    padding: '16px 24px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.2) 0%, rgba(28, 11, 24, 0.95) 100%)',
    border: '1.5px solid var(--pink-primary)',
    boxShadow: '0 8px 30px rgba(255, 46, 147, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '14px',
  },
  userLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  userRankNum: {
    fontSize: '1.3rem',
    fontWeight: 900,
    color: '#FFFFFF',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 46, 147, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  userLevelTag: {
    fontSize: '0.72rem',
    color: 'var(--pink-soft)',
  },
  userRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userStatBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: 800,
  },
  tableCard: {
    padding: '24px',
    borderRadius: '20px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
    paddingBottom: '14px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  tableRows: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
  },
  rowUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rowRank: {
    fontSize: '0.84rem',
    fontWeight: 800,
    color: 'var(--text-muted)',
    width: '28px',
  },
  rowName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  rowLevel: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  rowStreak: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  rowXp: {
    fontSize: '0.86rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  privacyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optInLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
}
