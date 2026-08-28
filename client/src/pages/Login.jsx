import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Hand,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    try {
      setLoading(true)
      if (isRegister) {
        await register({ name, email, password })
      } else {
        await login({ email, password })
      }
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Ensure the server is running or continue as a guest.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGuestContinue = () => {
    navigate('/dashboard')
  }

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        <div className="glass-card" style={styles.authCard}>
          {/* Logo & Header */}
          <div style={styles.header}>
            <div style={styles.logoIcon}>
              <Hand size={24} color="#FFFFFF" />
            </div>
            <h1 style={styles.title}>{isRegister ? 'Join SIGNOVA' : 'Welcome Back'}</h1>
            <p style={styles.subtitle}>
              {isRegister
                ? 'Create your learner profile to track XP, streaks, and achievements.'
                : 'Sign in to access your translation history and cloud progress.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={styles.tabsRow}>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false)
                setError(null)
              }}
              style={{
                ...styles.tabBtn,
                background: !isRegister ? 'var(--pink-primary)' : 'transparent',
                color: !isRegister ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true)
                setError(null)
              }}
              style={{
                ...styles.tabBtn,
                background: isRegister ? 'var(--pink-primary)' : 'transparent',
                color: isRegister ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={16} color="#EF4444" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Full Name</label>
                <div style={styles.inputWrap}>
                  <User size={16} color="var(--pink-soft)" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <div style={styles.inputWrap}>
                <Mail size={16} color="var(--pink-soft)" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Password</label>
              <div style={styles.inputWrap}>
                <Lock size={16} color="var(--pink-soft)" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            {isRegister && (
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Confirm Password</label>
                <div style={styles.inputWrap}>
                  <Lock size={16} color="var(--pink-soft)" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={styles.submitBtn}
            >
              {loading ? 'Processing...' : isRegister ? 'Create My Account' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Guest Mode Divider */}
          <div style={styles.divider}>
            <span>OR</span>
          </div>

          <button onClick={handleGuestContinue} className="btn-secondary" style={styles.guestBtn}>
            <Sparkles size={16} color="var(--pink-soft)" />
            Continue in Guest Mode (Offline)
          </button>
        </div>
      </div>
    </main>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 140px)',
  },
  authCard: {
    maxWidth: '440px',
    width: '100%',
    padding: '36px 30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: 'linear-gradient(180deg, #1C0B18 0%, #0B080D 100%)',
    border: '1.5px solid rgba(255, 46, 147, 0.35)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 46, 147, 0.2)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  logoIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #FF2E93 0%, #C026D3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
    boxShadow: '0 0 20px rgba(255, 46, 147, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  tabsRow: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '4px',
  },
  tabBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    fontSize: '0.8rem',
    color: '#EF4444',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
  },
  input: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.9rem',
    marginTop: '6px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    position: 'relative',
    margin: '2px 0',
  },
  guestBtn: {
    width: '100%',
    padding: '11px',
    fontSize: '0.84rem',
    gap: '8px',
  },
}