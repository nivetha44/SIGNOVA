import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  BookOpen,
  Gamepad2,
  PenLine,
  Type,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Clock,
  Sparkles,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Trash2,
} from 'lucide-react'
import {
  getStats,
  getDailyChallenge,
  getFrequentPhrases,
  removeFrequentPhrase,
} from '../services/localStore'
import { SIGNS } from '../data/signs'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { language, t } = useLanguage()
  const { user } = useAuth()

  const [stats, setStats] = useState(getStats())
  const [daily, setDaily] = useState(getDailyChallenge())
  const [phrases, setPhrases] = useState(getFrequentPhrases())

  useEffect(() => {
    setStats(getStats())
    setDaily(getDailyChallenge())
    setPhrases(getFrequentPhrases())
  }, [])

  const handleSpeakPhrase = (text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  const handleRemovePhrase = (id) => {
    removeFrequentPhrase(id)
    setPhrases(getFrequentPhrases())
  }

  const modelSigns = SIGNS.filter((s) => s.supportedByModel)

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.eyebrowRow}>
              <span className="eyebrow">{t('dash_welcome_back', 'AI-POWERED ACCESSIBILITY PLATFORM')}</span>
              <div style={styles.heroBadge}>
                <Sparkles size={13} color="var(--pink-soft)" />
                <span>MediaPipe AI Active</span>
              </div>
            </div>

            <h1 style={styles.heroTitle}>
              {user ? `Welcome back, ${user.name.split(' ')[0]} 👋` : 'Welcome back 👋'}
            </h1>
            <p style={styles.heroSubtitle}>
              Keep learning. Keep connecting. Real-time Indian Sign Language recognition, learning, and communication.
            </p>

            <div style={styles.heroBtnRow}>
              <Link to="/translator" className="btn-primary" style={styles.heroMainBtn}>
                <Camera size={18} />
                {t('dash_start_translation', 'Open Live Translator')}
                <ArrowRight size={16} />
              </Link>
              <Link to="/practice" className="btn-secondary" style={styles.heroSecBtn}>
                <Gamepad2 size={18} color="var(--pink-soft)" />
                {t('dash_start_practice', 'Enter Practice Arena')}
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Metric Cards */}
        <section style={styles.metricsGrid}>
          <MetricCard
            icon={Flame}
            value={`${stats.currentStreak || 0} Days`}
            label={t('dash_current_streak', 'Current Streak')}
            color="#FF5722"
            accent="rgba(255, 87, 34, 0.15)"
          />
          <MetricCard
            icon={Zap}
            value={`${stats.xp || 0} XP`}
            label={t('dash_xp_earned', 'XP Earned')}
            color="#FF2E93"
            accent="rgba(255, 46, 147, 0.15)"
          />
          <MetricCard
            icon={Target}
            value={`${stats.accuracy || 88}%`}
            label={t('dash_recognition_acc', 'Recognition Accuracy')}
            color="#10B981"
            accent="rgba(16, 185, 129, 0.15)"
          />
          <MetricCard
            icon={Clock}
            value={`${stats.signsLearned || 14} / 500`}
            label={t('dash_total_practice_time', 'Signs Learned')}
            color="#C026D3"
            accent="rgba(192, 38, 211, 0.15)"
          />
        </section>

        {/* Daily Challenge Card */}
        <section className="glass-card" style={styles.dailyCard}>
          <div style={styles.dailyLeft}>
            <div style={styles.dailyIconWrap}>
              <Trophy size={28} color="#FF2E93" />
            </div>
            <div style={styles.dailyInfo}>
              <div style={styles.dailyHeaderRow}>
                <h3 style={styles.dailyTitle}>{t('dash_daily_challenge', 'Daily ISL Challenge')}</h3>
                <span style={styles.dailyXpBadge}>+150 XP Bonus</span>
              </div>
              <p style={styles.dailyDesc}>
                Practice today's 3 selected signs to build your streak and earn bonus experience points.
              </p>
              <div style={styles.targetsRow}>
                {daily.targets.map((tgt, idx) => {
                  const isDone = daily.completed.includes(tgt)
                  return (
                    <span
                      key={idx}
                      style={{
                        ...styles.targetChip,
                        background: isDone ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 46, 147, 0.12)',
                        borderColor: isDone ? '#10B981' : 'var(--pink-border)',
                        color: isDone ? '#10B981' : 'var(--text-primary)',
                      }}
                    >
                      {isDone && <CheckCircle2 size={13} style={{ display: 'inline', marginRight: 4 }} />}
                      {tgt}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          <Link to="/practice" state={{ targetSign: daily.targets[0] }} className="btn-primary" style={styles.dailyBtn}>
            {t('dash_complete_challenge', 'Start Daily Challenge')}
          </Link>
        </section>

        {/* Quick Action Tiles */}
        <section style={styles.section}>
          <div style={styles.sectionHeading}>
            <div>
              <p className="eyebrow">{t('dash_quick_actions', 'STUDIO TOOLS')}</p>
              <h2 style={styles.sectionTitle}>Explore Platform Features</h2>
            </div>
          </div>

          <div style={styles.actionsGrid}>
            <ActionCard
              to="/translator"
              icon={Camera}
              title={t('dash_action_live', 'Live Translation')}
              desc="Translate Indian Sign Language to text & voice in real-time via camera."
              gradient="linear-gradient(135deg, rgba(255, 46, 147, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)"
            />
            <ActionCard
              to="/practice"
              icon={Gamepad2}
              title={t('dash_action_practice', 'Practice Arena')}
              desc="Play 5 evaluation game modes, test your speed, and earn rank XP."
              gradient="linear-gradient(135deg, rgba(192, 38, 211, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)"
            />
            <ActionCard
              to="/learn"
              icon={BookOpen}
              title={t('dash_action_learn', 'Learn Signs')}
              desc="Visual library with step-by-step instructions, pro tips, and examples."
              gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)"
            />
            <ActionCard
              to="/sentence-builder"
              icon={PenLine}
              title={t('dash_action_builder', 'Sentence Builder')}
              desc="Construct sign sequences with grammar smoothing in EN, TA, and HI."
              gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)"
            />
            <ActionCard
              to="/text-to-sign"
              icon={Type}
              title={t('dash_action_text_sign', 'Text → Sign')}
              desc="Convert written messages into animated visual sign sequences."
              gradient="linear-gradient(135deg, rgba(0, 212, 255, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)"
            />
          </div>
        </section>

        {/* Live Supported Signs Strip */}
        <section style={styles.section}>
          <div style={styles.sectionHeading}>
            <div>
              <p className="eyebrow">{t('dash_supported_signs', 'ON-DEVICE AI VOCABULARY')}</p>
              <h2 style={styles.sectionTitle}>14 Core Signs Recognized in Real-Time</h2>
            </div>
            <Link to="/learn" style={styles.textLink}>
              {t('common_view_all', 'View all signs')} <ArrowRight size={14} />
            </Link>
          </div>

          <div style={styles.signsStrip}>
            {modelSigns.map((sign) => (
              <Link key={sign.id} to="/learn" state={{ selectedSign: sign }} className="glass-card" style={styles.signMini}>
                <span style={styles.signEmoji}>{sign.emoji}</span>
                <strong style={styles.signName}>{sign.name}</strong>
                <small style={styles.signMeaning}>{sign.meaning[language] || sign.meaning.en}</small>
              </Link>
            ))}
          </div>
        </section>

        {/* Frequently Used Phrases */}
        {phrases.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionHeading}>
              <div>
                <p className="eyebrow">{t('dash_frequent_phrases', 'FREQUENTLY USED PHRASES')}</p>
                <h2 style={styles.sectionTitle}>Quick Communication Shortcuts</h2>
              </div>
            </div>

            <div style={styles.phrasesGrid}>
              {phrases.map((phrase) => (
                <div key={phrase.id} className="glass-card" style={styles.phraseCard}>
                  <div style={styles.phraseLeft}>
                    <strong style={styles.phraseText}>{phrase.text}</strong>
                    <span style={styles.phraseLang}>{phrase.language.toUpperCase()}</span>
                  </div>
                  <div style={styles.phraseActions}>
                    <button
                      onClick={() => handleSpeakPhrase(phrase.text)}
                      className="btn-secondary"
                      style={styles.phraseActionBtn}
                      title="Speak aloud"
                    >
                      <Volume2 size={15} color="var(--pink-soft)" />
                    </button>
                    <button
                      onClick={() => handleRemovePhrase(phrase.id)}
                      className="btn-secondary"
                      style={{ ...styles.phraseActionBtn, borderColor: 'rgba(239,68,68,0.3)' }}
                      title="Delete"
                    >
                      <Trash2 size={15} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Privacy Note */}
        <div style={styles.privacyBanner}>
          <ShieldCheck size={16} color="var(--pink-soft)" />
          <span>{t('dash_camera_privacy', '🔒 Your camera feed is processed in real time and is not recorded or stored.')}</span>
        </div>
      </div>
    </main>
  )
}

function MetricCard({ icon: Icon, value, label, color, accent }) {
  return (
    <div className="glass-card" style={styles.metricCard}>
      <div style={{ ...styles.metricIconWrap, background: accent, borderColor: `rgba(255, 46, 147, 0.2)` }}>
        <Icon size={22} color={color} />
      </div>
      <div style={styles.metricText}>
        <strong style={styles.metricValue}>{value}</strong>
        <span style={styles.metricLabel}>{label}</span>
      </div>
    </div>
  )
}

function ActionCard({ to, icon: Icon, title, desc, gradient }) {
  return (
    <Link to={to} className="glass-card" style={{ ...styles.actionCard, background: gradient }}>
      <div style={styles.actionTop}>
        <div style={styles.actionIconWrap}>
          <Icon size={24} color="#FFFFFF" />
        </div>
        <ArrowRight size={18} color="var(--pink-soft)" style={styles.actionArrow} />
      </div>
      <div style={styles.actionInfo}>
        <h3 style={styles.actionTitle}>{title}</h3>
        <p style={styles.actionDesc}>{desc}</p>
      </div>
    </Link>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    maxWidth: '1200px',
  },
  hero: {
    padding: '42px 36px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(28, 11, 24, 0.9) 0%, rgba(16, 8, 18, 0.95) 50%, rgba(5, 5, 5, 0.98) 100%)',
    border: '1px solid rgba(255, 46, 147, 0.25)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 35px rgba(255, 46, 147, 0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxWidth: '720px',
  },
  eyebrowRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.15)',
    border: '1px solid rgba(255, 46, 147, 0.35)',
    color: 'var(--pink-soft)',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
    fontWeight: 900,
    letterSpacing: '-0.03em',
    color: '#FFFFFF',
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  heroBtnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  heroMainBtn: {
    padding: '14px 30px',
    fontSize: '0.95rem',
  },
  heroSecBtn: {
    padding: '14px 26px',
    fontSize: '0.95rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  metricCard: {
    padding: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderRadius: '18px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.6) 0%, rgba(11, 8, 13, 0.85) 100%)',
    border: '1px solid var(--border-color)',
  },
  metricIconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    flexShrink: 0,
  },
  metricText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metricValue: {
    fontSize: '1.55rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
  },
  metricLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  dailyCard: {
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.12) 0%, rgba(20, 10, 22, 0.9) 100%)',
    border: '1.5px solid rgba(255, 46, 147, 0.35)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 46, 147, 0.1)',
    flexWrap: 'wrap',
  },
  dailyLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
    flex: 1,
    minWidth: '280px',
  },
  dailyIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255, 46, 147, 0.18)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dailyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  dailyHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  dailyTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  dailyXpBadge: {
    padding: '3px 9px',
    background: 'rgba(255, 46, 147, 0.25)',
    border: '1px solid var(--pink-primary)',
    borderRadius: '9999px',
    color: '#FFFFFF',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
  },
  dailyDesc: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  targetsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
    flexWrap: 'wrap',
  },
  targetChip: {
    padding: '5px 12px',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.76rem',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
  },
  dailyBtn: {
    padding: '12px 24px',
    fontSize: '0.88rem',
    flexShrink: 0,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeading: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  textLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    color: 'var(--pink-soft)',
    fontSize: '0.82rem',
    fontWeight: 700,
    textDecoration: 'none',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '14px',
  },
  actionCard: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '18px',
    borderRadius: '18px',
    border: '1px solid var(--border-color)',
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    minHeight: '170px',
  },
  actionTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionArrow: {
    transition: 'transform 0.2s ease',
  },
  actionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  actionTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  actionDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.45,
  },
  signsStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
    gap: '10px',
  },
  signMini: {
    padding: '14px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '4px',
    borderRadius: '14px',
    textDecoration: 'none',
    background: 'rgba(16, 10, 18, 0.65)',
    border: '1px solid var(--border-color)',
  },
  signEmoji: {
    fontSize: '1.8rem',
    marginBottom: '2px',
  },
  signName: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  signMeaning: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  phrasesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px',
  },
  phraseCard: {
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '14px',
    borderRadius: '14px',
    background: 'rgba(16, 10, 18, 0.75)',
  },
  phraseLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  phraseText: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  phraseLang: {
    fontSize: '0.68rem',
    color: 'var(--pink-soft)',
    fontWeight: 700,
  },
  phraseActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  phraseActionBtn: {
    width: '32px',
    height: '32px',
    padding: 0,
    borderRadius: '8px',
  },
  privacyBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    background: 'rgba(255, 46, 147, 0.05)',
    border: '1px solid rgba(255, 46, 147, 0.2)',
    borderRadius: '14px',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
    textAlign: 'center',
  },
}
