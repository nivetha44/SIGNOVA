import { Hand, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function GithubIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>

          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <Hand size={20} color="#fff" />
              </div>
              <span style={styles.logoText}>SIGNOVA</span>
            </div>
            <p style={styles.brandDesc}>
              AI-powered Indian Sign Language recognition
              and accessibility platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <div style={styles.links}>
              <Link to="/translator" style={styles.link}>Translator</Link>
              <Link to="/learn" style={styles.link}>Learn ISL</Link>
              <Link to="/practice" style={styles.link}>Practice</Link>
              <Link to="/about" style={styles.link}>About</Link>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={styles.colTitle}>Built With</h4>
            <div style={styles.links}>
              <span style={styles.link}>React + Vite</span>
              <span style={styles.link}>Node.js + Express</span>
              <span style={styles.link}>MongoDB</span>
              <span style={styles.link}>MediaPipe</span>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 style={styles.colTitle}>Connect</h4>
            <div style={styles.socials}>
              <a href="#" style={styles.socialIcon} aria-label="GitHub">
                <GithubIcon size={20} />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="LinkedIn">
                <LinkedinIcon size={20} />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © 2025 SIGNOVA. Built for accessibility.
          </p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '60px 0 30px',
    marginTop: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandDesc: {
    fontSize: '0.85rem',
    color: '#6B7280',
    lineHeight: 1.6,
    maxWidth: '250px',
  },
  colTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#fff',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '0.85rem',
    color: '#6B7280',
    textDecoration: 'none',
    transition: 'color 0.3s',
    cursor: 'pointer',
  },
  socials: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9CA3AF',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '20px',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#4B5563',
  },
}