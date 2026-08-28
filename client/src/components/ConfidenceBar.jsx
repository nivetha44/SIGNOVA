import { motion } from 'framer-motion'

export default function ConfidenceBar({ confidence = 0, label = 'Confidence' }) {
  const percentage = Math.round(confidence * 100)

  const getColor = () => {
    if (percentage >= 85) return '#22C55E'
    if (percentage >= 65) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        <span style={{ ...styles.value, color: getColor() }}>
          {percentage}%
        </span>
      </div>
      <div style={styles.track}>
        <motion.div
          style={{
            ...styles.fill,
            background: `linear-gradient(90deg, ${getColor()}, ${getColor()}dd)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  value: {
    fontSize: '0.9rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  track: {
    width: '100%',
    height: '8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: '9999px',
  },
}