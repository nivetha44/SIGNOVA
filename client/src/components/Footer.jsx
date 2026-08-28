import { Link } from 'react-router-dom'
import { Hand, ShieldCheck, Heart } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        {/* Top Info */}
        <div style={styles.topRow}>
          {/* Brand */}
          <div style={styles.brandCol}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <Hand size={18} color="#FFFFFF" />
              </div>
              <span style={styles.logoText}>SIGNOVA</span>
            </div>
            <p style={styles.tagline}>Bridging Silence, Building Understanding.</p>
            <p style={styles.mission}>
              Real-time AI Indian Sign Language recognition, interactive learning, and accessibility tools.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Platform</h4>
            <Link to="/translator" style={styles.link}>{t('nav_translator', 'Live Translator')}</Link>
            <Link to="/practice" style={styles.link}>{t('nav_practice', 'Practice Arena')}</Link>
            <Link to="/learn" style={styles.link}>{t('nav_learn', 'Sign Curriculum')}</Link>
            <Link to="/sentence-builder" style={styles.link}>{t('nav_sentence_builder', 'Sentence Builder')}</Link>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Features</h4>
            <Link to="/text-to-sign" style={styles.link}>{t('nav_text_to_sign', 'Text to Sign')}</Link>
            <Link to="/progress" style={styles.link}>{t('nav_progress', 'Progress Analytics')}</Link>
            <Link to="/leaderboard" style={styles.link}>{t('nav_leaderboard', 'Leaderboard')}</Link>
            <Link to="/history" style={styles.link}>{t('nav_history', 'Translation Logs')}</Link>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Account & Info</h4>
            <Link to="/profile" style={styles.link}>{t('nav_profile', 'Learner Profile')}</Link>
            <Link to="/settings" style={styles.link}>{t('nav_settings', 'Settings & Theme')}</Link>
            <Link to="/about" style={styles.link}>{t('nav_about', 'About AI Architecture')}</Link>
            <a
              href="https://github.com/nivetha44/SIGNOVA.git"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.githubLink}
            >
              <GithubIcon size={16} />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomRow}>
          <div style={styles.privacyNote}>
            <ShieldCheck size={14} color="var(--pink-soft)" />
            <span>On-device real-time AI. Zero video footage is recorded or saved.</span>
          </div>

          <div style={styles.copyright}>
            <span>Crafted with</span>
            <Heart size={14} color="#FF2E93" fill="#FF2E93" />
            <span>for ISL Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#070408',
    borderTop: '1px solid rgba(255, 46, 147, 0.18)',
    padding: '48px 0 28px',
    color: 'var(--text-secondary)',
    position: 'relative',
    zIndex: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
  },
  topRow: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
    gap: '32px',
    flexWrap: 'wrap',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #FF2E93 0%, #C026D3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 14px rgba(255, 46, 147, 0.35)',
  },
  logoText: {
    fontSize: '1.15rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--pink-soft)',
  },
  mission: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    maxWidth: '280px',
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  colTitle: {
    fontSize: '0.76rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  link: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  githubLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    marginTop: '4px',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '20px',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
  },
  privacyNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  copyright: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
}