import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Camera, BookOpen, Gamepad2, PenLine } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function MobileNav() {
  const location = useLocation()
  const { t } = useLanguage()

  const items = [
    { to: '/dashboard', label: t('nav_dashboard', 'Home'), icon: LayoutDashboard },
    { to: '/translator', label: t('nav_translator', 'Translate'), icon: Camera },
    { to: '/practice', label: t('nav_practice', 'Practice'), icon: Gamepad2 },
    { to: '/learn', label: t('nav_learn', 'Learn'), icon: BookOpen },
    { to: '/sentence-builder', label: t('nav_sentence_builder', 'Sentences'), icon: PenLine },
  ]

  return (
    <nav style={styles.mobileNav} className="mobile-only" aria-label="Mobile navigation">
      {items.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/')
        return (
          <Link
            key={to}
            to={to}
            style={{
              ...styles.navItem,
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                ...styles.iconWrap,
                background: isActive ? 'linear-gradient(135deg, rgba(255, 46, 147, 0.25) 0%, rgba(28, 11, 24, 0.8) 100%)' : 'transparent',
                borderColor: isActive ? 'rgba(255, 46, 147, 0.5)' : 'transparent',
                boxShadow: isActive ? '0 0 14px rgba(255, 46, 147, 0.25)' : 'none',
              }}
            >
              <Icon size={18} color={isActive ? 'var(--pink-soft)' : 'currentColor'} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ ...styles.label, fontWeight: isActive ? 700 : 500, color: isActive ? '#FFFFFF' : 'inherit' }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

const styles = {
  mobileNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '66px',
    background: 'rgba(10, 6, 11, 0.95)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderTop: '1px solid var(--pink-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1000,
    padding: '0 6px',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.6)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    flex: 1,
    height: '100%',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  iconWrap: {
    width: '36px',
    height: '28px',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
  },
  label: {
    fontSize: '0.64rem',
    letterSpacing: '-0.01em',
  },
}
