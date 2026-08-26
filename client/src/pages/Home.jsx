import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Camera,
  BookOpen,
  Gamepad2,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Hand,
  Brain,
  MessageSquare,
  Volume2,
  BarChart3,
  Users
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 }
  },
  viewport: { once: true }
}

export default function Home() {
  return (
    <div style={styles.page}>

      {/* ────── HERO SECTION ────── */}
      <section style={styles.hero}>
        {/* Animated background orbs */}
        <div style={styles.orb1} />
        <div style={styles.orb2} />

        <div className="container" style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={styles.heroText}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={styles.badge}
            >
              <Zap size={14} />
              AI-Powered Sign Language Recognition
            </motion.div>

            <h1 style={styles.heroTitle}>
              Breaking Barriers,
              <br />
              <span className="gradient-text">One Gesture at a Time</span>
            </h1>

            <p style={styles.heroSubtitle}>
              SIGNOVA uses advanced computer vision and machine learning
              to translate Indian Sign Language into text and speech in
              real-time. Making communication accessible for everyone.
            </p>

            <div style={styles.heroBtns}>
              <Link to="/translator" className="btn-primary">
                <Camera size={18} />
                Start Translating
                <ArrowRight size={16} />
              </Link>
              <Link to="/learn" className="btn-secondary">
                <BookOpen size={18} />
                Learn ISL
              </Link>
            </div>

            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>15+</span>
                <span style={styles.statLabel}>Signs Supported</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>94%</span>
                <span style={styles.statLabel}>Accuracy</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>~100ms</span>
                <span style={styles.statLabel}>Response Time</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={styles.heroVisual}
          >
            <div style={styles.translatorPreview}>
              <div style={styles.previewHeader}>
                <div style={styles.previewDot} />
                <div style={{ ...styles.previewDot, background: '#F59E0B' }} />
                <div style={{ ...styles.previewDot, background: '#22C55E' }} />
                <span style={styles.previewTitle}>Live Translator</span>
              </div>
              <div style={styles.previewBody}>
                <div style={styles.cameraPlaceholder}>
                  <Hand size={48} color="rgba(108,99,255,0.5)" />
                  <span style={styles.cameraText}>Camera Feed</span>
                </div>
                <div style={styles.previewResult}>
                  <span style={styles.resultLabel}>Detected Sign</span>
                  <span style={styles.resultSign}>HELLO</span>
                  <div style={styles.confidenceBar}>
                    <div style={styles.confidenceFill} />
                  </div>
                  <span style={styles.confidenceText}>
                    Confidence: 94%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeInUp} style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              How <span className="gradient-text">SIGNOVA</span> Works
            </h2>
            <p style={styles.sectionSubtitle}>
              Three simple steps to translate sign language in real-time
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            style={styles.stepsGrid}
          >
            {[
              {
                icon: Camera,
                step: '01',
                title: 'Show Your Sign',
                desc: 'Position your hand in front of the camera and perform any supported ISL sign.'
              },
              {
                icon: Brain,
                step: '02',
                title: 'AI Recognizes',
                desc: 'MediaPipe extracts hand landmarks and our ML model classifies the gesture instantly.'
              },
              {
                icon: MessageSquare,
                step: '03',
                title: 'Get Translation',
                desc: 'See the translated text with confidence score and optionally hear it spoken aloud.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="glass-card"
                style={styles.stepCard}
              >
                <div style={styles.stepNumber}>{item.step}</div>
                <div style={styles.stepIcon}>
                  <item.icon size={28} color="#6C63FF" />
                </div>
                <h3 style={styles.stepTitle}>{item.title}</h3>
                <p style={styles.stepDesc}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────── FEATURES ────── */}
      <section className="section" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <motion.div {...fadeInUp} style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p style={styles.sectionSubtitle}>
              Everything you need for sign language accessibility
            </p>
          </motion.div>

          <motion.div {...staggerContainer} style={styles.featuresGrid}>
            {[
              {
                icon: Camera,
                title: 'Real-Time Translation',
                desc: 'Instant sign language recognition through your webcam with live feedback.'
              },
              {
                icon: BookOpen,
                title: 'Learn ISL',
                desc: 'Interactive lessons to learn Indian Sign Language from scratch.'
              },
              {
                icon: Gamepad2,
                title: 'Practice Mode',
                desc: 'Gamified practice with scores, streaks, and progress tracking.'
              },
              {
                icon: Volume2,
                title: 'Text to Speech',
                desc: 'Hear translations spoken aloud for complete accessibility.'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Track your learning progress with detailed statistics.'
              },
              {
                icon: Shield,
                title: 'Privacy First',
                desc: 'All video processing happens locally. Nothing is recorded.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="glass-card"
                style={styles.featureCard}
              >
                <div style={styles.featureIcon}>
                  <feature.icon size={24} />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────── SUPPORTED SIGNS ────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeInUp} style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Supported <span className="gradient-text">Signs</span>
            </h2>
            <p style={styles.sectionSubtitle}>
              Currently recognizing 15+ Indian Sign Language gestures
            </p>
          </motion.div>

          <motion.div {...staggerContainer} style={styles.signsGrid}>
            {[
              'Hello', 'Thank You', 'Yes', 'No', 'Please',
              'Sorry', 'Help', 'Good', 'Bad', 'Love',
              'Water', 'Food', 'Welcome', 'I', 'You'
            ].map((sign, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="glass-card"
                style={styles.signChip}
              >
                <Hand size={16} color="#6C63FF" />
                {sign}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeInUp} style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>
              Ready to Break Communication Barriers?
            </h2>
            <p style={styles.ctaSubtitle}>
              Start translating Indian Sign Language in real-time.
              No downloads required.
            </p>
            <div style={styles.ctaBtns}>
              <Link to="/translator" className="btn-primary">
                <Camera size={18} />
                Launch Translator
                <ArrowRight size={16} />
              </Link>
              <Link to="/learn" className="btn-secondary">
                <BookOpen size={18} />
                Start Learning
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  page: {
    overflow: 'hidden',
  },

  /* ── Hero ── */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    paddingTop: '70px',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    bottom: '-20%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  heroContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    width: '100%',
    flexWrap: 'wrap',
  },
  heroText: {
    flex: 1,
    minWidth: '320px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(108, 99, 255, 0.1)',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#6C63FF',
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '24px',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: '#9CA3AF',
    lineHeight: 1.7,
    marginBottom: '36px',
    maxWidth: '540px',
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '48px',
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#6B7280',
    fontWeight: 500,
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.1)',
  },

  /* ── Hero Visual ── */
  heroVisual: {
    flex: 1,
    minWidth: '360px',
    display: 'flex',
    justifyContent: 'center',
  },
  translatorPreview: {
    width: '100%',
    maxWidth: '440px',
    background: 'rgba(17, 24, 39, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  previewDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#EF4444',
  },
  previewTitle: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    color: '#6B7280',
  },
  previewBody: {
    padding: '20px',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '200px',
    background: 'rgba(108, 99, 255, 0.05)',
    border: '2px dashed rgba(108, 99, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  cameraText: {
    fontSize: '0.85rem',
    color: '#6B7280',
  },
  previewResult: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    background: 'rgba(108, 99, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(108, 99, 255, 0.15)',
  },
  resultLabel: {
    fontSize: '0.75rem',
    color: '#6B7280',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  resultSign: {
    fontSize: '1.8rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  confidenceBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  confidenceFill: {
    width: '94%',
    height: '100%',
    background: 'linear-gradient(90deg, #6C63FF, #22C55E)',
    borderRadius: '9999px',
  },
  confidenceText: {
    fontSize: '0.8rem',
    color: '#22C55E',
    fontWeight: 500,
  },

  /* ── Sections ── */
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 800,
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: '#9CA3AF',
    maxWidth: '600px',
    margin: '0 auto',
  },

  /* ── Steps ── */
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  stepCard: {
    padding: '36px 28px',
    textAlign: 'center',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    fontSize: '3rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    color: 'rgba(108, 99, 255, 0.1)',
  },
  stepIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(108, 99, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '12px',
  },
  stepDesc: {
    fontSize: '0.9rem',
    color: '#9CA3AF',
    lineHeight: 1.6,
  },

  /* ── Features ── */
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  featureCard: {
    padding: '28px',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(108, 99, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6C63FF',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '0.9rem',
    color: '#9CA3AF',
    lineHeight: 1.6,
  },

  /* ── Signs ── */
  signsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  signChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },

  /* ── CTA ── */
  ctaCard: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,255,0.05))',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: '24px',
  },
  ctaTitle: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
    fontWeight: 800,
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '1.05rem',
    color: '#9CA3AF',
    marginBottom: '36px',
    maxWidth: '500px',
    margin: '0 auto 36px',
  },
  ctaBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}