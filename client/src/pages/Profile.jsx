import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Flame,
  Zap,
  Award,
  LogOut,
  Settings as SettingsIcon,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getStats } from '../services/localStore'

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const stats = getStats()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const achievements = [
    { title: 'First Sign Mastered', desc: 'Successfully performed your first ISL gesture in front of the camera', unlocked: true, icon: '🌟' },
    { title: 'Streak Builder', desc: 'Maintained practice consistency for 3 consecutive days', unlocked: (stats.currentStreak || 0) >= 3, icon: '🔥' },
    { title: 'Sentence Creator', desc: 'Constructed a multi-word message in Sentence Builder', unlocked: true, icon: '✍️' },
    { title: 'Sharp Eyes', desc: 'Achieved 90%+ recognition accuracy in Practice Arena', unlocked: (stats.accuracy || 0) >= 90, icon: '🎯' },
    { title: 'ISL Champion', desc: 'Earned 500+ XP in the learning community', unlocked: (stats.xp || 0) >= 500, icon: '🏆' },
  ]

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_profile', 'LEARNER PROFILE')}</p>
          <h1 style={styles.title}>{user?.name || 'Learner Profile'}</h1>
          <p style={styles.subtitle}>Manage your learning identity, streaks, and community achievements.</p>
        </div>

        {/* Profile Grid */}
        <div style={styles.layout}>
          {/* Left Column: User Card */}
          <div style={styles.leftCol}>
            <div className="glass-card" style={styles.profileCard}>
              <div style={styles.avatarWrap}>
                <User size={46} color="var(--pink-soft)" />
              </div>

              <h2 style={styles.userName}>{user?.name || 'Guest Learner'}</h2>
              <p style={styles.userEmail}>{user?.email || 'Local offline session'}</p>

              <div style={styles.userStatsRow}>
                <div style={styles.userStat}>
                  <Zap size={16} color="#FF2E93" />
                  <strong>{stats.xp || 320}</strong>
                  <small>XP</small>
                </div>
                <div style={styles.userStat}>
                  <Flame size={16} color="#FF5722" />
                  <strong>{stats.currentStreak || 1}</strong>
                  <small>Streak</small>
                </div>
                <div style={styles.userStat}>
                  <Award size={16} color="#10B981" />
                  <strong>Level {stats.level || 2}</strong>
                  <small>Rank</small>
                </div>
              </div>

              <div style={styles.btnCol}>
                <Link to="/settings" className="btn-secondary" style={styles.fullBtn}>
                  <SettingsIcon size={15} />
                  {t('nav_settings', 'Settings & Preferences')}
                </Link>

                {isAuthenticated ? (
                  <button onClick={handleLogout} className="btn-secondary" style={{ ...styles.fullBtn, color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                    <LogOut size={15} />
                    {t('nav_logout', 'Sign Out')}
                  </button>
                ) : (
                  <Link to="/login" className="btn-primary" style={styles.fullBtn}>
                    {t('nav_login', 'Sign In to Sync Account')}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements */}
          <div style={styles.rightCol}>
            <div className="glass-card" style={styles.achievementsCard}>
              <h2 style={styles.sectionTitle}>Learner Badges & Milestones</h2>
              <div style={styles.achievementsList}>
                {achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.achItem,
                      opacity: ach.unlocked ? 1 : 0.4,
                      borderColor: ach.unlocked ? 'var(--pink-border)' : 'var(--border-color)',
                      background: ach.unlocked ? 'rgba(255, 46, 147, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <span style={styles.achEmoji}>{ach.icon}</span>
                    <div style={styles.achInfo}>
                      <h4 style={styles.achTitle}>
                        {ach.title} {ach.unlocked && <CheckCircle2 size={14} color="#10B981" style={{ display: 'inline' }} />}
                      </h4>
                      <p style={styles.achDesc}>{ach.desc}</p>
                    </div>
                  </div>
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
    maxWidth: '1000px',
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
    gridTemplateColumns: '320px 1fr',
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
  profileCard: {
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '14px',
    borderRadius: '22px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
  },
  avatarWrap: {
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    background: 'rgba(255, 46, 147, 0.15)',
    border: '2px solid var(--pink-primary)',
    boxShadow: '0 0 20px rgba(255, 46, 147, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  userName: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  userStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    width: '100%',
    margin: '10px 0',
  },
  userStat: {
    padding: '12px 6px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
  },
  btnCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  fullBtn: {
    width: '100%',
    padding: '11px',
    fontSize: '0.84rem',
    justifyContent: 'center',
  },
  achievementsCard: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    borderRadius: '22px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  achievementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  achItem: {
    padding: '16px 18px',
    borderRadius: '14px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  achEmoji: {
    fontSize: '1.8rem',
  },
  achInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  achTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  achDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
}
