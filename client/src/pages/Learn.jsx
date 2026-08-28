import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  ChevronRight,
  X,
  Play,
  ArrowLeft,
} from 'lucide-react'

// ISL Sign Database
const SIGNS_DATA = [
  {
    id: 1,
    name: 'HELLO',
    category: 'Greetings',
    difficulty: 'Beginner',
    description:
      'Raise your open hand near your forehead and move it outward in a small wave.',
    steps: [
      'Raise your dominant hand to forehead level',
      'Keep all fingers extended and together',
      'Move your hand outward and slightly to the side',
      'This mimics a casual salute or wave',
    ],
    tips: 'Keep the movement smooth and natural. Think of a military salute turning into a wave.',
    emoji: '👋',
  },
  {
    id: 2,
    name: 'THANK YOU',
    category: 'Greetings',
    difficulty: 'Beginner',
    description:
      'Touch your chin with your fingertips and move your hand forward.',
    steps: [
      'Place the fingertips of your flat hand on your chin',
      'Move your hand forward and slightly downward',
      'Keep your palm facing up during the movement',
    ],
    tips: 'The motion resembles blowing a kiss from your chin.',
    emoji: '🙏',
  },
  {
    id: 3,
    name: 'YES',
    category: 'Basics',
    difficulty: 'Beginner',
    description:
      'Make a fist and nod it up and down, mimicking a head nod.',
    steps: [
      'Make a fist with your dominant hand',
      'Hold it at chest level',
      'Bend your wrist up and down repeatedly',
    ],
    tips: 'Think of your fist as a tiny head nodding "yes".',
    emoji: '✅',
  },
  {
    id: 4,
    name: 'NO',
    category: 'Basics',
    difficulty: 'Beginner',
    description:
      'Extend your index and middle finger, then tap them against your thumb.',
    steps: [
      'Extend your index and middle fingers',
      'Keep ring and pinky fingers folded',
      'Tap the extended fingers against your thumb repeatedly',
    ],
    tips: 'The motion looks like a mouth opening and closing saying "no".',
    emoji: '❌',
  },
  {
    id: 5,
    name: 'PLEASE',
    category: 'Basics',
    difficulty: 'Beginner',
    description:
      'Place your flat hand on your chest and move it in a circular motion.',
    steps: [
      'Place your open palm flat against your chest',
      'Move your hand in a clockwise circle',
      'Keep contact with your chest throughout',
    ],
    tips: 'The circular motion on the chest conveys sincerity.',
    emoji: '🙏',
  },
  {
    id: 6,
    name: 'SORRY',
    category: 'Emotions',
    difficulty: 'Beginner',
    description:
      'Make a fist and rub it in a circular motion over your chest.',
    steps: [
      'Make a fist with your dominant hand',
      'Place it on the center of your chest',
      'Rub in a small clockwise circle',
    ],
    tips: 'The circular rubbing motion shows genuine remorse.',
    emoji: '😔',
  },
  {
    id: 7,
    name: 'HELP',
    category: 'Basics',
    difficulty: 'Beginner',
    description:
      'Place your fist on your open palm and raise both hands upward.',
    steps: [
      'Make a fist with your dominant hand (thumb up)',
      'Place the fist on the palm of your other hand',
      'Raise both hands together upward',
    ],
    tips: 'The upward motion symbolizes lifting someone up.',
    emoji: '🆘',
  },
  {
    id: 8,
    name: 'GOOD',
    category: 'Emotions',
    difficulty: 'Beginner',
    description:
      'Touch your chin with your fingertips, then move your hand down to rest on your other hand.',
    steps: [
      'Place fingertips of flat hand on your chin',
      'Move hand downward',
      'Land it on the palm of your other hand',
    ],
    tips: 'Similar to "thank you" but ends on the other hand.',
    emoji: '👍',
  },
  {
    id: 9,
    name: 'LOVE',
    category: 'Emotions',
    difficulty: 'Beginner',
    description:
      'Cross both arms over your chest as if hugging yourself.',
    steps: [
      'Extend both arms in front of you',
      'Cross them over your chest',
      'Squeeze gently as if giving yourself a hug',
    ],
    tips: 'This is one of the most universally recognized signs.',
    emoji: '❤️',
  },
  {
    id: 10,
    name: 'WATER',
    category: 'Food & Drink',
    difficulty: 'Beginner',
    description:
      'Form the letter W with your fingers and tap your chin twice.',
    steps: [
      'Extend your index, middle, and ring fingers (W shape)',
      'Fold your thumb and pinky',
      'Tap your chin twice with the fingertips',
    ],
    tips: 'The W shape stands for "water".',
    emoji: '💧',
  },
  {
    id: 11,
    name: 'FOOD',
    category: 'Food & Drink',
    difficulty: 'Beginner',
    description:
      'Tap your fingertips to your lips repeatedly.',
    steps: [
      'Bring all fingertips together',
      'Tap them against your lips',
      'Repeat 2-3 times',
    ],
    tips: 'Mimics the action of eating.',
    emoji: '🍽️',
  },
  {
    id: 12,
    name: 'WELCOME',
    category: 'Greetings',
    difficulty: 'Beginner',
    description:
      'Open your hand and move it from your chin outward toward the person.',
    steps: [
      'Start with flat hand near your chin',
      'Move hand forward and outward',
      'Palm faces the person you are welcoming',
    ],
    tips: 'Similar to "thank you" but directed outward.',
    emoji: '🤗',
  },
]

const CATEGORIES = ['All', 'Greetings', 'Basics', 'Emotions', 'Food & Drink']

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSign, setSelectedSign] = useState(null)

  const filteredSigns = SIGNS_DATA.filter((sign) => {
    const matchesSearch = sign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || sign.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            <BookOpen size={28} color="#6C63FF" />
            Learn <span className="gradient-text">ISL</span>
          </h1>
          <p style={styles.subtitle}>
            Master Indian Sign Language one gesture at a time.
            Click any sign to learn how to perform it.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={styles.controls}
        >
          <div style={styles.searchBox}>
            <Search size={18} color="#6B7280" />
            <input
              type="text"
              placeholder="Search signs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.filterBtn,
                  ...(selectedCategory === cat
                    ? styles.filterBtnActive
                    : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sign Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={styles.grid}
        >
          {filteredSigns.map((sign, i) => (
            <motion.div
              key={sign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card"
              style={styles.signCard}
              onClick={() => setSelectedSign(sign)}
            >
              <div style={styles.signEmoji}>{sign.emoji}</div>
              <h3 style={styles.signName}>{sign.name}</h3>
              <div style={styles.signMeta}>
                <span style={styles.signCategory}>{sign.category}</span>
                <span
                  style={{
                    ...styles.signDifficulty,
                    color:
                      sign.difficulty === 'Beginner'
                        ? '#22C55E'
                        : '#F59E0B',
                  }}
                >
                  {sign.difficulty}
                </span>
              </div>
              <div style={styles.signArrow}>
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}

          {filteredSigns.length === 0 && (
            <div style={styles.noResults}>
              <Search size={48} color="rgba(108,99,255,0.2)" />
              <p>No signs found matching "{searchQuery}"</p>
            </div>
          )}
        </motion.div>

        {/* Sign Detail Modal */}
        <AnimatePresence>
          {selectedSign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.modalOverlay}
              onClick={() => setSelectedSign(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedSign(null)}
                  style={styles.closeBtn}
                >
                  <X size={20} />
                </button>

                <div style={styles.modalHeader}>
                  <span style={styles.modalEmoji}>
                    {selectedSign.emoji}
                  </span>
                  <div>
                    <h2 style={styles.modalTitle}>
                      {selectedSign.name}
                    </h2>
                    <span style={styles.modalCategory}>
                      {selectedSign.category} • {selectedSign.difficulty}
                    </span>
                  </div>
                </div>

                <p style={styles.modalDesc}>
                  {selectedSign.description}
                </p>

                <h4 style={styles.stepsTitle}>How to Perform</h4>
                <ol style={styles.stepsList}>
                  {selectedSign.steps.map((step, i) => (
                    <li key={i} style={styles.stepItem}>
                      <span style={styles.stepNumber}>{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div style={styles.tipBox}>
                  <strong>💡 Tip:</strong> {selectedSign.tips}
                </div>

                <div style={styles.modalActions}>
                  <button
                    onClick={() => setSelectedSign(null)}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    <ArrowLeft size={16} />
                    Back to Signs
                  </button>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSelectedSign(null)
                      // Could navigate to practice
                    }}
                  >
                    <Play size={16} />
                    Practice This Sign
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    maxWidth: '500px',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    maxWidth: '400px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.95rem',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#9CA3AF',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  filterBtnActive: {
    color: '#fff',
    background: 'rgba(108, 99, 255, 0.15)',
    borderColor: 'rgba(108, 99, 255, 0.4)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  signCard: {
    padding: '24px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  signEmoji: {
    fontSize: '2.5rem',
  },
  signName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  signMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signCategory: {
    fontSize: '0.75rem',
    color: '#6B7280',
    fontWeight: 500,
  },
  signDifficulty: {
    fontSize: '0.7rem',
    fontWeight: 600,
  },
  signArrow: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: '#6B7280',
  },
  noResults: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '60px 0',
    color: '#6B7280',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '24px',
  },
  modal: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '36px',
    maxWidth: '520px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9CA3AF',
    cursor: 'pointer',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  modalEmoji: {
    fontSize: '3rem',
  },
  modalTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  modalCategory: {
    fontSize: '0.8rem',
    color: '#6B7280',
  },
  modalDesc: {
    fontSize: '0.95rem',
    color: '#9CA3AF',
    lineHeight: 1.7,
    marginBottom: '24px',
  },
  stepsTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: '12px',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '0.9rem',
    color: '#D1D5DB',
    lineHeight: 1.5,
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '8px',
    background: 'rgba(108, 99, 255, 0.15)',
    color: '#6C63FF',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipBox: {
    padding: '14px 16px',
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '10px',
    fontSize: '0.85rem',
    color: '#F59E0B',
    lineHeight: 1.5,
    marginBottom: '24px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
  },
}