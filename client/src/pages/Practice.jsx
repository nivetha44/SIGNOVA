import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2,
  Trophy,
  Flame,
  Target,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Zap,
  Star,
  Play,
} from 'lucide-react'
import CameraComponent from '../components/Camera'

const PRACTICE_SIGNS = [
  'HELLO', 'THANK YOU', 'YES', 'NO', 'PLEASE',
  'SORRY', 'HELP', 'GOOD', 'LOVE', 'WATER',
  'FOOD', 'WELCOME',
]

const TOTAL_ROUNDS = 10

export default function Practice() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSign, setCurrentSign] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)

  // Pick random sign
  const pickNewSign = useCallback(() => {
    const random =
      PRACTICE_SIGNS[Math.floor(Math.random() * PRACTICE_SIGNS.length)]
    setCurrentSign(random)
    setFeedback(null)
    setTimeLeft(10)
  }, [])

  // Next round
  const nextRound = useCallback(() => {
    setRound((prev) => {
      if (prev >= TOTAL_ROUNDS) {
        setIsPlaying(false)
        return prev
      }
      return prev + 1
    })
    pickNewSign()
  }, [pickNewSign])

  const handleCorrect = useCallback(
    (confidence) => {
      setFeedback('correct')
      const points = Math.round(confidence * 100) + streak * 5
      setScore((prev) => prev + points)
      setStreak((prev) => {
        const newStreak = prev + 1
        setBestStreak((best) => Math.max(best, newStreak))
        return newStreak
      })
      setCorrectCount((prev) => prev + 1)

      setTimeout(() => nextRound(), 1500)
    },
    [streak, nextRound]
  )

  const handleWrong = useCallback(() => {
    setFeedback('wrong')
    setStreak(0)

    setTimeout(() => nextRound(), 1500)
  }, [nextRound])

  // Start game
  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setStreak(0)
    setRound(1)
    setCorrectCount(0)
    pickNewSign()
  }

  // Timer
  useEffect(() => {
    if (!isPlaying || feedback) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleWrong()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, feedback, round, handleWrong])

  // Handle gesture detection
  const handleGestureDetected = useCallback(
    (gesture) => {
      if (!isPlaying || feedback || !currentSign) return

      if (gesture.sign === currentSign && gesture.confidence > 0.7) {
        handleCorrect(gesture.confidence)
      }
    },
    [isPlaying, feedback, currentSign, handleCorrect]
  )

  const accuracy =
    round > 0 ? Math.round((correctCount / Math.max(round - 1, 1)) * 100) : 0

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
            <Gamepad2 size={28} color="#6C63FF" />
            Practice <span className="gradient-text">Mode</span>
          </h1>
          <p style={styles.subtitle}>
            Test your ISL skills. The app shows a sign — you perform it!
          </p>
        </motion.div>

        {/* Stats Bar */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.statsBar}
          >
            <div style={styles.statItem}>
              <Trophy size={16} color="#F59E0B" />
              <span style={styles.statValue}>{score}</span>
              <span style={styles.statLabel}>Score</span>
            </div>
            <div style={styles.statItem}>
              <Flame size={16} color="#EF4444" />
              <span style={styles.statValue}>{streak}</span>
              <span style={styles.statLabel}>Streak</span>
            </div>
            <div style={styles.statItem}>
              <Target size={16} color="#22C55E" />
              <span style={styles.statValue}>{accuracy}%</span>
              <span style={styles.statLabel}>Accuracy</span>
            </div>
            <div style={styles.statItem}>
              <Zap size={16} color="#6C63FF" />
              <span style={styles.statValue}>
                {round}/{TOTAL_ROUNDS}
              </span>
              <span style={styles.statLabel}>Round</span>
            </div>
            <div style={styles.statItem}>
              <span
                style={{
                  ...styles.statValue,
                  color: timeLeft <= 3 ? '#EF4444' : '#fff',
                }}
              >
                {timeLeft}s
              </span>
              <span style={styles.statLabel}>Time</span>
            </div>
          </motion.div>
        )}

        {/* Game Area */}
        <div style={styles.gameGrid}>
          {/* Camera */}
          <div style={styles.cameraCol}>
            <CameraComponent onGestureDetected={handleGestureDetected} />
          </div>

          {/* Challenge Panel */}
          <div style={styles.challengeCol}>
            {!isPlaying && round === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={styles.startCard}
              >
                <Gamepad2 size={48} color="#6C63FF" />
                <h2 style={styles.startTitle}>Ready to Practice?</h2>
                <p style={styles.startDesc}>
                  You'll be shown {TOTAL_ROUNDS} random ISL signs.
                  Perform each sign in front of your camera within 10 seconds.
                </p>
                <button onClick={startGame} className="btn-primary">
                  <Play size={18} />
                  Start Practice
                </button>

                {bestStreak > 0 && (
                  <div style={styles.bestStreak}>
                    <Star size={16} color="#F59E0B" />
                    Best Streak: {bestStreak}
                  </div>
                )}
              </motion.div>
            ) : (
              <>
                {/* Current Challenge */}
                <motion.div
                  key={currentSign}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card"
                  style={styles.challengeCard}
                >
                  <span style={styles.challengeLabel}>
                    Make this sign:
                  </span>
                  <h2 style={styles.challengeSign}>
                    {currentSign}
                  </h2>

                  {/* Feedback */}
                  <AnimatePresence>
                    {feedback === 'correct' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.correctFeedback}
                      >
                        <CheckCircle2 size={48} />
                        <span>Excellent! +{Math.round(100 + streak * 5)}</span>
                      </motion.div>
                    )}
                    {feedback === 'wrong' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.wrongFeedback}
                      >
                        <XCircle size={48} />
                        <span>Time's up!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Timer Bar */}
                <div style={styles.timerTrack}>
                  <motion.div
                    style={{
                      ...styles.timerFill,
                      background:
                        timeLeft <= 3
                          ? '#EF4444'
                          : 'linear-gradient(90deg, #6C63FF, #00D4FF)',
                    }}
                    animate={{ width: `${(timeLeft / 10) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </>
            )}

            {/* Game Over */}
            {!isPlaying && round >= TOTAL_ROUNDS && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={styles.gameOverCard}
              >
                <Trophy size={48} color="#F59E0B" />
                <h2 style={styles.gameOverTitle}>Practice Complete!</h2>
                <div style={styles.finalStats}>
                  <div style={styles.finalStat}>
                    <span style={styles.finalValue}>{score}</span>
                    <span style={styles.finalLabel}>Total Score</span>
                  </div>
                  <div style={styles.finalStat}>
                    <span style={styles.finalValue}>{accuracy}%</span>
                    <span style={styles.finalLabel}>Accuracy</span>
                  </div>
                  <div style={styles.finalStat}>
                    <span style={styles.finalValue}>{bestStreak}</span>
                    <span style={styles.finalLabel}>Best Streak</span>
                  </div>
                </div>
                <button onClick={startGame} className="btn-primary">
                  <RotateCcw size={18} />
                  Play Again
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    padding: '100px 24px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
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
  statsBar: {
    display: 'flex',
    gap: '24px',
    padding: '16px 24px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  cameraCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  challengeCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  startCard: {
    padding: '48px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  startTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  startDesc: {
    fontSize: '0.9rem',
    color: '#9CA3AF',
    lineHeight: 1.6,
    maxWidth: '360px',
  },
  bestStreak: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    fontSize: '0.85rem',
    color: '#F59E0B',
    fontWeight: 600,
  },
  challengeCard: {
    padding: '40px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  challengeLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  challengeSign: {
    fontSize: '3rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  correctFeedback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#22C55E',
    fontSize: '1.2rem',
    fontWeight: 700,
    marginTop: '16px',
  },
  wrongFeedback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#EF4444',
    fontSize: '1.2rem',
    fontWeight: 700,
    marginTop: '16px',
  },
  timerTrack: {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: '9999px',
  },
  gameOverCard: {
    padding: '40px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  gameOverTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  finalStats: {
    display: 'flex',
    gap: '32px',
  },
  finalStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  finalValue: {
    fontSize: '1.8rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  finalLabel: {
    fontSize: '0.75rem',
    color: '#6B7280',
    fontWeight: 500,
  },
}