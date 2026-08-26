const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()

const app = express()

// ── Middleware ──
app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true,
}))
app.use(express.json())

// ── Routes ──
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/translations', require('./routes/translationRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SIGNOVA API is running',
    timestamp: new Date().toISOString(),
  })
})

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// ── Start Server ──
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║     🚀 SIGNOVA API Server            ║
    ║     📡 http://localhost:${PORT}         ║
    ║     📊 http://localhost:${PORT}/api/health ║
    ╚══════════════════════════════════════╝
    `)
  })
})