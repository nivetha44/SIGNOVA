import { ShieldCheck, Cpu, Heart, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">ABOUT SIGNOVA</p>
          <h1 style={styles.title}>AI-Powered Indian Sign Language Platform</h1>
          <p style={styles.subtitle}>
            Bridging silence and building understanding with real-time, on-device AI gesture recognition.
          </p>
        </div>

        {/* Mission Card */}
        <section className="glass-card" style={styles.card}>
          <div style={styles.iconWrap}>
            <Heart size={26} color="#FF2E93" />
          </div>
          <h2 style={styles.cardTitle}>Our Mission</h2>
          <p style={styles.cardText}>
            Indian Sign Language (ISL) is used by millions of individuals across India. SIGNOVA was built to make ISL learning, real-time sign recognition, and bidirectional communication accessible to everyone — directly inside the browser with zero software installations required.
          </p>
        </section>

        {/* Architecture & AI Pipeline */}
        <section className="glass-card" style={styles.card}>
          <div style={styles.iconWrap}>
            <Cpu size={26} color="#C026D3" />
          </div>
          <h2 style={styles.cardTitle}>Technical Architecture</h2>
          <div style={styles.pipelineGrid}>
            <div style={styles.pipelineStep}>
              <span style={styles.stepNum}>01</span>
              <h4>Camera Stream</h4>
              <p>Captures video feed on-device via WebRTC media APIs with zero recording.</p>
            </div>
            <div style={styles.pipelineStep}>
              <span style={styles.stepNum}>02</span>
              <h4>MediaPipe Vision</h4>
              <p>Extracts 21 3D hand landmarks per hand at up to 60 FPS using GPU-accelerated WASM.</p>
            </div>
            <div style={styles.pipelineStep}>
              <span style={styles.stepNum}>03</span>
              <h4>ISL Gesture Classifier</h4>
              <p>Calculates joint angles, finger extensions, and relative positions with temporal smoothing.</p>
            </div>
            <div style={styles.pipelineStep}>
              <span style={styles.stepNum}>04</span>
              <h4>Grammar Smoothing</h4>
              <p>Converts raw ISL token sequences into natural grammatical sentences in EN, TA, and HI.</p>
            </div>
          </div>
        </section>

        {/* Reality Check & Limitations */}
        <section className="glass-card" style={{ ...styles.card, borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div style={styles.iconWrap}>
            <ShieldCheck size={26} color="#F59E0B" />
          </div>
          <h2 style={styles.cardTitle}>Model Capabilities & Honest Limitations</h2>
          <p style={styles.cardText}>
            We believe in complete transparency about current machine learning capabilities:
          </p>
          <ul style={styles.limitsList}>
            <li style={styles.limitItem}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
              <span><strong>Live AI Recognition:</strong> Currently supports reliable single and two-hand recognition for 14 core ISL signs (HELLO, THANK YOU, YES, NO, PLEASE, SORRY, HELP, GOOD, LOVE, WATER, FOOD, WELCOME, YOU, I).</span>
            </li>
            <li style={styles.limitItem}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
              <span><strong>Extended Learning Catalog:</strong> Signs beyond the model's live recognition are supported through structured step-by-step visual lessons and guides.</span>
            </li>
            <li style={styles.limitItem}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
              <span><strong>Privacy Guarantee:</strong> Camera video is strictly processed in temporary GPU memory in real-time. Video is never persisted or transmitted to cloud servers.</span>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <div style={styles.ctaCard}>
          <h2 style={styles.ctaTitle}>Ready to Start Your ISL Journey?</h2>
          <p style={styles.ctaText}>Practice signs, test your accuracy, and learn Indian Sign Language today.</p>
          <div style={styles.ctaBtnRow}>
            <Link to="/translator" className="btn-primary" style={styles.ctaBtn}>
              Open Live Translator <ArrowRight size={16} />
            </Link>
            <Link to="/learn" className="btn-secondary" style={styles.ctaBtn}>
              Browse Sign Lessons
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '900px',
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
  card: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.65) 0%, rgba(11, 8, 13, 0.9) 100%)',
  },
  iconWrap: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: 'rgba(255, 46, 147, 0.12)',
    border: '1px solid rgba(255, 46, 147, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  cardText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  pipelineGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginTop: '6px',
  },
  pipelineStep: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '14px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  stepNum: {
    fontSize: '0.74rem',
    fontWeight: 800,
    color: 'var(--pink-soft)',
  },
  limitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '4px',
  },
  limitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.86rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  ctaCard: {
    padding: '38px 28px',
    background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.18) 0%, rgba(20, 10, 22, 0.95) 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 46, 147, 0.3)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 46, 147, 0.15)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  ctaTitle: {
    fontSize: '1.4rem',
    fontWeight: 900,
    color: '#FFFFFF',
  },
  ctaText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
  },
  ctaBtnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaBtn: {
    padding: '12px 24px',
    fontSize: '0.88rem',
  },
}