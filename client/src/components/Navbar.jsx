import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hand,
  Home,
  Camera,
  BookOpen,
  Gamepad2,
  Clock,
  Info,
  Menu,
  X,
  LogIn
} from 'lucide-react'

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/translator', label: 'Translator', icon: Camera },
  { path: '/learn', label: 'Learn ISL', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Gamepad2 },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          ...styles.nav,
          ...(isScrolled ? styles.navScrolled : {}),
        }}
      >
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <Hand size={24} color="#fff" />
            </div>
            <span style={styles.logoText}>SIGNOVA</span>
          </Link>

          {/* Desktop Links */}
          <div className="desktop-only" style={styles.desktopLinks}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  }}
                >
                  <link.icon size={16} />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      style={styles.activeIndicator}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Login Button */}
          <Link to="/login" className="desktop-only" style={styles.loginBtn}>
            <LogIn size={16} />
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-only"
            style={styles.menuBtn}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={styles.mobileMenu}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...styles.mobileLink,
                    ...(isActive ? styles.mobileLinkActive : {}),
                  }}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              )
            })}
            <Link to="/login" style={styles.mobileLogin}>
              <LogIn size={20} />
              Login
            </Link>
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
    height: '70px',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    borderBottom: '1px solid transparent',
  },
  navScrolled: {
    background: 'rgba(11, 16, 32, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#9CA3AF',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
  navLinkActive: {
    color: '#FFFFFF',
    background: 'rgba(108, 99, 255, 0.15)',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
  },
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    borderRadius: '9999px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  mobileMenu: {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    background: 'rgba(11, 16, 32, 0.98)',
    backdropFilter: 'blur(20px)',
    padding: '20px',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  mobileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#9CA3AF',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  mobileLinkActive: {
    color: '#fff',
    background: 'rgba(108, 99, 255, 0.15)',
  },
  mobileLogin: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    borderRadius: '12px',
    textDecoration: 'none',
    marginTop: '8px',
  },
}