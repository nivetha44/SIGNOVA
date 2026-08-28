import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Timer,
  CheckCircle2,
  Trophy,
  Flame,
  Zap,
  RotateCcw,
  Play,
  HelpCircle,
  Target,
  Award,
  Sparkles,
} from 'lucide-react'
import Camera from '../components/Camera'
import AnimatedHandSign from '../components/AnimatedHandSign'
import { SIGNS } from '../data/signs'
import {
  addXP,
  logPracticeSession,
  getDailyChallenge,
  completeDailySign,
} from '../services/localStore'
import { updatePracticeStats, addLearnedSign } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

const SUPPORTED_SIGNS = SIGNS.filter((s) => s.supportedByModel)

export default function Practice() {
  const { language, t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Game Mode: 'single' | 'timed' | 'sentence' | 'quiz' | 'daily'
  const [gameMode, setGameMode] = useState('single')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  // Game State
  const [targetSign, setTargetSign] = useState(() => location.state?.targetSign || 'HELLO')
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(5)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [earnedXP, setEarnedXP] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [roundFeedback, setRoundFeedback] = useState(null) // 'correct' | 'wrong'
  const [showGestureHint, setShowGestureHint] = useState(false)

  // Quiz State
  const [quizQuestion, setQuizQuestion] = useState(null)
  const [quizSelectedOption, setQuizSelectedOption] = useState(null)

  const timerRef = useRef(null)

  // ── Pick Next Target ──
  const pickNextTarget = useCallback(() => {
    const otherSigns = SUPPORTED_SIGNS.filter((s) => s.name !== targetSign)
    const next = otherSigns[Math.floor(Math.random() * otherSigns.length)]
    if (next) {
      setTargetSign(next.name)
    }
    setRoundFeedback(null)
  }, [targetSign])

  // ── End Game Session ──
  const endGame = useCallback(() => {
    setIsPlaying(false)
    setIsFinished(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const accuracy = score > 0 ? Math.min(100, Math.round((score / (totalRounds * 100)) * 100)) : 85
    logPracticeSession(2, accuracy)

    if (isAuthenticated) {
      updatePracticeStats({ accuracy }).catch(() => {})
    }
  }, [score, totalRounds, isAuthenticated])

  // ── Generate Quiz Question ──
  const generateQuiz = useCallback(() => {
    const randomSign = SIGNS[Math.floor(Math.random() * SIGNS.length)]
    const otherSigns = SIGNS.filter((s) => s.id !== randomSign.id)
    const shuffledOthers = [...otherSigns].sort(() => 0.5 - Math.random()).slice(0, 3)

    const options = [randomSign, ...shuffledOthers].sort(() => 0.5 - Math.random())

    setQuizQuestion({
      correctSign: randomSign,
      options,
    })
    setQuizSelectedOption(null)
    setRoundFeedback(null)
  }, [])

  // ── Start Game Session ──
  const startGame = (mode = gameMode) => {
    setGameMode(mode)
    setIsPlaying(true)
    setIsFinished(false)
    setScore(0)
    setStreak(0)
    setEarnedXP(0)
    setCurrentRound(1)
    setRoundFeedback(null)

    if (mode === 'timed') {
      setTimeLeft(60)
      setTotalRounds(15)
      pickNextTarget()
    } else if (mode === 'single') {
      setTotalRounds(1)
    } else if (mode === 'quiz') {
      setTotalRounds(5)
      generateQuiz()
    } else if (mode === 'daily') {
      const daily = getDailyChallenge()
      setTargetSign(daily.targets[0] || 'HELLO')
      setTotalRounds(daily.targets.length)
    }
  }

  // ── Countdown Timer for Timed Challenge ──
  useEffect(() => {
    if (isPlaying && gameMode === 'timed' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, gameMode, timeLeft, endGame])

  // ── Gesture Detection & Matching ──
  const handleGestureDetected = useCallback(
    (detected) => {
      if (!isPlaying || isFinished || roundFeedback === 'correct') return
      if (gameMode === 'quiz') return // Quiz is multiple choice

      if (detected.sign === targetSign.toUpperCase() && detected.confidence >= 0.75) {
        // Correct Gesture!
        const xpGain = 25 + streak * 5
        setScore((s) => s + 100)
        setStreak((str) => str + 1)
        setEarnedXP((xp) => xp + xpGain)
        setRoundFeedback('correct')

        addXP(xpGain)

        if (gameMode === 'daily') {
          completeDailySign(targetSign)
        }

        // Sync with API
        if (isAuthenticated) {
          addLearnedSign({ sign: targetSign, accuracy: Math.round(detected.confidence * 100) }).catch(
            () => {}
          )
        }

        // Move to next after short delay
        setTimeout(() => {
          if (currentRound >= totalRounds && gameMode !== 'timed') {
            endGame()
          } else {
            setCurrentRound((r) => r + 1)
            pickNextTarget()
          }
        }, 1300)
      }
    },
    [isPlaying, isFinished, roundFeedback, gameMode, targetSign, streak, currentRound, totalRounds, isAuthenticated, endGame, pickNextTarget]
  )

  // ── Quiz Option Selection ──
  const handleQuizAnswer = (option) => {
    if (quizSelectedOption !== null) return
    setQuizSelectedOption(option)

    const isCorrect = option.id === quizQuestion.correctSign.id
    if (isCorrect) {
      setScore((s) => s + 100)
      setStreak((str) => str + 1)
      setEarnedXP((xp) => xp + 20)
      addXP(20)
      setRoundFeedback('correct')
    } else {
      setStreak(0)
      setRoundFeedback('wrong')
    }

    setTimeout(() => {
      if (currentRound >= totalRounds) {
        endGame()
      } else {
        setCurrentRound((r) => r + 1)
        generateQuiz()
      }
    }, 1400)
  }

  const currentSignObj = SIGNS.find((s) => s.name === targetSign)
  const calcAccuracy = score > 0 ? Math.min(100, Math.round((score / (totalRounds * 100)) * 100)) : 85

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_practice', 'EVALUATION & SKILL LAB')}</p>
          <h1 style={styles.title}>{t('prac_title', 'Practice & Game Arena')}</h1>
          <p style={styles.subtitle}>
            {t(
              'prac_subtitle',
              'Test your signing skills across multiple game modes, earn XP, and climb the leaderboard.'
            )}
          </p>
        </div>

        {/* Game Mode Selection (When Not in active round) */}
        {!isPlaying && !isFinished && (
          <div style={styles.modesGrid}>
            <ModeCard
              icon={Target}
              title={t('prac_mode_single', 'Single Sign Practice')}
              desc={t('prac_mode_single_desc', 'Select any sign and practice performing it in front of the camera.')}
              onStart={() => startGame('single')}
              badge="Standard"
            />
            <ModeCard
              icon={Timer}
              title={t('prac_mode_timed', '60s Timed Challenge')}
              desc={t('prac_mode_timed_desc', 'Score as many signs as you can before the clock runs out.')}
              onStart={() => startGame('timed')}
              badge="High XP"
            />
            <ModeCard
              icon={HelpCircle}
              title={t('prac_mode_quiz', 'Sign Recognition Quiz')}
              desc={t('prac_mode_quiz_desc', 'Match visual signs with their correct meanings.')}
              onStart={() => startGame('quiz')}
              badge="Trivia"
            />
            <ModeCard
              icon={Trophy}
              title={t('prac_mode_daily', 'Daily Challenge')}
              desc={t('prac_mode_daily_desc', 'Complete today\'s 3 curated signs for a bonus 150 XP.')}
              onStart={() => startGame('daily')}
              badge="+150 XP"
            />
          </div>
        )}

        {/* Active Practice Screen */}
        {isPlaying && (
          <div style={styles.activeArena}>
            {/* Top Game Status Bar */}
            <div className="glass-card" style={styles.statusBar}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t('prac_round', 'Round')}</span>
                <strong style={styles.statValue}>{currentRound} / {totalRounds}</strong>
              </div>

              {gameMode === 'timed' && (
                <div style={{ ...styles.statItem, color: timeLeft < 10 ? '#EF4444' : 'var(--pink-soft)' }}>
                  <span style={styles.statLabel}>{t('prac_time_left', 'Time Left')}</span>
                  <strong style={styles.statValue}>
                    <Timer size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    {timeLeft}s
                  </strong>
                </div>
              )}

              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t('prac_streak', 'Streak')}</span>
                <strong style={{ ...styles.statValue, color: '#FF5722' }}>
                  <Flame size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {streak}
                </strong>
              </div>

              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t('prac_score', 'Score')}</span>
                <strong style={{ ...styles.statValue, color: '#10B981' }}>{score} pts</strong>
              </div>

              <button onClick={endGame} className="btn-secondary" style={styles.quitBtn}>
                Exit Session
              </button>
            </div>

            {/* Main Interactive Arena */}
            {gameMode === 'quiz' && quizQuestion ? (
              /* Quiz Multiple Choice View */
              <div className="glass-card" style={styles.quizArena}>
                <div style={styles.quizVisual}>
                  <div style={styles.quizEmojiWrap}>
                    <span style={styles.quizEmoji}>{quizQuestion.correctSign.emoji}</span>
                  </div>
                  <h2 style={styles.quizPrompt}>What is the meaning of this ISL sign?</h2>
                </div>

                <div style={styles.quizOptionsGrid}>
                  {quizQuestion.options.map((opt) => {
                    const isSelected = quizSelectedOption?.id === opt.id
                    const isCorrect = opt.id === quizQuestion.correctSign.id
                    let bg = 'rgba(255, 255, 255, 0.04)'
                    let borderColor = 'var(--border-color)'

                    if (quizSelectedOption) {
                      if (isCorrect) {
                        bg = 'rgba(16, 185, 129, 0.25)'
                        borderColor = '#10B981'
                      } else if (isSelected) {
                        bg = 'rgba(239, 68, 68, 0.25)'
                        borderColor = '#EF4444'
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={quizSelectedOption !== null}
                        style={{ ...styles.quizOptionBtn, background: bg, borderColor }}
                      >
                        <strong style={styles.quizOptionName}>{opt.name}</strong>
                        <span style={styles.quizOptionMeaning}>{opt.meaning[language] || opt.meaning.en}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Camera Practice View */
              <div style={styles.cameraArena}>
                {/* Target Prompt Box */}
                <div className="glass-card" style={styles.promptCard}>
                  <span className="eyebrow">{t('prac_perform_sign', 'PERFORM THE SIGN FOR:')}</span>
                  <div style={styles.promptSignRow}>
                    <div style={styles.promptEmojiWrap}>
                      <span style={styles.promptEmoji}>{currentSignObj?.emoji || '👋'}</span>
                    </div>
                    <div>
                      <h2 style={styles.promptName}>{targetSign}</h2>
                      <p style={styles.promptMeaning}>
                        {currentSignObj?.meaning[language] || currentSignObj?.meaning.en || ''}
                      </p>
                    </div>
                  </div>

                  {/* Animated Gesture Reference Guide */}
                  <div style={styles.guideToggleRow}>
                    <button
                      onClick={() => setShowGestureHint(!showGestureHint)}
                      className="btn-secondary"
                      style={styles.guideToggleBtn}
                    >
                      <Sparkles size={14} color="var(--pink-soft)" />
                      <span>{showGestureHint ? 'Hide Animated Guide' : 'Show Animated Guide'}</span>
                    </button>
                  </div>

                  {showGestureHint && (
                    <div style={styles.practiceAnimWrap}>
                      <AnimatedHandSign signName={targetSign} size={240} showControls={false} />
                    </div>
                  )}

                  {roundFeedback === 'correct' && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={styles.correctFeedback}
                    >
                      <CheckCircle2 size={22} color="#10B981" />
                      <span>{t('prac_correct', 'Correct! Target Matched!')}</span>
                    </motion.div>
                  )}
                </div>

                {/* Live Camera Viewport */}
                <Camera onGestureDetected={handleGestureDetected} targetSign={targetSign} />
              </div>
            )}
          </div>
        )}

        {/* Completion Modal / Celebration Screen */}
        {isFinished && (
          <div className="glass-card" style={styles.summaryCard}>
            <div style={styles.trophyWrap}>
              <Trophy size={48} color="#FF2E93" />
            </div>

            <div style={styles.summaryScoreWrap}>
              <h1 style={styles.summaryScorePercent}>{calcAccuracy}%</h1>
              <p style={styles.summaryScoreVerdict}>
                {calcAccuracy >= 90 ? 'Outstanding Performance!' : calcAccuracy >= 75 ? 'Great Work!' : 'Good Effort! Keep practicing.'}
              </p>
            </div>

            <div style={styles.summaryStatsGrid}>
              <div style={styles.summaryStat}>
                <Zap size={22} color="#FF2E93" />
                <span style={styles.statLabel}>{t('prac_xp_earned', 'XP Earned')}</span>
                <strong style={styles.summaryStatVal}>+{earnedXP} XP</strong>
              </div>
              <div style={styles.summaryStat}>
                <Award size={22} color="#10B981" />
                <span style={styles.statLabel}>Final Score</span>
                <strong style={styles.summaryStatVal}>{score} pts</strong>
              </div>
              <div style={styles.summaryStat}>
                <Flame size={22} color="#FF5722" />
                <span style={styles.statLabel}>Highest Streak</span>
                <strong style={styles.summaryStatVal}>{streak}</strong>
              </div>
            </div>

            <div style={styles.summaryBtnRow}>
              <button onClick={() => startGame(gameMode)} className="btn-primary" style={styles.summaryBtn}>
                <RotateCcw size={16} />
                {t('prac_play_again', 'Play Again')}
              </button>
              <button onClick={() => setIsFinished(false)} className="btn-secondary" style={styles.summaryBtn}>
                Choose Another Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function ModeCard({ icon: Icon, title, desc, onStart, badge }) {
  return (
    <div className="glass-card" style={styles.modeCard}>
      <div style={styles.modeTop}>
        <div style={styles.modeIconWrap}>
          <Icon size={26} color="#FF2E93" />
        </div>
        <span style={styles.modeBadge}>{badge}</span>
      </div>
      <h3 style={styles.modeTitle}>{title}</h3>
      <p style={styles.modeDesc}>{desc}</p>
      <button onClick={onStart} className="btn-primary" style={styles.modeStartBtn}>
        <Play size={15} fill="currentColor" />
        Start Mode
      </button>
    </div>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '1200px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 900,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    maxWidth: '650px',
  },
  modesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  modeCard: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
    borderRadius: '22px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
    border: '1px solid var(--border-color)',
    minHeight: '260px',
  },
  modeTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255, 46, 147, 0.15)',
    border: '1px solid rgba(255, 46, 147, 0.35)',
    boxShadow: '0 0 16px rgba(255, 46, 147, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadge: {
    fontSize: '0.68rem',
    fontWeight: 800,
    padding: '3px 9px',
    borderRadius: '9999px',
    background: 'rgba(255, 46, 147, 0.2)',
    border: '1px solid var(--pink-primary)',
    color: '#FFFFFF',
    letterSpacing: '0.04em',
  },
  modeTitle: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  modeDesc: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    flex: 1,
  },
  modeStartBtn: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '0.86rem',
  },
  activeArena: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  statusBar: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    borderRadius: '18px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  quitBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
  cameraArena: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  promptCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    borderRadius: '20px',
  },
  promptSignRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  promptEmojiWrap: {
    width: '74px',
    height: '74px',
    borderRadius: '18px',
    background: 'radial-gradient(circle, rgba(255, 46, 147, 0.2) 0%, rgba(20, 10, 22, 0.8) 80%)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  promptEmoji: {
    fontSize: '2.6rem',
  },
  promptName: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: 'var(--pink-soft)',
  },
  promptMeaning: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  guideToggleRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
  },
  guideToggleBtn: {
    padding: '7px 14px',
    fontSize: '0.76rem',
    borderRadius: '8px',
    gap: '6px',
  },
  practiceAnimWrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '4px 0',
  },
  correctFeedback: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 18px',
    background: 'rgba(16, 185, 129, 0.2)',
    border: '1.5px solid #10B981',
    borderRadius: '12px',
    color: '#10B981',
    fontWeight: 800,
    fontSize: '0.92rem',
  },
  quizArena: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    textAlign: 'center',
    borderRadius: '24px',
  },
  quizVisual: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  quizEmojiWrap: {
    width: '120px',
    height: '120px',
    borderRadius: '24px',
    background: 'radial-gradient(circle, rgba(255, 46, 147, 0.2) 0%, rgba(20, 10, 22, 0.8) 80%)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizEmoji: {
    fontSize: '4.5rem',
  },
  quizPrompt: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  quizOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '14px',
    width: '100%',
    maxWidth: '650px',
  },
  quizOptionBtn: {
    padding: '18px 20px',
    borderRadius: '14px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--text-primary)',
    transition: 'all 0.2s',
  },
  quizOptionName: {
    fontSize: '1.05rem',
    fontWeight: 800,
  },
  quizOptionMeaning: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  summaryCard: {
    maxWidth: '520px',
    margin: '0 auto',
    padding: '44px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '24px',
    borderRadius: '26px',
    background: 'linear-gradient(180deg, #1C0B18 0%, #0B080D 100%)',
    border: '1.5px solid rgba(255, 46, 147, 0.35)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 46, 147, 0.2)',
  },
  trophyWrap: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    background: 'rgba(255, 46, 147, 0.18)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(255, 46, 147, 0.3)',
  },
  summaryScoreWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryScorePercent: {
    fontSize: '3.6rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FDA4AF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.03em',
  },
  summaryScoreVerdict: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--pink-soft)',
  },
  summaryStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%',
  },
  summaryStat: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '14px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  summaryStatVal: {
    fontSize: '1.1rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  summaryBtnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  summaryBtn: {
    flex: 1,
    padding: '14px',
    fontSize: '0.88rem',
  },
}