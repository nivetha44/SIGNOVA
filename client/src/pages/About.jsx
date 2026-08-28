import { motion } from 'framer-motion'
import {
  Info,
  Shield,
  Heart,
  Eye,
  Cpu,
  Database,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="container" style={styles.page}>

        {/* Header */}
        <motion.div {...fadeInUp} style={styles.header}>
          <h1 style={styles.title}>
            <Info size={28} color="#6C63FF" />
            About <span className="gradient-text">SIGNOVA</span>
          </h1>
          <p style={styles.subtitle}>
            An AI-powered accessibility platform for Indian Sign Language
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div {...fadeInUp} className="glass-card" style={styles.missionCard}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.missionText}>
            Over 5 million people in India use Indian Sign Language (ISL) as their
            primary mode of communication. Yet, the gap between the deaf community
            and hearing individuals remains significant. SIGNOVA bridges this gap
            by providing real-time, AI-powered sign language translation that works
            directly in your browser — no downloads, no expensive hardware, no barriers.
          </p>
        </motion.div>

        {/* How It Works (Technical) */}
        <motion.div {...fadeInUp} style={styles.section}>
          <h2 style={styles.sectionTitle}>
            How It Works <span className="gradient-text">Technically</span>
          </h2>
          <div style={styles.techGrid}>
            {[
              {
                icon: Eye,
                title: 'Computer Vision',
                desc: 'MediaPipe Hand Landmarker detects 21 hand keypoints in real-time at ~30fps using your webcam.',
              },
              {
                icon: Cpu,
                title: 'ML Classification',
                desc: 'Extracted landmarks are normalized and fed into a trained classifier (SVM/Random Forest/MLP) to predict the sign.',
              },
              {
                icon: Database,
                title: 'MERN Stack',
                desc: 'MongoDB stores user data and translations. Express/Node handles APIs. React provides the interactive UI.',
              },
              {
                icon: Shield,
                title: 'Privacy First',
                desc: 'All video processing happens locally in your browser. No frames are sent to any server.',
              },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={styles.techCard}>
                <div style={styles.techIcon}>
                  <item.icon size={24} color="#6C63FF" />
                </div>
                <h3 style={styles.techTitle}>{item.title}</h3>
                <p style={styles.techDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div {...fadeInUp} style={styles.section}>
          <h2 style={styles.sectionTitle}>Tech Stack</h2>
          <div style={styles.stackGrid}>
            {[
              { name: 'React + Vite', role: 'Frontend Framework', color: '#61DAFB' },
              { name: 'Node.js', role: 'Runtime Environment', color: '#68A063' },
              { name: 'Express', role: 'API Server', color: '#fff' },
              { name: 'MongoDB', role: 'Database', color: '#47A248' },
              { name: 'MediaPipe', role: 'Hand Tracking', color: '#FF6F00' },
              { name: 'Scikit-learn', role: 'ML Models', color: '#F7931E' },
              { name: 'JWT', role: 'Authentication', color: '#D63AFF' },
              { name: 'Framer Motion', role: 'Animations', color: '#FF6B6B' },
            ].map((tech, i) => (
              <div key={i} style={styles.stackChip}>
                <div
                  style={{
                    ...styles.stackDot,
                    background: tech.color,
                  }}
                />
                <div>
                  <span style={styles.stackName}>{tech.name}</span>
                  <span style={styles.stackRole}>{tech.role}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Limitations (Honest — interviewers love this) */}
        <motion.div {...fadeInUp} className="glass-card" style={styles.limitCard}>
          <h2 style={styles.sectionTitle}>Current Limitations</h2>
          <ul style={styles.limitList}>
            <li>
              <strong>Isolated signs only:</strong> The current version recognizes
              individual signs, not continuous sentence-level ISL which requires
              temporal modeling and contextual language understanding.
            </li>
            <li>
              <strong>Lighting sensitivity:</strong> Accuracy decreases in poor
              lighting conditions or complex backgrounds.
            </li>
            <li>
              <strong>Limited vocabulary:</strong> Currently supports 15 signs.
              Real ISL has thousands of signs including regional variations.
            </li>
            <li>
              <strong>Single-hand focus:</strong> Many ISL signs require two hands
              with specific spatial relationships. This is a future improvement.
            </li>
          </ul>
        </motion.div>

        {/* Footer CTA */}
        <motion.div {...fadeInUp} style={styles.footerCta}>
          <p style={styles.footerText}>
            Built with <Heart size={14} color="#EF4444" fill="#EF4444" /> for
            accessibility and inclusion.
          </p>
          <p style={styles.footerSubtext}>
            SIGNOVA © 2025 • Open Source • MERN + MediaPipe + ML
          </p>
        </motion.div>
      </div>
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
    marginBottom: '40px',
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
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: '16px',
  },
  missionCard: {
    padding: '32px',
    marginBottom: '48px',
  },
  missionText: {
    fontSize: '1rem',
    color: '#D1D5DB',
    lineHeight: 1.8,
  },
  section: {
    marginBottom: '48px',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  techCard: {
    padding: '24px',
  },
  techIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(108, 99, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  techTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '6px',
  },
  techDesc: {
    fontSize: '0.85rem',
    color: '#9CA3AF',
    lineHeight: 1.6,
  },
  stackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
  },
  stackChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
  },
  stackDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  stackName: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  stackRole: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#6B7280',
  },
  limitCard: {
    padding: '32px',
    marginBottom: '48px',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  limitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    listStyle: 'none',
  },
  limitListLi: {
    fontSize: '0.9rem',
    color: '#D1D5DB',
    lineHeight: 1.6,
    paddingLeft: '16px',
    borderLeft: '2px solid rgba(245, 158, 11, 0.3)',
  },
  footerCta: {
    textAlign: 'center',
    padding: '40px 0',
  },
  footerText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.95rem',
    color: '#9CA3AF',
    marginBottom: '8px',
  },
  footerSubtext: {
    fontSize: '0.8rem',
    color: '#4B5563',
  },
}