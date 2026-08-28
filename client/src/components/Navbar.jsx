import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hand,
  LayoutDashboard,
  Camera,
  BookOpen,
  Gamepad2,
  PenLine,
  Type,
  Clock,
  BarChart3,
  Globe,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  LogIn,
  User,
  Settings as SettingsIcon,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdown, setLangDropdown] = useState(false)
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme, textSize, setTextSize } = useTheme()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setLangDropdown(false)
  }, [location])

  const navLinks = [
    { to: '/dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard },
    { to: '/translator', label: t('nav_translator', 'Translator'), icon: Camera },
    { to: '/practice', label: t('nav_practice', 'Practice'), icon: Gamepad2 },
    { to: '/learn', label: t('nav_learn', 'Learn'), icon: BookOpen },
    { to: '/sentence-builder', label: t('nav_sentence_builder', 'Sentences'), icon: PenLine },
    { to: '/text-to-sign', label: t('nav_text_to_sign', 'Text→Sign'), icon: Type },
    { to: '/history', label: t('nav_history', 'History'), icon: Clock },
    { to: '/progress', label: t('nav_progress', 'Progress'), icon: BarChart3 },
  ]

  const nextTextSize = () => {
    if (textSize === 'normal') setTextSize('large')
    else if (textSize === 'large') setTextSize('xlarge')
    else setTextSize('normal')
  }

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('system')
    else setTheme('dark')
  }

  return (
    <>
      <nav
        style={{
          ...styles.nav,
          ...(isScrolled ? styles.navScrolled : {}),
        }}
      >
        <div className="container" style={styles.container}>
          {/* Logo */}
          <Link to="/dashboard" style={styles.logo} title="SIGNOVA — Bridging Silence, Building Understanding">
            <div style={styles.logoIcon}>
              <Hand size={20} color="#FFFFFF" />
            </div>
            <div style={styles.brandTextWrap}>
              <span style={styles.logoText}>SIGNOVA</span>
              <span style={styles.logoTagline} className="desktop-only">ISL AI</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="desktop-only" style={styles.desktopLinks}>
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to || (link.to === '/dashboard' && location.pathname === '/')
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  }}
                >
                  <link.icon size={15} style={{ color: isActive ? 'var(--pink-soft)' : 'inherit' }} />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      style={styles.activePill}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Controls: Language, Theme, Text Scaling, User */}
          <div style={styles.rightControls}>
            {/* Language Selector */}
            <div style={styles.dropdownWrap}>
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                style={styles.toolBtn}
                title="Change language"
                aria-label="Language selector"
              >
                <Globe size={15} color="var(--pink-soft)" />
                <span style={styles.langLabel}>
                  {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिन्दी' : 'EN'}
                </span>
              </button>

              {langDropdown && (
                <div style={styles.dropdownMenu}>
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setLangDropdown(false)
                    }}
                    style={{ ...styles.dropdownItem, color: language === 'en' ? 'var(--pink-primary)' : 'inherit', fontWeight: language === 'en' ? 700 : 500 }}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ta')
                      setLangDropdown(false)
                    }}
                    style={{ ...styles.dropdownItem, color: language === 'ta' ? 'var(--pink-primary)' : 'inherit', fontWeight: language === 'ta' ? 700 : 500 }}
                  >
                    🇮🇳 தமிழ் (Tamil)
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi')
                      setLangDropdown(false)
                    }}
                    style={{ ...styles.dropdownItem, color: language === 'hi' ? 'var(--pink-primary)' : 'inherit', fontWeight: language === 'hi' ? 700 : 500 }}
                  >
                    🇮🇳 हिन्दी (Hindi)
                  </button>
                </div>
              )}
            </div>

            {/* Text Size Scaler */}
            <button onClick={nextTextSize} style={styles.toolBtn} title={`Text scaling: ${textSize}`} aria-label="Text scaling">
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--pink-soft)' }}>
                {textSize === 'xlarge' ? 'A++' : textSize === 'large' ? 'A+' : 'A'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={styles.toolBtn} title={`Theme: ${theme}`} aria-label="Toggle theme">
              {theme === 'light' ? <Sun size={15} color="var(--pink-soft)" /> : theme === 'dark' ? <Moon size={15} color="var(--pink-soft)" /> : <Monitor size={15} color="var(--pink-soft)" />}
            </button>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <Link to="/profile" style={styles.userBadge} title="Your profile">
                <User size={15} color="var(--pink-soft)" />
                <span className="desktop-only">{user?.name?.split(' ')[0] || t('nav_profile', 'Profile')}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary" style={styles.loginBtn}>
                <LogIn size={15} />
                <span className="desktop-only">{t('nav_login', 'Login')}</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only"
              style={styles.menuBtn}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} color="var(--pink-primary)" /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={styles.mobileDrawer}
          >
            <div style={styles.drawerLinks}>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} style={styles.drawerItem}>
                  <link.icon size={18} color="var(--pink-soft)" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link to="/settings" style={styles.drawerItem}>
                <SettingsIcon size={18} color="var(--pink-soft)" />
                <span>{t('nav_settings', 'Settings')}</span>
              </Link>
              <Link to="/about" style={styles.drawerItem}>
                <Hand size={18} color="var(--pink-soft)" />
                <span>{t('nav_about', 'About SIGNOVA')}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '72px',
    zIndex: 1000,
    transition: 'all 0.25s ease',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(5, 5, 5, 0.82)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  },
  navScrolled: {
    background: 'rgba(10, 6, 11, 0.95)',
    borderBottom: '1px solid rgba(255, 46, 147, 0.22)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #FF2E93 0%, #C026D3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(255, 46, 147, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  brandTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FDA4AF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  logoTagline: {
    fontSize: '0.62rem',
    fontWeight: 800,
    color: 'var(--pink-primary)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  navLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 13px',
    fontSize: '0.84rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    borderRadius: '9999px',
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1,
  },
  navLinkActive: {
    color: '#FFFFFF',
    fontWeight: 700,
  },
  activePill: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.2) 0%, rgba(28, 11, 24, 0.8) 100%)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    borderRadius: '9999px',
    boxShadow: '0 0 16px rgba(255, 46, 147, 0.15)',
    zIndex: -1,
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  dropdownWrap: {
    position: 'relative',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 11px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.78rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  langLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    background: '#120914',
    border: '1px solid var(--pink-border)',
    borderRadius: '12px',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 46, 147, 0.15)',
    padding: '6px',
    minWidth: '160px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  dropdownItem: {
    padding: '8px 12px',
    fontSize: '0.82rem',
    color: 'var(--text-primary)',
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    background: 'rgba(255, 46, 147, 0.12)',
    border: '1px solid var(--pink-border)',
    borderRadius: '9999px',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 0 12px rgba(255, 46, 147, 0.15)',
  },
  loginBtn: {
    padding: '8px 18px',
    fontSize: '0.82rem',
    fontWeight: 700,
    gap: '6px',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  mobileDrawer: {
    position: 'fixed',
    top: '72px',
    left: 0,
    right: 0,
    background: 'rgba(10, 6, 11, 0.98)',
    borderBottom: '1px solid var(--pink-border)',
    zIndex: 999,
    padding: '18px 16px',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
  },
  drawerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  drawerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
}