import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Trash2,
  BarChart3,
  TrendingUp,
  Volume2,
  Calendar,
  Loader2,
  Search,
} from 'lucide-react'
import { getTranslations, getAnalytics, deleteTranslation } from '../services/api'

export default function History() {
  const [translations, setTranslations] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const token = localStorage.getItem('signova_token')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [transRes, analyticsRes] = await Promise.all([
        getTranslations(),
        getAnalytics(),
      ])
      setTranslations(transRes.data?.data?.translations || [])
      setAnalytics(analyticsRes.data?.data || null)
    } catch {
      setError('Failed to load history. Please ensure the backend server is running and you are logged in.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetchData()
  }, [token, fetchData])

  const handleDelete = async (id) => {
    try {
      await deleteTranslation(id)
      setTranslations((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const filtered = translations.filter((t) =>
    t.sentence.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!token) {
    return (
      <div className="page-wrapper">
        <div className="container" style={styles.page}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={styles.loginPrompt}
          >
            <Clock size={48} color="rgba(108,99,255,0.3)" />
            <h2 style={styles.promptTitle}>Login Required</h2>
            <p style={styles.promptText}>
              Sign in to view your translation history and analytics.
            </p>
            <a href="/login" className="btn-primary">
              Go to Login
            </a>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={styles.page}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>
            <Clock size={28} color="#6C63FF" />
            Translation <span className="gradient-text">History</span>
          </h1>
          <p style={styles.subtitle}>
            Review your past translations and track your progress.
          </p>
        </motion.div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#EF4444',
            fontSize: '0.85rem',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingState}>
            <Loader2 size={32} className="spin" color="#6C63FF" />
            <p>Loading your data...</p>
          </div>
        ) : (
          <>
            {/* Analytics Cards */}
            {analytics && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={styles.analyticsGrid}
              >
                <div className="glass-card" style={styles.analyticsCard}>
                  <BarChart3 size={20} color="#6C63FF" />
                  <div>
                    <span style={styles.analyticsValue}>
                      {analytics.totalTranslations}
                    </span>
                    <span style={styles.analyticsLabel}>
                      Total Translations
                    </span>
                  </div>
                </div>

                <div className="glass-card" style={styles.analyticsCard}>
                  <TrendingUp size={20} color="#22C55E" />
                  <div>
                    <span style={styles.analyticsValue}>
                      {analytics.averageConfidence}%
                    </span>
                    <span style={styles.analyticsLabel}>
                      Avg Confidence
                    </span>
                  </div>
                </div>

                <div className="glass-card" style={styles.analyticsCard}>
                  <Volume2 size={20} color="#00D4FF" />
                  <div>
                    <span style={styles.analyticsValue}>
                      {analytics.mostCommonSigns?.[0]?._id || 'N/A'}
                    </span>
                    <span style={styles.analyticsLabel}>
                      Most Used Sign
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Most Common Signs Chart */}
            {analytics?.mostCommonSigns?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card"
                style={styles.chartCard}
              >
                <h3 style={styles.chartTitle}>Most Practiced Signs</h3>
                <div style={styles.chartBars}>
                  {analytics.mostCommonSigns.slice(0, 6).map((item, i) => {
                    const maxCount = analytics.mostCommonSigns[0].count
                    const width = (item.count / maxCount) * 100
                    return (
                      <div key={i} style={styles.chartRow}>
                        <span style={styles.chartLabel}>{item._id}</span>
                        <div style={styles.chartTrack}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            style={styles.chartFill}
                          />
                        </div>
                        <span style={styles.chartCount}>{item.count}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Search */}
            <div style={styles.searchBox}>
              <Search size={16} color="#6B7280" />
              <input
                type="text"
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Translation List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={styles.list}
            >
              {filtered.length === 0 ? (
                <div style={styles.emptyState}>
                  <Clock size={48} color="rgba(108,99,255,0.2)" />
                  <p style={styles.emptyText}>
                    {searchQuery
                      ? 'No matching translations'
                      : 'No translations yet'}
                  </p>
                  <p style={styles.emptySubtext}>
                    Start translating to build your history
                  </p>
                </div>
              ) : (
                filtered.map((t, i) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-card"
                    style={styles.historyItem}
                  >
                    <div style={styles.historyContent}>
                      <div style={styles.historyTop}>
                        <span style={styles.historySentence}>
                          {t.sentence}
                        </span>
                        <span style={styles.historyConfidence}>
                          {Math.round(t.averageConfidence * 100)}%
                        </span>
                      </div>
                      <div style={styles.historyMeta}>
                        <Calendar size={12} />
                        <span>
                          {new Date(t.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span style={styles.historyDot}>•</span>
                        <span>{t.signs?.length || 0} signs</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </motion.div>
          </>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    padding: '100px 24px 60px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.8rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#9CA3AF',
  },
  loginPrompt: {
    padding: '60px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginTop: '60px',
  },
  promptTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
  },
  promptText: {
    color: '#9CA3AF',
    fontSize: '0.95rem',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '80px 0',
    color: '#9CA3AF',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  analyticsCard: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  analyticsValue: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  analyticsLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#6B7280',
    fontWeight: 500,
  },
  chartCard: {
    padding: '24px',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '16px',
  },
  chartBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  chartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chartLabel: {
    width: '90px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#D1D5DB',
    textAlign: 'right',
    flexShrink: 0,
  },
  chartTrack: {
    flex: 1,
    height: '8px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  chartFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6C63FF, #00D4FF)',
    borderRadius: '9999px',
  },
  chartCount: {
    width: '30px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#9CA3AF',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    marginBottom: '16px',
    maxWidth: '350px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.9rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '60px 0',
  },
  emptyText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: '0.85rem',
    color: '#4B5563',
  },
  historyItem: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  historyContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  historyTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historySentence: {
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  historyConfidence: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#22C55E',
    padding: '2px 8px',
    background: 'rgba(34, 197, 94, 0.1)',
    borderRadius: '9999px',
  },
  historyMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  historyDot: {
    color: '#4B5563',
  },
  deleteBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    flexShrink: 0,
  },
}